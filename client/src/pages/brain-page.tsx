import { useState, useMemo } from "react";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "../hooks/use-notes";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { 
  Brain, 
  Plus, 
  Search, 
  Star, 
  Pin, 
  Trash2, 
  Edit2,
  Lightbulb,
  BookOpen,
  Target,
  MessageSquare,
  Sparkles,
  Filter,
  Tag,
  Clock,
  TrendingUp,
  Zap,
  Heart,
  Archive,
  Link as LinkIcon,
  Grid3x3,
  List,
  X
} from "lucide-react";
import { cn } from "../lib/utils";
import { format } from "date-fns";

type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string | null;
  category?: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  color?: string | null;
  linkedNoteIds?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const CATEGORIES = [
  { value: 'idea', label: 'Idea', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { value: 'thought', label: 'Thought', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: 'learning', label: 'Learning', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
  { value: 'goal', label: 'Goal', icon: Target, color: 'text-gray-800 dark:text-gray-200', bg: 'bg-purple-500/10' },
  { value: 'reflection', label: 'Reflection', icon: Sparkles, color: 'text-gray-900 dark:text-gray-100', bg: 'bg-gray-500/10' },
  { value: 'misc', label: 'Misc', icon: Archive, color: 'text-gray-500', bg: 'bg-gray-500/10' },
];

const COLORS = [
  { value: 'red', class: 'border-red-500 bg-red-500/5' },
  { value: 'orange', class: 'border-orange-500 bg-orange-500/5' },
  { value: 'yellow', class: 'border-yellow-500 bg-yellow-500/5' },
  { value: 'green', class: 'border-green-500 bg-green-500/5' },
  { value: 'blue', class: 'border-blue-500 bg-blue-500/5' },
  { value: 'purple', class: 'border-purple-500 bg-purple-500/5' },
  { value: 'pink', class: 'border-gray-900 dark:border-gray-100 bg-pink-500/5' },
];

export default function BrainPage() {
  const { data: notes, isLoading } = useNotes();
  const { mutate: createNote } = useCreateNote();
  const { mutate: updateNote } = useUpdateNote();
  const { mutate: deleteNote } = useDeleteNote();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("misc");
  const [color, setColor] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const noteData = { title, content, tags, category, color };

    if (editingNote) {
      updateNote({ id: editingNote.id, ...noteData }, {
        onSuccess: () => resetForm()
      });
    } else {
      createNote(noteData, {
        onSuccess: () => resetForm()
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTags("");
    setCategory("misc");
    setColor("");
    setEditingNote(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || "");
    setCategory(note.category || "misc");
    setColor(note.color || "");
    setIsDialogOpen(true);
  };

  const togglePin = (note: Note) => {
    updateNote({ id: note.id, isPinned: !note.isPinned });
  };

  const toggleFavorite = (note: Note) => {
    updateNote({ id: note.id, isFavorite: !note.isFavorite });
  };

  const filteredNotes = useMemo(() => {
    if (!notes) return [];
    
    return notes.filter(note => {
      const matchesSearch = searchQuery === "" || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === "all" || note.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [notes, searchQuery, filterCategory]);

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const regularNotes = filteredNotes.filter(n => !n.isPinned);

  const stats = {
    total: notes?.length || 0,
    ideas: notes?.filter(n => n.category === 'idea').length || 0,
    favorites: notes?.filter(n => n.isFavorite).length || 0,
    thisWeek: notes?.filter(n => {
      if (!n.createdAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(n.createdAt) > weekAgo;
    }).length || 0,
  };

  const getCategoryInfo = (cat?: string | null) => {
    return CATEGORIES.find(c => c.value === cat) || CATEGORIES[5];
  };

  const getColorClass = (colorValue?: string | null) => {
    return COLORS.find(c => c.value === colorValue)?.class || '';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Second Brain</h1>
              <p className="text-white/90 mt-1">Capture, organize, and connect your thoughts</p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Total Notes</span>
              </div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm">Ideas</span>
              </div>
              <div className="text-3xl font-bold">{stats.ideas}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-4 w-4" />
                <span className="text-sm">Favorites</span>
              </div>
              <div className="text-3xl font-bold">{stats.favorites}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">This Week</span>
              </div>
              <div className="text-3xl font-bold">{stats.thisWeek}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your thoughts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <Button onClick={() => setIsDialogOpen(true)} className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-4 w-4" /> New Thought
            </Button>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNote ? "Edit" : "Capture"} Your Thought</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <textarea
                    placeholder="Expand your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                          category === cat.value
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <cat.icon className={cn("h-4 w-4", cat.color)} />
                        <span className="text-sm font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Tag (Optional)</Label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setColor(color === c.value ? "" : c.value)}
                        className={cn(
                          "w-10 h-10 rounded-full border-4 transition-all",
                          c.class,
                          color === c.value ? "scale-110 ring-2 ring-primary ring-offset-2" : ""
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    placeholder="e.g. productivity, idea, project"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingNote ? "Update" : "Create"} Note
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Filter */}
      <Tabs value={filterCategory} onValueChange={setFilterCategory}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value} className="gap-2">
              <cat.icon className={cn("h-4 w-4", cat.color)} />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filterCategory} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Brain className="h-8 w-8 animate-pulse text-primary" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No thoughts yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start capturing your ideas, learnings, and reflections
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create First Note
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Pinned Notes */}
              {pinnedNotes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Pin className="h-4 w-4" />
                    <span className="font-medium">Pinned</span>
                  </div>
                  <div className={cn(
                    "grid gap-4",
                    viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  )}>
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        getCategoryInfo={getCategoryInfo}
                        getColorClass={getColorClass}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Notes */}
              {regularNotes.length > 0 && (
                <div className="space-y-4">
                  {pinnedNotes.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Archive className="h-4 w-4" />
                      <span className="font-medium">All Notes</span>
                    </div>
                  )}
                  <div className={cn(
                    "grid gap-4",
                    viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  )}>
                    {regularNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        getCategoryInfo={getCategoryInfo}
                        getColorClass={getColorClass}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Note Card Component
function NoteCard({ 
  note, 
  onEdit, 
  onDelete, 
  onTogglePin, 
  onToggleFavorite,
  getCategoryInfo,
  getColorClass,
  viewMode
}: {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  getCategoryInfo: (cat?: string | null) => any;
  getColorClass: (color?: string | null) => string;
  viewMode: "grid" | "list";
}) {
  const categoryInfo = getCategoryInfo(note.category);
  const CategoryIcon = categoryInfo.icon;

  return (
    <Card className={cn(
      "group relative border-2 transition-all hover:shadow-lg",
      getColorClass(note.color),
      note.color ? "" : "border-border/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={cn("p-2 rounded-lg flex-shrink-0", categoryInfo.bg)}>
              <CategoryIcon className={cn("h-4 w-4", categoryInfo.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight break-words">{note.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {note.updatedAt ? format(new Date(note.updatedAt), 'MMM d, yyyy') : 'Just now'}
              </div>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onToggleFavorite(note)}
            >
              <Star className={cn("h-4 w-4", note.isFavorite && "fill-yellow-500 text-yellow-500")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onTogglePin(note)}
            >
              <Pin className={cn("h-4 w-4", note.isPinned && "fill-primary text-primary")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {note.content && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {note.content}
          </p>
        )}

        {note.tags && (
          <div className="flex flex-wrap gap-1">
            {note.tags.split(',').map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs font-medium"
              >
                <Tag className="h-3 w-3" />
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-1 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm("Delete this note?")) {
                onDelete(note.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}