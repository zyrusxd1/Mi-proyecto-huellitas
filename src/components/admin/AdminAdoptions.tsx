import React, { useState } from 'react';
import { Calendar, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdoptionApplication, AdoptionStatus } from '../../types';
import { formatDateEs } from '../../utils/format';
import { StatusLabel } from '../StatusLabel';

export const AdminAdoptions: React.FC = () => {
  const { data, updateAdoption, registerAdoptionCompletion, addAdoptionFollowUp } = useApp();
  const [filter, setFilter] = useState<'Todas' | AdoptionStatus>('Todas');
  const [selectedId, setSelectedId] = useState<string>(data.adoptions[0]?.id || '');

  // Interview / Decision local inputs
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpStatus, setFollowUpStatus] = useState('Adaptación positiva');
  const [feedback, setFeedback] = useState('');

  const filtered = data.adoptions.filter((a) => (filter === 'Todas' ? true : a.estado === filter));
  const selected: AdoptionApplication | undefined =
    data.adoptions.find((a) => a.id === selectedId) || filtered[0];

  const handleSelect = (app: AdoptionApplication) => {
    setSelectedId(app.id);
    setInterviewDate(app.fechaEntrevista || '');
    setInterviewNotes(app.notasEntrevista || '');
    setDecisionNotes(app.motivoDecision || '');
    setFeedback('');
  };

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    updateAdoption(selected.id, {
      estado: selected.estado === 'Recibida' ? 'En revisión' : selected.estado,
      fechaEntrevista: interviewDate,
      notasEntrevista: interviewNotes,
    });
    showToast('Entrevista guardada y solicitud marcada En revisión.');
  };

  const handleDecision = (newStatus: AdoptionStatus) => {
    if (!selected) return;
    updateAdoption(selected.id, {
      estado: newStatus,
      motivoDecision: decisionNotes,
    });
    showToast(`Solicitud actualizada a "${newStatus}".`);
  };

  const handleRegisterAdoption = () => {
    if (!selected) return;
    registerAdoptionCompletion(selected.id, deliveryNotes);
    setDeliveryNotes('');
    showToast(`Adopción registrada. ${selected.animalNombre} pasó a estado "Adoptado".`);
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !followUpNotes.trim()) return;
    addAdoptionFollowUp(selected.id, {
      fecha: new Date().toISOString().slice(0, 10),
      notas: followUpNotes.trim(),
      estadoAnimal: followUpStatus,
    });
    setFollowUpNotes('');
    showToast('Seguimiento posterior registrado.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex flex-wrap gap-1 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
          {(['Todas', 'Recibida', 'En revisión', 'Aprobada', 'Rechazada'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 text-sm font-medium rounded-[9px] whitespace-nowrap ${
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
            No hay solicitudes de adopción en este estado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Lista de solicitudes */}
          <div className="lg:col-span-5 space-y-3">
            {filtered.map((app) => {
              const active = selected?.id === app.id;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleSelect(app)}
                  className={`w-full text-left p-4 rounded-[12px] border transition-colors ${
                    active
                      ? 'bg-[#FFFBF5] border-[#2F4B3A] shadow-xs'
                      : 'bg-[#FFFBF5]/70 border-[#D9CBB3] hover:bg-[#FFFBF5]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-lg font-semibold text-[#2B2118]">
                      {app.animalNombre}
                    </span>
                    <StatusLabel status={app.estado} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#2B2118]">
                    {app.nombreSolicitante}
                  </p>
                  <p className="text-xs text-[#5C4E41]">
                    {app.zona} · Recibida {formatDateEs(app.fechaSolicitud)}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Detalle y gestión */}
          {selected && (
            <div className="lg:col-span-7 card-artesanal p-6 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9CBB3] pb-4">
                <div>
                  <p className="text-xs text-[#5C4E41] tabular-nums">
                    Solicitud {selected.id} · {formatDateEs(selected.fechaSolicitud)}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#2B2118]">
                    {selected.nombreSolicitante} → {selected.animalNombre}
                  </h3>
                  <p className="text-sm text-[#5C4E41] mt-1">
                    {selected.correo} · <span className="tabular-nums">{selected.telefono}</span> ·{' '}
                    {selected.zona}
                  </p>
                </div>
                <StatusLabel status={selected.estado} />
              </div>

              <div className="p-4 rounded-[10px] bg-[#F6EFE4] border border-[#D9CBB3] space-y-2 text-sm">
                <p>
                  <strong>Tipo de vivienda:</strong> {selected.tipoVivienda}
                </p>
                <p>
                  <strong>Estilo de vida y experiencia:</strong> {selected.estiloVida}
                </p>
              </div>

              {/* Programar entrevista */}
              <form onSubmit={handleScheduleInterview} className="space-y-3 border-t border-[#D9CBB3] pt-4">
                <h4 className="font-display text-lg font-semibold text-[#2F4B3A] inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <span>1. Entrevista y revisión</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Fecha y hora</label>
                    <input
                      type="text"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      placeholder="Ej. 2026-11-24 16:00"
                      className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Notas de entrevista</label>
                    <input
                      type="text"
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                      placeholder="Observaciones de visita o llamada"
                      className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                    />
                  </div>
                </div>
                <button type="submit" className="px-4 py-2 btn-secundario text-sm">
                  Guardar entrevista y pasar a En revisión
                </button>
              </form>

              {/* Decisión del administrador */}
              <div className="space-y-3 border-t border-[#D9CBB3] pt-4">
                <h4 className="font-display text-lg font-semibold text-[#2F4B3A]">
                  2. Decisión del administrador
                </h4>
                <input
                  type="text"
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="Motivo o comentario de aprobación / rechazo (opcional)"
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                />
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleDecision('Aprobada')}
                    className="px-4 py-2 rounded-[10px] bg-[#3F7D4E] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                  >
                    Aprobar solicitud
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('Rechazada')}
                    className="px-4 py-2 rounded-[10px] bg-[#A33A2A] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                  >
                    Rechazar solicitud
                  </button>
                </div>
              </div>

              {/* Registrar adopción formal */}
              <div className="space-y-3 border-t border-[#D9CBB3] pt-4">
                <h4 className="font-display text-lg font-semibold text-[#2F4B3A] inline-flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" aria-hidden="true" />
                  <span>3. Registrar entrega y adopción</span>
                </h4>
                {selected.adopcionRegistrada ? (
                  <div className="p-3.5 rounded-[10px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30 text-sm">
                    <p className="font-semibold text-[#3F7D4E]">
                      Adopción formalizada el {formatDateEs(selected.adopcionRegistrada.fechaAdopcion)}
                    </p>
                    <p className="text-[#2B2118] mt-1">
                      {selected.adopcionRegistrada.notasEntrega}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Notas de entrega, contrato firmado y cartilla"
                      className="flex-1 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleRegisterAdoption}
                      className="px-4 py-2 btn-terracota text-sm whitespace-nowrap"
                    >
                      Registrar adopción (Pasa a Adoptado)
                    </button>
                  </div>
                )}
              </div>

              {/* Seguimiento posterior */}
              <div className="space-y-3 border-t border-[#D9CBB3] pt-4">
                <h4 className="font-display text-lg font-semibold text-[#2F4B3A]">
                  4. Seguimiento posterior
                </h4>
                <form onSubmit={handleAddFollowUp} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <select
                    value={followUpStatus}
                    onChange={(e) => setFollowUpStatus(e.target.value)}
                    className="px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                  >
                    <option value="Adaptación positiva">Adaptación positiva</option>
                    <option value="Requiere visita">Requiere visita</option>
                    <option value="Control veterinario al día">Control veterinario al día</option>
                  </select>
                  <input
                    type="text"
                    required
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    placeholder="Detalle del seguimiento (fotos, peso, conducta)"
                    className="sm:col-span-2 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                  />
                  <button type="submit" className="sm:col-span-3 py-2 btn-bosque text-sm">
                    Agregar registro de seguimiento
                  </button>
                </form>

                {selected.seguimientos.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {selected.seguimientos.map((seg) => (
                      <li
                        key={seg.id}
                        className="p-3 rounded-[10px] bg-[#F6EFE4] border border-[#D9CBB3] text-sm"
                      >
                        <p className="text-xs text-[#5C4E41]">
                          {formatDateEs(seg.fecha)} · {seg.estadoAnimal}
                        </p>
                        <p className="text-[#2B2118] mt-0.5">{seg.notas}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
