import { useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";


import {
  useReadingHelpers,
  useReadingItems,
  useCreateReadingItem,
  useUpdateReadingItem,
  useDeleteReadingItem,
  useReadingSessions,
  useCreateReadingSession,
  useDeleteReadingSession,
  useReadingNotes,
  useCreateReadingNote,
  useDeleteReadingNote,
  useReadingWeeklyStats,
} from "../hooks/use-reading";


type ItemType = "book" | "movie" | "show" | "article";
type ItemStatus = "planned" | "in-progress" | "completed";

function statusBadge(status: string) {
  if (status === "planned") return <Badge variant="secondary">Planned</Badge>;
  if (status === "in-progress") return <Badge>In progress</Badge>;
  if (status === "completed") return <Badge variant="outline">Completed</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

function typeBadge(type: string) {
  if (type === "book") return <Badge variant="outline">Book</Badge>;
  if (type === "article") return <Badge variant="outline">Article</Badge>;
  if (type === "movie") return <Badge variant="outline">Movie</Badge>;
  if (type === "show") return <Badge variant="outline">Show</Badge>;
  return <Badge variant="outline">{type}</Badge>;
}

export default function ReadingPage() {
  const { toYMD, startOfWeekMonday, endOfWeekSunday } = useReadingHelpers();

  const itemsQ = useReadingItems();
  const createItem = useCreateReadingItem();
  const updateItem = useUpdateReadingItem();
  const deleteItem = useDeleteReadingItem();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedItem = useMemo(() => {
    return itemsQ.data?.find((x) => x.id === selectedId) ?? null;
  }, [itemsQ.data, selectedId]);

  // Filters
  const [filterStatus, setFilterStatus] = useState<ItemStatus | "all">("all");
  const [filterType, setFilterType] = useState<ItemType | "all">("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const list = itemsQ.data ?? [];
    return list
      .filter((it) => (filterStatus === "all" ? true : it.status === filterStatus))
      .filter((it) => (filterType === "all" ? true : it.type === filterType))
      .filter((it) => it.title.toLowerCase().includes(search.toLowerCase().trim()));
  }, [itemsQ.data, filterStatus, filterType, search]);

  // Sessions / Notes for selected item
  const sessionsQ = useReadingSessions(selectedItem?.id);
  const createSession = useCreateReadingSession();
  const deleteSession = useDeleteReadingSession();

  const notesQ = useReadingNotes(selectedItem?.id);
  const createNote = useCreateReadingNote();
  const deleteNote = useDeleteReadingNote();

  // Weekly stats for current week
  const now = useMemo(() => new Date(), []);
  const weekStart = toYMD(startOfWeekMonday(now));
  const weekEnd = toYMD(endOfWeekSunday(now));
  const statsQ = useReadingWeeklyStats(weekStart, weekEnd, true);

  // Dialog states + forms
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ItemType>("book");
  const [status, setStatus] = useState<ItemStatus>("planned");
  const [rating, setRating] = useState<string>("");
  const [itemNotes, setItemNotes] = useState("");

  const [sessionDate, setSessionDate] = useState(() => toYMD(new Date()));
  const [durationMinutes, setDurationMinutes] = useState<string>("25");
  const [pagesRead, setPagesRead] = useState<string>("0");
  const [sessionNote, setSessionNote] = useState("");

  const [noteKind, setNoteKind] = useState<"note" | "highlight">("note");
  const [noteContent, setNoteContent] = useState("");
  const [pageOrTime, setPageOrTime] = useState("");

  const resetAddForm = () => {
    setTitle("");
    setType("book");
    setStatus("planned");
    setRating("");
    setItemNotes("");
  };

  const openEditForSelected = () => {
    if (!selectedItem) return;
    setTitle(selectedItem.title);
    setType((selectedItem.type as ItemType) ?? "book");
    setStatus((selectedItem.status as ItemStatus) ?? "planned");
    setRating(selectedItem.rating == null ? "" : String(selectedItem.rating));
    setItemNotes(selectedItem.notes ?? "");
    setEditOpen(true);
  };

  const onCreateItem = async () => {
    const r = rating.trim() === "" ? null : Math.max(1, Math.min(5, Number(rating)));
    await createItem.mutateAsync({
      title: title.trim(),
      type,
      status,
      rating: Number.isFinite(r as any) ? r : null,
      notes: itemNotes.trim() ? itemNotes.trim() : null,
    });
    setAddOpen(false);
    resetAddForm();
  };

  const onUpdateItem = async () => {
    if (!selectedItem) return;
    const r = rating.trim() === "" ? null : Math.max(1, Math.min(5, Number(rating)));
    await updateItem.mutateAsync({
      id: selectedItem.id,
      updates: {
        title: title.trim(),
        type,
        status,
        rating: Number.isFinite(r as any) ? r : null,
        notes: itemNotes.trim() ? itemNotes.trim() : null,
      },
    });
    setEditOpen(false);
  };

  const onDeleteItem = async () => {
    if (!selectedItem) return;
    await deleteItem.mutateAsync(selectedItem.id);
    setSelectedId(null);
  };

  const onAddSession = async () => {
    if (!selectedItem) return;
    await createSession.mutateAsync({
      readingItemId: selectedItem.id,
      sessionDate,
      durationMinutes: Math.max(0, Number(durationMinutes || 0)),
      pagesRead: Math.max(0, Number(pagesRead || 0)),
      note: sessionNote.trim() ? sessionNote.trim() : undefined,
    });
    setSessionNote("");
  };

  const onAddNote = async () => {
    if (!selectedItem) return;
    await createNote.mutateAsync({
      readingItemId: selectedItem.id,
      kind: noteKind,
      content: noteContent.trim(),
      pageOrTime: pageOrTime.trim() ? pageOrTime.trim() : undefined,
    });
    setNoteContent("");
    setPageOrTime("");
    setNoteKind("note");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reading
          </h1>
          <p className="text-sm text-muted-foreground">
            Library, sessions, notes, and weekly progress.
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Add to reading</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Atomic Habits" />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={type} onValueChange={(v) => setType(v as ItemType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="show">Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={(v) => setStatus(v as ItemStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="optional" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea value={itemNotes} onChange={(e) => setItemNotes(e.target.value)} placeholder="optional" />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={onCreateItem}
                  disabled={!title.trim() || createItem.isPending}
                >
                  {createItem.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={openEditForSelected}
            disabled={!selectedItem}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <Button
            variant="destructive"
            onClick={onDeleteItem}
            disabled={!selectedItem || deleteItem.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Edit item</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={type} onValueChange={(v) => setType(v as ItemType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="movie">Movie</SelectItem>
                        <SelectItem value="show">Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={(v) => setStatus(v as ItemStatus)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Rating (1-5)</label>
                    <Input value={rating} onChange={(e) => setRating(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea value={itemNotes} onChange={(e) => setItemNotes(e.target.value)} />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={onUpdateItem} disabled={!title.trim() || updateItem.isPending}>
                  {updateItem.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            This week
          </CardTitle>
          <CardDescription>
            {weekStart} → {weekEnd}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statsQ.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading stats...
            </div>
          ) : statsQ.isError ? (
            <div className="text-sm text-destructive">Failed to load stats.</div>
          ) : (
            <div className="grid gap-3 md:grid-cols-4">
              <StatBox icon={<Timer className="h-4 w-4" />} label="Minutes" value={statsQ.data?.minutes ?? 0} />
              <StatBox icon={<BookOpen className="h-4 w-4" />} label="Pages" value={statsQ.data?.pages ?? 0} />
              <StatBox icon={<StickyNote className="h-4 w-4" />} label="Sessions" value={statsQ.data?.sessions ?? 0} />
              <StatBox icon={<Star className="h-4 w-4" />} label="Streak (days)" value={statsQ.data?.streakDays ?? 0} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Library */}
        <Card className="min-h-[520px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Library
            </CardTitle>
            <CardDescription>Pick an item to view sessions & notes.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-3">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title..."
              />

              <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="show">Show</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="in-progress">In progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {itemsQ.isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading library...
              </div>
            ) : itemsQ.isError ? (
              <div className="text-sm text-destructive">Failed to load reading list.</div>
            ) : filteredItems.length === 0 ? (
              <div className="text-sm text-muted-foreground">No items yet.</div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => setSelectedId(it.id)}
                    className={[
                      "w-full text-left rounded-xl border p-3 transition",
                      selectedId === it.id ? "border-primary/60 bg-primary/5" : "hover:bg-muted/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate">{it.title}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {typeBadge(it.type)}
                          {statusBadge(it.status)}
                          {it.rating != null ? (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5" />
                              {it.rating}/5
                            </Badge>
                          ) : null}
                        </div>
                        {it.notes ? (
                          <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{it.notes}</div>
                        ) : null}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(it.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="min-h-[520px]">
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>
              {selectedItem ? (
                <span className="flex items-center gap-2">
                  <span className="font-medium">{selectedItem.title}</span>
                  {typeBadge(selectedItem.type)}
                  {statusBadge(selectedItem.status)}
                </span>
              ) : (
                "Select an item from the library."
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!selectedItem ? (
              <div className="text-sm text-muted-foreground">
                اختر عنصر من Library باش تبان Sessions و Notes.
              </div>
            ) : (
              <Tabs defaultValue="sessions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                {/* Sessions */}
                <TabsContent value="sessions" className="space-y-4">
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">Add session</CardTitle>
                      <CardDescription>Log minutes/pages for this item.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <div className="grid gap-2 md:grid-cols-3">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Date</label>
                          <Input value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} placeholder="YYYY-MM-DD" />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Minutes</label>
                          <Input value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Pages</label>
                          <Input value={pagesRead} onChange={(e) => setPagesRead(e.target.value)} />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Note</label>
                        <Input value={sessionNote} onChange={(e) => setSessionNote(e.target.value)} placeholder="optional" />
                      </div>

                      <Button onClick={onAddSession} disabled={createSession.isPending}>
                        {createSession.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add session
                      </Button>
                    </CardContent>
                  </Card>

                  <Separator />

                  {sessionsQ.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading sessions...
                    </div>
                  ) : sessionsQ.isError ? (
                    <div className="text-sm text-destructive">Failed to load sessions.</div>
                  ) : (sessionsQ.data?.length ?? 0) === 0 ? (
                    <div className="text-sm text-muted-foreground">No sessions yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {sessionsQ.data!.map((s) => (
                        <div key={s.id} className="rounded-xl border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-medium">{s.sessionDate}</div>
                              <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-2">
                                <Badge variant="secondary">{s.durationMinutes} min</Badge>
                                <Badge variant="secondary">{s.pagesRead} pages</Badge>
                              </div>
                              {s.note ? <div className="text-sm mt-2">{s.note}</div> : null}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteSession.mutate({ id: s.id, readingItemId: selectedItem.id })}
                              disabled={deleteSession.isPending}
                              aria-label="Delete session"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Notes */}
                <TabsContent value="notes" className="space-y-4">
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-base">Add note / highlight</CardTitle>
                      <CardDescription>Save insights with optional page/time.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3">
                      <div className="grid gap-2 md:grid-cols-3">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Kind</label>
                          <Select value={noteKind} onValueChange={(v) => setNoteKind(v as any)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Kind" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="note">Note</SelectItem>
                              <SelectItem value="highlight">Highlight</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                          <label className="text-sm font-medium">Page / time</label>
                          <Input value={pageOrTime} onChange={(e) => setPageOrTime(e.target.value)} placeholder='e.g. "p.34" or "12:10"' />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Content</label>
                        <Textarea value={noteContent} onChange={(e) => setNoteContent(e.target.value)} placeholder="Write your note..." />
                      </div>

                      <Button onClick={onAddNote} disabled={!noteContent.trim() || createNote.isPending}>
                        {createNote.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add
                      </Button>
                    </CardContent>
                  </Card>

                  <Separator />

                  {notesQ.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading notes...
                    </div>
                  ) : notesQ.isError ? (
                    <div className="text-sm text-destructive">Failed to load notes.</div>
                  ) : (notesQ.data?.length ?? 0) === 0 ? (
                    <div className="text-sm text-muted-foreground">No notes yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {notesQ.data!.map((n) => (
                        <div key={n.id} className="rounded-xl border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant={n.kind === "highlight" ? "default" : "secondary"}>
                                  {n.kind === "highlight" ? "Highlight" : "Note"}
                                </Badge>
                                {n.pageOrTime ? <Badge variant="outline">{n.pageOrTime}</Badge> : null}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(n.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="mt-2 text-sm whitespace-pre-wrap break-words">
                                {n.content}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNote.mutate({ id: n.id, readingItemId: selectedItem.id })}
                              disabled={deleteNote.isPending}
                              aria-label="Delete note"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
