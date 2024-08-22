import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const notFound = () => {
  return (
    <div className="flex justify-center items-center h-screen flex-col gap-5">
      <h4 className="text-5xl">404 - This page could not be found</h4>
      <Link className="mt-4" href={"/"}>
        <Button>Go back to Home page</Button>
      </Link>
    </div>
  );
};

notFound.displayName = "notFound";

export default notFound;
