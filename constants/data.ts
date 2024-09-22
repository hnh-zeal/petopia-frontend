import { NavItem } from "@/types";

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export type Schedule = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: boolean;
  isActive: boolean;
  doctor: Doctor;
};

export type AppointmentSlot = {
  id: number;
  dow: string;
  dayOfWeek: number;
  date: Date;
  startTime: string;
  endTime: string;
  doctor: Doctor;
  status: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  verified: boolean;
  isActive: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Doctor = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  about: string;
  clinic: PetClinic;
  specialties: string[];
  verified: boolean;
  isActive: string;
};

export type PetClinic = {
  id: number;
  image?: string;
  name: string;
  contact: string;
  description: string;
  treatment?: string[];
  tools?: string[];
  verified: boolean;
  isActive: string;
};

export type CareService = {
  id: number;
  name: string;
  description: string;
  isActive: string;
};

export type PetSitter = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  careService: CareService;
  isActive: string;
};

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: "user",
    label: "user",
  },
  {
    title: "Doctors",
    href: "/admin/doctors",
    icon: "doctor",
    label: "doctor",
  },
  {
    title: "Pet Sitters",
    href: "/admin/pet-sitters",
    icon: "petSitter",
    label: "pet-sitters",
  },
  {
    title: "Pet Clinic",
    subMenu: true,
    subMenuItems: [
      {
        title: "Pet Centers",
        href: "/admin/pet-clinic/pet-centers",
        icon: "petCenters",
        label: "centers",
      },
      {
        title: "Appointments",
        href: "/admin/pet-clinic/appointments",
        icon: "appointments",
        label: "appointments",
      },
    ],
    icon: "petClinic",
    label: "petClinic",
  },
  {
    title: "Pet Care",
    // href: "/admin/pet-care",
    subMenu: true,
    subMenuItems: [
      {
        title: "Services",
        href: "/admin/pet-care/services",
        icon: "pawPrint",
        label: "centers",
      },
      {
        title: "Appointments",
        href: "/admin/pet-care/appointments",
        icon: "appointments",
        label: "appointments",
      },
    ],
    icon: "petCare",
    label: "petCare",
  },
  {
    title: "Pet Cafe",
    // href: "/admin/pet-cafe",
    subMenu: true,
    subMenuItems: [
      {
        title: "Rooms",
        href: "/admin/pet-cafe/cafe-rooms",
        icon: "room",
        label: "centers",
      },
      {
        title: "Pets",
        href: "/admin/pet-cafe/pets",
        icon: "cafePets",
        label: "pet-sitters",
      },
      {
        title: "Appointments",
        href: "/admin/pet-cafe/appointments",
        icon: "appointments",
        label: "appointments",
      },
    ],
    icon: "petCafe",
    label: "petCafe",
  },
  {
    title: "Packages",
    href: "/admin/packages",
    icon: "packages",
    label: "packages",
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: "report",
    label: "Report",
  },
];

export type Gender = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  verified: boolean;
  status: string;
};

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "Male",
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Birth Certificate",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Birth Certificate",
  "Driver's License",
  "Medical Insurance Card/Policy",
  "Military ID Card",
  "National Identity Card",
  "Passport",
  "Resident Alien Card (Green Card)",
  "Social Security Card",
  "State ID Card",
  "Student ID Card",
  "Voter ID Card",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "John Green",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "Leila Cameron",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "David Livingston",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "Evan Peter",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "Jane Powell",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "Hardik Sharma",
  },
];

export const StatusIcon = {
  scheduled: "/assets/icons/check.svg",
  pending: "/assets/icons/pending.svg",
  cancelled: "/assets/icons/cancelled.svg",
};

export const petTypes = [
  {
    name: "dog",
    label: "Dog",
  },
  {
    name: "cat",
    label: "Cat",
  },
  {
    name: "bird",
    label: "Bird",
  },
  {
    name: "rabbit",
    label: "Rabbit",
  },
];

export const GenderOptions = ["male", "female", "other"];
