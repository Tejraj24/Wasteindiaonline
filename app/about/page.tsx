import { redirect, RedirectType } from "next/navigation";

export default function AboutRedirectPage() {
  redirect("/our-story", RedirectType.replace);
}
