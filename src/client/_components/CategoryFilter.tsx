"use client";

import { useTranslations } from "@/context/TranslationContext";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const { translations } = useTranslations()
 
  const categories = {
    all: translations.categoryAll || "Todos",
    tourism: translations.categoryTourist || "Turístico",
    professional: translations.categoryProfessional || "Profissional",
    studio: translations.categoryStudio || "Estúdio",
  }

  return (
    <div className="mb-8 flex-wrap justify-center gap-2 md:gap-4" data-aos="fade-up">
      {Object.entries(categories).map(([key, label]) => (
        <button
          key={key}
          className={`px-3 py-2 font-semibold text-lg cursor-pointer rounded-md transition-all ${
            selectedCategory === key ? "text-primary" : "text-gray-600" 
          }`}
          onClick={() => onSelectCategory(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;