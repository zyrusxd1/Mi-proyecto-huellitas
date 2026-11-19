import React from 'react';
import { Clock, MapPin, Phone, Mail, Landmark } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE } from '../data/seedData';
import { SafeImage } from '../components/SafeImage';

export const AboutPage: React.FC = () => {
  const { data } = useApp();
  const { institution } = data;

  const lat = institution.latitud || -16.5105;
  const lon = institution.longitud || -68.1255;
  const bbox = `${(lon - 0.012).toFixed(4)},${(lat - 0.009).toFixed(4)},${(lon + 0.012).toFixed(4)},${(lat + 0.009).toFixed(4)}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-[#D9CBB3] pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F4B3A]">
          Sobre {institution.nombre}
        </h1>
        <p className="mt-2 text-base text-[#5C4E41] max-w-2xl">{institution.lema}</p>
      </div>

      {/* Historia */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2B2118]">
            Nuestra historia en La Paz
          </h2>
          <p className="text-base text-[#2B2118] leading-[1.75]">{institution.historia}</p>
          <p className="text-base text-[#5C4E41] leading-[1.75]">
            Creemos en la adopción transparente y acompañada: cada familia conversa primero con el
            equipo, conoce las necesidades del animal y cuenta con seguimiento posterior para asegurar
            una adaptación feliz.
          </p>
        </div>
        <div className="lg:col-span-6 aspect-[16/10] rounded-[12px] overflow-hidden border border-[#D9CBB3]">
          <SafeImage
            src={HERO_IMAGE}
            alt="Equipo de voluntarios en el patio de la Asociación Huellitas Bolivia"
          />
        </div>
      </section>

      {/* Contacto, horarios y mapa */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5 card-artesanal p-6 sm:p-8 space-y-6">
          <h2 className="font-display text-2xl font-semibold text-[#2F4B3A]">
            Contacto y horarios
          </h2>

          <ul className="space-y-4 text-base">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#C4572F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#2B2118]">Dirección del centro de acogida</p>
                <p className="text-[#5C4E41]">
                  {institution.direccion}, {institution.zona} · {institution.ciudad}
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#C4572F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#2B2118]">Horarios de atención</p>
                <p className="text-[#5C4E41]">{institution.horarios}</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#C4572F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#2B2118]">Teléfono y WhatsApp</p>
                <p className="text-[#5C4E41] tabular-nums">{institution.telefono}</p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#C4572F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#2B2118]">Correo institucional</p>
                <p className="text-[#5C4E41]">{institution.correo}</p>
              </div>
            </li>

            <li className="flex items-start gap-3 pt-2 border-t border-[#D9CBB3]">
              <Landmark className="w-5 h-5 text-[#2F4B3A] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#2B2118]">Cuenta bancaria para aportes</p>
                <p className="text-[#5C4E41] text-sm">
                  {institution.bancoNombre} · Cta.{' '}
                  <span className="tabular-nums font-medium text-[#2B2118]">
                    {institution.bancoCuenta}
                  </span>{' '}
                  · {institution.bancoTitular}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7 card-artesanal overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-[#F6EFE4] border-b border-[#D9CBB3] flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-[#2B2118]">
              Ubicación en {institution.zona}, La Paz
            </h2>
            <a
              href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[#C4572F] hover:underline"
            >
              Ver en OpenStreetMap
            </a>
          </div>
          <div className="flex-1 min-h-[340px]">
            <iframe
              title="Mapa de ubicación de Asociación Huellitas Bolivia en La Paz"
              src={osmUrl}
              className="w-full h-full min-h-[340px] border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
