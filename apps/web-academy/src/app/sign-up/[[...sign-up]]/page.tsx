import { redirect } from "next/navigation";

/**
 * Sign Up Page - Redirects to unified auth
 *
 * Since we have a unified "Sign In or Join Now" flow,
 * /sign-up just redirects to /sign-in which handles both.
 */
export default function SignUpPage() {
  redirect("/sign-in");
}
