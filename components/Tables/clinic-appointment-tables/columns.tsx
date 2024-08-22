"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Doctor } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";

export const columns: ColumnDef<Doctor>[] = [
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
    accessorKey: "email",
    header: ({ column }) => <SortColumn column={column} title="Email" />,
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => <SortColumn column={column} title="Phone Number" />,
  },
  {
    accessorFn: (row) => row.clinic.name,
    id: "clinic.name",
    header: ({ column }) => <SortColumn column={column} title="Pet Clinic" />,
  },
  {
    accessorKey: "about",
    header: ({ column }) => <SortColumn column={column} title="About" />,
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
