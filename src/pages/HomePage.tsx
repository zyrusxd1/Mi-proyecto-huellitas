import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Users } from 'lucide-react';
import { HERO_IMAGE } from '../data/seedData';
import { useApp } from '../context/AppContext';
import { PublicRoute } from '../types';
import { formatBs, formatDateEs } from '../utils/format';
import { SafeImage } from '../components/SafeImage';
import { StatusLabel } from '../components/StatusLabel';

interface HomePageProps {
  onNavigate: (route: PublicRoute) => void;
  onSelectAnimal: (animalId: string) => void;
  onSelectNews: (newsId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectAnimal,
  onSelectNews,
}) => {
  const { data } = useApp();

  const featuredAnimals = data.animals
    .filter((a) => a.estado !== 'Adoptado')
    .sort((a, b) => Number(b.destacado) - Number(a.destacado))
    .slice(0, 4);

  const activeCampaign = data.campaigns.find((c) => c.activa) || data.campaigns[0];
  const latestNews = [...data.news]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 3);

  const campaignPercent = activeCampaign
    ? Math.min(100, Math.round((activeCampaign.recaudadoBs / activeCampaign.metaBs) * 100))
    : 0;

  return (
    <div className="space-y-16 pb-12">
      {/* Banner principal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="card-artesanal overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-center bg-[#FFFBF5]">
            <p className="text-sm font-medium text-[#2F4B3A] mb-3">
              La Paz, Bolivia · Rescate y tenencia responsable
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-[#2B2118] leading-[1.15]">
              Cada perro y gato rescatado merece un hogar sereno y para toda la vida
            </h1>
            <p className="mt-4 text-base text-[#5C4E41] leading-relaxed max-w-xl">
              {data.institution.lema} Trabajamos junto a hogares temporales, veterinarios voluntarios
              y familias paceñas comprometidas.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate('animales')}
                className="px-6 py-3 btn-terracota text-base inline-flex items-center gap-2 whitespace-nowrap"
              >
                <Heart className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                <span>Adoptar</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('campanas')}
                className="px-6 py-3 btn-bosque text-base inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Donar</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 min-h-[280px] lg:min-h-[440px]">
            <SafeImage
              src={HERO_IMAGE}
              alt="Voluntaria de la Asociación Huellitas Bolivia junto a un perro rescatado en un patio de La Paz"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Animales destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2F4B3A]">
              Animales que buscan familia
            </h2>
            <p className="mt-1.5 text-base text-[#5C4E41]">
              Conoce a quienes ya recibieron atención veterinaria y esperan una entrevista de adopción.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('animales')}
            className="text-base font-semibold text-[#C4572F] hover:text-[#A8441F] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {featuredAnimals.length === 0 ? (
          <div className="surface-arena p-8 text-center">
            <p className="text-base text-[#5C4E41]">
              Todos nuestros animales registrados ya encontraron hogar. Pronto publicaremos nuevos rescates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAnimals.map((animal) => (
              <article
                key={animal.id}
                className="card-artesanal overflow-hidden flex flex-col hover:border-[#2F4B3A]/50 transition-colors"
              >
                <div className="aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                  <SafeImage
                    src={animal.fotos[0]}
                    alt={`${animal.nombre}, ${animal.especie.toLowerCase()} en adopción`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                      {animal.nombre}
                    </h3>
                    <StatusLabel status={animal.estado} />
                  </div>
                  <p className="mt-1 text-sm text-[#5C4E41]">
                    {animal.especie} · {animal.edad} · {animal.tamano}
                  </p>
                  <p className="mt-3 text-sm text-[#2B2118] line-clamp-2 flex-1">
                    {animal.comportamiento}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectAnimal(animal.id)}
                    className="mt-4 w-full py-2.5 px-4 btn-secundario text-sm font-semibold"
                  >
                    Ver ficha y postular
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Campaña activa */}
      {activeCampaign && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="surface-arena p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 aspect-[16/10] rounded-[12px] overflow-hidden border border-[#D9CBB3]">
              <SafeImage
                src={activeCampaign.imagen}
                alt={activeCampaign.titulo}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 space-y-4">
              <p className="text-sm font-semibold text-[#2F4B3A]">
                Campaña activa · Cierre {formatDateEs(activeCampaign.fechaFin)}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2B2118]">
                {activeCampaign.titulo}
              </h2>
              <p className="text-base text-[#5C4E41] leading-relaxed">
                {activeCampaign.descripcion}
              </p>

              <div className="pt-2 space-y-2">
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-[#2B2118] tabular-nums">
                    Recaudado: {formatBs(activeCampaign.recaudadoBs)}
                  </span>
                  <span className="text-[#5C4E41] tabular-nums">
                    Meta: {formatBs(activeCampaign.metaBs)} ({campaignPercent}%)
                  </span>
                </div>
                <div
                  className="w-full h-3 rounded-full bg-[#FFFBF5] border border-[#D9CBB3] overflow-hidden"
                  role="progressbar"
                  aria-valuenow={campaignPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progreso de la campaña"
                >
                  <div
                    className="h-full bg-[#3F7D4E] transition-all"
                    style={{ width: `${campaignPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('campanas')}
                  className="px-5 py-2.5 btn-terracota text-base"
                >
                  Aportar a esta campaña
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('campanas')}
                  className="px-5 py-2.5 btn-secundario text-base"
                >
                  Ver todas las campañas
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Últimas 3 noticias */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2F4B3A]">
              Noticias recientes del refugio
            </h2>
            <p className="mt-1.5 text-base text-[#5C4E41]">
              Rescates, jornadas de salud y consejos de convivencia en nuestra ciudad.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('noticias')}
            className="text-base font-semibold text-[#C4572F] hover:text-[#A8441F] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span>Leer todas las noticias</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestNews.map((article) => (
            <article key={article.id} className="card-artesanal overflow-hidden flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                <SafeImage src={article.imagen} alt={article.titulo} />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-[#5C4E41]">
                  {article.categoria} · {formatDateEs(article.fecha)}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold text-[#2B2118] leading-snug">
                  {article.titulo}
                </h3>
                <p className="mt-2.5 text-sm text-[#5C4E41] line-clamp-3 flex-1">
                  {article.resumen}
                </p>
                <button
                  type="button"
                  onClick={() => onSelectNews(article.id)}
                  className="mt-4 text-left text-sm font-semibold text-[#2F4B3A] hover:text-[#C4572F] inline-flex items-center gap-1.5"
                >
                  <span>Leer nota completa</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Accesos a Tienda y Comunidad */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-artesanal p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <ShoppingBag className="w-7 h-7 text-[#C4572F] mb-3" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-[#2F4B3A]">
                Tienda artesanal con causa
              </h2>
              <p className="mt-2.5 text-base text-[#5C4E41] leading-relaxed">
                Collares tejidos con motivos andinos, tazas de cerámica, camisetas y comederos hechos
                con talleres locales. El 100% del margen sostiene nuestras cirugías.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => onNavigate('tienda')}
                className="px-5 py-2.5 btn-terracota text-base inline-flex items-center gap-2"
              >
                <span>Explorar la tienda</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="card-artesanal p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <Users className="w-7 h-7 text-[#2F4B3A] mb-3" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="font-display text-2xl font-semibold text-[#2F4B3A]">
                Red comunitaria y voluntariado
              </h2>
              <p className="mt-2.5 text-base text-[#5C4E41] leading-relaxed">
                Reporta animales perdidos o encontrados en tu zona, comparte historias de finales
                felices o postula como hogar temporal y voluntario de traslados.
              </p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => onNavigate('comunidad')}
                className="px-5 py-2.5 btn-bosque text-base inline-flex items-center gap-2"
              >
                <span>Participar en comunidad</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
