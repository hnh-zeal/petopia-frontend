import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export default function PetRow({ row }: { row: any }) {
  return (
    <>
      <p>{row.original.pet ? row.original.pet.name : ""}</p>
    </>
  );
}
