import { CafeRoom } from "@/types/api";
import { CareService } from "@/types/api";
import { create } from "zustand";

interface BookingState {
  date: Date | null;
  startTime: string;
  endTime: string;
  duration: number;
  guests: number;
  cafeRoom: CafeRoom | null;
  setDate: (date: Date) => void;
  setStartTime: (startTime: string) => void;
  setEndTime: (endTime: string) => void;
  setDuration: (duration: number) => void;
  setGuests: (guests: number) => void;
  setCafeRoom: (cafeRoom: CafeRoom) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  date: null,
  startTime: "",
  endTime: "",
  guests: 1,
  duration: 0,
  cafeRoom: null,
  setDate: (date) => set({ date }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setDuration: (duration) => set({ duration }),
  setGuests: (guests) => set({ guests }),
  setCafeRoom: (cafeRoom) => set({ cafeRoom }),
}));

interface ServiceAppointmentStore {
  service: CareService | null;
  setService: (service: CareService) => void;
}

export const useAppointmentStore = create<ServiceAppointmentStore>((set) => ({
  service: null,
  setService: (service) => set({ service }),
}));
