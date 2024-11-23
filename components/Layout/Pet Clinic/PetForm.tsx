import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PawPrint } from "lucide-react";
import { petTypes, breeds, GenderOptions } from "@/constants/data";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PetFormProps {
  form: UseFormReturn<any>;
  user: any;
  onSubmit: () => void;
}

export const PetForm: React.FC<PetFormProps> = ({ form, user, onSubmit }) => {
  const [isNew, setIsNew] = useState(true);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Pet Information</CardTitle>
        <CardDescription>
          Fill out your pet information or select an existing pet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <span className="font-medium">
            Switch to {isNew ? "Existing" : "New"} Pet Form
          </span>
          <Switch
            checked={isNew}
            onCheckedChange={(value) => setIsNew(value)}
            className={`${
              isNew ? "bg-primary" : "bg-gray-200"
            } relative inline-flex items-center h-6 rounded-full w-11`}
          >
            <span
              className={`${
                isNew ? "translate-x-6" : "translate-x-1"
              } inline-block w-4 h-4 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <motion.div
              key={isNew ? "new" : "existing"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {isNew ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="petType"
                      label="Pet Type"
                      placeholder="Select Pet Type"
                      required={true}
                    >
                      {petTypes.map((pet, i) => (
                        <SelectItem key={i} value={pet.value}>
                          <div className="flex cursor-pointer items-center gap-2">
                            <p>{pet.label}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </CustomFormField>
                    <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name="breed"
                      label="Breed"
                      placeholder="Select Breed"
                    >
                      {breeds[
                        form.watch("petType") as keyof typeof breeds
                      ]?.map((breed: any, i: number) => (
                        <SelectItem key={i} value={breed.value}>
                          {breed.label}
                        </SelectItem>
                      ))}
                    </CustomFormField>
                  </div>
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name="name"
                      placeholder="Pet's Name"
                      label="Enter Your Pet Name"
                      required={true}
                    />
                    <CustomFormField
                      fieldType={FormFieldType.SKELETON}
                      control={form.control}
                      name="sex"
                      label="Sex"
                      required={true}
                      renderSkeleton={(field) => (
                        <RadioGroup
                          className="flex h-11 gap-6 xl:justify-between"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {GenderOptions.map((option, i) => {
                            const capitalizedOption =
                              option.charAt(0).toUpperCase() +
                              option.slice(1).toLowerCase();
                            return (
                              <div
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option}
                                  id={capitalizedOption}
                                />
                                <Label
                                  htmlFor={capitalizedOption}
                                  className="cursor-pointer"
                                >
                                  {capitalizedOption}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-6 xl:flex-row">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Enter Age (Year){" "}
                            <span className="text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Pet's Age"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              min={0}
                            />
                          </FormControl>
                          <FormMessage className="shad-error" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="shad-input-label">
                            Enter Age (Months){" "}
                            <span className="text-red-400">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Pet's Age"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                              min={1}
                              max={12}
                            />
                          </FormControl>
                          <FormMessage className="shad-error" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <CustomFormField
                    fieldType={FormFieldType.IMAGE}
                    control={form.control}
                    name="vaccinationRecords"
                    label="Vaccination Records"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user?.pets?.map((pet: any) => (
                    <motion.div
                      key={pet.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card
                        className={`cursor-pointer ${
                          form.watch("petId") === pet.id.toString()
                            ? "border-2 border-primary"
                            : "border border-gray-200"
                        }`}
                        onClick={() => {
                          const currentPetId = form.watch("petId");
                          if (currentPetId === pet.id.toString()) {
                            form.setValue("petId", "");
                          } else {
                            form.setValue("petId", pet.id.toString());
                          }
                        }}
                      >
                        <CardContent className="flex items-center p-4">
                          <Avatar className="w-16 h-16 mr-4">
                            <AvatarImage
                              src={pet.imageUrl || undefined}
                              alt={pet.name}
                            />
                            <AvatarFallback>
                              <PawPrint />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{pet.name}</h3>
                            <p className="text-sm text-gray-500">
                              {pet.petType}, {pet.breed}
                            </p>
                            <p className="text-sm text-gray-500">
                              {pet.age} years, {pet.month} months
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
