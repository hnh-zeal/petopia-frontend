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
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
  birthDate: z.date().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
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
  phone: z.string(),
  address: z.string(),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
});

export const VerifyOTPSchema = z.object({
  otpCode: z.string(),
});

export const ChangePasswordSchema = z.object({
  new_password: z.string().min(1, { message: "New Password is required." }),
  confirm_password: z
    .string()
    .min(1, { message: "Confirm Password is required." }),
});

const sectionSchema = z.object({
  dow: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const CreatePetClinicSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  contact: z.string().min(1, { message: "Contact No. is required." }),
  description: z.string(),
  sections: z.array(sectionSchema).optional(),
  tools: z.any(z.string()).optional(),
  treatment: z.any(z.string()).optional(),
  mainImage: z.any().optional(),
});

const addOnSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  type: z.enum(["SITTING", "GROOMING", "TRAINING"]),
  description: z.string().min(1, { message: "Name is required." }),
  price: z.number(),
  categoryIds: z
    .array(z.any())
    .nonempty("Please select at least one category."),
  addOns: z.array(addOnSchema).optional(),
});

export const CreateCafeRoomSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  roomNo: z.string().min(1, { message: "Room No. is required." }),
  price: z.number(),
  description: z.string().min(1, { message: "Description is required." }),
  contact: z.string(),
  mainImage: z.string().optional(),
  images: z.any().optional(),
});

export const CreateCafePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string(),
  roomId: z.string(),
});

export const UpdateCafePetSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  description: z.string().optional(),
  petType: z.string().optional(),
  breed: z.string().optional(),
  roomId: z.any().optional(),
  dateOfBirth: z.date().optional(),
  sex: z.any().optional(),
  imageUrl: z.any().optional(),
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
  from_year: z.string().optional(),
  to_year: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
});

const educationSchema = z.object({
  year: z.string().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
});

const scheduleSchema = z.object({
  dayOfWeek: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

const MAX_FILE_SIZE = 50000000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CreateDoctorSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Enter a valid email address" }),
  clinicId: z.string().min(1, { message: "Pet Center is required" }),
  phoneNumber: z.string().optional(),
  about: z.string().optional(),
  schedule: z.array(scheduleSchema).optional(),
  work_experiences: z.array(experienceSchema).optional(),
  education: z.array(educationSchema).optional(),
  profile: z
    .instanceof(File)
    .refine((file) => {
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Only .jpg, .jpeg, .png and .webp formats are supported.")
    .optional(),
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
  startDate: z.date(),
  endDate: z.date(),
});

export const EditProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  profile: z.any().optional(),
  address: z.string().optional(),
  password: z.string().optional(),
});

export const ClinicAppointmentSchema = z.object({});
