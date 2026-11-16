import { getContact } from "@/lib/siteSettings";
import { SiteHeader } from "@/components/SiteHeader";

export async function Header() {
  const { phone, phoneHref } = await getContact();
  return <SiteHeader phone={phone} phoneHref={phoneHref} />;
}
