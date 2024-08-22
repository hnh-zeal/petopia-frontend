import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { fetchUserByID, toggleActiveUser } from "@/pages/api/api";

export default function ToggleActive({ row }: { row: any }) {
  const [user, setUser] = useState<any>(row);
  const toggle = async () => {
    await toggleActiveUser(row.original.id);
    await fetchUserByID(row.original.id);
  };

  useEffect(() => {
    const getUserByID = async () => {
      try {
        const data = await fetchUserByID(row.original.id);
        setUser((prevState: any) => ({
          ...prevState,
          ...data,
        }));
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    getUserByID();
  }, [row.original.id]);

  return (
    <>
      {row.original?.isActive ? (
        <Badge className="bg-green-500 hover:cursor-pointer" onClick={toggle}>
          Active
        </Badge>
      ) : (
        <Badge
          variant="destructive"
          className="hover:cursor-pointer"
          onClick={toggle}
        >
          Inactive
        </Badge>
      )}
    </>
  );
}
