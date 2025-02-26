import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { purchasePackage, fetchPackageByID } from "@/pages/api/api";
import { Packages } from "@/types/api";
import { GetServerSideProps } from "next";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { useEffect, useState } from "react";
import { getDurationText } from "..";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export const getServerSideProps: GetServerSideProps<{
  pkg: Packages;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const pkg = await fetchPackageByID(Number(id));
    return { props: { pkg } };
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return {
      notFound: true,
    };
  }
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required"),
  card: z.string().min(1, "Card information is required"),
  year: z.number(),
  month: z.number(),
  cvv: z.string().min(3, "CVV is required").max(4, "Invalid CVV"),
});

export default function ConfirmationPage({ pkg }: { pkg: Packages }) {
  const auth = useRecoilValue(userAuthState);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: auth?.user.name,
      email: auth?.user.email,
    },
  });

  const onSubmit = async (formValues: any) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        packageId: pkg.id,
      };

      const data = await purchasePackage(formData, auth?.accessToken as string);
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
        router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      router.push("/login");
    }
    setMounted(true);
  }, [auth, router]);

  if (!auth || !mounted) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto p-4 max-w-6xl">
        <nav className="mb-6">
          <ol className="flex text-sm text-gray-500">
            <li className="after:content-['>'] after:mx-2">Packages</li>
            <li>Confirm Package</li>
          </ol>
        </nav>

        <h1 className="text-2xl font-bold mb-6">Confirm Your Subscription</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* User Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Enter user information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-row gap-4">
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        placeholder="John Doe"
                        label="Name"
                        required={true}
                      />
                      <CustomFormField
                        fieldType={FormFieldType.EMAIL}
                        control={form.control}
                        name="email"
                        placeholder="JohnDoe@gmail.com"
                        label="Email"
                        required={true}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Credit Card Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pay with Credit or Debit Card</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="card"
                      placeholder="Card"
                      label="Credit or Debit Card"
                      required={true}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-row gap-4">
                        <FormField
                          control={form.control}
                          name="month"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="shad-input-label">
                                Month <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="01"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                  min={0}
                                  max={12}
                                />
                              </FormControl>
                              <FormMessage className="shad-error" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="year"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel className="shad-input-label">
                                Year <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="2028"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber)
                                  }
                                  min={2024}
                                />
                              </FormControl>
                              <FormMessage className="shad-error" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="cvv"
                        placeholder="866"
                        label="CVV"
                        required={true}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-4">
                <Card key={pkg.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-3xl font-bold mb-4">฿ {pkg.price}</div>
                    <div className="space-y-2">
                      <p>
                        Duration:{" "}
                        {getDurationText(pkg.duration, pkg.durationType)}
                      </p>
                      {pkg.discountPercent > 0 && (
                        <>
                          Discount Percent:{" "}
                          <Badge variant="secondary" className="text-sm">
                            {Number(pkg.discountPercent)} % off
                          </Badge>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      onClick={() => router.push(`/packages/${pkg.id}`)}
                      className="w-full bg-[#00b2d8] hover:bg-[#2cc4e6]"
                    >
                      {loading ? "Purchasing" : "Confirm Purchase"}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Cancellation Rules */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Refund policy</h3>
                  <p className="text-sm text-gray-600">No Refund Available.</p>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    By selecting the button below, I agree to Petopia&apos;s
                    Rules, Regulation and Refund Policy, and that Teraluxe can
                    charge my payment method if I&apos;m responsible for damage.
                  </p>
                  <p className="text-sm text-gray-600">
                    I also agree to the Payments Terms of Service , and I
                    acknowledge the Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
