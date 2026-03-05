import { Link } from "react-router-dom";
import type { UrlItem } from "../api/shortener";

interface UrlListCardProps {
  urls: UrlItem[];
}

/** Ícone de link/URL (chain). */
function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/** Listagem no estilo Receipt Card: card com título "Urls" e linhas code / originalUrl. */
export default function UrlListCard({ urls }: UrlListCardProps) {
  return (
    <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <LinkIcon className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          Urls
        </h2>
        <Link
          to="/home/add"
          className="inline-flex items-center justify-center text-white bg-cyan-500 hover:bg-cyan-600 focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-full text-sm px-8 py-2.5 text-center leading-5 transition-colors"
          aria-label="Adicionar URL"
        >
          +
        </Link>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
        {urls.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            Nenhuma URL encurtada ainda.
          </div>
        ) : (
          urls.map((item, index) => (
            <div key={item.code + index} className="px-6 py-4 space-y-3">
              <div className="flex justify-between items-center gap-4">
                <span className="text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300 shrink-0">
                  Code
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right truncate min-w-0" title={item.code}>
                  {item.code}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300 shrink-0">
                  Original URL
                </span>
                <span
                  className="text-sm text-gray-700 dark:text-gray-200 text-right truncate min-w-0 max-w-[70%]"
                  title={item.originalUrl}
                >
                  {item.originalUrl}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
