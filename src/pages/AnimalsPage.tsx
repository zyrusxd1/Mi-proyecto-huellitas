import React, { useEffect, useState } from 'react';
import { Check, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Animal, AnimalSize, AnimalSpecies } from '../types';
import { isValidEmail, isValidPhoneBolivia } from '../utils/format';
import { SafeImage } from '../components/SafeImage';
import { StatusLabel } from '../components/StatusLabel';

interface AnimalsPageProps {
  initialAnimalId?: string | null;
  onClearInitialAnimal?: () => void;
}

export const AnimalsPage: React.FC<AnimalsPageProps> = ({
  initialAnimalId,
  onClearInitialAnimal,
}) => {
  const { data, submitAdoption } = useApp();

  const [speciesFilter, setSpeciesFilter] = useState<'Todos' | AnimalSpecies>('Todos');
  const [sizeFilter, setSizeFilter] = useState<'Todos' | AnimalSize>('Todos');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);

  // Form states
  const [nombreSolicitante, setNombreSolicitante] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [zona, setZona] = useState('');
  const [tipoVivienda, setTipoVivienda] = useState('Casa con patio');
  const [estiloVida, setEstiloVida] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (initialAnimalId) {
      const found = data.animals.find((a) => a.id === initialAnimalId);
      if (found) {
        setSelectedAnimal(found);
        setShowAdoptionForm(false);
        setSubmittedRef(null);
      }
      onClearInitialAnimal?.();
    }
  }, [initialAnimalId, data.animals, onClearInitialAnimal]);

  const filteredAnimals = data.animals.filter((animal) => {
    if (speciesFilter !== 'Todos' && animal.especie !== speciesFilter) return false;
    if (sizeFilter !== 'Todos' && animal.tamano !== sizeFilter) return false;
    if (onlyAvailable && animal.estado !== 'Disponible') return false;
    return true;
  });

  const openDetail = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowAdoptionForm(false);
    setFormError('');
    setSubmittedRef(null);
  };

  const closeDetail = () => {
    setSelectedAnimal(null);
    setShowAdoptionForm(false);
    setFormError('');
  };

  const handleSubmitAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal) return;
    setFormError('');

    if (!nombreSolicitante.trim()) {
      setFormError('Ingresa tu nombre completo.');
      return;
    }
    if (!isValidEmail(correo)) {
      setFormError('Ingresa un correo electrónico válido.');
      return;
    }
    if (!isValidPhoneBolivia(telefono)) {
      setFormError('Ingresa un teléfono válido (mínimo 7 dígitos).');
      return;
    }
    if (!zona.trim()) {
      setFormError('Indica tu zona o barrio en La Paz / El Alto.');
      return;
    }
    if (estiloVida.trim().length < 15) {
      setFormError('Cuéntanos un poco más sobre tu rutina, familia y experiencia previa.');
      return;
    }

    const created = submitAdoption({
      animalId: selectedAnimal.id,
      animalNombre: selectedAnimal.nombre,
      nombreSolicitante: nombreSolicitante.trim(),
      correo: correo.trim(),
      telefono: telefono.trim(),
      zona: zona.trim(),
      tipoVivienda,
      estiloVida: estiloVida.trim(),
    });

    setSubmittedRef(created.id);
    setNombreSolicitante('');
    setCorreo('');
    setTelefono('');
    setZona('');
    setEstiloVida('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#D9CBB3] pb-6">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F4B3A]">
          Animales en adopción
        </h1>
        <p className="mt-2 text-base text-[#5C4E41] max-w-2xl">
          Todos nuestros rescatados pasan por evaluación veterinaria y socialización. Al enviar tu
          postulación, nuestro equipo coordina una entrevista y visita antes de formalizar la adopción.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
            {(['Todos', 'Perro', 'Gato'] as const).map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => setSpeciesFilter(sp)}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-[9px] whitespace-nowrap transition-colors ${
                  speciesFilter === sp
                    ? 'bg-[#FFFBF5] text-[#2B2118] shadow-xs'
                    : 'text-[#5C4E41] hover:text-[#2B2118]'
                }`}
              >
                {sp === 'Todos' ? 'Todas las especies' : sp === 'Perro' ? 'Perros' : 'Gatos'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
            {(['Todos', 'Pequeño', 'Mediano', 'Grande'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => setSizeFilter(sz)}
                className={`px-3 py-1.5 text-sm font-medium rounded-[9px] whitespace-nowrap transition-colors ${
                  sizeFilter === sz
                    ? 'bg-[#FFFBF5] text-[#2B2118] shadow-xs'
                    : 'text-[#5C4E41] hover:text-[#2B2118]'
                }`}
              >
                {sz === 'Todos' ? 'Cualquier tamaño' : sz}
              </button>
            ))}
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-[#2B2118] cursor-pointer">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => setOnlyAvailable(e.target.checked)}
            className="w-4 h-4 accent-[#2F4B3A]"
          />
          <span>Solo disponibles ahora</span>
        </label>
      </div>

      {/* Grilla de animales */}
      {filteredAnimals.length === 0 ? (
        <div className="surface-arena p-10 text-center space-y-3">
          <p className="font-display text-xl text-[#2B2118]">
            No encontramos animales con esos filtros
          </p>
          <p className="text-base text-[#5C4E41]">
            Prueba limpiando los filtros de especie o tamaño para ver todos nuestros rescatados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSpeciesFilter('Todos');
              setSizeFilter('Todos');
              setOnlyAvailable(false);
            }}
            className="mt-2 px-5 py-2.5 btn-secundario text-sm"
          >
            Mostrar todos los animales
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAnimals.map((animal) => (
            <article key={animal.id} className="card-artesanal overflow-hidden flex flex-col">
              <div className="aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                <SafeImage
                  src={animal.fotos[0]}
                  alt={`${animal.nombre}, ${animal.especie.toLowerCase()} de tamaño ${animal.tamano.toLowerCase()}`}
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold text-[#2B2118]">
                    {animal.nombre}
                  </h2>
                  <StatusLabel status={animal.estado} />
                </div>
                <p className="mt-1 text-sm text-[#5C4E41]">
                  {animal.especie} · {animal.edad} · {animal.tamano}
                </p>
                <p className="mt-3 text-sm text-[#2B2118] line-clamp-2 flex-1">
                  {animal.comportamiento}
                </p>
                <button
                  type="button"
                  onClick={() => openDetail(animal)}
                  className="mt-4 w-full py-2.5 px-4 btn-terracota text-sm"
                >
                  Conocer a {animal.nombre}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal de Ficha y Solicitud de Adopción */}
      {selectedAnimal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2118]/50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Ficha de ${selectedAnimal.nombre}`}
        >
          <div className="relative w-full max-w-3xl bg-[#FFFBF5] rounded-[12px] border border-[#D9CBB3] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-[#F6EFE4] border-b border-[#D9CBB3] px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#2B2118]">
                  {selectedAnimal.nombre}
                </h2>
                <p className="text-sm text-[#5C4E41]">
                  {selectedAnimal.especie} · {selectedAnimal.sexo} · {selectedAnimal.edad} ·{' '}
                  {selectedAnimal.tamano}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                aria-label="Cerrar ficha"
                className="w-10 h-10 inline-flex items-center justify-center rounded-[12px] hover:bg-[#EADFCB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {submittedRef ? (
                <div className="p-6 rounded-[12px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30 space-y-3">
                  <div className="flex items-center gap-2 text-[#3F7D4E] font-semibold text-lg">
                    <CheckCircle2 className="w-6 h-6 shrink-0" aria-hidden="true" />
                    <span>Solicitud recibida correctamente</span>
                  </div>
                  <p className="text-base text-[#2B2118]">
                    Tu postulación para adoptar a <strong>{selectedAnimal.nombre}</strong> quedó
                    registrada en estado <strong>Recibida</strong> (Referencia:{' '}
                    <span className="tabular-nums font-semibold">{submittedRef}</span>).
                  </p>
                  <p className="text-sm text-[#5C4E41]">
                    Nuestro equipo revisará tus respuestas y se comunicará contigo por teléfono o
                    correo para coordinar la entrevista.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="px-5 py-2.5 btn-bosque text-sm"
                    >
                      Volver al catálogo
                    </button>
                  </div>
                </div>
              ) : !showAdoptionForm ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="aspect-[4/3] rounded-[12px] overflow-hidden border border-[#D9CBB3]">
                      <SafeImage
                        src={selectedAnimal.fotos[0]}
                        alt={`Fotografía de ${selectedAnimal.nombre}`}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#5C4E41]">Estado actual</span>
                        <StatusLabel status={selectedAnimal.estado} />
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#2F4B3A]">
                          Comportamiento
                        </h3>
                        <p className="mt-1 text-base text-[#2B2118] leading-relaxed">
                          {selectedAnimal.comportamiento}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#2F4B3A]">
                          Historia de rescate
                        </h3>
                        <p className="mt-1 text-base text-[#5C4E41] leading-relaxed">
                          {selectedAnimal.historia}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-[12px] bg-[#F6EFE4] border border-[#D9CBB3] space-y-3">
                    <h3 className="font-display text-lg font-semibold text-[#2F4B3A]">
                      Estado de salud veterinaria
                    </h3>
                    <div className="flex flex-wrap gap-6 text-sm font-medium text-[#2B2118]">
                      <span className="inline-flex items-center gap-1.5">
                        <Check
                          className={`w-4 h-4 ${
                            selectedAnimal.estadoSalud.vacunado ? 'text-[#3F7D4E]' : 'text-[#5C4E41]'
                          }`}
                          aria-hidden="true"
                        />
                        Vacunado: {selectedAnimal.estadoSalud.vacunado ? 'Sí' : 'Pendiente'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Check
                          className={`w-4 h-4 ${
                            selectedAnimal.estadoSalud.esterilizado
                              ? 'text-[#3F7D4E]'
                              : 'text-[#5C4E41]'
                          }`}
                          aria-hidden="true"
                        />
                        Esterilizado: {selectedAnimal.estadoSalud.esterilizado ? 'Sí' : 'Compromiso'}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Check
                          className={`w-4 h-4 ${
                            selectedAnimal.estadoSalud.desparasitado
                              ? 'text-[#3F7D4E]'
                              : 'text-[#5C4E41]'
                          }`}
                          aria-hidden="true"
                        />
                        Desparasitado: {selectedAnimal.estadoSalud.desparasitado ? 'Sí' : 'Pendiente'}
                      </span>
                    </div>
                    <p className="text-sm text-[#5C4E41]">
                      {selectedAnimal.estadoSalud.notasMedicas}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeDetail}
                      className="px-5 py-2.5 btn-secundario text-base"
                    >
                      Cerrar
                    </button>
                    {selectedAnimal.estado === 'Adoptado' ? (
                      <span className="text-sm font-medium text-[#3F7D4E]">
                        {selectedAnimal.nombre} ya fue adoptado por una familia.
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAdoptionForm(true)}
                        className="px-6 py-2.5 btn-terracota text-base"
                      >
                        Solicitar adopción
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmitAdoption} className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D9CBB3] pb-3">
                    <h3 className="font-display text-xl font-semibold text-[#2F4B3A]">
                      Formulario de adopción para {selectedAnimal.nombre}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAdoptionForm(false)}
                      className="text-sm font-medium text-[#5C4E41] hover:text-[#2B2118] underline"
                    >
                      Volver a la ficha
                    </button>
                  </div>

                  {formError && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-[12px] bg-[#A33A2A]/10 border border-[#A33A2A]/30 text-[#A33A2A] text-sm flex items-start gap-2"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ado-nombre" className="block text-sm font-medium mb-1">
                        Nombre completo *
                      </label>
                      <input
                        id="ado-nombre"
                        type="text"
                        required
                        value={nombreSolicitante}
                        onChange={(e) => setNombreSolicitante(e.target.value)}
                        placeholder="Tu nombre y apellido"
                        className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                      />
                    </div>
                    <div>
                      <label htmlFor="ado-correo" className="block text-sm font-medium mb-1">
                        Correo electrónico *
                      </label>
                      <input
                        id="ado-correo"
                        type="email"
                        required
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        placeholder="nombre@correo.bo"
                        className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                      />
                    </div>
                    <div>
                      <label htmlFor="ado-tel" className="block text-sm font-medium mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        id="ado-tel"
                        type="tel"
                        required
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="71500000"
                        className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                      />
                    </div>
                    <div>
                      <label htmlFor="ado-zona" className="block text-sm font-medium mb-1">
                        Zona o barrio *
                      </label>
                      <input
                        id="ado-zona"
                        type="text"
                        required
                        value={zona}
                        onChange={(e) => setZona(e.target.value)}
                        placeholder="Ej. Sopocachi, Obrajes, Miraflores"
                        className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ado-vivienda" className="block text-sm font-medium mb-1">
                      Tipo de vivienda *
                    </label>
                    <select
                      id="ado-vivienda"
                      value={tipoVivienda}
                      onChange={(e) => setTipoVivienda(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                    >
                      <option value="Casa con patio">Casa con patio cercado</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Casa sin patio">Casa sin patio abierto</option>
                      <option value="Quinta / terreno">Vivienda amplia en zona residencial</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ado-estilo" className="block text-sm font-medium mb-1">
                      Estilo de vida, integrantes del hogar y experiencia previa *
                    </label>
                    <textarea
                      id="ado-estilo"
                      rows={4}
                      required
                      value={estiloVida}
                      onChange={(e) => setEstiloVida(e.target.value)}
                      placeholder="Cuéntanos cuántas horas pasaría acompañado, si hay niños u otros animales y cómo piensas cuidarlo."
                      className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdoptionForm(false)}
                      className="px-5 py-2.5 btn-secundario text-base"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="px-6 py-2.5 btn-terracota text-base">
                      Enviar solicitud de adopción
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
