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
import { fetchUserByID, fetchPetClinics } from "@/pages/api/api";

type UserFormValue = z.infer<typeof UserSchema>;
interface EditUserFormProps {
  id: number;
}

export default function EditUserForm({ id }: EditUserFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [petClinicsData, setPetClinicsData] = useState({
    clinics: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });

  const form = useForm<UserFormValue>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      about: "",
    },
  });

  useEffect(() => {
    const getPetClinics = async () => {
      setLoading(true);
      try {
        const data = await fetchPetClinics();
        setPetClinicsData((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch Pet Centers", error);
      } finally {
        setLoading(false);
      }
    };

    const getUser = async () => {
      setLoading(true);
      try {
        const data = await fetchUserByID(Number(id));
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
    getPetClinics();
  }, [id, form]);

  const onSubmit = async (formValues: UserFormValue) => {
    setLoading(true);
    try {
      // Call API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        }
      );

      const data = await response.json();
      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
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
              name="name"
              label="Name"
            />

            <CustomFormField
              fieldType={FormFieldType.EMAIL}
              placeholder="Enter user's email"
              control={form.control}
              name="email"
              label="Email"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              placeholder="Phone Number"
              control={form.control}
              name="phoneNumber"
              label="Phone Number"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              placeholder="About"
              control={form.control}
              name="about"
              label="About"
            />
          </div>

          <div className="flex mt-10 items-center justify-between space-x-4">
            <div></div>
            <div className="flex items-center justify-between space-x-4">
              <Button
                disabled={loading}
                variant="outline"
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
