import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Clock, Users, ChefHat, Star, Heart, BookOpen, Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

const defaultImages = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
  dinner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  dessert: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
  snack: 'https://images.unsplash.com/photo-1559181567-c3190100191d?w=800&q=80',
  drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80',
  appetizer: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=800&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
};

export default function RecipeModal({ recipe, open, onClose, onEdit, onDelete, onUpdate }) {
  if (!recipe) return null;

  const imageUrl = recipe.image_url || defaultImages[recipe.category] || defaultImages.dinner;
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  const handleFavorite = async () => {
    await base44.entities.Recipe.update(recipe.id, { is_favorite: !recipe.is_favorite });
    onUpdate?.();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Hero image */}
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-white">{recipe.title}</h2>
              {recipe.cuisine && <p className="text-white/80 text-sm mt-0.5">{recipe.cuisine} cuisine</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={handleFavorite} className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                <Heart size={18} className={recipe.is_favorite ? 'fill-red-400 text-red-400' : 'text-white'} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3 mb-5">
            {totalTime > 0 && (
              <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5 text-sm">
                <Clock size={14} className="text-muted-foreground" />
                <span className="font-medium">{totalTime} min</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5 text-sm">
                <Users size={14} className="text-muted-foreground" />
                <span className="font-medium">{recipe.servings} servings</span>
              </div>
            )}
            {recipe.difficulty && (
              <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5 text-sm">
                <ChefHat size={14} className="text-muted-foreground" />
                <span className="font-medium capitalize">{recipe.difficulty}</span>
              </div>
            )}
            {recipe.rating && (
              <div className="flex items-center gap-1.5 bg-amber-50 rounded-lg px-3 py-1.5 text-sm">
                <Star size={14} className="text-gold fill-gold" />
                <span className="font-medium text-amber-700">{recipe.rating}/5</span>
              </div>
            )}
            {recipe.calories_per_serving && (
              <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5 text-sm">
                <span className="text-muted-foreground text-xs">🔥</span>
                <span className="font-medium">{recipe.calories_per_serving} cal</span>
              </div>
            )}
          </div>

          {recipe.description && (
            <p className="text-muted-foreground mb-5 leading-relaxed">{recipe.description}</p>
          )}

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {recipe.tags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-playfair font-semibold text-lg mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 py-1.5 border-b border-border/50 last:border-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm">
                      <span className="font-medium">{ing.amount} {ing.unit}</span>{' '}
                      <span className="text-foreground">{ing.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions */}
          {recipe.instructions?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-playfair font-semibold text-lg mb-3">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-foreground pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Notes */}
          {recipe.notes && (
            <div className="mb-5 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">Notes</p>
              <p className="text-sm text-amber-900">{recipe.notes}</p>
            </div>
          )}

          {/* Source */}
          {recipe.source && (
            <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5">
              <ExternalLink size={14} />
              View original source
            </a>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onEdit} variant="outline" className="flex-1 gap-2">
              <Pencil size={16} />
              Edit Recipe
            </Button>
            <Button onClick={onDelete} variant="outline" className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5">
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}