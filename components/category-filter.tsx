'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, CATEGORY_INFO } from '@/lib/map-data';

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
  locationCounts: Record<Category, number>;
  loading: boolean;
}

export function CategoryFilter({ 
  selectedCategories, 
  onCategoryChange, 
  locationCounts,
  loading 
}: CategoryFilterProps) {
  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  // Group categories by their group property
  const groupedCategories: Record<string, Category[]> = {};
  (Object.keys(CATEGORY_INFO) as Category[]).forEach((category) => {
    const group = CATEGORY_INFO[category].group;
    if (!groupedCategories[group]) {
      groupedCategories[group] = [];
    }
    groupedCategories[group].push(category);
  });

  const allCategories = Object.keys(CATEGORY_INFO) as Category[];
  
  const selectAll = () => {
    onCategoryChange(allCategories);
  };

  const clearAll = () => {
    onCategoryChange([]);
  };

  const totalLocations = Object.values(locationCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden z-[1000]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Filter Categories</h2>
        <p className="text-sm text-gray-600">
          {selectedCategories.length} selected · {totalLocations} locations
        </p>
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={selectAll}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={clearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedCategories).map(([group, categories]) => (
          <div key={group} className="border-b border-gray-100">
            <div className="px-4 py-2 bg-gray-50">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {group}
              </p>
            </div>
            <div className="px-3 py-2">
              {categories.map((category) => {
                const count = locationCounts[category] || 0;
                const isSelected = selectedCategories.includes(category);
                
                return (
                  <div
                    key={category}
                    className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md p-2 mb-1 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Checkbox
                        id={category}
                        checked={isSelected}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm leading-none cursor-pointer flex items-center space-x-2 flex-1 min-w-0"
                      >
                        <span className="text-base flex-shrink-0">{CATEGORY_INFO[category].emoji}</span>
                        <span className="truncate">{CATEGORY_INFO[category].label}</span>
                      </label>
                    </div>
                    {isSelected && (
                      <span 
                        className={`flex-shrink-0 ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                          loading ? 'bg-gray-200 text-gray-600' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {loading ? '...' : count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}