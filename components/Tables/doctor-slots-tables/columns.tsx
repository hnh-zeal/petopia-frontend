"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { AppointmentSlot } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import { formatDate } from "date-fns";

export const columns: ColumnDef<AppointmentSlot>[] = [
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
    cell: ({ row }) => (
      <span>{formatDate(row.original.date, "dd MMMM, yyyy")}</span>
    ),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <SortColumn column={column} title="Start Time" />,
    cell: ({ row }) => (
      <span>{formatDate(row.original.startTime, "HH:mm a")}</span>
    ),
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => <SortColumn column={column} title="End Time" />,
    cell: ({ row }) => (
      <span>{formatDate(row.original.endTime, "HH:mm a")}</span>
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
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
