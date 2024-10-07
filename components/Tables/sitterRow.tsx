export default function SitterRow({ row }: { row: any }) {
  return (
    <>
      <p>{row.original.petSitter ? row.original.petSitter.name : ""}</p>
    </>
  );
}
