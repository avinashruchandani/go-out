'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Category, CATEGORY_INFO } from '@/lib/map-data';
import { Heart, X, SlidersHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoryChange: (categories: Category[]) => void;
  locationCounts: Record<Category, number>;
  loading: boolean;
  showOnlyFavorites: boolean;
  onShowOnlyFavoritesChange: (value: boolean) => void;
  isAuthenticated: boolean;
}

export function CategoryFilter({ 
  selectedCategories, 
  onCategoryChange, 
  locationCounts,
  loading,
  showOnlyFavorites,
  onShowOnlyFavoritesChange,
  isAuthenticated
}: CategoryFilterProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  // Shared content for both desktop sidebar and mobile drawer
  const filterContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Filter Categories</h2>
        <p className="text-sm text-gray-600">
          {selectedCategories.length} selected · {totalLocations} locations
        </p>
        
        {/* Favorites Toggle */}
        {isAuthenticated && (
          <div className="mt-3 mb-2">
            <div
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                showOnlyFavorites ? 'bg-pink-50 border border-pink-200' : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onShowOnlyFavoritesChange(!showOnlyFavorites)}
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites-toggle"
                  checked={showOnlyFavorites}
                  onCheckedChange={(checked) => onShowOnlyFavoritesChange(checked as boolean)}
                />
                <label
                  htmlFor="favorites-toggle"
                  className="text-sm font-medium cursor-pointer flex items-center space-x-1"
                >
                  <Heart className={`h-4 w-4 ${showOnlyFavorites ? 'fill-pink-500 text-pink-500' : ''}`} />
                  <span>Show Only Favorites</span>
                </label>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={selectAll}
            disabled={showOnlyFavorites}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={clearAll}
            disabled={showOnlyFavorites}
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
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile (< 768px) */}
      <div className="hidden md:flex w-80 bg-white border-r border-gray-200 flex-col h-full overflow-hidden z-[1000]">
        {filterContent}
      </div>

      {/* Mobile Filter Button - Bottom left floating */}
      <div className="md:hidden fixed bottom-6 left-6 z-[1000]">
        <Button
          onClick={() => setIsMobileOpen(true)}
          className="shadow-2xl rounded-full h-14 w-14 p-0"
          size="icon"
        >
          <SlidersHorizontal className="h-6 w-6" />
        </Button>
        {selectedCategories.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
            {selectedCategories.length}
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[1001] animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer - Slides in from left */}
      <div className={`
        md:hidden fixed top-0 left-0 h-full w-[85vw] max-w-sm bg-white z-[1002]
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col overflow-hidden shadow-2xl
      `}>
        {/* Mobile Header with Close Button */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-600">
              {selectedCategories.length} selected · {totalLocations} locations
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Drawer Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Favorites Toggle (Mobile) */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100">
              <div
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  showOnlyFavorites ? 'bg-pink-50 border border-pink-200' : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onShowOnlyFavoritesChange(!showOnlyFavorites)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="favorites-toggle-mobile"
                    checked={showOnlyFavorites}
                    onCheckedChange={(checked) => onShowOnlyFavoritesChange(checked as boolean)}
                  />
                  <label
                    htmlFor="favorites-toggle-mobile"
                    className="text-sm font-medium cursor-pointer flex items-center space-x-1"
                  >
                    <Heart className={`h-4 w-4 ${showOnlyFavorites ? 'fill-pink-500 text-pink-500' : ''}`} />
                    <span>Show Only Favorites</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions (Mobile) */}
          <div className="flex gap-2 p-4 border-b border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={selectAll}
              disabled={showOnlyFavorites}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={clearAll}
              disabled={showOnlyFavorites}
            >
              Clear All
            </Button>
          </div>

          {/* Categories */}
          <div className="pb-4">
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
                            id={`${category}-mobile`}
                            checked={isSelected}
                            onCheckedChange={() => toggleCategory(category)}
                          />
                          <label
                            htmlFor={`${category}-mobile`}
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

        {/* Mobile Footer with Apply Button */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <Button
            onClick={() => setIsMobileOpen(false)}
            className="w-full"
            size="lg"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
}