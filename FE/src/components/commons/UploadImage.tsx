import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { uploadImage } from "@/services/employeeApi";

const UploadImage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const { token } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      try {
        const response = await uploadImage(token, image);

        setImageUrl(response.data.url);
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer">
        <img src={imageUrl} alt="Uploaded" />
      </label>
      <button
        onClick={handleUpload}
        className="border border-pink-200 px-4 py-2 rounded-md">
        Upload
      </button>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default UploadImage;
