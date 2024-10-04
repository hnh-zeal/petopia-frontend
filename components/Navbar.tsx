import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronDown, Menu } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { ModeToggle } from "./modetoggle";
import { cn } from "@/lib/utils";
import { userAuthState } from "@/states/auth";
import { useRecoilState, useRecoilValue } from "recoil";
import { UserAvatar } from "./Layout/user-avatar";
import { fetchUserWithToken } from "@/pages/api/api";
import { User } from "@/constants/data";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface RouteProps {
  href: string;
  label: string;
  sub_menu?: boolean;
  sub_menus?: any[];
}

const petClinicMenus: { title: string; href: string }[] = [
  {
    title: "Centers and Clinics",
    href: "/pet-clinics",
  },
  {
    title: "Doctors",
    href: "/pet-clinics/doctors",
  },
  {
    title: "Make an appointment",
    href: "/pet-clinics/appointments",
  },
];

const petCareMenus: { title: string; href: string }[] = [
  {
    title: "Care Services",
    href: "/pet-care/services",
  },
  {
    title: "Pet Sitters",
    href: "/pet-care/pet-sitters",
  },
  {
    title: "Make an appointment",
    href: "/pet-care/appointments",
  },
];

const petCafeMenus: { title: string; href: string }[] = [
  {
    title: "Explore Cafe Rooms",
    href: "/pet-cafe/rooms",
  },
  {
    title: "Pets",
    href: "/pet-cafe/pets",
  },
];

const menuList: RouteProps[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/pet-clinics",
    label: "Pet Clinic",
    sub_menu: true,
    sub_menus: petClinicMenus,
  },
  {
    href: "/pet-care",
    label: "Pet Care Services",
    sub_menu: true,
    sub_menus: petCareMenus,
  },
  {
    href: "/pet-cafe",
    label: "Pet Cafe",
    sub_menu: true,
    sub_menus: petCafeMenus,
  },
  {
    href: "/packages",
    label: "Packages",
  },
  {
    href: "/about-us",
    label: "About us",
  },
];

export const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [auth, setAuth] = useRecoilState(userAuthState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchUser = async (token: string) => {
      try {
        const data = await fetchUserWithToken(token);
        setAuth({ user: data, accessToken: token });
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    let token = searchParams.get("token") || localStorage.getItem("token");

    if (token) {
      if (searchParams.get("token")) {
        localStorage.setItem("token", token);
        router.replace(window.location.pathname); // Clear the token from the URL
      }
      fetchUser(token);
    }
  }, [router, searchParams, setAuth]);

  if (!mounted) {
    return null;
  }

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogOut = () => {
    setAuth(undefined);
    localStorage.removeItem("token");

    const currentPath = router.pathname;
    router.push(currentPath);

    window.location.reload();
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <Image src="/logo.ico" width="35" height="35" alt="Logo" />
            <Link
              rel="noreferrer noopener"
              href="/"
              className="ml-2 mt-1 font-bold text-xl flex"
            >
              Petopia
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex lg:hidden">
            {auth && <UserAvatar />}
            {/* <ModeToggle /> */}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="px-2">
                <Menu
                  className="flex lg:hidden ml-5 h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  {/* Hydration Error */}
                  {/* <span className="sr-only">Menu Icon</span> */}
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"} className="w-[250px] sm:w-[250px]">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Petopia</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center gap-2 mt-4">
                  {menuList.map((item, index) => (
                    <MobileMenuItem key={index} item={item} />
                  ))}
                </nav>

                <>
                  {auth ? (
                    <Button variant="ghost" onClick={handleLogOut}>
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col justify-center gap-2 mt-4">
                      <Button variant="ghost" onClick={handleLogin}>
                        Login
                      </Button>
                      <Button variant="ghost" onClick={handleRegister}>
                        Register
                      </Button>
                    </div>
                  )}
                </>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden lg:flex gap-4">
            {menuList.map((item, index) => (
              <MenuItem key={index} item={item} />
            ))}
          </nav>

          <div className="hidden lg:flex gap-2">
            <>
              {auth ? (
                <UserAvatar />
              ) : (
                <>
                  <Button variant="ghost" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button className="rounded-3xl" onClick={handleRegister}>
                    Register
                  </Button>
                </>
              )}
            </>
            {/* <ModeToggle /> */}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

const MenuItem = ({ item }: { item: RouteProps }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="flex relative group">
      {item.sub_menu ? (
        <>
          <div
            rel="noreferrer noopener"
            className={`flex items-center gap-2 text-[17px] hover:cursor-pointer ${buttonVariants(
              {
                variant: "ghost",
              }
            )}`}
            onClick={toggleSubMenu}
          >
            {item.label}
            <div>
              <ChevronDown
                className={`ml-auto mx-1 transition-transform h-4 w-4 ${
                  subMenuOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </>
      ) : (
        <Link
          href={item.href}
          rel="noreferrer noopener"
          className={`text-[17px] ${buttonVariants({
            variant: "ghost",
          })}`}
        >
          {item.label}
        </Link>
      )}

      {/* Submenus */}
      {subMenuOpen && (
        <ul className="absolute left-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg border rounded-md">
          {item.sub_menus?.map((menu, j) => (
            <li className="whitespace-nowrap" key={j}>
              <Link
                href={menu.href}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {menu.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MobileMenuItem = ({ item }: { item: RouteProps }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div>
      {item.sub_menu ? (
        <>
          <div
            rel="noreferrer noopener"
            className={`flex items-center gap-2 text-[17px] hover:cursor-pointer ${buttonVariants(
              {
                variant: "ghost",
              }
            )}`}
            onClick={toggleSubMenu}
          >
            {item.label}
            <div>
              <ChevronDown
                className={`ml-auto mx-1 transition-transform h-4 w-4 ${
                  subMenuOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </>
      ) : (
        <Link
          href={item.href}
          rel="noreferrer noopener"
          className={`text-[17px] ${buttonVariants({
            variant: "ghost",
          })}`}
        >
          {item.label}
        </Link>
      )}

      {/* Submenus */}
      {subMenuOpen && (
        <div className="ml-10 mt-1 space-y-2">
          {item.sub_menus?.map((subItem: any, subIndex: number) => {
            return (
              <Link
                key={subIndex}
                href={subItem.href}
                className={cn(
                  "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  // isActive ? "bg-accent" : "transparent"
                )}
              >
                <span className="mr-2 truncate">{subItem.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
