import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import UrlListCard from "../components/UrlListCard";
import { getToken } from "../api/api";
import { getUrls } from "../api/shortener";
import type { UrlItem } from "../api/shortener";

export default function Home() {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <AppLayout centered>
        <p className="text-gray-500 dark:text-gray-400">Carregando...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="w-full flex flex-col items-center">
        {error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : (
          <UrlListCard urls={urls} />
        )}
      </div>
    </AppLayout>
  );
}
