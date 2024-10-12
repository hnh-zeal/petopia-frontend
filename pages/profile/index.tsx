"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecoilValue } from "recoil";
import { userAuthState } from "@/states/auth";
import EditProfileForm from "@/components/Forms/edit-profile-form";
import UserPetForm from "@/components/Forms/edit-pet-profile-form";

export default function ProfilePage() {
  const auth = useRecoilValue(userAuthState);
  const user = auth?.user;
  const [activeTab, setActiveTab] = useState("profile");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      </div>
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
