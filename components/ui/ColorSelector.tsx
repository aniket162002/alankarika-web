'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ColorOption {
  name: string;
  value: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor?: string;
  onColorSelect: (color: ColorOption) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  allowCustomColor?: boolean;
  customColorValue?: string;
  onCustomColorChange?: (color: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorSelect,
  className,
  size = 'md',
  allowCustomColor = false,
  customColorValue = '',
  onCustomColorChange
}: ColorSelectorProps) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [tempCustomColor, setTempCustomColor] = useState(customColorValue);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Show component even if no predefined colors when custom colors are allowed
  if ((!colors || colors.length === 0) && !allowCustomColor) {
    return null;
  }

  const handleCustomColorSubmit = () => {
    if (tempCustomColor.trim() && onCustomColorChange) {
      onCustomColorChange(tempCustomColor.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="text-sm font-medium text-gray-700">
        Choose Color:
      </div>

      {/* Predefined Colors */}
      {colors && colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <motion.button
              key={color.value}
              type="button"
              className={cn(
                'relative rounded-full border-2 transition-all duration-200 hover:scale-110',
                sizeClasses[size],
                selectedColor === color.value
                  ? 'border-amber-500 shadow-lg'
                  : 'border-gray-300 hover:border-amber-400'
              )}
              style={{ backgroundColor: color.hex }}
              onClick={() => onColorSelect(color)}
              onMouseEnter={() => setHoveredColor(color.value)}
              onMouseLeave={() => setHoveredColor(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedColor === color.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    'absolute inset-0 flex items-center justify-center',
                    iconSizes[size]
                  )}
                >
                  <Check
                    className={cn(
                      'text-white drop-shadow-lg',
                      iconSizes[size]
                    )}
                    strokeWidth={3}
                  />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Custom Color Input */}
      {allowCustomColor && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-2 text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              <Palette className="w-4 h-4" />
              Custom Color
            </Button>
          ) : (
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Enter custom color (e.g., Rose Gold, Antique)"
                value={tempCustomColor}
                onChange={(e) => setTempCustomColor(e.target.value)}
                className="flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomColorSubmit();
                  }
                }}
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCustomColorSubmit}
                disabled={!tempCustomColor.trim()}
              >
                Add
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowCustomInput(false);
                  setTempCustomColor(customColorValue);
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Display current custom color */}
          {customColorValue && !showCustomInput && (
            <div className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              Custom: {customColorValue}
            </div>
          )}
        </div>
      )}

      {/* Color name display for predefined colors */}
      {(hoveredColor || selectedColor) && colors.find(c => c.value === (hoveredColor || selectedColor)) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md border"
        >
          {colors.find(c => c.value === (hoveredColor || selectedColor))?.name}
        </motion.div>
      )}
    </div>
  );
}

// Helper function to check if a product has color options
export function hasColorOptions(product: any): boolean {
  return product?.available_colors && 
         Array.isArray(product.available_colors) && 
         product.available_colors.length > 0;
}

// Helper function to check if a product is a पारिजात product
export function isParijaatProduct(productName: string): boolean {
  return productName?.startsWith('पारिजात');
}

// Helper function to get color name from color value
export function getColorName(colorValue: string, availableColors: ColorOption[]): string {
  const color = availableColors?.find(c => c.value === colorValue);
  return color?.name || colorValue;
}
