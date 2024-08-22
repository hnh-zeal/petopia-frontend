"use client";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { User } from "@/constants/data";

interface UserInfoProps {
  user: User | undefined;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <>
      <ScrollArea className="h-full">
        <main className="relative flex-1 space-y-4 p-1 md:p-8">
          <div className="flex space-y-4 items-center justify-start">
            <div className="flex-none p-4 w-20 items-center">
              <Avatar className="max-w-[500px] max-h-[200px]">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-none text-center content-center">
              {user?.name}
              <br />
              Last Login on
            </div>
          </div>
          <div className="flex m-2 items-center justify-start">
            <div className="flex-none">
              <Button>Personal Information</Button>
            </div>
            <div className="flex-none">
              <Button variant="ghost">Pet Information</Button>
            </div>
            <div className="flex-none">
              <Button variant="ghost">Appointments</Button>
            </div>
            <div className="flex-none">
              <Button variant="ghost">Packages</Button>
            </div>
          </div>
          <Separator />

          {/* About */}
          <section>
            <h4 className="font-bold mb-3 text-lg">About</h4>
            <div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
            <div className="flex flex-row mt-10 items-center space-x-10 content-center">
              <div className="bg-slate-100 p-15">
                <div className="flex space-x-40">
                  <Label className="">Name</Label>
                  <Label className="">{user?.name}</Label>
                </div>
              </div>
              <div className="flex space-x-40 bg-slate-100">
                <Label className="">Email</Label>
                <Label className="">{user?.email}</Label>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section>
            <h4 className="font-bold mb-3 text-lg">Experience</h4>
            <div>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industrys standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged. It was
                popularised in the 1960s with the release of Letraset sheets
                containing Lorem Ipsum passages, and more recently with desktop
                publishing software like Aldus PageMaker including versions of
                Lorem Ipsum.
              </p>
            </div>
            <div className="flex flex-row mt-10 items-center space-x-10 content-center">
              <div className="bg-slate-100 p-15">
                <div className="flex space-x-40">
                  <Label className="">Name</Label>
                  <Label className="">{user?.name}</Label>
                </div>
              </div>
              <div className="flex space-x-40 bg-slate-100">
                <Label className="">Email</Label>
                <Label className="">{user?.email}</Label>
              </div>
            </div>
          </section>
        </main>
      </ScrollArea>
    </>
  );
}
