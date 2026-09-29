import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Life Project OS
        </h1>

        <p className="mt-4 text-xl text-gray-600">
          Hola mundo
        </p>

        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="mt-8 rounded-lg bg-black px-5 py-3 text-white hover:bg-gray-800"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </main>
  );
}