"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { useToast } from "../ui/use-toast";
import { EditProfileSchema } from "@/validations/formValidation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { updateUserWithToken } from "@/pages/api/api";
import { userAuthState } from "@/states/auth";
import { useRecoilValue } from "recoil";

type ProfileFormValue = z.infer<typeof EditProfileSchema>;

export default function EditProfileForm({ user }: any) {
  const { toast } = useToast();
  const auth = useRecoilValue(userAuthState);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();

  const form = useForm<ProfileFormValue>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      profile: user?.profileUrl,
      phoneNumber: user?.phoneNumber,
    },
  });

  const onSubmit = async (formValues: ProfileFormValue) => {
    setLoading(true);
    try {
      const data = await updateUserWithToken(
        auth?.accessToken as string,
        formValues
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        router.push("/admin/pet-sitters");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="relative">
            <Avatar className="w-32 h-32 mx-auto">
              <AvatarImage src={user?.profileUrl} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button
                type="button"
                size="sm"
                className="absolute bottom-0 right-1/3 transform translate-x-1/2 rounded-full"
                onClick={() =>
                  document.getElementById("profile-upload")?.click()
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="text-center mt-4">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500">
              Last login:{" "}
              {user?.lastLoginDate &&
                format(new Date(user.lastLoginDate), "dd MMM yyyy, HH:mm a")}
            </p>
          </div>
          <div className="flex justify-around mt-4">
            <div className="text-center">
              <p className="font-semibold">{user?.pets?.length || 0}</p>
              <p className="text-sm text-gray-500">Pets</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{user?.packages?.length || 0}</p>
              <p className="text-sm text-gray-500">Packages</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">
                {user?.clinicAppointments?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Appointments</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">User Information</h2>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full flex-1 space-y-5"
              >
                {/* Name and Email */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    placeholder="Enter doctor's name"
                    control={form.control}
                    name="name"
                    label="Name"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.EMAIL}
                    placeholder="Enter doctor's email"
                    control={form.control}
                    name="email"
                    label="Email"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-6 xl:flex-row">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    placeholder="Enter doctor's name"
                    control={form.control}
                    name="phoneNumber"
                    label="Name"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    placeholder="Enter doctor's name"
                    control={form.control}
                    name="birthDate"
                    label="Date of Birth"
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Name</p>
                <p>{user?.name}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p>{user?.email}</p>
              </div>
              <div>
                <p className="font-semibold">Phone Number</p>
                <p>{user?.phoneNumber}</p>
              </div>
              <div>
                <p className="font-semibold">Birth Date</p>
                <p>
                  {user?.birthDate &&
                    format(new Date(user.birthDate), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
