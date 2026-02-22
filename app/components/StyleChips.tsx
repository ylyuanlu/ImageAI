"use client";

import React from 'react';

interface StyleOption {
  id: string;
  label: string;
}

interface StyleChipsProps {
  label: string;
  options: StyleOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function StyleChips({
  label,
  options,
  selected,
  onSelect,
}: StyleChipsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`style-chip px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selected === option.id
                ? 'bg-primary-600 text-white shadow-md border-transparent'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-primary-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
