import z from "zod";

export const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Chỉ cho phép upload file ảnh (jpg, png, webp)"
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, "File phải nhỏ hơn 5MB"),
});

export type ImageFormData = z.infer<typeof imageSchema>;
