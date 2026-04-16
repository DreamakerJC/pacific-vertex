import { Clock, Users, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const difficultyColors = {
  easy: 'text-sage bg-sage-light',
  medium: 'text-amber-700 bg-amber-100',
  hard: 'text-red-700 bg-red-100',
};

const categoryColors = {
  breakfast: 'bg-amber-50 text-amber-700',
  lunch: 'bg-green-50 text-green-700',
  dinner: 'bg-blue-50 text-blue-700',
  dessert: 'bg-pink-50 text-pink-700',
  snack: 'bg-purple-50 text-purple-700',
  drink: 'bg-cyan-50 text-cyan-700',
  appetizer: 'bg-orange-50 text-orange-700',
  soup: 'bg-red-50 text-red-700',
  salad: 'bg-lime-50 text-lime-700',
  bread: 'bg-yellow-50 text-yellow-700',
};

const defaultImages = {
  breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&q=80',
  lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  dinner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  dessert: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
  snack: 'https://images.unsplash.com/photo-1559181567-c3190100191d?w=600&q=80',
  drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80',
  appetizer: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=600&q=80',
  soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
};

export default function RecipeCard({ recipe, onClick, onToggleFavorite }) {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
  const imageUrl = recipe.image_url || defaultImages[recipe.category] || defaultImages.dinner;

  const handleFavorite = async (e) => {
    e.stopPropagation();
    await base44.entities.Recipe.update(recipe.id, { is_favorite: !recipe.is_favorite });
    onToggleFavorite?.();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            size={16}
            className={recipe.is_favorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}
          />
        </button>

        {/* Category badge */}
        {recipe.category && (
          <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${categoryColors[recipe.category] || 'bg-white/80 text-gray-700'}`}>
            {recipe.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-playfair font-semibold text-lg text-foreground mb-1 line-clamp-1">
          {recipe.title}
        </h3>
        {recipe.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{recipe.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {totalTime}m
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1">
                <Users size={13} />
                {recipe.servings}
              </span>
            )}
            {recipe.rating && (
              <span className="flex items-center gap-1 text-gold">
                <Star size={13} className="fill-gold" />
                {recipe.rating}
              </span>
            )}
          </div>

          {recipe.difficulty && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}