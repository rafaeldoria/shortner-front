import { useState } from "react";
import { Link } from "react-router-dom";
import type { UrlItem } from "../api/shortener";
import CopyIcon from "./icons/CopyIcon";
import CheckIcon from "./icons/CheckIcon";
import LinkIcon from "./icons/LinkIcon";

interface UrlListCardProps {
  urls: UrlItem[];
}

const shortnerBaseUrl = import.meta.env.VITE_SHORTNER_URL ?? "";

/** Listagem no estilo Receipt Card: card com título "Urls" e linhas code / originalUrl. */
export default function UrlListCard({ urls }: UrlListCardProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function handleCopy(text: string, code: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }

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
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right truncate min-w-0" title={`${shortnerBaseUrl}${item.code}`}>
                    {shortnerBaseUrl}{item.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${shortnerBaseUrl}${item.code}`, item.code)}
                    className="shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Copiar URL encurtada"
                  >
                    {copiedCode === item.code ? (
                      <CheckIcon className="text-green-500" />
                    ) : (
                      <CopyIcon className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                    )}
                  </button>
                </div>
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
              <div className="flex justify-between items-center gap-4">
                <span className="text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300 shrink-0">
                  Clicks
                </span>
                <span
                  className="text-sm text-gray-700 dark:text-gray-200 text-right truncate min-w-0 max-w-[70%]"
                  title={String(item.clicks ?? 0)}
                >
                  {item.clicks ?? 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
