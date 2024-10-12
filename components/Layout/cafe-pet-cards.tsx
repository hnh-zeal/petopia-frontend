import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Cake,
  PawPrint,
  Heart,
  Plus,
  Edit,
  Syringe,
  FileText,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { CafePet, CafePetData } from "@/types/api";
import { ScrollArea } from "../ui/scroll-area";
import { Heading } from "../ui/heading";
import Pagination from "../Tables/pagination";
import EditCafePetForm from "../Forms/edit-cafe-pets-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import SubmitButton from "../submit-button";
import { useToast } from "../ui/use-toast";
import { UpdateCafePetSchema } from "@/validations/formValidation";
import { SelectItem } from "../ui/select";
import { breeds, PetClinic, petTypes } from "@/constants/data";
import {
  fetchCafePetByID,
  fetchCafeRooms,
  updateCafePetByID,
} from "@/pages/api/api";
import { useRouter } from "next/router";

interface CafePetsListProps {
  petsData: CafePetData;
}

type CafePetFormValue = z.infer<typeof UpdateCafePetSchema>;

const CafePetsCards: React.FC<CafePetsListProps> = ({ petsData }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(Number(page));
  };

  const [loading, setLoading] = useState(false);
  const [cafePet, setCafePet] = useState<CafePet>();
  const [roomData, setRoomData] = useState({
    rooms: [],
    count: 0,
    totalPages: 0,
    page: 1,
    pageSize: 5,
  });
  const form = useForm<CafePetFormValue>({
    resolver: zodResolver(UpdateCafePetSchema),
  });

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      try {
        const data = await fetchCafeRooms();
        setRoomData((prevState) => ({
          ...prevState,
          ...data,
        }));
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
    form.setValue("roomId", pet.room.id);
    form.setValue("description", pet.description);
    setDialogOpen(true);
  };

  const onSubmit = async (formValues: CafePetFormValue) => {
    setLoading(true);
    try {
      const formData = {
        ...formValues,
        ...{ roomId: Number(formValues.roomId) },
      };

      const data = await updateCafePetByID(Number(cafePet?.id), formData);

      if (data.error) {
        toast({
          variant: "destructive",
          description: `${data.message}`,
        });
      } else {
        toast({
          variant: "success",
          description: "Cafe Pet updated.",
        });
        window.location.reload();
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
          onClick={() => router.push(`/admin/pet-cafe/cafe-rooms/create`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <ScrollArea className="h-[calc(100vh-220px)] rounded-md">
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petsData.cafePets.length > 0 ? (
              petsData.cafePets?.map((pet) => (
                <Card
                  key={pet.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="relative p-0">
                    <Image
                      src={pet.imageUrl}
                      alt={pet.name}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${pet.isActive ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {pet.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2 flex items-center justify-between">
                      <span>{pet.name}</span>
                      <Badge variant="outline">{pet.petType}</Badge>
                    </CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Cake className="w-4 h-4 mr-2 text-gray-500" />
                        <span>
                          {pet.year} years, {pet.month} months old
                        </span>
                      </div>
                      <div className="flex items-center">
                        <PawPrint className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{pet.breed}</span>
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{pet.sex}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>
                          Born: {new Date(pet.dateOfBirth).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <p className="text-sm text-gray-600">{pet.description}</p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 p-4 flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <Syringe className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="font-semibold">Medication:</span>
                      <span className="ml-2">{pet.medication || "None"}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FileText className="w-4 h-4 mr-2 text-green-500" />
                      <span className="font-semibold">Vaccination:</span>
                      <span className="ml-2">
                        {pet.vaccinationRecords || "Up to date"}
                      </span>
                    </div>
                    {pet.specialNeeds && (
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="font-semibold">Special Needs:</span>
                        <span className="ml-2">{pet.specialNeeds}</span>
                      </div>
                    )}
                    <Separator className="my-3 w-full" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm text-gray-500">
                        Room: {pet.room.name} (No. {pet.room.roomNo})
                      </span>
                      <Button size="sm" onClick={() => onEdit(pet)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p>No pets found.</p>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Pagination
              currentPage={currentPage}
              totalPages={petsData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </ScrollArea>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-1/2">
          <DialogHeader>
            <DialogTitle>Edit Pet</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
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
                  fieldType={FormFieldType.SELECT}
                  placeholder="Room"
                  control={form.control}
                  name="roomId"
                  label="Room"
                >
                  {roomData.rooms.map((room: PetClinic, i) => (
                    <SelectItem key={room.name + i} value={`${room.id}`}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <p>{room.name}</p>
                      </div>
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  placeholder="Birth Date"
                  control={form.control}
                  name="dateOfBirth"
                  label="Birth Date"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  placeholder="Age"
                  control={form.control}
                  name="age"
                  label="Age"
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CafePetsCards;
