"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMessage("Introduce tu correo electrónico.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage("Introduce un correo electrónico válido.");
      return;
    }

    if (!password) {
      setErrorMessage("Introduce una contraseña.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        "La contraseña debe tener como mínimo 8 caracteres."
      );
      return;
    }

    if (!repeatPassword) {
      setErrorMessage("Repite la contraseña.");
      return;
    }

    if (password !== repeatPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
      });

if (error) {
  console.error("Error al crear usuario:", error);

  setErrorMessage(
    "No se ha podido crear la cuenta. Revisa los datos e inténtalo de nuevo."
  );

  return;
}

      // Con Confirm Email desactivado, Supabase inicia sesión
      // automáticamente. La cerramos porque nuestro flujo quiere
      // volver al login después del registro.
      await supabase.auth.signOut();

      router.push("/login");
      router.refresh();
    } catch {
      setErrorMessage(
        "No se ha podido crear la cuenta. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Life Project OS
          </h1>

          <p className="mt-2 text-gray-600">
            Crear una cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              placeholder="nombre@correo.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label
              htmlFor="repeatPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Repite la contraseña
            </label>

            <input
              id="repeatPassword"
              type="password"
              autoComplete="new-password"
              value={repeatPassword}
              onChange={(event) =>
                setRepeatPassword(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
              placeholder="Repite la contraseña"
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </main>
  );
}