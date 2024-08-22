"use client";
import React, { FormEvent, useState } from "react";
import ImagePreview from "./imagePreview";
import { Input } from "../ui/input";

const FileUploadForm = () => {
  const [images, setImages] = useState<File[]>([]);
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // convert `FileList` to `File[]`
      const _files = Array.from(e.target.files);
      setImages(_files);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image, i) => {
      formData.append(image.name, image);
    });
  };
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="flex justify-between">
        <Input
          type="file"
          multiple
          className={
            "file:bg-violet-50 file:text-violet-500 hover:file:bg-violet-100 file:rounded-lg file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none hover:cursor-pointer border rounded-lg text-gray-400"
          }
          accept="image/png, image/jpeg"
          onChange={handleFileSelected}
        />
      </div>
      <ImagePreview images={images} />
    </form>
  );
};

export default FileUploadForm;
