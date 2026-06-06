import { useState } from "react";
import { Link } from "react-router-dom";
import type { UrlItem } from "../api/shortener";
import CopyIcon from "./icons/CopyIcon";
import CheckIcon from "./icons/CheckIcon";
import LinkIcon from "./icons/LinkIcon";
import PencilIcon from "./icons/PencilIcon";
import SaveIcon from "./icons/SaveIcon";
import TrashIcon from "./icons/TrashIcon";

interface UrlListCardProps {
  urls: UrlItem[];
  onUpdateUrl: (code: string, originalUrl: string) => Promise<void>;
  onDeleteUrl: (code: string) => Promise<void>;
}

const shortenerBaseUrl = import.meta.env.VITE_SHORTENER_URL ?? "";

function getShortUrl(code: string) {
  return `${shortenerBaseUrl.replace(/\/?$/, "/")}${code}`;
}

/** Listagem no estilo Receipt Card: card com título "Urls" e linhas code / originalUrl. */
export default function UrlListCard({
  urls,
  onUpdateUrl,
  onDeleteUrl,
}: UrlListCardProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [draftUrl, setDraftUrl] = useState("");
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<UrlItem | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ code: string; message: string } | null>(null);

  function handleCopy(text: string, code: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  }

  function startEdit(item: UrlItem) {
    setEditingCode(item.code);
    setDraftUrl(item.originalUrl);
    setRowError(null);
  }

  function cancelEdit() {
    setEditingCode(null);
    setDraftUrl("");
    setRowError(null);
  }

  async function handleSave(item: UrlItem) {
    const trimmedUrl = draftUrl.trim();

    if (!trimmedUrl) {
      setRowError({ code: item.code, message: "Informe uma URL válida." });
      return;
    }

    if (trimmedUrl === item.originalUrl) {
      cancelEdit();
      return;
    }

    setSavingCode(item.code);
    setRowError(null);

    try {
      await onUpdateUrl(item.code, trimmedUrl);
      cancelEdit();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Erro ao salvar. Tente novamente.";
      setRowError({ code: item.code, message });
    } finally {
      setSavingCode(null);
    }
  }

  async function confirmDelete() {
    if (!deleteCandidate) return;

    setDeletingCode(deleteCandidate.code);
    setRowError(null);

    try {
      await onDeleteUrl(deleteCandidate.code);
      setDeleteCandidate(null);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "Erro ao deletar. Tente novamente.";
      setRowError({ code: deleteCandidate.code, message });
      setDeleteCandidate(null);
    } finally {
      setDeletingCode(null);
    }
  }

  return (
    <>
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
            urls.map((item) => {
              const isEditing = editingCode === item.code;
              const isSaving = savingCode === item.code;
              const isDeleting = deletingCode === item.code;
              const disabled = isSaving || isDeleting;

              return (
                <div key={item.code} className="px-6 py-4 space-y-3">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300 shrink-0">
                      Code
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-right truncate min-w-0" title={getShortUrl(item.code)}>
                        {getShortUrl(item.code)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(getShortUrl(item.code), item.code)}
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
                    <div className="flex items-center justify-end gap-2 min-w-0 flex-1">
                      {isEditing ? (
                        <>
                          <input
                            type="url"
                            value={draftUrl}
                            onChange={(event) => {
                              setDraftUrl(event.target.value);
                              setRowError(null);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void handleSave(item);
                              }
                              if (event.key === "Escape") {
                                cancelEdit();
                              }
                            }}
                            className="w-full max-w-[70%] h-9 px-3 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:focus:ring-indigo-400/60 transition-colors"
                            aria-label="URL original"
                            disabled={disabled}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={disabled}
                            className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <span
                          className="text-sm text-gray-700 dark:text-gray-200 text-right truncate min-w-0 max-w-[70%]"
                          title={item.originalUrl}
                        >
                          {item.originalUrl}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => isEditing ? handleSave(item) : startEdit(item)}
                        disabled={disabled}
                        className="shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={isEditing ? "Salvar URL original" : "Editar URL original"}
                      >
                        {isEditing ? (
                          <SaveIcon className="text-blue-500 hover:text-blue-600" />
                        ) : (
                          <PencilIcon className="text-emerald-500 hover:text-emerald-600" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(item)}
                        disabled={disabled}
                        className="shrink-0 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Deletar URL"
                      >
                        <TrashIcon className="text-red-500 hover:text-red-600" />
                      </button>
                    </div>
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
                  {rowError?.code === item.code && (
                    <p className="text-sm text-red-500 text-right">
                      {rowError.message}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Deletar url?
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 truncate" title={deleteCandidate.originalUrl}>
              {deleteCandidate.originalUrl}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={deletingCode === deleteCandidate.code}
                className="flex-1 h-10 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingCode === deleteCandidate.code}
                className="flex-1 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingCode === deleteCandidate.code ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
