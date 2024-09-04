"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import DoctorRow from "../doctorRow";
import UserRow from "../userRow";
import { format } from "date-fns";
import { ClinicAppointment } from "@/types/api";

export const userColumns: ColumnDef<ClinicAppointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortColumn column={column} title="Id" />,
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => <SortColumn column={column} title="Doctor" />,
    cell: ({ row }) => <DoctorRow row={row} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortColumn column={column} title="Date" />,
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <SortColumn column={column} title="Start Time" />,
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => <SortColumn column={column} title="End Time" />,
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

export const adminColumns: ColumnDef<ClinicAppointment>[] = [
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
    accessorKey: "user",
    header: ({ column }) => <SortColumn column={column} title="User" />,
    cell: ({ row }) => <UserRow row={row} />,
  },
  {
    accessorKey: "pet",
    header: ({ column }) => <SortColumn column={column} title="Pet" />,
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => <SortColumn column={column} title="Doctor" />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortColumn column={column} title="Date" />,
    cell: ({ row }) => (
      <span>{format(row.original.date, "dd MMM yyyy, HH:mm a")}</span>
    ),
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => <SortColumn column={column} title="Start Time" />,
  },
  {
    accessorKey: "endTime",
    header: ({ column }) => <SortColumn column={column} title="End Time" />,
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
