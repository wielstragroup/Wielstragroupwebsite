import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-950">Pagina niet gevonden</h1>
      <p className="mt-3 text-slate-600">De pagina die je zoekt bestaat niet of is verplaatst.</p>
      <Link href="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
        Terug naar home
      </Link>
    </section>
  );
}
