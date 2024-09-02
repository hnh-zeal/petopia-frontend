"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditProfileSchema } from "@/validations/formValidation";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import EditProfileForm from "@/components/Forms/edit-profile-form";
import UserPetForm from "@/components/Forms/edit-pet-profile-form";

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

export default function ProfilePage() {
  const auth = useRecoilValue(userAuthState);
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState("profile");

  const [pets, setPets] = useState<Pet[]>(user?.pets || []);
  const [isAddingPet, setIsAddingPet] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="pets">Pets</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <EditProfileForm user={user} />
            </TabsContent>

            <TabsContent value="pets">
              <UserPetForm user={user} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
