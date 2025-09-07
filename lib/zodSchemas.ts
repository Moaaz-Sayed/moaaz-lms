import { z } from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const;

export const courseStatus = ["Draft", "Published", "Archived"] as const;

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office production",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  price: z.coerce.number().min(1, {
    message: "Price must be a positive number",
  }) as unknown as z.ZodNumber,
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, {
      message: "Duration must be at most 500 hours",
    }) as unknown as z.ZodNumber,
  level: z.enum(courseLevels, {
    message: "Level is required",
  }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small Description must be at least 3 characters long" })
    .max(200, {
      message: "Small Description must be at most 200 characters long",
    }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),

  courseId: z.string().uuid({ message: "invalid course ID" }),
});

export const lessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),

  courseId: z.string().uuid({ message: "invalid course ID" }),

  chapterId: z.string().uuid({ message: "invalid chapter ID" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .optional(),

  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

export type ChapterSchemaType = z.infer<typeof chapterSchema>;

export type LessonSchemaType = z.infer<typeof lessonSchema>;
