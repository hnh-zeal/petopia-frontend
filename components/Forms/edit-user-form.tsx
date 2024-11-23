"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Heading } from "../ui/heading";
import { Separator } from "@/components/ui/separator";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { UserSchema } from "@/validations/formValidation";
import { useEffect, useState } from "react";
import { fetchUserByID, updateUserByID } from "@/pages/api/api";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { UserDetails } from "@/types/api";

type UserFormValue = z.infer<typeof UserSchema>;
interface EditUserFormProps {
  id: number;
}

export default function EditUserForm({ id }: EditUserFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useRecoilValue(adminAuthState);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDetails>();

  const form = useForm<UserFormValue>({
    resolver: zodResolver(UserSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const data = await fetchUserByID(
          Number(id),
          auth?.accessToken as string
        );
        setUserData((prevState) => ({
          ...prevState,
          ...data,
        }));
        form.reset(data);
      } catch (error) {
        console.error("Failed to fetch User", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id, auth, form]);

  const onSubmit = async (formValues: UserFormValue) => {
    setLoading(true);
    try {
      // Call API
      const data = await updateUserByID(
        id,
        auth?.accessToken as string,
        formValues
      );
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: `${data.message}`,
        });
        router.push("/admin/users");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/admin/users");
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Edit User" />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              placeholder="Enter User's name"
              value={userData?.name}
              name="name"
              label="Name"
            />

            <CustomFormField
              fieldType={FormFieldType.EMAIL}
              placeholder="Enter your email"
              control={form.control}
              name="email"
              label="Email"
              value={userData?.email}
              isDisabled={true}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Enter User's phone number"
              control={form.control}
              value={userData?.phone}
              name="phone"
              label="Phone Number"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              placeholder="Address"
              control={form.control}
              value={userData?.address}
              name="address"
              label="Address"
            />
          </div>

          <div className="flex mt-10 items-center justify-end space-x-4">
            <div className="flex items-center justify-end space-x-4">
              <Button
                disabled={loading}
                variant="outline"
                type="button"
                className="ml-auto w-full"
                onClick={onCancel}
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
    </>
  );
}
