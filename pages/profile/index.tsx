"use client";

import React, { useEffect, useState } from "react";
import EditProfileForm from "@/components/Forms/edit-profile-form";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Cat, Dog, Bird, Edit, Save } from "lucide-react";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import { fetchUserWithToken, updatePetWithToken } from "../api/api";
import { Pet, User } from "@/types/api";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import Loading from "../loading";

const PetCard: React.FC<{ pet: Pet; onUpdatePet: (pet: Pet) => void }> = ({
  pet,
  onUpdatePet,
}) => {
  const auth = useRecoilValue(userAuthState);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState(pet);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedPet(pet); // Update the state when the `pet` prop changes
  }, [pet]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await updatePetWithToken(
        pet.id,
        auth?.accessToken as string,
        editedPet
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
        setIsEditing(false);
        onUpdatePet(editedPet);
      }
    } catch (error) {
      console.error("Error updating pet:", error);
    } finally {
      setLoading(false);
    }
  };

  const petIcons = {
    cat: <Cat className="w-6 h-6" />,
    dog: <Dog className="w-6 h-6" />,
    bird: <Bird className="w-6 h-6" />,
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {pet.imageUrl ? (
              <Avatar className="w-20 h-20">
                <AvatarImage
                  src={pet.imageUrl || "/default-pet.png"}
                  alt={pet.name}
                />
                <AvatarFallback>
                  {petIcons[pet.petType as keyof typeof petIcons]}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full">
                {petIcons[pet.petType as keyof typeof petIcons]}
              </div>
            )}
            <div className="flex flex-col gap-3">
              {isEditing ? (
                <Input
                  value={editedPet.name}
                  onChange={(e) =>
                    setEditedPet({ ...editedPet, name: e.target.value })
                  }
                  className="font-semibold text-lg"
                />
              ) : (
                <h3 className="font-semibold text-lg">{pet.name}</h3>
              )}
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="petType">Type</Label>
                <Select
                  value={editedPet.petType}
                  onValueChange={(value) =>
                    setEditedPet({ ...editedPet, petType: value })
                  }
                >
                  <SelectTrigger id="petType">
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={editedPet.breed}
                  onChange={(e) =>
                    setEditedPet({ ...editedPet, breed: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={editedPet.age || ""}
                  onChange={(e) =>
                    setEditedPet({
                      ...editedPet,
                      age: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="month">Age (months)</Label>
                <Input
                  id="month"
                  type="number"
                  value={editedPet.month || ""}
                  onChange={(e) =>
                    setEditedPet({
                      ...editedPet,
                      month: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="sex">Sex</Label>
              <Select
                value={editedPet.sex}
                onValueChange={(value) =>
                  setEditedPet({ ...editedPet, sex: value })
                }
              >
                <SelectTrigger id="sex">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-row justify-between gap-3">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? <Loading /> : <Save className="w-4 h-4 mr-2" />} Save
                Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Type:</span> {pet.petType}
            </p>
            <p>
              <span className="font-semibold">Breed:</span> {pet.breed}
            </p>
            <p>
              <span className="font-semibold">Age:</span>{" "}
              {pet.age ? `${pet.age} years` : ""}{" "}
              {pet.month ? `${pet.month} months` : ""}
            </p>
            <p>
              <span className="font-semibold">Sex:</span> {pet.sex}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ProfilePage() {
  const auth = useRecoilValue(userAuthState);
  const [user, setUser] = useState<User>();
  const [activeTab, setActiveTab] = useState("profile");
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [mounted, setMounted] = useState(false);

  const handleUpdatePet = (updatedPet: Pet) => {
    setUserPets((prevPets) =>
      prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (auth) {
        const user = await fetchUserWithToken(auth?.accessToken as string);
        setUser(user);
        setUserPets(user?.pets || []);
      }
      setMounted(true);
    };

    fetchUser();
  }, [auth]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        </div>
        <Card className="max-w-5xl mx-auto">
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="pets">Pets</TabsTrigger>
                <TabsTrigger value="packages">Package History</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <EditProfileForm user={user} />
              </TabsContent>

              <TabsContent value="pets">
                <div className="items-center">
                  <div className="grid grid-cols-2 m-4 gap-6 place-items-start">
                    {userPets?.map((pet) => (
                      <PetCard
                        key={pet.id}
                        pet={pet}
                        onUpdatePet={handleUpdatePet}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="packages">
                <div className="items-center p-2">
                  {user?.packageHistory?.map((pkg) => (
                    <Card key={pkg.id} className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex flex-row items-center gap-3">
                              <h3 className="font-semibold text-lg">
                                {pkg.package?.name}
                              </h3>
                              <div className="items-center">
                                {new Date(pkg.expiredDate) < new Date() ? (
                                  <Badge variant={"destructive"}>Expired</Badge>
                                ) : (
                                  <Badge variant={"success"}>Active</Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">
                              {pkg.package?.description}
                            </p>
                          </div>
                          <Badge>{pkg.package?.type}</Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>Price: ${pkg.package?.price}</div>
                          <div>
                            Duration: {pkg.package?.duration}{" "}
                            {pkg.package?.durationType}
                          </div>
                          <div>Discount: {pkg.package?.discountPercent}%</div>
                          <div>
                            Expires:{" "}
                            {format(new Date(pkg?.expiredDate), "MMMM d, yyyy")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
