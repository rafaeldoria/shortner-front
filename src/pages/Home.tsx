import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import UrlListCard from "../components/UrlListCard";
import { getToken } from "../api/api";
import { getUrls } from "../api/shortener";
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
    const token = getToken();
    if (!token) {
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
      .catch(() => setError("Erro ao carregar URLs."))
      .finally(() => setLoading(false));
  }, [navigate]);

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
          <UrlListCard urls={urls} />
        )}
      </div>
    </AppLayout>
  );
}
