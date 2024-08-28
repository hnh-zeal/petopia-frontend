import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export default function SortColumn({
  column,
  title,
}: {
  column: any;
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      <span className="capitalize">{title}</span>
      {column.getIsSorted() === "asc" ? (
        <ArrowDown className="ml-2 h-3 w-3" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowUp className="ml-2 h-3 w-3" />
      ) : (
        <ChevronsUpDown className="ml-2 h-3 w-3" />
      )}
    </Button>
  );
}
