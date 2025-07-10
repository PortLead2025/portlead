import { LucideLayoutDashboard, Package, UsersIcon } from "lucide-react";
import Link from "next/link";
import Divider from "./divider";
import { Separator } from "./ui/separator";

type PageHeaderProps = {
  current: "dashboard" | "leads" | "orders";
};

const LINKS = [
  {
    href: "/protected",
    label: "Dashboard",
    Icon: <LucideLayoutDashboard />,
  },
  { href: "/protected/leads", label: "Leads", Icon: <UsersIcon /> },
  { href: "/protected/orders", label: "Orders", Icon: <Package /> },
];

export default function PageHeader({ current }: PageHeaderProps) {
  const currentPage = LINKS.find(
    (link) => link.label.toLowerCase() === current.toLowerCase()
  );

  return (
    <>
      <nav className="bg-white w-full text-sm p-3 px-5 rounded-md text-foreground flex gap-2 items-center justify-between">
        <h1 className="text-xl flex gap-2 text-gray-700 items-center font-medium">
          {/* {currentPage?.Icon} */}
          {currentPage?.label}
        </h1>{" "}
        <ul className="flex gap-4">
          {LINKS.map(({ label, href, Icon }) => {
            // if (label.toLowerCase() === current.toLowerCase()) return null;

            return (
              <li key={label}>
                <Link
                  className="flex items-center [&>svg]:w-4 gap-1 hover:text-gray-500"
                  href={href}
                >
                  {label}
                  {Icon}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* <Separator className="mt-4" /> */}
    </>
  );
}
