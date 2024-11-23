"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserCellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import { format } from "date-fns";
import { RoomSlot } from "@/types/api";

export const columns: ColumnDef<RoomSlot>[] = [
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
