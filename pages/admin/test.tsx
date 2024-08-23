import { useState } from "react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MultiSelect() {
  const [selectedDays, setSelectedDays] = useState([]);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const removeDay = (dayToRemove) => {
    setSelectedDays(selectedDays.filter((day) => day !== dayToRemove));
  };

  return (
    <div className="w-full max-w-lg">
      <div className="relative">
        <div
          className="relative w-full py-2 pl-3 pr-10 bg-white rounded-lg shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm flex flex-wrap gap-2 items-center"
          onClick={() =>
            document.getElementById("dropdown").classList.toggle("hidden")
          }
        >
          {selectedDays.length > 0 ? (
            selectedDays.map((day) => (
              <div
                key={day}
                className="flex items-center px-3 py-1 bg-gray-200 rounded-full"
              >
                <span className="text-sm text-gray-700">{day}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDay(day);
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-400">Select days</span>
          )}
        </div>

        <div
          id="dropdown"
          className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg hidden"
        >
          <ul className="max-h-60 py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {days.map((day) => (
              <li
                key={day}
                className={`cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                  selectedDays.includes(day)
                    ? "bg-indigo-100 text-indigo-900"
                    : "text-gray-900"
                }`}
                onClick={() => toggleDay(day)}
              >
                <span
                  className={`block truncate ${selectedDays.includes(day) ? "font-medium" : "font-normal"}`}
                >
                  {day}
                </span>
                {/* {selectedDays.includes(day) && (
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                )} */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
