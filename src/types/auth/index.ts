import { loginSchema } from "@/src/app";
import { registerSchema } from "@/src/app/(panel)/register/page";
import z from "zod";

export type LoginData = z.infer<typeof loginSchema>;

export type RegisterData = z.infer<typeof registerSchema>;
