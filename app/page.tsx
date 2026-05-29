"use client";

import { Header } from "@/components/layout/Header";
import { HomeContent } from "../components/home/home-content";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Smart Draft</h1>
        </div>
        <Header />
      </header>
      <main className="flex-1">
        <HomeContent />
      </main>
    </div>
  );
}
