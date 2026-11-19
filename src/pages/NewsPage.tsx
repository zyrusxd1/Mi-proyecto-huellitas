import React, { useEffect, useState } from 'react';
import { ArrowLeft, Share2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsArticle } from '../types';
import { formatDateEs } from '../utils/format';
import { SafeImage } from '../components/SafeImage';

interface NewsPageProps {
  initialNewsId?: string | null;
  onClearInitialNews?: () => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({ initialNewsId, onClearInitialNews }) => {
  const { data } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string>('');

  useEffect(() => {
    if (initialNewsId) {
      const found = data.news.find((n) => n.id === initialNewsId);
      if (found) setSelectedArticle(found);
      onClearInitialNews?.();
    }
  }, [initialNewsId, data.news, onClearInitialNews]);

  const sortedNews = [...data.news].sort((a, b) => b.fecha.localeCompare(a.fecha));

  const handleShare = async (article: NewsArticle) => {
    const shareUrl = `${window.location.origin}/#noticia-${article.id}`;
    const shareData = {
      title: `${article.titulo} — Asociación Huellitas Bolivia`,
      text: article.resumen,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        setShareFeedback('Nota compartida');
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareFeedback('Enlace copiado al portapapeles');
      } else {
        setShareFeedback(`Enlace listo: ${shareUrl}`);
      }
    } catch {
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
          setShareFeedback('Enlace copiado al portapapeles');
        }
      } catch {
        setShareFeedback('No se pudo copiar el enlace.');
      }
    }

    setTimeout(() => setShareFeedback(''), 3500);
  };

  if (selectedArticle) {
    const paragraphs = selectedArticle.contenido.split('\n\n').filter(Boolean);
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              setSelectedArticle(null);
              setShareFeedback('');
            }}
            className="inline-flex items-center gap-2 text-base font-medium text-[#2F4B3A] hover:text-[#C4572F]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver a todas las noticias</span>
          </button>

          <div className="flex items-center gap-3">
            {shareFeedback && (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#3F7D4E]">
                <Check className="w-4 h-4" aria-hidden="true" />
                {shareFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleShare(selectedArticle)}
              className="px-4 py-2 btn-secundario text-sm inline-flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
              <span>Compartir</span>
            </button>
          </div>
        </div>

        <article className="card-artesanal overflow-hidden">
          <div className="aspect-[16/9] overflow-hidden bg-[#EADFCB]">
            <SafeImage src={selectedArticle.imagen} alt={selectedArticle.titulo} />
          </div>
          <div className="p-6 sm:p-10 space-y-5 max-w-3xl">
            <p className="text-sm text-[#5C4E41]">
              {selectedArticle.categoria} · {formatDateEs(selectedArticle.fecha)} · Por{' '}
              {selectedArticle.autor}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2B2118] leading-tight">
              {selectedArticle.titulo}
            </h1>
            <p className="text-lg text-[#5C4E41] leading-relaxed border-b border-[#D9CBB3] pb-5">
              {selectedArticle.resumen}
            </p>
            <div className="space-y-4 text-base text-[#2B2118] leading-[1.75]">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#D9CBB3] pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F4B3A]">
          Noticias del refugio
        </h1>
        <p className="mt-2 text-base text-[#5C4E41] max-w-2xl">
          Crónicas de rescates, balances mensuales de adopción y guías prácticas para el cuidado de
          perros y gatos en La Paz.
        </p>
      </div>

      {sortedNews.length === 0 ? (
        <div className="surface-arena p-10 text-center">
          <p className="text-base text-[#5C4E41]">
            Aún no hay noticias publicadas. Vuelve pronto para conocer nuestras novedades.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedNews.map((article) => (
            <article key={article.id} className="card-artesanal overflow-hidden flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                <SafeImage src={article.imagen} alt={article.titulo} />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-[#5C4E41]">
                  {article.categoria} · {formatDateEs(article.fecha)}
                </p>
                <h2 className="mt-1.5 font-display text-xl font-semibold text-[#2B2118] leading-snug">
                  {article.titulo}
                </h2>
                <p className="mt-2.5 text-sm text-[#5C4E41] leading-relaxed flex-1">
                  {article.resumen}
                </p>
                <div className="mt-5 pt-3 border-t border-[#D9CBB3]/70 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedArticle(article)}
                    className="text-sm font-semibold text-[#C4572F] hover:text-[#A8441F]"
                  >
                    Leer artículo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare(article)}
                    aria-label={`Compartir ${article.titulo}`}
                    className="inline-flex items-center gap-1.5 text-sm text-[#5C4E41] hover:text-[#2B2118]"
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    <span>Compartir</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {shareFeedback && !selectedArticle && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-[12px] bg-[#2F4B3A] text-[#FFFBF5] text-sm shadow-lg"
        >
          {shareFeedback}
        </div>
      )}
    </div>
  );
};
