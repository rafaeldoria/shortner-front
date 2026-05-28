import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getUsername } from "../api/api";
import { logout } from "../api/auth";
import { useTheme } from "../contexts/ThemeContext";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Se true, centraliza o conteúdo (login/register). Se false, usa padding e deixa o conteúdo fluir (home). */
  centered?: boolean;
  authenticated?: boolean;
}

function ThemeButton() {
  const { toggleTheme, theme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className="p-2.5 rounded-full bg-gray-200/80 hover:bg-gray-300/80 dark:bg-white/10 dark:hover:bg-white/20 transition-colors border border-gray-300/50 dark:border-white/10"
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
  );
}

export default function AppLayout({ children, centered = false, authenticated = false }: AppLayoutProps) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // O token local deve ser removido mesmo quando ja expirou no servidor.
    } finally {
      clearSession();
      navigate("/", { replace: true });
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 relative overflow-hidden transition-colors ${
        authenticated
          ? "items-center justify-start pb-12 px-4"
          : centered
            ? "items-center justify-center"
            : "items-center justify-start pt-24 pb-12 px-4"
      }`}
    >
      {authenticated ? (
        <nav className="w-full max-w-2xl mt-4 mb-8 px-4 py-3 rounded-2xl shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
            {getUsername()}
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/home/password"
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Change password
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-60 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {loggingOut ? "..." : "Logout"}
            </button>
            <ThemeButton />
          </div>
        </nav>
      ) : (
        <div className="absolute top-4 right-4 z-10">
          <ThemeButton />
        </div>
      )}

      {children}

      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-20 -translate-x-1/2 w-[245px] h-[115px] bg-linear-to-tr from-indigo-800/35 to-transparent rounded-full blur-3xl" />
        <div className="absolute right-12 bottom-10 w-[105px] h-[55px] bg-linear-to-bl from-indigo-700/35 to-transparent rounded-full blur-2xl" />
      </div>
    </div>
  );
}
