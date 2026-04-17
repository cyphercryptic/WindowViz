'use client';

import { Card, CardContent } from '@/components/ui/card';
import { AppWindow, PanelLeft, DoorOpen } from 'lucide-react';
import type { ProductCategory } from '@/types';

interface CategorySelectorProps {
  onSelect: (category: ProductCategory) => void;
}

const categories: { value: ProductCategory; label: string; description: string; icon: typeof AppWindow }[] = [
  {
    value: 'window',
    label: 'Windows',
    description: 'Double-hung, casement, bay, picture, and more',
    icon: AppWindow,
  },
  {
    value: 'sliding_glass_door',
    label: 'Sliding Glass Doors',
    description: 'Multi-panel sliding and patio doors',
    icon: PanelLeft,
  },
  {
    value: 'entry_door',
    label: 'Entry Doors',
    description: 'Front doors, sidelights, and transoms',
    icon: DoorOpen,
  },
];

export function CategorySelector({ onSelect }: CategorySelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-brand-brown/60">
        What type of product do you want to visualize?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map(({ value, label, description, icon: Icon }) => (
          <button key={value} type="button" onClick={() => onSelect(value)}>
            <Card className="h-full transition-colors hover:border-brand-orange hover:shadow-md cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
                <Icon className="h-10 w-10 text-brand-orange" />
                <div className="text-center">
                  <p className="text-lg font-semibold text-brand-brown">{label}</p>
                  <p className="text-sm text-brand-brown/50">{description}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
