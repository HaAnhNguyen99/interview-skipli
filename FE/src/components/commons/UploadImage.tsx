import loading from "@/assets/loading.svg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/commons/ui/dialog";
import { useUser } from "@/context/UserContext";
import { updateManagerAvatar, uploadImage } from "@/services/employeeApi";
import { useState, useRef, useCallback } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { imageSchema, type ImageFormData } from "@/schemas/image";
import { Button } from "../ui/button";

const UploadImage = ({ imageUrl }: { imageUrl: string }) => {
  const [preview, setPreview] = useState<string | null>(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const { token, user, login } = useUser();
  const {
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userID", user?.employeeId || "");

      if (user?.role === "manager") {
        formData.append("phoneNumber", user?.phoneNumber || "");
        handleUpdateManagerAvatar(formData);
      }

      handleUpload(formData);
      setOpen(false);
    },
    [token, user?.employeeId, login]
  );

  const handleUpdateManagerAvatar = async (formData: FormData) => {
    try {
      setIsUploading(true);
      const res = await updateManagerAvatar(token, formData);
      login(
        {
          ...res.data.manager,
        },
        token
      );
    } catch (error) {
      console.error("Error updating manager avatar:", error);
      alert("Failed to update manager avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async (formData: FormData) => {
    try {
      setIsUploading(true);
      const res = await uploadImage(token, formData);
      login(
        {
          ...res.data.user,
        },
        token
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
      return;
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop,
  });

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div>
        <div
          className="relative group w-48 h-48 mx-auto rounded-full overflow-hidden"
          onClick={() => setOpen(true)}>
          {isUploading ? (
            <img src={loading} alt="Loading" className="w-full h-full" />
          ) : (
            <>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <p className="group-hover:opacity-50 absolute top-1/2 left-1/2 text-2xl transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg px-4 py-2 cursor-pointer opacity-0 transition-opacity duration-300 inset-0 w-full h-full flex items-center justify-center text-red-200 font-bold tracking-widest">
                Change
              </p>
            </>
          )}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Change avatar</DialogTitle>
            <DialogDescription>
              Make changes to your avatar here.
            </DialogDescription>
          </DialogHeader>
          <div
            {...getRootProps()}
            className=" h-[250px] w-[250px] flex justify-center items-center rounded-full border-2 border-dashed p-4 text-center mx-auto mb-4 relative">
            <input
              {...getInputProps()}
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
            />

            {preview ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute  bg-neutral-200 cursor-pointer hover:bg-transparent font-bold text-lg hover:text-red-900 top-0 right-0"
                  onClick={handleClear}>
                  X
                </Button>
                <div className="relative w-full h-full mx-auto rounded-full overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </>
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

          <p className="text-sm text-center text-gray-400">
            Support: .jpg, .png, .webp
          </p>
          <p className="text-sm text-gray-400 text-center">( Max size: 5MB )</p>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadImage;
