import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DonationType } from '../types';
import {
  formatBs,
  formatDateEs,
  isValidEmail,
  isValidPhoneBolivia,
  readFileAsDataUrl,
} from '../utils/format';
import { SafeImage } from '../components/SafeImage';

export const CampaignsPage: React.FC = () => {
  const { data, submitDonation } = useApp();

  const [tipo, setTipo] = useState<DonationType>('Económica');
  const [campanaId, setCampanaId] = useState<string>(data.campaigns[0]?.id || '');
  const [donanteNombre, setDonanteNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [montoBs, setMontoBs] = useState('100');
  const [descripcionEspecie, setDescripcionEspecie] = useState('');
  const [comprobanteNombre, setComprobanteNombre] = useState('');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ id: string; tipo: DonationType } | null>(null);

  const activeCampaigns = data.campaigns.filter((c) => c.activa);
  const pastCampaigns = data.campaigns.filter((c) => !c.activa);

  const handleSelectCampaign = (id: string) => {
    setCampanaId(id);
    const el = document.getElementById('formulario-donacion');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('El comprobante no debe superar los 2 MB.');
      return;
    }
    try {
      const url = await readFileAsDataUrl(file);
      setComprobanteNombre(file.name);
      setComprobanteUrl(url);
      setErrorMsg('');
    } catch {
      setErrorMsg('No se pudo leer el archivo seleccionado.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessInfo(null);

    if (!donanteNombre.trim()) {
      setErrorMsg('Ingresa tu nombre completo.');
      return;
    }
    if (!isValidEmail(correo)) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }
    if (!isValidPhoneBolivia(telefono)) {
      setErrorMsg('Ingresa un teléfono válido.');
      return;
    }

    let parsedMonto: number | undefined;
    if (tipo === 'Económica') {
      parsedMonto = Number(montoBs);
      if (!Number.isFinite(parsedMonto) || parsedMonto <= 0) {
        setErrorMsg('El monto del aporte económico debe ser mayor a Bs 0.');
        return;
      }
      if (!comprobanteNombre) {
        setErrorMsg('Adjunta el comprobante de tu transferencia para aportes económicos.');
        return;
      }
    } else {
      if (descripcionEspecie.trim().length < 8) {
        setErrorMsg('Describe qué insumos o alimentos deseas donar.');
        return;
      }
    }

    const selectedCampaign = data.campaigns.find((c) => c.id === campanaId);
    const created = submitDonation({
      tipo,
      donanteNombre: donanteNombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      montoBs: tipo === 'Económica' ? parsedMonto : undefined,
      descripcionEspecie: tipo === 'En especie' ? descripcionEspecie.trim() : undefined,
      campanaId: selectedCampaign?.id,
      campanaTitulo: selectedCampaign?.titulo,
      comprobanteNombre: tipo === 'Económica' ? comprobanteNombre : undefined,
      comprobanteUrl: tipo === 'Económica' ? comprobanteUrl : undefined,
    });

    setSuccessInfo({ id: created.id, tipo: created.tipo });
    setDonanteNombre('');
    setCorreo('');
    setTelefono('');
    setMontoBs('100');
    setDescripcionEspecie('');
    setComprobanteNombre('');
    setComprobanteUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      <div className="border-b border-[#D9CBB3] pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F4B3A]">
          Campañas y donaciones
        </h1>
        <p className="mt-2 text-base text-[#5C4E41] max-w-2xl">
          Tu aporte sostiene cirugías, vacunas, alimento y hogares temporales en La Paz. Toda
          donación económica es verificada manualmente por la Asociación antes de sumarse a la meta.
        </p>
      </div>

      {/* Campañas activas */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-[#2F4B3A]">Campañas activas</h2>

        {activeCampaigns.length === 0 ? (
          <div className="surface-arena p-8 text-center">
            <p className="text-base text-[#5C4E41]">
              Actualmente no hay campañas específicas abiertas, pero puedes registrar un aporte al
              fondo general del refugio más abajo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeCampaigns.map((camp) => {
              const pct = Math.min(100, Math.round((camp.recaudadoBs / camp.metaBs) * 100));
              return (
                <article key={camp.id} className="card-artesanal overflow-hidden flex flex-col">
                  <div className="aspect-[16/9] overflow-hidden bg-[#EADFCB]">
                    <SafeImage src={camp.imagen} alt={camp.titulo} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div>
                      <p className="text-sm text-[#5C4E41]">
                        Campaña activa · Cierre {formatDateEs(camp.fechaFin)}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-semibold text-[#2B2118]">
                        {camp.titulo}
                      </h3>
                      <p className="mt-2.5 text-base text-[#5C4E41] leading-relaxed">
                        {camp.descripcion}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-baseline justify-between text-sm">
                        <span className="font-semibold text-[#2B2118] tabular-nums">
                          {formatBs(camp.recaudadoBs)} recaudados
                        </span>
                        <span className="text-[#5C4E41] tabular-nums">
                          Meta {formatBs(camp.metaBs)} · {pct}%
                        </span>
                      </div>
                      <div
                        className="w-full h-3 rounded-full bg-[#EADFCB] border border-[#D9CBB3] overflow-hidden"
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Avance de ${camp.titulo}`}
                      >
                        <div className="h-full bg-[#3F7D4E]" style={{ width: `${pct}%` }} />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectCampaign(camp.id)}
                        className="w-full py-2.5 px-4 btn-terracota text-base"
                      >
                        Donar a esta campaña
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {pastCampaigns.length > 0 && (
          <div className="pt-4 space-y-3">
            <h3 className="font-display text-xl font-semibold text-[#5C4E41]">
              Campañas finalizadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastCampaigns.map((camp) => (
                <div key={camp.id} className="surface-arena p-5 space-y-2">
                  <p className="text-xs text-[#5C4E41]">Finalizada · {formatDateEs(camp.fechaFin)}</p>
                  <p className="font-display text-lg font-semibold text-[#2B2118]">{camp.titulo}</p>
                  <p className="text-sm text-[#3F7D4E] font-semibold tabular-nums">
                    Logrado: {formatBs(camp.recaudadoBs)} de {formatBs(camp.metaBs)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Formulario de donación */}
      <section
        id="formulario-donacion"
        className="card-artesanal p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        <div className="lg:col-span-5 space-y-4">
          <HeartHandshake className="w-8 h-8 text-[#C4572F]" strokeWidth={1.75} aria-hidden="true" />
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2F4B3A]">
            Registrar un aporte
          </h2>
          <p className="text-base text-[#5C4E41] leading-relaxed">
            Puedes apoyar mediante transferencia bancaria o con insumos en especie (alimento,
            mantas limpias, arena sanitaria o medicamentos veterinarios).
          </p>

          <div className="p-4 rounded-[12px] bg-[#F6EFE4] border border-[#D9CBB3] space-y-1.5 text-sm">
            <p className="font-semibold text-[#2B2118]">Cuenta oficial para aportes económicos</p>
            <p className="text-[#5C4E41]">{data.institution.bancoNombre}</p>
            <p className="font-semibold text-[#2B2118] tabular-nums">
              Cuenta: {data.institution.bancoCuenta}
            </p>
            <p className="text-[#5C4E41]">Titular: {data.institution.bancoTitular}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-[12px] bg-[#A33A2A]/10 border border-[#A33A2A]/30 text-[#A33A2A] text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div
              role="status"
              className="p-4 rounded-[12px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30 text-[#3F7D4E] text-sm space-y-1"
            >
              <div className="flex items-center gap-2 font-semibold text-base">
                <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>¡Gracias por tu aporte!</span>
              </div>
              <p className="text-[#2B2118]">
                Registramos tu donación ({successInfo.tipo}) con referencia{' '}
                <strong className="tabular-nums">{successInfo.id}</strong> en estado{' '}
                <strong>Pendiente</strong>. Nuestro equipo la verificará y confirmará manualmente.
              </p>
            </div>
          )}

          <div>
            <span className="block text-sm font-medium text-[#2B2118] mb-2">Tipo de aporte *</span>
            <div className="inline-flex p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
              {(['Económica', 'En especie'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTipo(t);
                    setErrorMsg('');
                  }}
                  className={`px-4 py-2 text-sm font-medium rounded-[9px] transition-colors ${
                    tipo === t
                      ? 'bg-[#FFFBF5] text-[#2B2118] shadow-xs'
                      : 'text-[#5C4E41] hover:text-[#2B2118]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="don-nombre" className="block text-sm font-medium mb-1">
                Tu nombre o familia *
              </label>
              <input
                id="don-nombre"
                type="text"
                required
                value={donanteNombre}
                onChange={(e) => setDonanteNombre(e.target.value)}
                placeholder="Ej. Álvaro Quispe"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
            <div>
              <label htmlFor="don-campana" className="block text-sm font-medium mb-1">
                Campaña destino (opcional)
              </label>
              <select
                id="don-campana"
                value={campanaId}
                onChange={(e) => setCampanaId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              >
                <option value="">Fondo general del refugio</option>
                {activeCampaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.titulo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="don-correo" className="block text-sm font-medium mb-1">
                Correo electrónico *
              </label>
              <input
                id="don-correo"
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="nombre@correo.bo"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
            <div>
              <label htmlFor="don-tel" className="block text-sm font-medium mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                id="don-tel"
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="71500000"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
          </div>

          {tipo === 'Económica' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label htmlFor="don-monto" className="block text-sm font-medium mb-1">
                  Monto aportado (Bs) *
                </label>
                <input
                  id="don-monto"
                  type="number"
                  min={1}
                  step="1"
                  required
                  value={montoBs}
                  onChange={(e) => setMontoBs(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base tabular-nums"
                />
              </div>
              <div>
                <label htmlFor="don-comprobante" className="block text-sm font-medium mb-1">
                  Comprobante de transferencia *
                </label>
                <label
                  htmlFor="don-comprobante"
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-[12px] border border-dashed border-[#D9CBB3] bg-[#F6EFE4] hover:bg-[#EADFCB] cursor-pointer text-sm font-medium truncate"
                >
                  <Upload className="w-4 h-4 text-[#C4572F] shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {comprobanteNombre || 'Subir imagen o captura'}
                  </span>
                </label>
                <input
                  id="don-comprobante"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="don-especie" className="block text-sm font-medium mb-1">
                Descripción de la donación en especie *
              </label>
              <textarea
                id="don-especie"
                rows={3}
                required
                value={descripcionEspecie}
                onChange={(e) => setDescripcionEspecie(e.target.value)}
                placeholder="Ej. 1 bolsa de alimento para perro adulto (15 kg), 3 mantas limpias y gasas. Coordinaremos entrega en Sopocachi."
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
          )}

          <div className="pt-2">
            <button type="submit" className="px-6 py-3 btn-terracota text-base">
              Enviar registro de donación
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
