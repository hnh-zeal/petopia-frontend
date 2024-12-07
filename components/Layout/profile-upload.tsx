"use client";

import { useState, useRef, forwardRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";

interface ProfilePictureUploadProps {
  field: any;
  defaultImage?: string;
  setImageUrl?: any;
}

const ProfilePictureUpload = forwardRef<
  HTMLInputElement,
  ProfilePictureUploadProps
>(({ field, defaultImage, setImageUrl }, ref) => {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Update the form field with the file
      field.onChange(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click(); // This triggers the hidden input
  };

  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary">
          {preview ? (
            <Image
              src={preview}
              alt="Profile picture"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={handleEditClick}
        >
          <PencilIcon className="w-4 h-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </div>
      <Input
        id="profile"
        type="file"
        accept="image/*"
        className="hidden"
        ref={(el) => {
          fileInputRef.current = el; // Assign ref to the hidden input
          field.ref(el); // Pass the ref to react-hook-form
        }}
        onChange={(e) => {
          handleImageChange(e); // Call your custom onChange for preview
        }}
      />
    </div>
  );
});

ProfilePictureUpload.displayName = "ProfilePictureUpload";

export default ProfilePictureUpload;
