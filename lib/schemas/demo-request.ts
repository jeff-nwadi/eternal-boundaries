import { z } from "zod";

export const demoRequestSchema = z.object({
  email: z.string().trim().email().max(254),
});

export type DemoRequestState = {
  status: "idle" | "success" | "invalid" | "rate_limited" | "error";
};
