"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import SortColumn from "../sortColumn";
import { truncate } from "@/utils/truncate";
import { serviceType } from "@/components/Forms/create-services-form";
import { CareService } from "@/types/api";

export const columns: ColumnDef<CareService>[] = [
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
    accessorKey: "type",
    header: ({ column }) => <SortColumn column={column} title="Type" />,
    cell: ({ row }) => {
      const matchedType = serviceType.find(
        (type) => type.value === row.original.type
      );
      return (
        <span className="text-pretty">
          {matchedType ? matchedType.name : "Unknown"}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortColumn column={column} title="Price" />,
    cell: ({ row }) => <span>฿ {row.original.price}</span>,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortColumn column={column} title="Description" />,
    cell: ({ row }) => (
      <span className="text-pretty">
        {truncate(row.original.description, 300)}
      </span>
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
