import React, { useCallback, useState } from "react";
import { format, parse } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateDoctorScheduleByID, addDoctorSchedule } from "@/pages/api/api";
import { useToast } from "@/components/ui/use-toast";
import { Schedule } from "@/types/api";
import { useRouter } from "next/router";

const getDayName = (dayOfWeek: string) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[+dayOfWeek];
};

const DoctorSchedule = ({
  schedules: initialSchedules,
}: {
  schedules: Schedule[];
}) => {
  const router = useRouter();
  const { id } = router.query;
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleScheduleUpdate = (updatedSchedule: Schedule) => {
    setSchedules((prevSchedules) => {
      const scheduleIndex = prevSchedules.findIndex(
        (s) => s.id === updatedSchedule.id
      );
      if (scheduleIndex !== -1) {
        const updatedSchedules = [...prevSchedules];
        updatedSchedules[scheduleIndex] = updatedSchedule;
        return updatedSchedules;
      }

      return [...prevSchedules, updatedSchedule];
    });
  };

  const handleCloseDialog = useCallback(() => {
    setEditingSchedule(null);
    setIsDialogOpen(false);
  }, []);

  const openAddDialog = () => {
    setEditingSchedule(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">Weekly Schedule</h2>
          <Button className="mb-4" onClick={openAddDialog}>
            Add Schedule
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Day of Week</TableHead>
              <TableHead className="text-center">Start Time</TableHead>
              <TableHead className="text-center">End Time</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
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
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => openEditDialog(schedule)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? "Edit Schedule" : "Add Schedule"}
              </DialogTitle>
            </DialogHeader>
            <ScheduleForm
              schedule={editingSchedule}
              doctorId={`${id}`}
              onClose={handleCloseDialog}
              onScheduleUpdate={handleScheduleUpdate}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const ScheduleSwitch = ({ schedule }: { schedule: Schedule }) => {
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(schedule.isActive);
  const { toast } = useToast();

  const handleStatusToggle = async () => {
    setLoading(true);
    try {
      const data = await updateDoctorScheduleByID(schedule.id, {
        isActive: !isActive,
      });
      if (data.error) {
        toast({
          variant: "destructive",
          description: data.message,
        });
      } else {
        setIsActive(!isActive);
        toast({
          variant: "success",
          description: "Schedule status updated successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleStatusToggle}
      disabled={loading}
    />
  );
};

const ScheduleForm = ({
  schedule,
  doctorId,
  onClose,
  onScheduleUpdate,
}: {
  schedule: Schedule | null;
  doctorId: string;
  onClose: () => void;
  onScheduleUpdate: (schedule: Schedule) => void;
}) => {
  const [dayOfWeek, setDayOfWeek] = useState(
    schedule?.dayOfWeek.toString() || ""
  );
  const [startTime, setStartTime] = useState(schedule?.startTime || "");
  const [endTime, setEndTime] = useState(schedule?.endTime || "");
  const [isActive, setIsActive] = useState(schedule?.isActive);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      dayOfWeek: parseInt(dayOfWeek),
      startTime,
      endTime,
      isActive: isActive ?? true,
    };

    if (!schedule) {
      payload.doctorId = +doctorId;
    }

    onClose();
    try {
      const data = schedule
        ? await updateDoctorScheduleByID(schedule.id, payload)
        : await addDoctorSchedule(payload);

      if (data.error) {
        toast({
          variant: "destructive",
          description: data.message,
        });
      } else {
        onScheduleUpdate(data.data);
        toast({
          variant: "success",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occurred. Please try again.",
      });
    }
  };

  const daysOfWeek = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dayOfWeek">Day of Week</Label>
        <Select
          value={dayOfWeek}
          onValueChange={(value) => setDayOfWeek(value)}
        >
          <SelectTrigger id="dayOfWeek">
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {daysOfWeek.map((day) => (
              <SelectItem key={day.value} value={day.value}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time</Label>
        <Input
          id="startTime"
          type="time"
          value={startTime.slice(0, 5)}
          onChange={(e) => setStartTime(`${e.target.value}:00`)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time</Label>
        <Input
          id="endTime"
          type="time"
          value={endTime.slice(0, 5)}
          onChange={(e) => setEndTime(`${e.target.value}:00`)}
          required
        />
      </div>

      <div className="space-y-2">
        <Button type="submit" className="justify-end">
          {schedule ? "Update" : "Add"} Schedule
        </Button>
      </div>
    </form>
  );
};

export default DoctorSchedule;
