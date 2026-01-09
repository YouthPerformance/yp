// ===================================================================
// SIGN IN PAGE - REDIRECT TO UNIFIED AUTH
// ===================================================================

import { redirect } from "next/navigation";

export default function SignInPage() {
  redirect("/auth");
}
