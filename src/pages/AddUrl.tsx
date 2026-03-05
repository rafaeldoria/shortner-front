import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { getToken } from "../api/api";
import { createUrl } from "../api/shortener";

export default function AddUrl() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) navigate("/", { replace: true });
  }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await createUrl({ originalUrl: trimmed });
      if (res.status >= 200 && res.status < 300) {
        navigate("/home", { replace: true });
        return;
      }
      setError("Erro ao salvar. Tente novamente.");
    } catch {
      setError("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/80">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label
                htmlFor="originalUrl"
                className="block text-sm font-medium tracking-tight text-gray-600 dark:text-gray-300 mb-2"
              >
                Url
              </label>
              <input
                id="originalUrl"
                type="url"
                value={url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full h-12 px-4 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 dark:focus:ring-indigo-400/60 transition-colors"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed font-medium"
              >
                {loading ? "Salvando..." : "Save"}
              </button>
              <Link
                to="/home"
                className="flex-1 h-11 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors font-medium flex items-center justify-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
