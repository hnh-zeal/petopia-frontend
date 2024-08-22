import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [pages, setPages] = useState<number[]>([]);

  useEffect(() => {
    const totalPageNumbers = 5;
    const halfTotalPageNumbers = Math.floor(totalPageNumbers / 2);

    let startPage: number, endPage: number;
    if (totalPages <= totalPageNumbers) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= halfTotalPageNumbers) {
        startPage = 1;
        endPage = totalPageNumbers;
      } else if (currentPage + halfTotalPageNumbers >= totalPages) {
        startPage = totalPages - totalPageNumbers + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfTotalPageNumbers;
        endPage = currentPage + halfTotalPageNumbers;
      }
    }

    const newPages = Array.from(
      { length: endPage + 1 - startPage },
      (_, i) => startPage + i
    );
    setPages(newPages);
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={"ghost"}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "default" : "ghost"}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;
