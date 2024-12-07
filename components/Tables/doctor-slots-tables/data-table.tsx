"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import CreateScheduleForm from "@/components/Forms/create-slot-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Pagination from "../pagination";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fetchAppointmentSlots } from "@/pages/api/api";
import { useRouter } from "next/router";
import Loading from "@/pages/loading";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  isLoading?: boolean;
  onClickRow?: (id: string) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onClickRow,
  totalPages,
  currentPage,
  onPageChange,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const { id } = router.query;
  const [tableData, setTableData] = React.useState<TData[]>(data); // State to hold the filtered data
  const [date, setDate] = React.useState<Date | any>();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [loading, setLoading] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: tableData, // Use the filtered data state
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpenChange = (open: any) => {
    setIsOpen(open);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleDateChange = async (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      setDate(selectedDate);
      const data = await fetchAppointmentSlots({
        doctorId: Number(id),
        date: selectedDate.toISOString(),
        page: 1,
        pageSize: 10,
      });

      const filteredData: any[] = data.slots;
      setTableData(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const resetDate = async () => {
    setLoading(true);
    try {
      setDate(null);
      const data = await fetchAppointmentSlots({
        ...(router.query.id && { doctorId: Number(id) }),
        page: 1,
        pageSize: 10,
      });

      const resetData: any[] = data.slots;
      setTableData(resetData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        <div className="flex flex-row items-center justify-between gap-5">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={resetDate}>Reset</Button>
        </div>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              className="text-xs md:text-sm"
              onClick={() => setIsOpen(true)}
            >
              Create Appointment Slots
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Available Slots</DialogTitle>
            </DialogHeader>
            <CreateScheduleForm onCancel={handleCancel} />
          </DialogContent>
        </Dialog>
      </div>
      {!loading ? (
        <ScrollArea className="h-[calc(80vh-220px)] rounded-md border">
          <Table className="relative">
            <TableHeader className="bg-zinc-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-black">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:cursor-pointer"
                    onClick={() =>
                      !!onClickRow && onClickRow((row.original as any).id)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <ScrollBar orientation="horizontal" />
          </Table>
        </ScrollArea>
      ) : (
        <div className="flex items-center justify-center h-[calc(100vh-220px)]">
          <Loading />
        </div>
      )}

      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}
