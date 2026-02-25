'use client';

import type { Category } from '@/types/menu.types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  return (
    <aside className="w-28 bg-white/40 backdrop-blur-md">
      <nav className="flex flex-col gap-3 p-3">
        <button
          onClick={() => onSelectCategory(null)}
          className={`btn-touch rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-soft ${
            selectedCategoryId === null
              ? 'bg-primary text-primary-foreground shadow-soft-lg scale-105'
              : 'bg-white hover:bg-[#e8dfd0]/30 text-primary'
          }`}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`btn-touch rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-soft ${
              selectedCategoryId === category.id
                ? 'bg-primary text-primary-foreground shadow-soft-lg scale-105'
                : 'bg-white hover:bg-[#e8dfd0]/30 text-primary'
            }`}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
