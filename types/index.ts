import { Icons } from "@/components/icons";
import { Admin } from "./api";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  subMenu?: boolean;
  subMenuItems?: any;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  roles?: string[];
}

export interface SubNavItem {
  title: string;
  href: string;
  icon?: keyof typeof Icons;
  label?: string;
  roles?: string[];
  description?: string;
  disabled?: boolean;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
  lastLoginDate: string;
  birthDate: Date;
  clinicAppointments: any[];
  packages: any[];
  pets: any[];
  profileUrl: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CafePet = {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
};

export type CafePetPagination = {
  cafePets: CafePet[];
  count: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export type userLoggedInData = {
  user: User;
  accessToken: string;
};

export type adminLoggedInData = {
  admin: Admin;
  accessToken: string;
  role: Role;
};

export enum Role {
  SUPER = "Super Admin",
  CLINIC = "Pet Clinic Admin",
  CARE = "Pet Care Admin",
  CAFE = "Pet Cafe Admin",
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
