"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import { truncate } from "@/utils/truncate";
import { Admin } from "@/types/api";
import { Role } from "@/types";
import { formatDate } from "date-fns";

export const columns: ColumnDef<Admin>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select Row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    accessorKey: "role",
    header: ({ column }) => <SortColumn column={column} title="Roles" />,
    cell: ({ row }) => (
      <span className="text-pretty">
        {Role[row.original.role as keyof unknown]}
      </span>
    ),
  },
  {
    accessorKey: "about",
    header: ({ column }) => <SortColumn column={column} title="About" />,
    cell: ({ row }) => (
      <span className="text-pretty">{truncate(row.original.about, 70)}</span>
    ),
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
    accessorKey: "createdAt",
    header: ({ column }) => <SortColumn column={column} title="Created On" />,
    cell: ({ row }) => (
      <span>{formatDate(row.original.createdAt, "dd MMM yyyy, HH:mm a")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
