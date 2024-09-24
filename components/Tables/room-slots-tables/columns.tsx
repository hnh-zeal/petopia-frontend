"use client";
import { ColumnDef } from "@tanstack/react-table";
import { AdminCellAction, UserCellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import { format } from "date-fns";
import { CafeBooking } from "@/types/api";

export const columns: ColumnDef<CafeBooking>[] = [
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
    accessorKey: "date",
    header: ({ column }) => <SortColumn column={column} title="Date" />,
    cell: ({ row }) => <span>{format(row.original.date, "dd MMM yyyy")}</span>,
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <SortColumn column={column} title="Start Time" />,
    cell: ({ row }) => <span>{format(row.original.startTime, "HH:mm a")}</span>,
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => <SortColumn column={column} title="End Time" />,
    cell: ({ row }) => <span>{format(row.original.endTime, "HH:mm a")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <SortColumn column={column} title="Submitted on" />,
    cell: ({ row }) => (
      <span>{format(row.original.createdAt, "dd MMM yyyy, HH:mm a")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortColumn column={column} title="Status" />,
    cell: ({ row }) => (
      <>
        {row.original?.status ? (
          <Badge className="bg-green-500">Available</Badge>
        ) : (
          <Badge variant="destructive">Not Available</Badge>
        )}
      </>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
];
