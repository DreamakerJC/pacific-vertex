import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Search, Filter, Heart, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '@/components/recipes/RecipeCard';
import RecipeModal from '@/components/recipes/RecipeModal';
import RecipeForm from '@/components/recipes/RecipeForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const categories = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'drink', 'appetizer', 'soup', 'salad', 'bread'];

export default function Recipes() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date', 500),
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ['recipes'] });

  // Filter and sort
  let filtered = recipes.filter(r => {
    const matchesSearch = !search || r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = category === 'all' || r.category === category;
    const matchesFavorites = !showFavoritesOnly || r.is_favorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'time') return ((a.prep_time || 0) + (a.cook_time || 0)) - ((b.prep_time || 0) + (b.cook_time || 0));
    return new Date(b.created_date) - new Date(a.created_date);
  });

  const handleDelete = async () => {
    if (deleteId) {
      await base44.entities.Recipe.delete(deleteId);
      setDeleteId(null);
      setSelectedRecipe(null);
      refetch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground">My Recipes</h1>
          <p className="text-muted-foreground mt-1">{recipes.length} recipes in your collection</p>
        </div>
        <Button onClick={() => { setEditingRecipe(null); setShowForm(true); }} className="gap-2">
          <Plus size={18} />
          Add Recipe
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-36">
              <Filter size={14} className="mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c} className="capitalize">
                  {c === 'all' ? 'All Categories' : c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SlidersHorizontal size={14} className="mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="time">Cook Time</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex-shrink-0"
          >
            <Heart size={16} className={showFavoritesOnly ? 'fill-current' : ''} />
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filtered.map(recipe => (
              <motion.div key={recipe.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onToggleFavorite={refetch}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-playfair text-lg font-semibold mb-1">No recipes found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            {search || category !== 'all' || showFavoritesOnly
              ? 'Try adjusting your filters'
              : 'Start by adding your first recipe'}
          </p>
          {!search && category === 'all' && !showFavoritesOnly && (
            <Button onClick={() => { setEditingRecipe(null); setShowForm(true); }} className="gap-2">
              <Plus size={16} />
              Add Recipe
            </Button>
          )}
        </div>
      )}

      {/* View modal */}
      <RecipeModal
        recipe={selectedRecipe}
        open={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={() => { setEditingRecipe(selectedRecipe); setSelectedRecipe(null); setShowForm(true); }}
        onDelete={() => setDeleteId(selectedRecipe?.id)}
        onUpdate={refetch}
      />

      {/* Form modal */}
      <RecipeForm
        recipe={editingRecipe}
        open={showForm}
        onClose={() => { setShowForm(false); setEditingRecipe(null); }}
        onSave={() => { setShowForm(false); setEditingRecipe(null); refetch(); }}
      />

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recipe?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}