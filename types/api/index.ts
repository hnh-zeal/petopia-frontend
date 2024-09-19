export interface RoomsData {
  rooms: [];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PetClinicData {
  petClinics: [];
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
  doctors: [];
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

export interface WorkExperience {
  from_year: string;
  to_year: string;
  position: string;
  location: string;
}

export interface Education {
  year: string;
  name: string;
  location: string;
}

export interface Root {
  doctors: Doctor[];
  count: number;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  about: string;
  profileUrl?: string;
  specialties?: string[];
  languages?: string[];
  work_experiences: WorkExperience[];
  education: Education[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  clinic: Clinic;
}

export interface WorkExperience {
  from_year: string;
  to_year: string;
  position: string;
  location: string;
}

export interface Education {
  year: string;
  name: string;
  location: string;
}

export interface Clinic {
  id: number;
  name: string;
  description: string;
  contact: string;
  image?: string;
  treatment?: string[];
  tools?: string[];
  facilities?: string[];
  operatingHours?: OperatingHour[];
  servicesProvided?: string[];
  photos?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  specialNeeds: any;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CafePet {
  id: number;
  name: string;
  description: string;
  petType: string;
  age: number;
  month?: number;
  breed: string;
  sex: string;
  medication: any;
  vaccinationRecords: any;
  specialNeeds: any;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CareService {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CafeRoom {
  id: string;
  name: string;
  roomNo: string;
  description: string;
  price: number;
  promotion: string;
  rating: number;
  reviews: number;
  amenities: string[];
  mainImage: string;
  images: string[];
  pets: {
    id: string;
    name: string;
    petType: string;
    age: number;
    sex: string;
    description: string;
    imageUrl: string;
  }[];
  operatingHours: { dow: string }[];
  contact: string;
}

export interface CafeBooking {
  id: string;
  room: CafeRoom;
  user: User;
  guests: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  status: boolean;
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
  price: number;
  duration: number;
  durationType: "day" | "week" | "month" | "year";
  discountPercent: number;
}
