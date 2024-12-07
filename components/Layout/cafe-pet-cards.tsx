import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Cake,
  PawPrint,
  PlusCircle,
  Edit,
  CalendarIcon,
  Home,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { CafePet, CafeRoom } from "@/types/api";
import { ScrollArea } from "../ui/scroll-area";
import { Heading } from "../ui/heading";
import Pagination from "../Tables/pagination";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { UpdateCafePetSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { breeds, GenderOptions, petTypes } from "@/constants/data";
import {
  deleteFile,
  fetchCafePets,
  fetchCafeRooms,
  singleFileUpload,
  updateCafePetByID,
} from "@/pages/api/api";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useRecoilValue } from "recoil";
import { adminAuthState } from "@/states/auth";
import { useFetchData } from "@/hooks/useFetchData";
import Loading from "@/pages/loading";
import ImageUpload from "../ImageUpload";
import ProfilePictureUpload from "./profile-upload";

type CafePetFormValue = z.infer<typeof UpdateCafePetSchema>;

const CafePetsCards: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);

  const adminAuth = useRecoilValue(adminAuthState);
  const { data, totalPages, loading, currentPage, handlePageChange } =
    useFetchData<CafePet>(fetchCafePets, 1, 6, adminAuth?.accessToken);

  const [isLoading, setLoading] = useState(false);
  const [cafePet, setCafePet] = useState<CafePet>();
  const [roomData, setRoomData] = useState<CafeRoom[]>();
  const [imageUrl, setImageUrl] = useState(cafePet?.imageUrl);
  const form = useForm<CafePetFormValue>({
    resolver: zodResolver(UpdateCafePetSchema),
  });

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      try {
        const data = await fetchCafeRooms({});
        setRoomData(data.data);
      } catch (error) {
        console.error("Failed to fetch Pet Centers", error);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [form]);

  const onEdit = (pet: CafePet) => {
    setCafePet(pet);
    form.setValue("name", pet.name);
    form.setValue("dateOfBirth", new Date(pet.dateOfBirth));
    form.setValue("roomId", String(pet.room.id));
    form.setValue("description", pet.description);
    form.setValue("petType", pet.petType);
    form.setValue("breed", pet.breed);
    form.setValue("sex", pet.sex);
    setDialogOpen(true);
  };

  const onSubmit = async (formValues: CafePetFormValue) => {
    setLoading(true);
    try {
      const { imageUrl, ...otherValues } = formValues;

      let profileUrl;

      if (imageUrl instanceof File) {
        // Delete the file first
        if (cafePet?.imageUrl) {
          const key = cafePet?.imageUrl.split("/").pop() as string;
          await deleteFile(key, adminAuth?.accessToken as string);
        }

        // Upload
        const fileData = await singleFileUpload(
          { file: imageUrl, isPublic: false },
          adminAuth?.accessToken as string
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

      const formData = {
        ...otherValues,
        ...{ roomId: Number(formValues.roomId) },
        imageUrl: profileUrl,
      };

      const data = await updateCafePetByID(Number(cafePet?.id), formData);

      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        window.location.reload();
        toast({
          variant: "success",
          description: "Cafe Pet updated.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setDialogOpen(false);
    form.reset();
  };

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title="Pets" />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/admin/pet-cafe/pets/create`)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] rounded-md">
        <div className="container mx-auto p-4">
          {loading ? (
            <>
              <div className="flex items-center justify-center h-[calc(100vh-220px)]">
                <Loading />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.length > 0 ? (
                data?.map((pet) => (
                  <Card
                    key={pet.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white p-6"
                  >
                    <CardContent className="p-0">
                      <div className="flex gap-6">
                        {/* Left side - Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="h-24 w-24 rounded-full overflow-hidden">
                            <Image
                              src={pet.imageUrl || "/placeholder-pet.jpg"}
                              alt={pet.name}
                              layout="fill"
                              className="rounded-full"
                              objectFit="cover"
                            />
                          </div>
                        </div>

                        {/* Right side - Basic Info */}
                        <div className="flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-bold">{pet.name}</h2>
                            <Badge className="bg-[#00b2d8] hover:bg-[#2cc4e6]">
                              <p className="capitalize">{pet.sex}</p>
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <PawPrint className="h-4 w-4" />
                            <span className="capitalize">
                              {pet.petType} - {pet.breed}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Cake className="h-4 w-4" />
                            <span>
                              {pet.year} years {pet.month} months
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Full width sections */}
                      <div className="mt-6 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Description</h3>
                          <p className="text-gray-600">{pet.description}</p>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-gray-600">
                          <div className="flex flex-row items-center gap-2">
                            <Home className="h-4 w-4" />
                            <span>
                              Room: {pet.room.name} ({pet.room.roomNo})
                            </span>
                          </div>
                          <Button size="sm" onClick={() => onEdit(pet)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p>No pets found.</p>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </ScrollArea>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-5"
            >
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="shad-input-label">
                      Profile Picture
                    </FormLabel>
                    <FormControl>
                      <ProfilePictureUpload
                        field={field}
                        defaultImage={cafePet?.imageUrl}
                        setImageUrl={setImageUrl}
                      />
                    </FormControl>
                    <FormMessage className="shad-error" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label="Name"
                  required={true}
                />

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  placeholder="Room"
                  control={form.control}
                  name="roomId"
                  label="Room"
                  required={true}
                >
                  {roomData?.map((room: CafeRoom, i: number) => (
                    <SelectItem key={room.name + i} value={`${room.id}`}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{room.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block text-sm font-medium text-gray-700">
                        Date of Birth <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[220px] text-left font-normal",
                                !field.value && "text-gray-400"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm mt-1" />
                    </FormItem>
                  )}
                />

                <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="sex"
                  label="Sex"
                  renderSkeleton={(field) => (
                    <>
                      <FormControl>
                        <RadioGroup
                          className="flex py-3 px-2 gap-3 xl:justify-between"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          {GenderOptions.map((option, i) => (
                            <div
                              key={option + i}
                              className="radio-group flex flex-row gap-3"
                            >
                              <RadioGroupItem value={option} id={option} />
                              <Label
                                htmlFor={option}
                                className="cursor-pointer"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </>
                  )}
                />
              </div>

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
                  required={true}
                >
                  {breeds[form.watch("petType") as keyof typeof breeds]?.map(
                    (breed: any, i: number) => (
                      <SelectItem key={breed} value={breed.value}>
                        {breed.label}
                      </SelectItem>
                    )
                  )}
                </CustomFormField>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="About"
                  control={form.control}
                  name="description"
                  label="About"
                />
              </div>

              <div className="flex mt-10 items-center justify-between space-x-4">
                <div></div>
                <div className="flex items-center justify-between space-x-4">
                  <Button
                    disabled={isLoading}
                    variant="outline"
                    type="button"
                    className="ml-auto w-full"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    isLoading={isLoading}
                    className="ml-auto w-full"
                  >
                    Update
                  </SubmitButton>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CafePetsCards;
