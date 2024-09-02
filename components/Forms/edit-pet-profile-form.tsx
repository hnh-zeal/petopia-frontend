"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Calendar, Info } from "lucide-react";
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

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
  petType: z.enum(["dog", "cat"]),
  breed: z.string().min(1, "Breed is required"),
  sex: z.enum(["male", "female", "unknown"]),
  dateOfBirth: z.string().optional(),
  image: z.string().optional(),
});

type Pet = z.infer<typeof petSchema>;

export default function UserPetForm({ user }: any) {
  const auth = useRecoilValue(userAuthState);
  const [activeTab, setActiveTab] = useState("profile");
  const [pets, setPets] = useState<Pet[]>(user?.pets || []);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const petForm = useForm<Pet>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      age: 0,
      petType: "dog",
      breed: "",
      sex: "unknown",
      dateOfBirth: "",
      image: "",
    },
  });

  const onSubmitPet = (data: Pet) => {
    if (editingPet) {
      setPets(pets.map((pet) => (pet === editingPet ? data : pet)));
      setEditingPet(null);
      toast({
        title: "Pet updated",
        description: "Your pet's information has been updated successfully.",
      });
    } else {
      setPets([...pets, data]);
      setIsAddingPet(false);
      toast({
        title: "Pet added",
        description: "Your pet has been added successfully.",
      });
    }
    petForm.reset();
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    petForm.reset(pet);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        petForm.setValue("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const PetForm = () => (
    <Form {...petForm}>
      <form onSubmit={petForm.handleSubmit(onSubmitPet)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={petForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petForm.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petForm.control}
            name="petType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petForm.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petForm.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="unknown" />
                      </FormControl>
                      <FormLabel className="font-normal">Unknown</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={petForm.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={petForm.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pet Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileUpload(e);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAddingPet(false);
              setEditingPet(null);
              petForm.reset();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">{editingPet ? "Update Pet" : "Add Pet"}</Button>
        </div>
      </form>
    </Form>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Pets</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setIsAddingPet(true);
                setEditingPet(null);
                petForm.reset();
              }}
            >
              Add Another Pet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isAddingPet ? "Add a New Pet" : "Edit Pet"}
              </DialogTitle>
            </DialogHeader>
            <PetForm />
          </DialogContent>
        </Dialog>
      </div>
      {pets.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">You have not added any pets yet.</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsAddingPet(true);
                  setEditingPet(null);
                  petForm.reset();
                }}
              >
                Add a Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Pet</DialogTitle>
              </DialogHeader>
              <PetForm />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="space-y-4">
          {pets.map((pet, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={pet.image} alt={pet.name} />
                    <AvatarFallback>{pet.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{pet.name}</h3>
                        <p className="text-sm text-gray-500">{pet.breed}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPet(pet)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit Pet</DialogTitle>
                          </DialogHeader>
                          <PetForm />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Badge variant="secondary">{pet.petType}</Badge>
                      <Badge variant="secondary">{pet.sex}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    make an appointment
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500">
                    <Info className="w-4 h-4 mr-2" />
                    details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
