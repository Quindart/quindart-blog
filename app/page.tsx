import { DarkThemeToggle } from "flowbite-react";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <h1 className="text-2xl text-primary dark:text-white">Flowbite React + Next.js</h1>
      <h2>Hi. Minh quang</h2>
      <button className="bg-secondary">Hi</button>
      <DarkThemeToggle />
    </main>
  );
}
