"use client";
import { ColumnDef } from "@tanstack/react-table";
import { UserCellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import UserRow from "../userRow";
import { format } from "date-fns";
import { CareAppointment } from "@/types/api";
import PetRow from "../petRow";
import SitterRow from "../sitterRow";

export const userColumns: ColumnDef<CareAppointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortColumn column={column} title="Id" />,
  },
  {
    accessorKey: "pet",
    header: ({ column }) => <SortColumn column={column} title="Pet" />,
    cell: ({ row }) => <PetRow row={row} />,
  },
  {
    accessorKey: "service",
    header: ({ column }) => <SortColumn column={column} title="Service" />,
    cell: ({ row }) => (
      <p>{row.original.service ? row.original.service.name : ""}</p>
    ),
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => <SortColumn column={column} title="Category" />,
    cell: ({ row }) => (
      <p>{row.original.categoryId ? row.original.categoryId.name : ""}</p>
    ),
  },
  {
    accessorKey: "sitter",
    header: ({ column }) => <SortColumn column={column} title="Sitter" />,
    cell: ({ row }) => <SitterRow row={row} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortColumn column={column} title="Date" />,
    cell: ({ row }) => (
      <span>{format(row.original.date, "dd MMM yyyy, HH:mm a")}</span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => <SortColumn column={column} title="Price" />,
    cell: ({ row }) => <span>฿ {row.original.totalPrice}</span>,
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
        {row.original?.status === "ACCEPTED" ? (
          <Badge className="bg-green-500">Accepted</Badge>
        ) : row.original?.status === "PENDING" ? (
          <Badge className="bg-orange-500">Pending</Badge>
        ) : (
          <Badge variant="destructive">Rejected</Badge>
        )}
      </>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
];

export const adminColumns: ColumnDef<CareAppointment>[] = [
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
    cell: ({ row }) => <PetRow row={row} />,
  },
  {
    accessorKey: "service",
    header: ({ column }) => <SortColumn column={column} title="Service" />,
    cell: ({ row }) => (
      <p>{row.original.service ? row.original.service.name : ""}</p>
    ),
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => <SortColumn column={column} title="Category" />,
    cell: ({ row }) => (
      <p>{row.original.categoryId ? row.original.categoryId.name : ""}</p>
    ),
  },
  {
    accessorKey: "sitter",
    header: ({ column }) => <SortColumn column={column} title="Sitter" />,
    cell: ({ row }) => <SitterRow row={row} />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <SortColumn column={column} title="Date" />,
    cell: ({ row }) => (
      <span>{format(row.original.date, "dd MMM yyyy, HH:mm a")}</span>
    ),
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => <SortColumn column={column} title="Price" />,
    cell: ({ row }) => <span>{row.original.totalPrice} ฿</span>,
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
        {row.original?.status === "ACCEPTED" ? (
          <Badge className="bg-green-500">Accepted</Badge>
        ) : row.original?.status === "PENDING" ? (
          <Badge className="bg-orange-500">Pending</Badge>
        ) : (
          <Badge variant="destructive">Rejected</Badge>
        )}
      </>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
];
