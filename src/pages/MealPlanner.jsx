import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, GripVertical, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
const mealColors = {
  breakfast: 'bg-amber-50 border-amber-200 text-amber-800',
  lunch: 'bg-green-50 border-green-200 text-green-800',
  dinner: 'bg-blue-50 border-blue-200 text-blue-800',
  snack: 'bg-purple-50 border-purple-200 text-purple-800',
};

export default function MealPlanner() {
  const queryClient = useQueryClient();
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchRecipe, setSearchRecipe] = useState('');

  const weekDays = useMemo(() =>
    [...Array(7)].map((_, i) => addDays(currentWeek, i)),
    [currentWeek]
  );

  const { data: mealPlans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['mealPlans', format(currentWeek, 'yyyy-MM-dd')],
    queryFn: async () => {
      const start = format(currentWeek, 'yyyy-MM-dd');
      const end = format(addDays(currentWeek, 6), 'yyyy-MM-dd');
      return base44.entities.MealPlan.filter({
        date: { $gte: start, $lte: end }
      });
    },
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date', 500),
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ['mealPlans'] });

  const getMealsForDay = (date) => mealPlans.filter(m => m.date === format(date, 'yyyy-MM-dd'));

  const openAddModal = (date, mealType) => {
    setSelectedSlot({ date: format(date, 'yyyy-MM-dd'), mealType });
    setSearchRecipe('');
    setShowAddModal(true);
  };

  const handleAddMeal = async (recipe) => {
    if (!selectedSlot) return;
    await base44.entities.MealPlan.create({
      date: selectedSlot.date,
      meal_type: selectedSlot.mealType,
      recipe_id: recipe.id,
      recipe_title: recipe.title,
    });
    setShowAddModal(false);
    refetch();
    toast.success(`Added ${recipe.title} to ${selectedSlot.mealType}`);
  };

  const handleRemoveMeal = async (mealId) => {
    await base44.entities.MealPlan.delete(mealId);
    refetch();
  };

  const generateShoppingList = async () => {
    const ingredientsMap = {};
    
    for (const meal of mealPlans) {
      if (meal.recipe_id) {
        const recipe = recipes.find(r => r.id === meal.recipe_id);
        if (recipe?.ingredients) {
          for (const ing of recipe.ingredients) {
            const key = ing.name?.toLowerCase().trim();
            if (key) {
              if (!ingredientsMap[key]) {
                ingredientsMap[key] = { name: ing.name, amount: ing.amount, unit: ing.unit, sources: [] };
              }
              ingredientsMap[key].sources.push(recipe.title);
            }
          }
        }
      }
    }

    const items = Object.values(ingredientsMap);
    if (items.length === 0) {
      toast.info('No ingredients to add. Plan some meals first!');
      return;
    }

    for (const item of items) {
      await base44.entities.ShoppingList.create({
        name: item.name,
        amount: item.amount,
        unit: item.unit,
        recipe_source: item.sources.join(', '),
        is_checked: false,
      });
    }
    toast.success(`Added ${items.length} items to shopping list`);
  };

  const filteredRecipes = recipes.filter(r =>
    r.title?.toLowerCase().includes(searchRecipe.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground">Meal Planner</h1>
          <p className="text-muted-foreground mt-1">Plan your week ahead</p>
        </div>
        <Button onClick={generateShoppingList} variant="outline" className="gap-2">
          <ShoppingCart size={16} />
          Generate Shopping List
        </Button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, -7))}>
          <ChevronLeft size={20} />
        </Button>
        <div className="text-center">
          <p className="font-semibold text-foreground">
            {format(currentWeek, 'MMMM d')} – {format(addDays(currentWeek, 6), 'MMMM d, yyyy')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setCurrentWeek(addDays(currentWeek, 7))}>
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-7 gap-3 min-w-[800px]">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            const dayMeals = getMealsForDay(day);

            return (
              <div key={day.toISOString()} className={`rounded-xl border ${isToday ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                <div className={`p-3 text-center border-b ${isToday ? 'border-primary/20' : 'border-border'}`}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{format(day, 'EEE')}</p>
                  <p className={`text-lg font-semibold ${isToday ? 'text-primary' : 'text-foreground'}`}>{format(day, 'd')}</p>
                </div>
                <div className="p-2 space-y-2 min-h-[200px]">
                  {mealTypes.map(type => {
                    const meal = dayMeals.find(m => m.meal_type === type);
                    return (
                      <div key={type}>
                        {meal ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`rounded-lg border px-2 py-1.5 text-xs ${mealColors[type]} group relative`}
                          >
                            <p className="text-[10px] font-medium uppercase tracking-wide opacity-70 mb-0.5">{type}</p>
                            <p className="font-medium truncate pr-5">{meal.recipe_title || 'Untitled'}</p>
                            <button
                              onClick={() => handleRemoveMeal(meal.id)}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/10"
                            >
                              <X size={12} />
                            </button>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => openAddModal(day, type)}
                            className="w-full rounded-lg border border-dashed border-border/60 px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:border-border transition-colors"
                          >
                            <span className="capitalize">{type}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add meal modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-playfair">
              Add {selectedSlot?.mealType} for {selectedSlot && format(new Date(selectedSlot.date), 'EEEE, MMM d')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Search recipes..."
              value={searchRecipe}
              onChange={e => setSearchRecipe(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.slice(0, 20).map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => handleAddMeal(recipe)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium">{recipe.title}</span>
                    {recipe.category && (
                      <span className="text-xs text-muted-foreground capitalize">{recipe.category}</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-6 text-sm">No recipes found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}