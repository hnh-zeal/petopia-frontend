import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";

interface ImageUploadProps {
  images: string[];
  onImageUpload: (urls: string[]) => void;
  onImageRemove: (index: number) => void;
  label?: string;
  description?: string;
}

export default function MultiImageUpload({
  images,
  onImageUpload,
  onImageRemove,
  label = "Images",
  description = "Upload images",
}: ImageUploadProps) {
  const { toast } = useToast();
  const [previewUrls, setPreviewUrls] = useState<string[]>(images);

  const handleRemove = (index: number) => {
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
    onImageRemove(index);
  };

  const handleUploadComplete = (res: { url: string }[]) => {
    if (res && res.length > 0) {
      const uploadedUrls = res.map((item) => item.url);
      const newPreviewUrls = [...previewUrls, ...uploadedUrls];
      setPreviewUrls(newPreviewUrls);
      onImageUpload(newPreviewUrls);
    }
  };

  const handleFileChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newPreviewUrls = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      onImageUpload([...previewUrls, ...newPreviewUrls]);
    }
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
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            toast({
              variant: "destructive",
              description: `ERROR! ${error.message}`,
            });
          }}
          onChange={handleFileChange}
        />
      </div>

      {previewUrls.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative w-40 h-40">
              <Image
                src={url}
                alt="Uploaded Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute rounded-full bg-gray-100 -right-2 -top-2"
                onClick={() => handleRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
