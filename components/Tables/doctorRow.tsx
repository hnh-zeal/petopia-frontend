export default function DoctorRow({ row }: { row: any }) {
  return (
    <>
      <p>{row.original.doctor ? row.original.doctor.name : ""}</p>
    </>
  );
}
