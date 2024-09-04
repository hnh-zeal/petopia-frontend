"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchUserWithToken } from "@/pages/api/api";
import { userAuthState } from "@/states/auth";
import { userLoggedInData } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export function UserAvatar() {
  const router = useRouter();

  const [userData, setUserData] = useState<any>();
  const [auth, setAuth] = useRecoilState(userAuthState);

  useEffect(() => {
    if (auth) {
      const user = auth.user;
      setUserData(user);
    }
  }, [auth]);

  const logout = () => {
    window.location.reload();
    setUserData(undefined);
    setAuth(undefined);
    localStorage.removeItem("token");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 mr-5 rounded-full"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={auth?.user.profileUrl} alt="Image" />
            <AvatarFallback suppressHydrationWarning>
              {auth?.user?.name ? auth.user.name[0] : ""}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {auth?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {auth?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/profile`)}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:cursor-pointer"
            onClick={() => router.push(`/profile/appointments`)}
          >
            Appointments
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => logout()}
        >
          Log out
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  // }
}
