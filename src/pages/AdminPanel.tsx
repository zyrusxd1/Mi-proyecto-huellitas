import React, { useState } from 'react';
import {
  LayoutDashboard,
  PawPrint,
  ClipboardList,
  ShoppingBag,
  HeartHandshake,
  MessageSquare,
  Building2,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AdminSection } from '../types';
import { formatBs } from '../utils/format';
import { AdminAnimalsNews } from '../components/admin/AdminAnimalsNews';
import { AdminAdoptions } from '../components/admin/AdminAdoptions';
import { AdminStore } from '../components/admin/AdminStore';
import { AdminCampaignsDonations } from '../components/admin/AdminCampaignsDonations';
import { AdminCommunity } from '../components/admin/AdminCommunity';
import { AdminInstitution } from '../components/admin/AdminInstitution';

interface AdminPanelProps {
  onBackToSite: () => void;
}

const MENU_ITEMS: { id: AdminSection; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'resumen', label: 'Resumen general', Icon: LayoutDashboard },
  { id: 'animales-noticias', label: 'Animales y Noticias', Icon: PawPrint },
  { id: 'adopciones', label: 'Adopciones', Icon: ClipboardList },
  { id: 'tienda', label: 'Tienda e Inventario', Icon: ShoppingBag },
  { id: 'campanas-donaciones', label: 'Campañas y Donaciones', Icon: HeartHandshake },
  { id: 'comunidad', label: 'Comunidad', Icon: MessageSquare },
  { id: 'institucion', label: 'Institución', Icon: Building2 },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSite }) => {
  const { data, getAvailableStock, logoutAdmin } = useApp();
  const [section, setSection] = useState<AdminSection>('resumen');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Real calculated KPIs
  const pendingAdoptions = data.adoptions.filter(
    (a) => a.estado === 'Recibida' || a.estado === 'En revisión'
  ).length;
  const ordersToConfirm = data.orders.filter((o) => o.estado === 'Pendiente de pago').length;
  const donationsToReview = data.donations.filter((d) => d.estado === 'Pendiente').length;
  const communityToModerate = data.community.filter((c) => c.estado === 'Pendiente').length;
  const lowStockProducts = data.products.filter((p) => getAvailableStock(p) <= 5);

  const handleLogout = () => {
    logoutAdmin();
    onBackToSite();
  };

  const activeTitle = MENU_ITEMS.find((m) => m.id === section)?.label || 'Panel de administración';

  return (
    <div className="min-h-screen bg-[#F6EFE4] flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-[#2F4B3A] text-[#FFFBF5] border-r border-[#23392C] shrink-0">
        <div className="p-6 border-b border-[#FFFBF5]/15">
          <p className="font-display text-xl font-semibold">Huellitas Bolivia</p>
          <p className="text-xs text-[#EADFCB] mt-0.5">Panel de administración</p>
        </div>

        <nav aria-label="Secciones del panel" className="flex-1 p-3 space-y-1">
          {MENU_ITEMS.map(({ id, label, Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#C4572F] text-[#FFFBF5]'
                    : 'text-[#EADFCB] hover:bg-[#23392C] hover:text-[#FFFBF5]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#FFFBF5]/15 space-y-2">
          <button
            type="button"
            onClick={onBackToSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm text-[#EADFCB] hover:bg-[#23392C] hover:text-[#FFFBF5]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Ver sitio público</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-sm text-[#EADFCB] hover:bg-[#A33A2A] hover:text-[#FFFBF5]"
          >
            <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-[#2F4B3A] text-[#FFFBF5] px-4 h-16 flex items-center justify-between border-b border-[#23392C]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label="Abrir menú de administración"
            className="w-10 h-10 inline-flex items-center justify-center rounded-[10px] hover:bg-[#23392C]"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display text-lg font-semibold">Administración</span>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[#EADFCB] hover:text-[#FFFBF5]"
        >
          Salir
        </button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden bg-[#23392C] text-[#FFFBF5] px-4 py-3 space-y-1 border-b border-[#3F634D]">
          {MENU_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSection(id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium ${
                section === id ? 'bg-[#C4572F] text-[#FFFBF5]' : 'text-[#EADFCB]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onBackToSite}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm text-[#EADFCB] border-t border-[#FFFBF5]/15 mt-2 pt-3"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver al sitio público</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-8">
        <header className="border-b border-[#D9CBB3] pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#5C4E41]">
              Asociación Huellitas Bolivia · Sesión: admin@huellitas.bo
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2F4B3A] mt-0.5">
              {activeTitle}
            </h1>
          </div>
        </header>

        {section === 'resumen' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
              <button
                type="button"
                onClick={() => setSection('adopciones')}
                className="card-artesanal p-5 text-left hover:border-[#2F4B3A] transition-colors"
              >
                <p className="text-sm text-[#5C4E41]">Solicitudes pendientes</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2B2118] tabular-nums">
                  {pendingAdoptions}
                </p>
                <p className="mt-1 text-xs text-[#C4572F] font-medium">Ir a Adopciones</p>
              </button>

              <button
                type="button"
                onClick={() => setSection('tienda')}
                className="card-artesanal p-5 text-left hover:border-[#2F4B3A] transition-colors"
              >
                <p className="text-sm text-[#5C4E41]">Pedidos por confirmar</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2B2118] tabular-nums">
                  {ordersToConfirm}
                </p>
                <p className="mt-1 text-xs text-[#C4572F] font-medium">Ir a Pedidos</p>
              </button>

              <button
                type="button"
                onClick={() => setSection('campanas-donaciones')}
                className="card-artesanal p-5 text-left hover:border-[#2F4B3A] transition-colors"
              >
                <p className="text-sm text-[#5C4E41]">Donaciones por revisar</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2B2118] tabular-nums">
                  {donationsToReview}
                </p>
                <p className="mt-1 text-xs text-[#C4572F] font-medium">Ir a Donaciones</p>
              </button>

              <button
                type="button"
                onClick={() => setSection('comunidad')}
                className="card-artesanal p-5 text-left hover:border-[#2F4B3A] transition-colors"
              >
                <p className="text-sm text-[#5C4E41]">Contenido por moderar</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#2B2118] tabular-nums">
                  {communityToModerate}
                </p>
                <p className="mt-1 text-xs text-[#C4572F] font-medium">Ir a Comunidad</p>
              </button>

              <button
                type="button"
                onClick={() => setSection('tienda')}
                className="card-artesanal p-5 text-left hover:border-[#2F4B3A] transition-colors"
              >
                <p className="text-sm text-[#5C4E41]">Productos con poco stock</p>
                <p className="mt-2 font-display text-3xl font-bold text-[#A33A2A] tabular-nums">
                  {lowStockProducts.length}
                </p>
                <p className="mt-1 text-xs text-[#5C4E41]">Con 5 o menos disponibles</p>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-artesanal p-6 space-y-4">
                <h2 className="font-display text-xl font-semibold text-[#2F4B3A]">
                  Alerta de inventario bajo (≤ 5 uds.)
                </h2>
                {lowStockProducts.length === 0 ? (
                  <p className="text-sm text-[#5C4E41]">
                    Todos los productos cuentan con stock suficiente.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#D9CBB3] text-sm">
                    {lowStockProducts.map((p) => (
                      <li key={p.id} className="py-2.5 flex items-center justify-between gap-2">
                        <span className="font-medium text-[#2B2118]">{p.nombre}</span>
                        <span className="tabular-nums font-semibold text-[#A33A2A]">
                          {getAvailableStock(p)} disponibles
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="card-artesanal p-6 space-y-4">
                <h2 className="font-display text-xl font-semibold text-[#2F4B3A]">
                  Resumen de actividad del refugio
                </h2>
                <dl className="divide-y divide-[#D9CBB3] text-sm">
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#5C4E41]">Animales disponibles para adopción</dt>
                    <dd className="font-semibold tabular-nums">
                      {data.animals.filter((a) => a.estado === 'Disponible').length} de{' '}
                      {data.animals.length}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#5C4E41]">Animales ya adoptados</dt>
                    <dd className="font-semibold text-[#3F7D4E] tabular-nums">
                      {data.animals.filter((a) => a.estado === 'Adoptado').length}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#5C4E41]">Total recaudado en campañas activas</dt>
                    <dd className="font-semibold tabular-nums">
                      {formatBs(
                        data.campaigns
                          .filter((c) => c.activa)
                          .reduce((sum, c) => sum + c.recaudadoBs, 0)
                      )}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <dt className="text-[#5C4E41]">Pedidos confirmados / entregados</dt>
                    <dd className="font-semibold tabular-nums">
                      {
                        data.orders.filter(
                          (o) => o.estado !== 'Pendiente de pago' && o.estado !== 'Cancelado'
                        ).length
                      }
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {section === 'animales-noticias' && <AdminAnimalsNews />}
        {section === 'adopciones' && <AdminAdoptions />}
        {section === 'tienda' && <AdminStore />}
        {section === 'campanas-donaciones' && <AdminCampaignsDonations />}
        {section === 'comunidad' && <AdminCommunity />}
        {section === 'institucion' && <AdminInstitution />}
      </main>
    </div>
  );
};
