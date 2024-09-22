import { Calendar } from "@/components/ui/calendar";
import React, { useState } from "react";

const AvailableSlots = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row space-x-8">
        <div className="w-1/3 bg-white py-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">Choose Date</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
          {/* Additional schedule based on selected date range */}
        </div>

        {/* Right Side: Time Slots */}
        <div className="w-2/3 py-4 ">
          <div className="text-lg font-bold mb-4">Available Time</div>
          <div className="flex flex-wrap py-4 gap-10">
            {/* Time Slot Buttons */}
            {[
              "9:00 AM",
              "9:30 AM",
              "10:00 AM",
              "10:30 AM",
              "11:00 AM",
              "11:30 AM",
              "12:00 PM",
              "12:30 PM",
            ].map((time, index) => (
              <button
                key={index}
                className={`items-center justify-center text-sm font-medium hover:cursor-pointer h-10 rounded-md px-4 py-2 border ${
                  time === "10:00 AM" ? "bg-red-500 text-white" : ""
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableSlots;
