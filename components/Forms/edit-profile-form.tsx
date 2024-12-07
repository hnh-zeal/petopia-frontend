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
import { useRef, useState } from "react";
import { Edit, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import {
  deleteFile,
  singleFileUpload,
  updateUserWithToken,
} from "@/pages/api/api";
import { userAuthState } from "@/states/auth";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import { Input } from "../ui/input";
import { Password } from "../password";
import { User } from "@/types/api";
import SubmitButton from "../submit-button";

type ProfileFormValue = z.infer<typeof EditProfileSchema>;

interface EditProfileProps {
  user: User | any;
}

export default function EditProfileForm({ user }: EditProfileProps) {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useRecoilValue(userAuthState);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    user?.profileUrl || null
  );

  const form = useForm<ProfileFormValue>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: user?.name,
      phone: user?.phone,
      profile: null,
      address: user?.address,
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
      form.setValue("profile", file);
    }
  };

  const onSubmit = async (formValues: ProfileFormValue) => {
    setLoading(true);
    try {
      const { name, phone, profile, address, password } = formValues;
      let profileUrl;

      if (profile instanceof File) {
        // Delete the file first
        if (user?.profileUrl) {
          const key = user.profileUrl.split("/").pop();
          await deleteFile(key, auth?.accessToken as string);
        }

        // Upload
        const fileData = await singleFileUpload(
          { file: profile, isPublic: false },
          auth?.accessToken as string
        );

        if (fileData.error) {
          toast({
            variant: "destructive",
            description: fileData.message,
          });
          return;
        }

        profileUrl = fileData.url;
      }

      // Prepare formData for API request
      const formData = {
        name,
        phone,
        password,
        address,
        ...(password && { password }),
        ...(profileUrl && { profileUrl }),
      };

      const data = await updateUserWithToken(
        auth?.accessToken as string,
        formData
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Profile updated successfully",
        });
        setIsEditing(false);
        router.push("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  if (!auth) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/3">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
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
            <p className="font-semibold">{user?.packageHistory?.length || 0}</p>
            <p className="text-sm text-gray-500">Packages</p>
          </div>
          <div className="text-center">
            <p className="font-semibold">
              {user?.clinicAppointments?.length +
                user?.careAppointments.length +
                user?.bookings.length || 0}
            </p>
            <p className="text-sm text-gray-500">Appointments</p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-2/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Information</h2>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-3" /> Edit
            </Button>
          )}
        </div>
        {isEditing ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex-1 space-y-5"
            >
              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter your name"
                  control={form.control}
                  name="name"
                  label="Name"
                />
                <CustomFormField
                  fieldType={FormFieldType.EMAIL}
                  placeholder="Enter your email"
                  control={form.control}
                  name="email"
                  label="Email"
                  value={user?.email}
                  isDisabled={true}
                />
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter your phone number"
                  control={form.control}
                  name="phone"
                  label="Phone Number"
                />

                <Password
                  form={form}
                  name="password"
                  label="Password"
                  required={false}
                />
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Enter Address"
                  control={form.control}
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
                <SubmitButton
                  isLoading={loading}
                  className="ml-auto w-full sm:w-auto"
                >
                  Save
                </SubmitButton>
              </div>
            </form>
          </Form>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              <p className="font-semibold">Name</p>
              <p>{user?.name}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <p className="font-semibold">Email</p>
              <p>{user?.email}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <p className="font-semibold">Phone Number</p>
              <p>{user?.phone}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <p className="font-semibold">Password</p>
              <p>***************</p>
            </div>
            <div className="flex flex-col space-y-3">
              <p className="font-semibold">Address</p>
              <p>{user?.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
