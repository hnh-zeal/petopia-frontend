import * as z from "zod";

export const AdminLoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const UserRegisterSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, { message: "Password is required" }),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number")
    .optional(),
  birthDate: z.date().optional(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().optional(),
  terms: z.boolean(),
  privacy: z.boolean(),
});

export const UserLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, { message: "Password is required" }),
});

export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phoneNumber: z.string(),
  about: z.string(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export const VerifyOTPSchema = z.object({
  otpCode: z.string(),
});

export const ChangePasswordSchema = z.object({
  new_password: z.string(),
  confirm_password: z.string(),
});

const sectionSchema = z.object({
  dow: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const CreatePetClinicSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  contact: z.string().min(1, { message: "Contact No. is required." }),
  description: z.string(),
  sections: z.array(sectionSchema),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string(),
});

export const CreateCafeRoomSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  roomNo: z.string(),
  price: z.string(),
  roomType: z.string(),
  description: z.string(),
  // facilities: z.string(),
  // menus: z.string(),
});

export const CreateCafePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string(),
  roomId: z.string(),
});

export const UpdateCafePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string(),
  roomId: z.string(),
  age: z.number(),
});

export const CreatePetSitterSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phoneNumber: z.string(),
  careServiceId: z.string().min(1, { message: "Care Service is required" }),
  about: z.string(),
});

export const CreateAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

const experienceSchema = z.object({
  from_year: z.string(),
  to_year: z.string(),
  position: z.string(),
  location: z.string(),
});

const educationSchema = z.object({
  year: z.string(),
  name: z.string(),
  location: z.string(),
});

const scheduleSchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const CreateDoctorSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  clinicId: z.string().min(1, { message: "Pet Center is required" }),
  phoneNumber: z.string(),
  about: z.string(),
  schedule: z.array(scheduleSchema),
  work_experiences: z.array(experienceSchema),
  education: z.array(educationSchema),
  // specialties: z.array(z.string()),
  // languages: z.array(z.string()),
});

export const ScheduleAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  primaryPhysician: z.string().min(2, "Select at least one doctor"),
  schedule: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}

export const CreateSlotSchema = z.object({
  doctorId: z.number(),
  startDate: z.date(),
  endDate: z.date(),
});
