"use client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import { deleteFile, editAdmin, singleFileUpload } from "@/pages/api/api";
import { SelectItem } from "../ui/select";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { adminRoles } from "@/constants/data";
import { ScrollArea } from "../ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ProfilePictureUpload from "../Layout/profile-upload";
import { Admin } from "@/types/api";

const CreateAdminSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.string().min(1, { message: "Role is required." }),
  profile: z.any().optional(),
  about: z.string().optional(),
});

type AdminFormValue = z.infer<typeof CreateAdminSchema>;

export default function EditAdminForm({ admin }: { admin: Admin }) {
  const auth = useRecoilValue(adminAuthState);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<AdminFormValue>({
    resolver: zodResolver(CreateAdminSchema),
    defaultValues: {
      name: admin.name,
      email: admin.email,
      role: admin.role,
      profile: admin.profileUrl,
      about: admin.about,
    },
  });

  const onSubmit = async (formValues: AdminFormValue) => {
    setLoading(true);
    try {
      const { profile, password, ...otherValues } = formValues;
      let profileUrl;

      if (profile instanceof File) {
        // Delete the file first
        if (admin.profileUrl) {
          const key = admin.profileUrl.split("/").pop() as string;
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
        ...otherValues,
        ...(password && { password }),
        profileUrl,
      };

      const data = await editAdmin(
        admin.id,
        formData,
        auth?.accessToken as string
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Admin updated successfully.",
        });
        router.push("/admin/admins");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Update Admin" />
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-210px)] px-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-5 px-2"
          >
            <FormField
              control={form.control}
              name="profile"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="shad-input-label">
                    Profile Picture
                  </FormLabel>
                  <FormControl>
                    <ProfilePictureUpload
                      field={field}
                      defaultImage={admin.profileUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-error" />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Enter admin's name"
                control={form.control}
                name="name"
                label="Name"
                required={true}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="role"
                label="Admin Role"
                placeholder="Select Role"
                required={true}
              >
                {adminRoles.map((type, i) => (
                  <SelectItem key={i} value={`${type.value}`}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{type.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.EMAIL}
                placeholder="Enter email"
                control={form.control}
                name="email"
                label="Email"
                required={true}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                placeholder="Password"
                control={form.control}
                name="password"
                label="Password"
                required={true}
              />
            </div>

            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                placeholder="Description"
                control={form.control}
                name="about"
                label="Description"
              />
            </div>

            <div className="flex my-10 items-center justify-end space-x-4">
              <div className="flex items-center justify-between space-x-4">
                <Button
                  disabled={loading}
                  variant="outline"
                  className="ml-auto w-full"
                  onClick={() => router.push(`/admin/admins`)}
                >
                  Cancel
                </Button>
                <SubmitButton isLoading={loading} className="ml-auto w-full">
                  Update
                </SubmitButton>
              </div>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </>
  );
}
