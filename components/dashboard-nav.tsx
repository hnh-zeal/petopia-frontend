"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem, SubNavItem } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  // setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          return <MenuItem key={index} item={item} isMobileNav={isMobileNav} />;
        })}
      </TooltipProvider>
    </nav>
  );
}

const MenuItem = ({
  item,
  isMobileNav,
}: {
  item: NavItem;
  isMobileNav: boolean;
}) => {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const Icon = Icons[item.icon || "arrowRight"];
  const isActive = path === item.href;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <>
            {item.subMenu ? (
              <div
                className={cn(
                  "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:cursor-pointer hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent" : "transparent"
                )}
                onClick={toggleSubMenu}
              >
                <Icon className={`ml-3 size-5`} />
                {isMobileNav || (!isMinimized && !isMobileNav) ? (
                  <span className="mr-2 truncate">{item.title}</span>
                ) : (
                  ""
                )}
                <Icons.ChevronDown
                  className={`ml-auto mx-1 transition-transform h-5 w-5 ${
                    subMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            ) : (
              <Link
                href={item.href as string}
                className={cn(
                  "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent" : "transparent"
                )}
              >
                <Icon className={`ml-3 size-5`} />
                {isMobileNav || (!isMinimized && !isMobileNav) ? (
                  <span className="mr-2 truncate">{item.title}</span>
                ) : (
                  ""
                )}
              </Link>
            )}

            {subMenuOpen && (
              <div className="ml-6 mt-1 space-y-2">
                {item.subMenuItems?.map(
                  (subItem: SubNavItem, subIndex: number) => {
                    const SubIcon = Icons[subItem.icon || "arrowRight"];
                    return (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          isActive ? "bg-accent" : "transparent",
                          isMobileNav || (!isMinimized && !isMobileNav)
                            ? ""
                            : ""
                        )}
                      >
                        <SubIcon className={`ml-2 size-5`} />
                        {isMobileNav || (!isMinimized && !isMobileNav) ? (
                          <>
                            <span className="mr-2 truncate">
                              {subItem.title}
                            </span>
                          </>
                        ) : (
                          ""
                        )}
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </>
        </TooltipTrigger>
        <TooltipContent
          align="center"
          side="right"
          sideOffset={8}
          className={!isMinimized ? "hidden" : "inline-block"}
        >
          {item.title}
        </TooltipContent>
      </Tooltip>
    </>
  );
};
