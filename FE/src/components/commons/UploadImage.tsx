import { useUser } from "@/context/UserContext";
import { uploadImage } from "@/services/employeeApi";
import { useState, useRef, useCallback } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { imageSchema, type ImageFormData } from "@/schemas/image";
import { Button } from "../ui/button";

const UploadImage = ({ imageUrl }: { imageUrl: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { token } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
  });

  const handleFileChange = useCallback(
    async (selectedFile: File) => {
      try {
        imageSchema.parse({ file: selectedFile });
        console.log(typeof selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setPreview(previewUrl);
        clearErrors("file");
      } catch {
        setPreview(null);
      }
    },
    [clearErrors]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          handleFileChange(acceptedFiles[0]);
          clearErrors("file");
        } else {
          setError("file", {
            message: "Please select right image format (jpg, png, webp)",
          });
        }
      },
      [handleFileChange, setError, clearErrors]
    ),
  });

  const handleUpload = async (data: ImageFormData) => {
    if (data.file) {
      const formData = new FormData();
      formData.append("file", data.file);
      console.log(data.file);
      try {
        const response = await uploadImage(token, data.file);

        setUploadedImage(response.data.url);
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    clearErrors("file");
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleUpload)}>
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-4 text-center">
          <input
            {...getInputProps()}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
          />

          {preview ? (
            <div className="">
              <div className="relative w-fit max-w-full mx-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full border h-48 object-cover rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute border border-white bg-neutral-200 cursor-pointer hover:bg-transparent font-bold text-lg hover:text-red-900 top-0 right-0"
                  onClick={handleClear}>
                  X
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-12 h-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-primary">Drop the image here...</p>
              ) : (
                <p className="text-gray-500">
                  Drag and drop an image here, or{" "}
                  <span
                    className="text-primary underline cursor-pointer"
                    onClick={handleButtonClick}>
                    select file
                  </span>
                </p>
              )}
            </div>
          )}
        </div>
        {errors.file && (
          <p className="text-red-500 text-sm">{errors.file.message}</p>
        )}

        <p className="text-sm text-gray-400">Support: .jpg, .png, .webp</p>
        <p className="text-sm text-gray-400">( Max size: 5MB )</p>

        <Button
          type="submit"
          className="border w-full px-4 py-2 rounded-md bg-blue-500 text-white"
          disabled={!preview}>
          Upload
        </Button>
      </form>
    </>
  );
};

export default UploadImage;
