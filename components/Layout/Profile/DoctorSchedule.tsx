import { Switch } from "@/components/ui/switch";
import { format, parse } from "date-fns";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Schedule } from "@/constants/data";
import { updateDoctorScheduleByID } from "@/pages/api/api";
import { toast } from "@/components/ui/use-toast";

export const getDayName = (dayOfWeek: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
};

const DoctorSchedule = ({ schedules }: any) => {
  return (
    <div className="w-full space-x-8">
      <div className="bg-white py-4 mt-2 rounded-lg">
        <h2 className="text-lg font-bold">Weekly Schedule</h2>
        <Table className="w-full mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Day of Week</TableHead>
              <TableHead className="text-center">Start Time</TableHead>
              <TableHead className="text-center">End Time</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule: Schedule, index: number) => (
              <TableRow key={index} className="border-t">
                <TableCell className="text-center">
                  {getDayName(schedule.dayOfWeek)}
                </TableCell>
                <TableCell className="text-center">
                  {format(
                    parse(schedule.startTime, "HH:mm:ss", new Date()),
                    "h:mm a"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {format(
                    parse(schedule.endTime, "HH:mm:ss", new Date()),
                    "h:mm a"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <ScheduleSwitch schedule={schedule} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const ScheduleSwitch = ({ schedule }: { schedule: Schedule }) => {
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(schedule.isActive);

  const handleStatusToggle = async (schedule: Schedule) => {
    setLoading(true);
    try {
      const data = await updateDoctorScheduleByID(schedule.id, {
        isActive: !isActive,
      });
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        setIsActive(!isActive);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={isActive}
      disabled={loading}
      onCheckedChange={() => handleStatusToggle(schedule)}
      className={`${
        schedule.isActive ? "bg-blue-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span
        className={`${
          schedule.isActive ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default DoctorSchedule;
