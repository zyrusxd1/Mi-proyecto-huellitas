import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PublicRoute } from '../types';

interface NavbarProps {
  currentRoute: PublicRoute;
  onNavigate: (route: PublicRoute) => void;
}

const NAV_ITEMS: { route: PublicRoute; label: string }[] = [
  { route: 'inicio', label: 'Inicio' },
  { route: 'animales', label: 'Animales' },
  { route: 'tienda', label: 'Tienda' },
  { route: 'campanas', label: 'Campañas y donaciones' },
  { route: 'noticias', label: 'Noticias' },
  { route: 'comunidad', label: 'Comunidad' },
  { route: 'nosotros', label: 'Nosotros' },
];

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { cart, setIsCartOpen } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLinkClick = (route: PublicRoute) => {
    onNavigate(route);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#2F4B3A] text-[#FFFBF5] border-b border-[#23392C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[12px] text-[#FFFBF5] hover:bg-[#23392C] transition-colors"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('inicio')}
            className="font-display text-xl font-semibold tracking-tight text-[#FFFBF5] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          >
            Huellitas Bolivia
          </button>
        </div>

        <nav
          aria-label="Navegación principal"
          className="hidden lg:flex items-center gap-5 xl:gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1.5 text-[15px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'text-[#FFFBF5]' : 'text-[#EADFCB] hover:text-[#FFFBF5]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-[#E0A030] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Abrir carrito, ${totalItems} artículos`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-[12px] bg-[#C4572F] hover:bg-[#A8441F] text-[#FFFBF5] text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="tabular-nums font-semibold">({totalItems})</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navegación móvil"
          className="lg:hidden bg-[#23392C] border-t border-[#3F634D] px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                aria-current={active ? 'page' : undefined}
                className={`w-full text-left px-3 py-2.5 rounded-[12px] text-base font-medium transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#2F4B3A] text-[#FFFBF5]'
                    : 'text-[#EADFCB] hover:bg-[#2F4B3A]/70 hover:text-[#FFFBF5]'
                }`}
              >
                <span>{item.label}</span>
                {active && <span className="w-2 h-2 rounded-full bg-[#E0A030]" aria-hidden="true" />}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
