"use client";

import { useTranslations } from "@/context/TranslationContext";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationProps) => {
  const { translations } = useTranslations();
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const getButtonClasses = (isActive: boolean, isDisabled: boolean) => {
    if (isDisabled) return "px-4 py-2 rounded bg-gray-200 text-gray-400 cursor-not-allowed";
    return isActive
      ? "px-4 py-2 rounded bg-gray-400 text-white shadow-md"
      : "px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400";
  };

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {/* "Previous" button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={getButtonClasses(false, currentPage === 1)}
        aria-label={translations.paginatonAriaLabel}
      >
        ← {translations.paginationPrevious || "Anterior"}
      </button>

      {/* Render page numbers - hiding on small screens */}
      <div className="hidden md:flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={getButtonClasses(currentPage === pageNumber, false)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* "Next" button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={getButtonClasses(false, currentPage === totalPages)}
        aria-label={translations.paginationAriaLabe2}
      >
        {translations.paginationNext || "Próximo"} →
      </button>
    </div>
  );
};

export default Pagination;