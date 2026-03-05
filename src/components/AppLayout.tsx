import { useTheme } from "../contexts/ThemeContext";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Se true, centraliza o conteúdo (login/register). Se false, usa padding e deixa o conteúdo fluir (home). */
  centered?: boolean;
}

export default function AppLayout({ children, centered = false }: AppLayoutProps) {
  const { toggleTheme, theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 relative overflow-hidden transition-colors ${centered ? "items-center justify-center" : "items-center justify-start pt-24 pb-12 px-4"}`}
    >
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-white/10 dark:hover:bg-white/20 transition-colors border border-gray-300/50 dark:border-white/10"
      >
        {theme === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>

      {children}

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[245px] h-[115px] bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-[105px] h-[55px] bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </div>
  );
}
