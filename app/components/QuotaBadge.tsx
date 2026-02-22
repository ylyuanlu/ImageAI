"use client";

import React from 'react';

interface QuotaBadgeProps {
  remaining: number;
}

export default function QuotaBadge({ remaining }: QuotaBadgeProps) {
  return (
    <div className="h-10 px-3 rounded-lg bg-primary-50 border border-primary-200 flex items-center gap-2">
      <svg
        className="w-4 h-4 text-primary-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm font-medium text-primary-700">
        剩余 {remaining} 张
      </span>
    </div>
  );
}
