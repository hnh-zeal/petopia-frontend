import { Role } from "..";

export interface RoomsData {
  rooms: CafeRoom[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PetClinicData {
  data: Clinic[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CareServicesData {
  careServices: [];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DoctorData {
  data: Doctor[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Root {
  id: number;
  name: string;
  description: string;
  contact: string;
  image: any;
  treatment: any;
  tools: any;
  facilities: any;
  operatingHours: OperatingHour[];
  servicesProvided: any;
  photos: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  doctors: Doctor[];
}

export interface OperatingHour {
  dow: string;
  startTime: string;
  endTime: string;
}

export interface Root {
  doctors: Doctor[];
  count: number;
}

interface WorkExperience {
  from_year: string;
  to_year: string;
  position: string;
  location: string;
}

interface Education {
  year: string;
  name: string;
  location: string;
}

export interface Schedule {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  dow: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  about: string;
  profileUrl: string;
  specialties: string[];
  languages: string[];
  work_experiences: WorkExperience[];
  education: Education[];
  isActive: boolean;
  createdAt: Date;
  clinic: Clinic;
  schedules: Schedule[];
}

export interface Clinic {
  id: number;
  name: string;
  description: string;
  contact: string;
  mainImage: string;
  treatment: string[];
  tools: string[];
  operatingHours: { dow: string; startTime: string; endTime: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  doctors: Doctor[];
}

export interface OperatingHour {
  dow: string;
  startTime: string;
  endTime: string;
}

export interface ClinicAppointment {
  id: number;
  description: string;
  date: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  pet: Pet;
  doctor: Doctor;
  reason: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  loginType: string;
  phone?: string;
  birthDate: string;
  address: string;
  city?: string;
  state: any;
  country?: string;
  postalCode: any;
  emergencyContact: any;
  contactNumber: any;
  profileUrl: any;
  lastLoginDate: any;
  pets?: Pet[];
  packages?: Packages[];
  clinicAppointments?: ClinicAppointment[];
  careAppointments?: CareAppointment[];
  bookings?: CafeBooking[];
  packageHistory: PackageHistory[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pet {
  id: number;
  name: string;
  petType: string;
  age: number;
  month?: number;
  breed: string;
  sex: string;
  medication: any;
  vaccinationRecords: any;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CafePetData {
  data: CafePet[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CafePet {
  id: number;
  name: string;
  dateOfBirth: string;
  imageUrl: string;
  year: number;
  month: number;
  petType: string;
  breed: string;
  sex: string;
  description: string;
  medication: string;
  vaccinationRecords: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  room: {
    id: number;
    name: string;
    roomNo: string;
    roomType: string;
  };
}

export interface CareService {
  id: number;
  name: string;
  type: string;
  description: string;
  mainImage: string;
  images: string[];
  price: number;
  rating: number;
  reviews: number;
  categories: Category[];
  petSitters: PetSitter[];
  addOns: { name: string; price: number; id?: number; description: string }[];
  isActive: boolean;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CafeRoom {
  id: number;
  name: string;
  roomNo: string;
  roomType: string;
  description: string;
  price: number;
  promotion: string;
  rating: number;
  reviews: number;
  amenities: string[];
  mainImage: string;
  images: string[];
  isActive: boolean;
  pets: CafePet[];
  operatingHours: { dow: string }[];
  contact: string;
}

export interface CafeBooking {
  id: number;
  room: CafeRoom;
  user: User;
  guests: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  totalPrice: number;
  status: boolean | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomSlot {
  id: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  status: Boolean;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PackagesData {
  page?: number;
  pageSize?: number;
  totalPages?: number;
  count: number;
  packages: Packages[];
}

export interface Packages {
  id: number;
  name: string;
  description: string;
  type: string;
  price: number;
  duration: number;
  status: boolean;
  durationType: "day" | "week" | "month" | "year";
  discountPercent: number;
}

export interface PetSitter {
  id: number;
  name: string;
  profileUrl: string;
  about: string;
  email: string;
  rating: number;
  phoneNumber: string;
  specialties: string[];
  languages: string[];
  isActive: boolean;
  reviews: string;
  services: CareService[];
  createdAt: Date;
}

export interface Category {
  id: string;
  icon: string;
  name: string;
  price: number;
  isActive: boolean;
}

export interface CategoriesData {
  count: number;
  categories: Category[];
}

export interface CareAppointment {
  id: number;
  description: string;
  date: string;
  status: string;
  type: string;
  totalPrice: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  pet: Pet;
  petSitter: PetSitter;
  service: CareService;
  categoryId: Category;
  reason: string;
}

export interface PieData {
  clinic_count: number;
  care_count: number;
  cafe_count: number;
  user_count: number;
}

export interface Appointments {
  clinicAppointments: ClinicAppointment[];
  careAppointments: CareAppointment[];
  cafeBookings: CafeBooking[];
}

export interface OverviewData {
  count: PieData;
  appointments: Appointments;
}

export interface PackageHistory {
  id: number;
  expiredDate: string;
  package: Packages;
}

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  country: string;
  profileUrl: string;
  lastLoginDate: string;
  currentLoginDate: string;
  isActive: boolean;
  createdAt: string;
  pets: Pet[];
  clinicAppointments: ClinicAppointment[];
  careAppointments: CareAppointment[];
  bookings: CafeBooking[];
  packageHistory: PackageHistory[];
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: Role;
  password: string;
  profileUrl: string;
  currentLoginDate: Date;
  lastLoginDate: Date;
  isActive: boolean;
  about: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminData {
  admins: Admin[];
  count: number;
  totalPages: number;
  page: number;
  pageSize: number;
}
