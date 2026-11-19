import React, { useState } from 'react';
import { Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModerationStatus } from '../../types';
import { formatDateEs } from '../../utils/format';
import { StatusLabel } from '../StatusLabel';

export const AdminCommunity: React.FC = () => {
  const { data, moderateCommunity, deleteCommunity } = useApp();
  const [filter, setFilter] = useState<'Todos' | ModerationStatus>('Todos');
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState('');

  const filtered = data.community.filter((c) => (filter === 'Todos' ? true : c.estado === filter));

  const notify = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
          {(['Todos', 'Pendiente', 'Aprobada', 'Rechazada'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-[9px] ${
                filter === st ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {feedback && (
          <span className="text-sm font-medium text-[#3F7D4E] inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            {feedback}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="surface-arena p-8 text-center">
          <p className="text-base text-[#5C4E41]">
            No hay envíos comunitarios en esta categoría.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const replyVal = replies[item.id] ?? item.respuestaAdmin ?? '';
            return (
              <article key={item.id} className="card-artesanal p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9CBB3] pb-3">
                  <div>
                    <p className="text-xs text-[#5C4E41]">
                      {item.tipo}
                      {item.subtipoAlerta ? ` (${item.subtipoAlerta})` : ''} · {item.autorNombre}
                      {item.zona ? ` · ${item.zona}` : ''} · {formatDateEs(item.fecha)}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-[#5C4E41] mt-0.5">
                      {item.correo} · <span className="tabular-nums">{item.telefono}</span>
                      {item.disponibilidad ? ` · Disp.: ${item.disponibilidad}` : ''}
                    </p>
                  </div>
                  <StatusLabel status={item.estado} />
                </div>

                <p className="text-base text-[#2B2118]">{item.contenido}</p>

                <div className="pt-2 space-y-2.5">
                  <input
                    type="text"
                    value={replyVal}
                    onChange={(e) => setReplies({ ...replies, [item.id]: e.target.value })}
                    placeholder="Respuesta o nota institucional opcional (se mostrará al público si se aprueba)"
                    className="w-full px-3 py-2 rounded-[10px] bg-[#F6EFE4] border border-[#D9CBB3] text-sm"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          moderateCommunity(item.id, 'Aprobada', replyVal.trim() || undefined);
                          notify('Contenido aprobado y visible en Comunidad.');
                        }}
                        className="px-4 py-1.5 rounded-[10px] bg-[#3F7D4E] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                      >
                        Aprobar publicación
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          moderateCommunity(item.id, 'Rechazada', replyVal.trim() || undefined);
                          notify('Envío rechazado.');
                        }}
                        className="px-4 py-1.5 rounded-[10px] bg-[#A33A2A] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                      >
                        Rechazar
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        deleteCommunity(item.id);
                        notify('Registro eliminado.');
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#A33A2A] hover:bg-[#A33A2A]/10 rounded-[8px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
