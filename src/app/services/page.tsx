import { redirect } from "next/navigation";

/** Legacy URL. Commercial ladder lives on /offers. */
export default function ServicesPage() {
  redirect("/offers");
}
