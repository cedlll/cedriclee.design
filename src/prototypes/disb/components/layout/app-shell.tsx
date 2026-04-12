
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { MobileNav } from "./mobile-nav";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
}

export function AppShell({ children, title }: Readonly<AppShellProps>) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-h-screen flex-col lg:ml-20">
        <Header title={title} />

        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-10 lg:py-8 lg:pb-10">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
