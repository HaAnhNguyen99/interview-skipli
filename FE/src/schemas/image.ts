import z from "zod";

export const imageSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024),
  type: z.string().startsWith("image/"),
});

export type ImageFormData = z.infer<typeof imageSchema>;
