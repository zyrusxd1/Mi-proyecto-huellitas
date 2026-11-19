import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';
import { formatBs, formatDateEs } from '../../utils/format';
import { StatusLabel } from '../StatusLabel';

const PRESET_CAMPAIGN_IMAGES = [
  '/src/assets/images/campana_esterilizacion_1795047514379.jpg',
  '/src/assets/images/noticia_rescate_invierno_1795047516680.jpg',
  '/src/assets/images/hero_refugio_lapaz_1795047509046.jpg',
];

export const AdminCampaignsDonations: React.FC = () => {
  const { data, saveCampaign, deleteCampaign, reviewDonation } = useApp();
  const [subTab, setSubTab] = useState<'donaciones' | 'campanas'>('donaciones');
  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);
  const [feedback, setFeedback] = useState('');

  const notify = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !editingCampaign.titulo?.trim()) return;
    saveCampaign({
      id: editingCampaign.id,
      titulo: editingCampaign.titulo.trim(),
      descripcion: editingCampaign.descripcion?.trim() || '',
      metaBs: Number(editingCampaign.metaBs) || 5000,
      recaudadoBs: Number(editingCampaign.recaudadoBs) || 0,
      imagen: editingCampaign.imagen || PRESET_CAMPAIGN_IMAGES[0],
      fechaFin: editingCampaign.fechaFin || new Date().toISOString().slice(0, 10),
      activa: editingCampaign.activa !== false,
    });
    setEditingCampaign(null);
    notify('Campaña guardada correctamente.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
          <button
            type="button"
            onClick={() => setSubTab('donaciones')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              subTab === 'donaciones' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Donaciones recibidas ({data.donations.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('campanas')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              subTab === 'campanas' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Campañas ({data.campaigns.length})
          </button>
        </div>

        {subTab === 'campanas' && (
          <button
            type="button"
            onClick={() =>
              setEditingCampaign({
                titulo: '',
                descripcion: '',
                metaBs: 10000,
                recaudadoBs: 0,
                imagen: PRESET_CAMPAIGN_IMAGES[0],
                fechaFin: '2026-12-31',
                activa: true,
              })
            }
            className="px-4 py-2 btn-terracota text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Nueva campaña</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          role="status"
          className="p-3 rounded-[10px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30 text-[#3F7D4E] text-sm inline-flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{feedback}</span>
        </div>
      )}

      {subTab === 'donaciones' ? (
        <div className="space-y-4">
          {data.donations.length === 0 ? (
            <div className="surface-arena p-8 text-center">
              <p className="text-base text-[#5C4E41]">No hay aportes registrados aún.</p>
            </div>
          ) : (
            data.donations.map((don) => (
              <article key={don.id} className="card-artesanal p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9CBB3] pb-3">
                  <div>
                    <p className="text-xs text-[#5C4E41]">
                      {don.tipo} · {formatDateEs(don.fecha)}
                      {don.campanaTitulo ? ` · ${don.campanaTitulo}` : ' · Fondo general'}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                      {don.donanteNombre}
                    </h3>
                    <p className="text-sm text-[#5C4E41]">
                      {don.correo} · <span className="tabular-nums">{don.telefono}</span>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusLabel status={don.estado} />
                    {don.tipo === 'Económica' && don.montoBs && (
                      <p className="font-display text-xl font-bold text-[#2B2118] tabular-nums">
                        {formatBs(don.montoBs)}
                      </p>
                    )}
                  </div>
                </div>

                {don.tipo === 'En especie' ? (
                  <p className="text-sm text-[#2B2118]">
                    <strong>Detalle en especie:</strong> {don.descripcionEspecie}
                  </p>
                ) : (
                  <div className="text-sm text-[#5C4E41] space-y-2">
                    <p>
                      <strong>Comprobante:</strong> {don.comprobanteNombre || 'No adjuntado'}
                    </p>
                    {don.comprobanteUrl && don.comprobanteUrl.startsWith('data:image') && (
                      <img
                        src={don.comprobanteUrl}
                        alt={`Comprobante de ${don.donanteNombre}`}
                        className="max-h-32 rounded-[8px] border border-[#D9CBB3]"
                      />
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-2.5 pt-2">
                  {don.estado !== 'Confirmada' && (
                    <button
                      type="button"
                      onClick={() => {
                        reviewDonation(don.id, 'Confirmada');
                        notify('Aporte confirmado y sumado a la campaña (si aplica).');
                      }}
                      className="px-4 py-2 rounded-[10px] bg-[#3F7D4E] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                    >
                      Confirmar aporte
                    </button>
                  )}
                  {don.estado !== 'Rechazada' && (
                    <button
                      type="button"
                      onClick={() => {
                        reviewDonation(don.id, 'Rechazada');
                        notify('Aporte marcado como rechazado.');
                      }}
                      className="px-4 py-2 rounded-[10px] bg-[#A33A2A] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                    >
                      Rechazar aporte
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.campaigns.map((camp) => {
            const pct = Math.min(100, Math.round((camp.recaudadoBs / camp.metaBs) * 100));
            return (
              <div key={camp.id} className="card-artesanal p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-[#5C4E41]">
                      {camp.activa ? 'Campaña activa' : 'Finalizada'} · Cierre{' '}
                      {formatDateEs(camp.fechaFin)}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                      {camp.titulo}
                    </h3>
                  </div>
                  <StatusLabel
                    status={camp.activa ? 'Activa' : 'Inactiva'}
                    tone={camp.activa ? 'success' : 'neutral'}
                  />
                </div>
                <p className="text-sm text-[#5C4E41]">{camp.descripcion}</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm tabular-nums">
                    <span className="font-semibold">{formatBs(camp.recaudadoBs)}</span>
                    <span className="text-[#5C4E41]">
                      Meta {formatBs(camp.metaBs)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#EADFCB] overflow-hidden">
                    <div className="h-full bg-[#3F7D4E]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-[#D9CBB3] pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingCampaign(camp)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 btn-secundario text-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCampaign(camp.id);
                      notify('Campaña eliminada.');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#A33A2A] hover:bg-[#A33A2A]/10 rounded-[8px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2118]/50">
          <div className="w-full max-w-lg bg-[#FFFBF5] rounded-[12px] border border-[#D9CBB3] max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#F6EFE4] border-b border-[#D9CBB3] flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                {editingCampaign.id ? 'Editar campaña' : 'Nueva campaña'}
              </h3>
              <button type="button" onClick={() => setEditingCampaign(null)} aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCampaign} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.titulo || ''}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, titulo: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta (Bs)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingCampaign.metaBs ?? 5000}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, metaBs: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Recaudado (Bs)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingCampaign.recaudadoBs ?? 0}
                    onChange={(e) =>
                      setEditingCampaign({
                        ...editingCampaign,
                        recaudadoBs: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de cierre</label>
                  <input
                    type="date"
                    value={editingCampaign.fechaFin || ''}
                    onChange={(e) =>
                      setEditingCampaign({ ...editingCampaign, fechaFin: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción *</label>
                <textarea
                  rows={3}
                  required
                  value={editingCampaign.descripcion || ''}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, descripcion: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingCampaign.activa !== false}
                  onChange={(e) =>
                    setEditingCampaign({ ...editingCampaign, activa: e.target.checked })
                  }
                />
                Campaña activa en el sitio público
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2 btn-secundario text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 btn-terracota text-sm">
                  Guardar campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
