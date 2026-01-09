// ===================================================================
// SIGN UP PAGE - REDIRECT TO UNIFIED AUTH
// ===================================================================

import { redirect } from "next/navigation";

export default function SignUpPage() {
  redirect("/auth?new=true");
}
