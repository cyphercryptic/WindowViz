'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Eye, Home } from 'lucide-react';
import type { Perspective } from '@/types';

interface PerspectiveSelectorProps {
  onSelect: (perspective: Perspective) => void;
}

export function PerspectiveSelector({ onSelect }: PerspectiveSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-brand-brown/60">
        What perspective is the photo taken from?
      </p>
      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={() => onSelect('exterior')}>
          <Card className="h-full transition-colors hover:border-brand-orange hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-8">
              <Home className="h-10 w-10 text-brand-orange" />
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-brown">Exterior</p>
                <p className="text-sm text-brand-brown/50">Outside view</p>
              </div>
            </CardContent>
          </Card>
        </button>
        <button type="button" onClick={() => onSelect('interior')}>
          <Card className="h-full transition-colors hover:border-brand-orange hover:shadow-md cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center gap-3 p-8">
              <Eye className="h-10 w-10 text-brand-orange" />
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-brown">Interior</p>
                <p className="text-sm text-brand-brown/50">Inside view</p>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>
    </div>
  );
}
