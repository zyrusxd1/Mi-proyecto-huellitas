import React, { useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InstitutionInfo } from '../../types';

export const AdminInstitution: React.FC = () => {
  const { data, updateInstitution, resetDemoData } = useApp();
  const [form, setForm] = useState<InstitutionInfo>(data.institution);
  const [savedMsg, setSavedMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstitution(form);
    setSavedMsg('Datos de la institución actualizados en Nosotros, Tienda y Pie de página.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="card-artesanal p-6 space-y-5">
        <div className="border-b border-[#D9CBB3] pb-3">
          <h3 className="font-display text-2xl font-semibold text-[#2F4B3A]">
            Información institucional, contacto y ubicación
          </h3>
          <p className="text-sm text-[#5C4E41] mt-1">
            Cualquier cambio se refleja de inmediato en las páginas públicas «Nosotros» y en el
            pie de página.
          </p>
        </div>

        {savedMsg && (
          <div
            role="status"
            className="p-3.5 rounded-[10px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30 text-[#3F7D4E] text-sm flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{savedMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la organización</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correo institucional</label>
            <input
              type="email"
              required
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Teléfono / WhatsApp</label>
            <input
              type="text"
              required
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Horarios de atención</label>
            <input
              type="text"
              required
              value={form.horarios}
              onChange={(e) => setForm({ ...form, horarios: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lema institucional</label>
          <input
            type="text"
            required
            value={form.lema}
            onChange={(e) => setForm({ ...form, lema: e.target.value })}
            className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Historia de la Asociación</label>
          <textarea
            rows={4}
            required
            value={form.historia}
            onChange={(e) => setForm({ ...form, historia: e.target.value })}
            className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Dirección física</label>
            <input
              type="text"
              required
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zona / Barrio</label>
            <input
              type="text"
              required
              value={form.zona}
              onChange={(e) => setForm({ ...form, zona: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad</label>
            <input
              type="text"
              required
              value={form.ciudad}
              onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Latitud (Mapa OSM)</label>
            <input
              type="number"
              step="0.0001"
              value={form.latitud}
              onChange={(e) => setForm({ ...form, latitud: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitud (Mapa OSM)</label>
            <input
              type="number"
              step="0.0001"
              value={form.longitud}
              onChange={(e) => setForm({ ...form, longitud: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#D9CBB3]">
          <div>
            <label className="block text-sm font-medium mb-1">Banco</label>
            <input
              type="text"
              value={form.bancoNombre}
              onChange={(e) => setForm({ ...form, bancoNombre: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Número de cuenta</label>
            <input
              type="text"
              value={form.bancoCuenta}
              onChange={(e) => setForm({ ...form, bancoCuenta: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Titular</label>
            <input
              type="text"
              value={form.bancoTitular}
              onChange={(e) => setForm({ ...form, bancoTitular: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Enlace de pago externo (opcional)</label>
          <input
            type="url"
            value={form.enlacePagoExterno}
            onChange={(e) => setForm({ ...form, enlacePagoExterno: e.target.value })}
            className="w-full px-3.5 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-6 py-2.5 btn-terracota text-base">
            Guardar datos institucionales
          </button>
        </div>
      </form>

      <div className="surface-arena p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-[#2B2118]">Restablecer datos de demostración</p>
          <p className="text-sm text-[#5C4E41]">
            Devuelve animales, tienda, pedidos, donaciones y comunidad a su estado inicial.
          </p>
        </div>
        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                setConfirmReset(false);
                setSavedMsg('Datos de demostración restablecidos.');
              }}
              className="px-4 py-2 rounded-[10px] bg-[#A33A2A] text-[#FFFBF5] text-sm font-semibold"
            >
              Confirmar reinicio
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 text-sm text-[#5C4E41] underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 btn-secundario text-sm inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Restablecer datos</span>
          </button>
        )}
      </div>
    </div>
  );
};
