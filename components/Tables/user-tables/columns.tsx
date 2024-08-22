"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { User } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import SortColumn from "../sortColumn";
import { formatDate } from "date-fns";
import ToggleActive from "../toggle";

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "phone",
    header: ({ column }) => <SortColumn column={column} title="Phone Number" />,
  },
  {
    accessorKey: "Register Date",
    header: ({ column }) => (
      <SortColumn column={column} title="Register Date" />
    ),
    cell: ({ row }) => (
      <span>{formatDate(row.original.createdAt, "dd MMM yyyy, HH:mm a")}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <SortColumn column={column} title="Status" />,
    cell: ({ row }) => <ToggleActive row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
