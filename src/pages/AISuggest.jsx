import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Sparkles, Wand2, ChefHat, Loader2, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const suggestionPrompts = [
  "Quick weeknight dinner under 30 minutes",
  "Healthy breakfast ideas",
  "What can I make with chicken and vegetables?",
  "Vegetarian comfort food",
  "Something sweet but not too complicated",
  "Meal prep ideas for the week",
];

export default function AISuggest() {
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [saving, setSaving] = useState(false);

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => base44.entities.Recipe.list('-created_date', 100),
  });

  const handleSuggest = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setSuggestion(null);

    const existingTitles = recipes.slice(0, 20).map(r => r.title).join(', ');

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a creative chef assistant. The user wants recipe ideas.

User request: "${prompt}"

They already have these recipes: ${existingTitles || 'none yet'}

Suggest ONE new recipe that matches their request. Be creative and provide complete details.
Return a JSON object with this exact structure:
{
  "title": "Recipe Name",
  "description": "Brief appetizing description (1-2 sentences)",
  "category": "one of: breakfast, lunch, dinner, dessert, snack, drink, appetizer, soup, salad, bread",
  "cuisine": "Cuisine type (e.g., Italian, Mexican, Asian, American)",
  "difficulty": "easy, medium, or hard",
  "prep_time": number in minutes,
  "cook_time": number in minutes,
  "servings": number,
  "calories_per_serving": estimated number,
  "ingredients": [{"name": "ingredient", "amount": "1", "unit": "cup"}],
  "instructions": ["Step 1...", "Step 2..."],
  "tags": ["tag1", "tag2"]
}`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          cuisine: { type: "string" },
          difficulty: { type: "string" },
          prep_time: { type: "number" },
          cook_time: { type: "number" },
          servings: { type: "number" },
          calories_per_serving: { type: "number" },
          ingredients: { type: "array", items: { type: "object" } },
          instructions: { type: "array", items: { type: "string" } },
          tags: { type: "array", items: { type: "string" } },
        }
      }
    });

    setSuggestion(response);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!suggestion) return;
    setSaving(true);
    await base44.entities.Recipe.create(suggestion);
    queryClient.invalidateQueries({ queryKey: ['recipes'] });
    toast.success('Recipe saved to your collection!');
    setSaving(false);
    setSuggestion(null);
    setPrompt('');
  };

  const totalTime = suggestion ? (suggestion.prep_time || 0) + (suggestion.cook_time || 0) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles size={24} className="text-white" />
        </div>
        <h1 className="font-playfair text-3xl font-bold text-foreground">AI Chef</h1>
        <p className="text-muted-foreground mt-2">Get personalized recipe suggestions powered by AI</p>
      </div>

      {/* Input */}
      <div className="bg-card rounded-2xl border border-border p-5 mb-6">
        <Textarea
          placeholder="What would you like to cook? Describe your mood, ingredients, or cuisine preference..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={3}
          className="resize-none mb-4"
        />
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestionPrompts.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <Button onClick={handleSuggest} disabled={!prompt.trim() || loading} className="w-full gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
          {loading ? 'Thinking...' : 'Get Suggestion'}
        </Button>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            {/* Hero section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary" className="mb-2 capitalize">{suggestion.category}</Badge>
                  <h2 className="font-playfair text-2xl font-bold text-foreground">{suggestion.title}</h2>
                  {suggestion.description && (
                    <p className="text-muted-foreground mt-2">{suggestion.description}</p>
                  )}
                </div>
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  <ChefHat size={24} className="text-accent" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-4 text-sm">
                {totalTime > 0 && <span className="text-muted-foreground">⏱ {totalTime} min</span>}
                {suggestion.servings && <span className="text-muted-foreground">👥 {suggestion.servings} servings</span>}
                {suggestion.difficulty && <span className="text-muted-foreground capitalize">📊 {suggestion.difficulty}</span>}
                {suggestion.calories_per_serving && <span className="text-muted-foreground">🔥 {suggestion.calories_per_serving} cal</span>}
                {suggestion.cuisine && <span className="text-muted-foreground">🌍 {suggestion.cuisine}</span>}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tags */}
              {suggestion.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {suggestion.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}

              {/* Ingredients */}
              {suggestion.ingredients?.length > 0 && (
                <div>
                  <h3 className="font-playfair font-semibold text-lg mb-3">Ingredients</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestion.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span className="font-medium">{ing.amount} {ing.unit}</span> {ing.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {suggestion.instructions?.length > 0 && (
                <div>
                  <h3 className="font-playfair font-semibold text-lg mb-3">Instructions</h3>
                  <ol className="space-y-3">
                    {suggestion.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <p className="text-sm leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={() => { setSuggestion(null); handleSuggest(); }} variant="outline" className="flex-1 gap-2">
                  <RefreshCw size={16} />
                  Try Another
                </Button>
                <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Save to Recipes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}