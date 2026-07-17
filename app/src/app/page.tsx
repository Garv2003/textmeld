import React from 'react';
import { Link } from 'next-view-transitions';
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from 'lucide-react';
import { ModeToggle } from '@/components/custom/MoonToggle';
import { navigation, features } from '@/constants/home';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white">

      <header className="top-0 z-30 w-full px-4 fixed backdrop-blur bg-white/80 dark:bg-black/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="text-3xl font-bold text-zinc-900 dark:text-white duration-150 hover:text-blue-600 dark:hover:text-blue-400">
              TextMeld
            </Link>
            <nav className="flex items-center space-x-8">
              <ul className="flex items-center space-x-6">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 duration-150 hover:text-blue-600 dark:hover:text-blue-400"
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                      {item.external && <ExternalLink className="w-4 h-4" />}
                    </Link>
                  </li>
                ))}
              </ul>
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto">
        <div className="flex flex-col gap-24 pb-16 pt-32">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center px-4">
            <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-100/10 dark:ring-zinc-800 duration-150 hover:ring-zinc-200 dark:hover:ring-zinc-700">
              <Link href="https://github.com/Garv2003/TextMeld" className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span>Star us on GitHub</span>
              </Link>
            </div>

            <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-7xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
              Your Ultimate README Editor
            </h1>

            <p className="mt-6 text-xl leading-8 text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Create, edit, and share your documentation with ease. TextMeld combines the power of a markdown editor
              with instant collaboration features and a desktop application.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor">
                <Button className="min-w-[200px] p-6 text-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                  Start Writing
                </Button>
              </Link>
              <Link href="/download">
                <Button variant="outline" className="min-w-[200px] p-6 text-lg border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  Download Desktop App
                </Button>
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center text-center p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-3">
                    <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center gap-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              Built with ❤️ by{" "}
              <Link
                href="https://github.com/Garv2003"
                className="font-semibold duration-150 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Garv Aggarwal
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}