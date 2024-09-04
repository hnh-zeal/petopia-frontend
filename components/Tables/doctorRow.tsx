import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";

export default function DoctorRow({ row }: { row: any }) {
  return (
    <>
      <p>{row.original.doctor.name}</p>
    </>
  );
}
