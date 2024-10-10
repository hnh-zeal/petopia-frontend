import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full gap-3 text-gray-600">
      <Image
        src="/assets/icons/loader.svg"
        alt="loader"
        width={40}
        height={40}
        className="animate-spin"
      />
      Loading...
    </div>
  );
}
