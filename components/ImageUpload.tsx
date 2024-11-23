import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";

interface ImageUploadProps {
  image: string;
  onImageUpload: (url: string) => void;
  onImageRemove: () => void;
  label?: string;
  description?: string;
}

export default function ImageUpload({
  image,
  onImageUpload,
  onImageRemove,
  label = "Image",
  description = "Upload an image",
}: ImageUploadProps) {
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(image);

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageRemove();
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div>
          <Label className="text-base font-semibold">{label}</Label>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res.length > 0) {
              const uploadedUrl = res[0].url;
              setPreviewUrl(uploadedUrl);
              onImageUpload(uploadedUrl);
            }
          }}
          onUploadError={(error: Error) => {
            toast({
              variant: "destructive",
              description: `ERROR! ${error.message}`,
            });
          }}
          onChange={(acceptedFiles) => {
            if (acceptedFiles.length > 0) {
              const objectUrl = URL.createObjectURL(acceptedFiles[0]);
              setPreviewUrl(objectUrl);
              onImageUpload(objectUrl);
            }
          }}
        />
      </div>

      {previewUrl && previewUrl.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-96">
            <Image
              src={previewUrl}
              alt="Uploaded Image"
              fill
              className="rounded-lg "
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute rounded-full bg-gray-100 -right-2 -top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
