import z from "zod";

export const createVaultSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
    url: z.string().min(1, "URL is required").url("Invalid URL format"),
    type: z.enum(["youtube", "x", "notion", "linkedin", "instagram", "github", "other"], {
        message: "Invalid content type"
    }),
    customType: z.string().min(1).max(50, "Custom type cannot exceed 50 characters").optional(),
    tags: z.array(z.string()).max(5, "Maximum of 5 tags allowed").optional(),
}).refine(
    (data) => data.type !== "other" || (data.customType && data.customType.trim().length > 0),
    { message: "Please specify the type", path: ["customType"] }
)