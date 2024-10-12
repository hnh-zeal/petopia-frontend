import { fetchPetSitterByID } from "@/pages/api/api";
import React from "react";
import type { GetServerSideProps } from "next";
import { PetSitter } from "@/types/api";
import PetSitterDetails from "@/components/Layout/Pet Care/SitterDetails";

export const getServerSideProps: GetServerSideProps<{
  sitter: PetSitter;
}> = async (context) => {
  const { id } = context.params as { id: string };
  try {
    const sitter = await fetchPetSitterByID(Number(id));
    return { props: { sitter } };
  } catch (error) {
    console.error("Error fetching pet sitter:", error);
    return {
      notFound: true,
    };
  }
};

export default function PetSitterPage({ sitter }: { sitter: PetSitter }) {
  return (
    <>
      <PetSitterDetails sitter={sitter} />
    </>
  );
}
