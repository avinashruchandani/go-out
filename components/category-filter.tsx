'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, CATEGORY_INFO } from '@/lib/map-data';

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const [open, setOpen] = useState(false);

  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const categories = Object.keys(CATEGORY_INFO) as Category[];

  return (
    <div className="absolute top-6 left-6 z-[1000]">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            className="shadow-lg bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter Categories
            {selectedCategories.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedCategories.length}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="space-y-2 p-2">
            {categories.map((category) => (
              <div
                key={category}
                className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-md p-2"
                onClick={() => toggleCategory(category)}
              >
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                />
                <label
                  htmlFor={category}
                  className="text-sm font-medium leading-none cursor-pointer flex items-center space-x-2 flex-1"
                >
                  <span>{CATEGORY_INFO[category].emoji}</span>
                  <span>{CATEGORY_INFO[category].label}</span>
                </label>
              </div>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => onCategoryChange([])}
                >
                  Clear All
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
