"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { PetClinic } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";

export const columns: ColumnDef<PetClinic>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select Row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <SortColumn column={column} title="Id" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortColumn column={column} title="Name" />,
  },
  {
    accessorKey: "contact",
    header: ({ column }) => <SortColumn column={column} title="Contact" />,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortColumn column={column} title="Description" />,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <SortColumn column={column} title="Status" />,
    cell: ({ row }) => (
      <>
        {row.original?.isActive ? (
          <Badge className="bg-green-500">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        )}
      </>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
