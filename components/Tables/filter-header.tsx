import { useDataTableSorting } from "@/hooks/useDataTableSorting";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function FilterHeader({
  title,
}: {
  title: string;
  sortType?: "asc" | "desc" | undefined;
}) {
  const { handleClick, isSorted } = useDataTableSorting({ sortBy: title });

  return (
    <Button variant="ghost" onClick={handleClick}>
      <span className="capitalize">{title}</span>
      {isSorted === "asc" && <ArrowDown className="ml-2 h-4 w-4" />}
      {isSorted === "desc" && <ArrowUp className="ml-2 h-4 w-4" />}
    </Button>
  );
}
