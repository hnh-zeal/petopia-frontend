import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export default function UserRow({ row }: { row: any }) {
  return (
    <>
      <p>{row.original.user.name}</p>
    </>
  );
}
