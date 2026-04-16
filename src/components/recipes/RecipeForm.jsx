import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Plus, X, Trash2, Loader2 } from 'lucide-react';

const categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'drink', 'appetizer', 'soup', 'salad', 'bread'];
const difficulties = ['easy', 'medium', 'hard'];

export default function RecipeForm({ recipe, open, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    title: recipe?.title || '',
    description: recipe?.description || '',
    category: recipe?.category || '',
    cuisine: recipe?.cuisine || '',
    difficulty: recipe?.difficulty || 'easy',
    prep_time: recipe?.prep_time || '',
    cook_time: recipe?.cook_time || '',
    servings: recipe?.servings || '',
    ingredients: recipe?.ingredients || [{ name: '', amount: '', unit: '' }],
    instructions: recipe?.instructions || [''],
    tags: recipe?.tags?.join(', ') || '',
    image_url: recipe?.image_url || '',
    notes: recipe?.notes || '',
    source: recipe?.source || '',
    calories_per_serving: recipe?.calories_per_serving || '',
    rating: recipe?.rating || '',
  }));

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (idx, field, value) => {
    const updated = [...form.ingredients];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm(prev => ({ ...prev, ingredients: updated }));
  };

  const addIngredient = () => {
    setForm(prev => ({ ...prev, ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }] }));
  };

  const removeIngredient = (idx) => {
    setForm(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== idx) }));
  };

  const handleInstructionChange = (idx, value) => {
    const updated = [...form.instructions];
    updated[idx] = value;
    setForm(prev => ({ ...prev, instructions: updated }));
  };

  const addInstruction = () => {
    setForm(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeInstruction = (idx) => {
    setForm(prev => ({ ...prev, instructions: prev.instructions.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSaving(true);
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category || undefined,
      cuisine: form.cuisine.trim() || undefined,
      difficulty: form.difficulty,
      prep_time: form.prep_time ? Number(form.prep_time) : undefined,
      cook_time: form.cook_time ? Number(form.cook_time) : undefined,
      servings: form.servings ? Number(form.servings) : undefined,
      ingredients: form.ingredients.filter(i => i.name.trim()),
      instructions: form.instructions.filter(i => i.trim()),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      image_url: form.image_url.trim() || undefined,
      notes: form.notes.trim() || undefined,
      source: form.source.trim() || undefined,
      calories_per_serving: form.calories_per_serving ? Number(form.calories_per_serving) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
    };

    if (recipe?.id) {
      await base44.entities.Recipe.update(recipe.id, data);
    } else {
      await base44.entities.Recipe.create(data);
    }
    setSaving(false);
    onSave?.();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-playfair text-xl">{recipe ? 'Edit Recipe' : 'New Recipe'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={e => handleChange('title', e.target.value)} placeholder="Grandma's Apple Pie" className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="A family favorite..." rows={2} className="mt-1.5" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => handleChange('category', v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cuisine">Cuisine</Label>
              <Input id="cuisine" value={form.cuisine} onChange={e => handleChange('cuisine', e.target.value)} placeholder="Italian" className="mt-1.5" />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={form.difficulty} onValueChange={v => handleChange('difficulty', v)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {difficulties.map(d => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="servings">Servings</Label>
              <Input id="servings" type="number" min="1" value={form.servings} onChange={e => handleChange('servings', e.target.value)} placeholder="4" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="prep_time">Prep Time (min)</Label>
              <Input id="prep_time" type="number" min="0" value={form.prep_time} onChange={e => handleChange('prep_time', e.target.value)} placeholder="15" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cook_time">Cook Time (min)</Label>
              <Input id="cook_time" type="number" min="0" value={form.cook_time} onChange={e => handleChange('cook_time', e.target.value)} placeholder="30" className="mt-1.5" />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Ingredients</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addIngredient} className="h-7 text-xs gap-1">
                <Plus size={14} /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {form.ingredients.map((ing, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={ing.amount} onChange={e => handleIngredientChange(i, 'amount', e.target.value)} placeholder="1" className="w-16" />
                  <Input value={ing.unit} onChange={e => handleIngredientChange(i, 'unit', e.target.value)} placeholder="cup" className="w-20" />
                  <Input value={ing.name} onChange={e => handleIngredientChange(i, 'name', e.target.value)} placeholder="Flour" className="flex-1" />
                  {form.ingredients.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(i)} className="h-10 w-10 text-muted-foreground hover:text-destructive">
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Instructions</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addInstruction} className="h-7 text-xs gap-1">
                <Plus size={14} /> Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {form.instructions.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <span className="flex-shrink-0 w-7 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">{i+1}</span>
                  <Textarea value={step} onChange={e => handleInstructionChange(i, e.target.value)} placeholder="Step description..." rows={2} className="flex-1 min-h-[40px]" />
                  {form.instructions.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeInstruction(i)} className="h-10 w-10 text-muted-foreground hover:text-destructive self-start">
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" value={form.tags} onChange={e => handleChange('tags', e.target.value)} placeholder="quick, healthy, family" className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" value={form.image_url} onChange={e => handleChange('image_url', e.target.value)} placeholder="https://..." className="mt-1.5" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" value={form.notes} onChange={e => handleChange('notes', e.target.value)} rows={2} placeholder="Personal tips..." className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="source">Source / URL</Label>
              <Input id="source" value={form.source} onChange={e => handleChange('source', e.target.value)} placeholder="https://..." className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="calories">Calories per serving</Label>
              <Input id="calories" type="number" value={form.calories_per_serving} onChange={e => handleChange('calories_per_serving', e.target.value)} placeholder="250" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input id="rating" type="number" min="1" max="5" step="0.5" value={form.rating} onChange={e => handleChange('rating', e.target.value)} placeholder="4.5" className="mt-1.5" />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={saving || !form.title.trim()} className="flex-1 gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {recipe ? 'Save Changes' : 'Add Recipe'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}