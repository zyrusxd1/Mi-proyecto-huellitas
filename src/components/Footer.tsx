import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PublicRoute } from '../types';

interface FooterProps {
  onNavigate: (route: PublicRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { data, isAdminLoggedIn } = useApp();
  const { institution } = data;

  return (
    <footer className="bg-[#2F4B3A] text-[#FFFBF5] border-t border-[#23392C] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-[#FFFBF5]/15">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#FFFBF5]">
              {institution.nombre}
            </h2>
            <p className="mt-3 text-base text-[#EADFCB] leading-relaxed max-w-sm">
              {institution.lema}
            </p>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[#FFFBF5] mb-3">
              Explora el refugio
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-[#EADFCB]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('animales')}
                  className="hover:text-[#FFFBF5] underline-offset-4 hover:underline"
                >
                  Animales en adopción
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('tienda')}
                  className="hover:text-[#FFFBF5] underline-offset-4 hover:underline"
                >
                  Tienda solidaria
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('campanas')}
                  className="hover:text-[#FFFBF5] underline-offset-4 hover:underline"
                >
                  Campañas y donaciones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('noticias')}
                  className="hover:text-[#FFFBF5] underline-offset-4 hover:underline"
                >
                  Noticias
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('comunidad')}
                  className="hover:text-[#FFFBF5] underline-offset-4 hover:underline"
                >
                  Comunidad y voluntariado
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('nosotros')}
                  className="hover:text-[#FFFBF5] underline-offset-4 hover:underline"
                >
                  Nosotros y mapa
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-medium text-[#FFFBF5] mb-3">
              Contacto en La Paz
            </h3>
            <ul className="space-y-2.5 text-sm text-[#EADFCB]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#E0A030]" aria-hidden="true" />
                <span>
                  {institution.direccion}, {institution.zona} · {institution.ciudad}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-[#E0A030]" aria-hidden="true" />
                <span className="tabular-nums">{institution.telefono}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-[#E0A030]" aria-hidden="true" />
                <span>{institution.correo}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-[#EADFCB]">
          <p>
            © {new Date().getFullYear()} {institution.nombre}. La Paz, Bolivia.
          </p>
          <button
            type="button"
            onClick={() => onNavigate(isAdminLoggedIn ? 'admin' : 'admin-login')}
            className="text-[#EADFCB] hover:text-[#FFFBF5] underline underline-offset-4 transition-colors"
          >
            {isAdminLoggedIn ? 'Panel de administración' : 'Acceso del administrador'}
          </button>
        </div>
      </div>
    </footer>
  );
};
