import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunitySubmissionType } from '../types';
import { formatDateEs, isValidEmail, isValidPhoneBolivia } from '../utils/format';

const SUBMISSION_TYPES: CommunitySubmissionType[] = [
  'Historia de rescate',
  'Animal perdido o encontrado',
  'Consulta o sugerencia',
  'Solicitud de voluntariado',
];

export const CommunityPage: React.FC = () => {
  const { data, submitCommunity } = useApp();

  const [activeType, setActiveType] = useState<CommunitySubmissionType>('Historia de rescate');
  const [feedFilter, setFeedFilter] = useState<'Todos' | CommunitySubmissionType>('Todos');

  // Form states
  const [titulo, setTitulo] = useState('');
  const [autorNombre, setAutorNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [zona, setZona] = useState('');
  const [subtipoAlerta, setSubtipoAlerta] = useState<'Perdido' | 'Encontrado'>('Perdido');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [contenido, setContenido] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const approvedPosts = data.community
    .filter((item) => item.estado === 'Aprobada')
    .filter((item) => (feedFilter === 'Todos' ? true : item.tipo === feedFilter));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!titulo.trim()) {
      setErrorMsg('Ingresa un título breve para tu envío.');
      return;
    }
    if (!autorNombre.trim()) {
      setErrorMsg('Ingresa tu nombre.');
      return;
    }
    if (!isValidEmail(correo)) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }
    if (!isValidPhoneBolivia(telefono)) {
      setErrorMsg('Ingresa un teléfono o WhatsApp válido.');
      return;
    }
    if (contenido.trim().length < 15) {
      setErrorMsg('Por favor escribe un poco más de detalle (mínimo 15 caracteres).');
      return;
    }
    if (activeType === 'Solicitud de voluntariado' && !disponibilidad.trim()) {
      setErrorMsg('Indica tu disponibilidad de horarios para el voluntariado.');
      return;
    }

    submitCommunity({
      tipo: activeType,
      titulo: titulo.trim(),
      autorNombre: autorNombre.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      zona: zona.trim() || undefined,
      subtipoAlerta: activeType === 'Animal perdido o encontrado' ? subtipoAlerta : undefined,
      disponibilidad: activeType === 'Solicitud de voluntariado' ? disponibilidad.trim() : undefined,
      contenido: contenido.trim(),
    });

    setSuccessMsg(
      'Recibimos tu envío correctamente. Tu contenido se publicará cuando sea aprobado por el equipo de la Asociación.'
    );
    setTitulo('');
    setAutorNombre('');
    setCorreo('');
    setTelefono('');
    setZona('');
    setDisponibilidad('');
    setContenido('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      <div className="border-b border-[#D9CBB3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F4B3A]">
            Comunidad Huellitas
          </h1>
          <p className="mt-2 text-base text-[#5C4E41] max-w-2xl">
            Un espacio abierto para compartir historias de adopción, alertas de animales perdidos o
            encontrados, consultas y postulaciones de voluntariado.
          </p>
        </div>
        <p className="text-sm font-medium text-[#2B2118] bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px] px-4 py-2.5">
          Tu contenido se publicará cuando sea aprobado.
        </p>
      </div>

      {/* Formularios de participación */}
      <section className="card-artesanal p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#2F4B3A] mb-3">
            Enviar aporte o solicitud
          </h2>
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
            {SUBMISSION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setActiveType(type);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`px-3.5 py-2 text-sm font-medium rounded-[9px] whitespace-nowrap transition-colors ${
                  activeType === type
                    ? 'bg-[#FFFBF5] text-[#2B2118] shadow-xs'
                    : 'text-[#5C4E41] hover:text-[#2B2118]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div
              role="alert"
              className="p-3.5 rounded-[12px] bg-[#A33A2A]/10 border border-[#A33A2A]/30 text-[#A33A2A] text-sm flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div
              role="status"
              className="p-4 rounded-[12px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30 text-[#3F7D4E] text-sm flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-[#2B2118] font-medium">{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="com-titulo" className="block text-sm font-medium mb-1">
                {activeType === 'Historia de rescate' && 'Título de la historia *'}
                {activeType === 'Animal perdido o encontrado' &&
                  'Nombre o descripción breve del animal *'}
                {activeType === 'Consulta o sugerencia' && 'Asunto de tu consulta o sugerencia *'}
                {activeType === 'Solicitud de voluntariado' && 'Área en la que deseas apoyar *'}
              </label>
              <input
                id="com-titulo"
                type="text"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder={
                  activeType === 'Animal perdido o encontrado'
                    ? 'Ej. Perro mestizo beige con collar verde cerca de Obrajes'
                    : activeType === 'Solicitud de voluntariado'
                    ? 'Ej. Paseos en Sopocachi o traslados veterinarios'
                    : 'Escribe un título claro'
                }
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>

            <div>
              <label htmlFor="com-autor" className="block text-sm font-medium mb-1">
                Tu nombre completo *
              </label>
              <input
                id="com-autor"
                type="text"
                required
                value={autorNombre}
                onChange={(e) => setAutorNombre(e.target.value)}
                placeholder="Nombre y apellido"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="com-correo" className="block text-sm font-medium mb-1">
                Correo electrónico *
              </label>
              <input
                id="com-correo"
                type="email"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="nombre@correo.bo"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
            <div>
              <label htmlFor="com-tel" className="block text-sm font-medium mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                id="com-tel"
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="71500000"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
            <div>
              <label htmlFor="com-zona" className="block text-sm font-medium mb-1">
                Zona o barrio
              </label>
              <input
                id="com-zona"
                type="text"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ej. Miraflores, San Pedro..."
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
          </div>

          {activeType === 'Animal perdido o encontrado' && (
            <div>
              <span className="block text-sm font-medium mb-1">Tipo de reporte *</span>
              <div className="inline-flex p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
                {(['Perdido', 'Encontrado'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSubtipoAlerta(st)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-[9px] ${
                      subtipoAlerta === st ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
                    }`}
                  >
                    Animal {st.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeType === 'Solicitud de voluntariado' && (
            <div>
              <label htmlFor="com-disp" className="block text-sm font-medium mb-1">
                Disponibilidad de días y horarios *
              </label>
              <input
                id="com-disp"
                type="text"
                required
                value={disponibilidad}
                onChange={(e) => setDisponibilidad(e.target.value)}
                placeholder="Ej. Sábados de 09:00 a 13:00 o tardes entre semana"
                className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
              />
            </div>
          )}

          <div>
            <label htmlFor="com-contenido" className="block text-sm font-medium mb-1">
              Detalle *
            </label>
            <textarea
              id="com-contenido"
              rows={4}
              required
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe toda la información útil (señas particulares, fecha aproximada, consulta o experiencia)."
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <p className="text-sm text-[#5C4E41]">
              Tu contenido se publicará cuando sea aprobado.
            </p>
            <button type="submit" className="px-6 py-2.5 btn-terracota text-base">
              Enviar para revisión
            </button>
          </div>
        </form>
      </section>

      {/* Publicaciones aprobadas */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold text-[#2F4B3A]">
            Publicaciones aprobadas de la comunidad
          </h2>

          <div className="flex flex-wrap gap-1 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
            {(['Todos', ...SUBMISSION_TYPES] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFeedFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-[9px] whitespace-nowrap transition-colors ${
                  feedFilter === f ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
                }`}
              >
                {f === 'Todos' ? 'Todo' : f}
              </button>
            ))}
          </div>
        </div>

        {approvedPosts.length === 0 ? (
          <div className="surface-arena p-8 text-center">
            <p className="text-base text-[#5C4E41]">
              No hay publicaciones aprobadas en esta categoría todavía.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedPosts.map((post) => (
              <article key={post.id} className="card-artesanal p-6 space-y-3">
                <p className="text-sm text-[#5C4E41]">
                  {post.tipo}
                  {post.subtipoAlerta ? ` (${post.subtipoAlerta})` : ''} · {post.autorNombre}
                  {post.zona ? ` · ${post.zona}` : ''} · {formatDateEs(post.fecha)}
                </p>
                <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                  {post.titulo}
                </h3>
                <p className="text-base text-[#2B2118] leading-relaxed">{post.contenido}</p>

                {post.tipo === 'Animal perdido o encontrado' && (
                  <p className="text-sm font-medium text-[#C4572F] tabular-nums">
                    Contacto de aviso: {post.telefono}
                  </p>
                )}

                {post.respuestaAdmin && (
                  <div className="mt-3 p-3.5 rounded-[10px] bg-[#F6EFE4] border border-[#D9CBB3] text-sm">
                    <p className="font-semibold text-[#2F4B3A]">Respuesta de Huellitas Bolivia</p>
                    <p className="mt-1 text-[#2B2118]">{post.respuestaAdmin}</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
