"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  HeartPulse,
  Info,
  PencilIcon,
  Syringe,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { deleteFile } from "@/pages/api/api";

const petSchema = z.object({
  profile: z.any().optional(),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Year must be at least 0"),
  month: z
    .number()
    .min(1, "Month must be at least 1")
    .max(12, "Month must not be greater than 12."),
  petType: z.enum(["dog", "cat"]),
  breed: z.string().min(1, "Breed is required"),
  sex: z.enum(["male", "female", "unknown"]),
  dateOfBirth: z.string().optional(),
  image: z.string().optional(),
});

type Pet = z.infer<typeof petSchema>;

export default function UserPetForm({ user }: any) {
  const auth = useRecoilValue(userAuthState);
  const [pets, setPets] = useState<Pet[]>(user?.pets || []);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  return (
    <>
      {pets.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No pets yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {user.pets.map((pet: Pet, index: number) => (
            <PetProfile key={index} pet={pet} />
          ))}
        </div>
      )}
    </>
  );
}

interface PetProfileProps {
  pet: Pet | any;
}

const PetProfile = ({ pet }: PetProfileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    pet?.profileUrl || null
  );

  const petForm = useForm<Pet>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      age: 0,
      month: 1,
      petType: "dog",
      breed: "",
      sex: "unknown",
      dateOfBirth: "",
      image: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      petForm.setValue("profile", file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (formValues: any) => {
    setLoading(true);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Pet Information</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
          <div className="flex flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile picture"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Image
                          src="/avatar.png"
                          alt="Profile picture"
                          width={128}
                          height={128}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full"
                      onClick={handleEditClick}
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  <Input
                    id="profile"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              {isEditing ? (
                <Form {...petForm}>
                  <form
                    onSubmit={petForm.handleSubmit(onSubmit)}
                    className="w-full flex-1 space-y-5"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        placeholder="Enter your name"
                        control={petForm.control}
                        name="name"
                        label="Name"
                      />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        placeholder="Enter your phone number"
                        control={petForm.control}
                        name="phone"
                        label="Phone Number"
                      />
                    </div>

                    <div className="flex flex-col gap-6 xl:flex-row">
                      <CustomFormField
                        fieldType={FormFieldType.TEXTAREA}
                        placeholder="Enter Address"
                        control={petForm.control}
                        name="address"
                        label="Address"
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold">Name</p>
                    <p>{pet?.name}</p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold">Email</p>
                    <p>{pet?.age}</p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold">Phone Number</p>
                    <p>{pet?.phone}</p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold">Password</p>
                    <p>***************</p>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <p className="font-semibold">Address</p>
                    <p>{pet?.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {pet?.clinicAppointments?.length > 0 ? (
              pet?.clinicAppointments?.map((appointment: any) => (
                <div key={appointment.id} className="mb-4 p-3 border rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      {appointment.date.toLocaleDateString()}
                    </span>
                    <Badge
                      variant={
                        appointment.status === "completed"
                          ? "default"
                          : appointment.status === "scheduled"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {appointment.reason}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No appointments scheduled.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};
