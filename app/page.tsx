import Hero from "@/components/hero";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <Hero />
      <div className="flex-1 text-center flex flex-col gap-6 px-4">
        <p>
          Please{" "}
          <Link className="font-medium text-blue-400" href="/sign-in">
            sign in
          </Link>{" "}
          or{" "}
          <Link className="font-medium text-blue-400" href="/sign-up">
            sign up
          </Link>{" "}
          to create your first one!
        </p>
      </div>
    </>
  );
}
