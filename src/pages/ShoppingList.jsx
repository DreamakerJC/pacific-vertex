import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Check, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const categories = ['produce', 'dairy', 'meat', 'seafood', 'bakery', 'pantry', 'frozen', 'beverages', 'spices', 'other'];

const categoryIcons = {
  produce: '🥬',
  dairy: '🥛',
  meat: '🥩',
  seafood: '🐟',
  bakery: '🍞',
  pantry: '🥫',
  frozen: '🧊',
  beverages: '🥤',
  spices: '🧂',
  other: '📦',
};

export default function ShoppingList() {
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('other');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['shoppingList'],
    queryFn: () => base44.entities.ShoppingList.list('category', 500),
  });

  const refetch = () => queryClient.invalidateQueries({ queryKey: ['shoppingList'] });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await base44.entities.ShoppingList.create({
      name: newItem.trim(),
      amount: newAmount.trim() || undefined,
      category: newCategory,
      is_checked: false,
    });
    setNewItem('');
    setNewAmount('');
    refetch();
    toast.success('Item added');
  };

  const handleToggle = async (item) => {
    await base44.entities.ShoppingList.update(item.id, { is_checked: !item.is_checked });
    refetch();
  };

  const handleDelete = async (id) => {
    await base44.entities.ShoppingList.delete(id);
    refetch();
  };

  const clearChecked = async () => {
    const checked = items.filter(i => i.is_checked);
    for (const item of checked) {
      await base44.entities.ShoppingList.delete(item.id);
    }
    refetch();
    toast.success(`Cleared ${checked.length} items`);
  };

  const clearAll = async () => {
    for (const item of items) {
      await base44.entities.ShoppingList.delete(item.id);
    }
    refetch();
    toast.success('List cleared');
  };

  // Group by category
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = items.filter(i => (i.category || 'other') === cat);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.is_checked).length;
  const totalCount = items.length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-foreground">Shopping List</h1>
          <p className="text-muted-foreground mt-1">
            {checkedCount} of {totalCount} items checked
          </p>
        </div>
        {checkedCount > 0 && (
          <Button onClick={clearChecked} variant="outline" size="sm" className="gap-2">
            <Check size={14} />
            Clear Checked
          </Button>
        )}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <Input
          placeholder="Add item..."
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Qty"
          value={newAmount}
          onChange={e => setNewAmount(e.target.value)}
          className="w-20"
        />
        <Select value={newCategory} onValueChange={setNewCategory}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c} value={c} className="capitalize">
                {categoryIcons[c]} {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" size="icon">
          <Plus size={18} />
        </Button>
      </form>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-playfair text-lg font-semibold mb-1">Your list is empty</h3>
          <p className="text-muted-foreground text-sm">Add items above or generate from meal planner</p>
        </div>
      )}

      {/* List by category */}
      {!isLoading && items.length > 0 && (
        <div className="space-y-6">
          {categories.map(cat => {
            const catItems = grouped[cat];
            if (!catItems || catItems.length === 0) return null;

            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{categoryIcons[cat]}</span>
                  <h3 className="font-semibold capitalize text-foreground">{cat}</h3>
                  <span className="text-xs text-muted-foreground">({catItems.length})</span>
                </div>
                <div className="space-y-1.5">
                  <AnimatePresence>
                    {catItems.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                          item.is_checked
                            ? 'bg-muted/50 border-border/50'
                            : 'bg-card border-border'
                        }`}
                      >
                        <Checkbox
                          checked={item.is_checked}
                          onCheckedChange={() => handleToggle(item)}
                          className="h-5 w-5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${item.is_checked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {item.amount && <span className="text-accent font-semibold">{item.amount} </span>}
                            {item.name}
                          </p>
                          {item.recipe_source && (
                            <p className="text-xs text-muted-foreground truncate">From: {item.recipe_source}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear all */}
      {!isLoading && items.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <Button onClick={clearAll} variant="outline" className="w-full text-muted-foreground hover:text-destructive hover:border-destructive/30">
            Clear Entire List
          </Button>
        </div>
      )}
    </div>
  );
}