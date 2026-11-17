import Link from "next/link";
export default function NotFound() {
  return (<main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
    <p className="font-script text-5xl text-rose">Lost?</p><h1 className="mt-2 font-display text-3xl">We couldn’t find that page.</h1>
    <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-blush to-rose px-7 text-sm font-semibold text-midnight">Back home</Link></main>);
}
