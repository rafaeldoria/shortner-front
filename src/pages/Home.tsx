import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import UrlListCard from "../components/UrlListCard";
import { clearSession, getApiError, hasSession } from "../api/api";
import { deleteUrl, getUrls, updateUrl } from "../api/shortener";
import type { UrlItem } from "../api/shortener";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage] = useState(() =>
    (location.state as { passwordChanged?: boolean } | null)?.passwordChanged
      ? "Password updated successfully."
      : null,
  );
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ((location.state as { passwordChanged?: boolean } | null)?.passwordChanged) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!hasSession()) {
      navigate("/", { replace: true });
      return;
    }

    getUrls()
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) setUrls(data);
        else if (data && typeof data === "object" && "urls" in data && Array.isArray((data as { urls: UrlItem[] }).urls))
          setUrls((data as { urls: UrlItem[] }).urls);
        else setUrls([]);
      })
      .catch((err: unknown) => {
        const { status } = getApiError(err);

        if (status === 401) {
          clearSession();
          navigate("/", { replace: true });
          return;
        }

        setError("Erro ao carregar URLs.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  async function handleUpdateUrl(code: string, originalUrl: string) {
    try {
      const res = await updateUrl(code, { originalUrl });
      const updatedOriginalUrl = (res.data as Partial<UrlItem>).originalUrl ?? originalUrl;

      setUrls((currentUrls) =>
        currentUrls.map((url) =>
          url.code === code
            ? { ...url, originalUrl: updatedOriginalUrl }
            : url,
        ),
      );
    } catch (err: unknown) {
      const { message } = getApiError(err);
      throw new Error(message ?? "Erro ao salvar. Tente novamente.");
    }
  }

  async function handleDeleteUrl(code: string) {
    try {
      await deleteUrl(code);
      setUrls((currentUrls) => currentUrls.filter((url) => url.code !== code));
    } catch (err: unknown) {
      const { message } = getApiError(err);
      throw new Error(message ?? "Erro ao deletar. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <AppLayout authenticated>
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout authenticated>
      <div className="w-full flex flex-col items-center gap-4">
        {successMessage && (
          <p className="text-green-600 dark:text-green-400 text-sm">
            {successMessage}
          </p>
        )}
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <UrlListCard
            urls={urls}
            onUpdateUrl={handleUpdateUrl}
            onDeleteUrl={handleDeleteUrl}
          />
        )}
      </div>
    </AppLayout>
  );
}
