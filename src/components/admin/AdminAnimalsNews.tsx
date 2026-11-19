import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Animal, AnimalSize, AnimalSpecies, AnimalStatus, NewsArticle } from '../../types';
import { formatDateEs, readFileAsDataUrl } from '../../utils/format';
import { SafeImage } from '../SafeImage';
import { StatusLabel } from '../StatusLabel';

const PRESET_ANIMAL_PHOTOS = [
  '/src/assets/images/animal_inti_perro_1795047508626.jpg',
  '/src/assets/images/animal_killa_gata_1795047509999.jpg',
  '/src/assets/images/animal_tunari_perro_1795047509376.jpg',
  '/src/assets/images/animal_wayra_perro_1795047509859.jpg',
  '/src/assets/images/animal_sisa_gata_1795047510744.jpg',
  '/src/assets/images/animal_illimani_perro_1795047511371.jpg',
  '/src/assets/images/animal_chaska_gata_1795047511195.jpg',
  '/src/assets/images/animal_paco_perro_1795047511080.jpg',
];

const PRESET_NEWS_PHOTOS = [
  '/src/assets/images/noticia_rescate_invierno_1795047516680.jpg',
  '/src/assets/images/campana_esterilizacion_1795047514379.jpg',
  '/src/assets/images/hero_refugio_lapaz_1795047509046.jpg',
];

export const AdminAnimalsNews: React.FC = () => {
  const { data, saveAnimal, deleteAnimal, saveNews, deleteNews } = useApp();
  const [subTab, setSubTab] = useState<'animales' | 'noticias'>('animales');

  // Animal modal state
  const [editingAnimal, setEditingAnimal] = useState<Partial<Animal> | null>(null);
  const [confirmDeleteAnimal, setConfirmDeleteAnimal] = useState<string | null>(null);

  // News modal state
  const [editingNews, setEditingNews] = useState<Partial<NewsArticle> | null>(null);
  const [confirmDeleteNews, setConfirmDeleteNews] = useState<string | null>(null);

  const openNewAnimal = () => {
    setEditingAnimal({
      nombre: '',
      especie: 'Perro',
      edad: '1 año',
      tamano: 'Mediano',
      sexo: 'Macho',
      estado: 'Disponible',
      fotos: [PRESET_ANIMAL_PHOTOS[0]],
      comportamiento: '',
      estadoSalud: {
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        notasMedicas: 'Control veterinario al día.',
      },
      historia: '',
      destacado: false,
      fechaIngreso: new Date().toISOString().slice(0, 10),
    });
  };

  const handleAnimalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAnimal) return;
    const url = await readFileAsDataUrl(file);
    setEditingAnimal({ ...editingAnimal, fotos: [url] });
  };

  const handleSaveAnimal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnimal || !editingAnimal.nombre?.trim()) return;
    saveAnimal({
      id: editingAnimal.id,
      nombre: editingAnimal.nombre.trim(),
      especie: (editingAnimal.especie || 'Perro') as AnimalSpecies,
      edad: editingAnimal.edad?.trim() || '1 año',
      tamano: (editingAnimal.tamano || 'Mediano') as AnimalSize,
      sexo: editingAnimal.sexo || 'Macho',
      estado: (editingAnimal.estado || 'Disponible') as AnimalStatus,
      fotos: editingAnimal.fotos?.length ? editingAnimal.fotos : [PRESET_ANIMAL_PHOTOS[0]],
      comportamiento: editingAnimal.comportamiento?.trim() || 'Sociable y cariñoso.',
      estadoSalud: editingAnimal.estadoSalud || {
        vacunado: true,
        esterilizado: true,
        desparasitado: true,
        notasMedicas: 'Sin observaciones.',
      },
      historia: editingAnimal.historia?.trim() || 'Rescatado en La Paz.',
      destacado: Boolean(editingAnimal.destacado),
      fechaIngreso: editingAnimal.fechaIngreso || new Date().toISOString().slice(0, 10),
    });
    setEditingAnimal(null);
  };

  const openNewNews = () => {
    setEditingNews({
      titulo: '',
      resumen: '',
      contenido: '',
      categoria: 'Rescates',
      autor: 'Equipo Huellitas Bolivia',
      fecha: new Date().toISOString().slice(0, 10),
      imagen: PRESET_NEWS_PHOTOS[0],
    });
  };

  const handleNewsPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingNews) return;
    const url = await readFileAsDataUrl(file);
    setEditingNews({ ...editingNews, imagen: url });
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews || !editingNews.titulo?.trim()) return;
    saveNews({
      id: editingNews.id,
      titulo: editingNews.titulo.trim(),
      resumen: editingNews.resumen?.trim() || '',
      contenido: editingNews.contenido?.trim() || '',
      categoria: editingNews.categoria?.trim() || 'Noticias',
      autor: editingNews.autor?.trim() || 'Equipo Huellitas Bolivia',
      fecha: editingNews.fecha || new Date().toISOString().slice(0, 10),
      imagen: editingNews.imagen || PRESET_NEWS_PHOTOS[0],
    });
    setEditingNews(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
          <button
            type="button"
            onClick={() => setSubTab('animales')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              subTab === 'animales' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Animales ({data.animals.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('noticias')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              subTab === 'noticias' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Noticias ({data.news.length})
          </button>
        </div>

        <button
          type="button"
          onClick={subTab === 'animales' ? openNewAnimal : openNewNews}
          className="px-4 py-2.5 btn-terracota text-sm inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>{subTab === 'animales' ? 'Registrar animal' : 'Publicar noticia'}</span>
        </button>
      </div>

      {subTab === 'animales' ? (
        <div className="card-artesanal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F6EFE4] border-b border-[#D9CBB3] text-[#5C4E41]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Animal</th>
                  <th className="py-3 px-4 font-semibold">Especie / Tamaño</th>
                  <th className="py-3 px-4 font-semibold">Edad</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9CBB3]">
                {data.animals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-[#F6EFE4]/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-[8px] overflow-hidden shrink-0 border border-[#D9CBB3]">
                          <SafeImage src={animal.fotos[0]} alt={animal.nombre} />
                        </div>
                        <div>
                          <p className="font-semibold text-[#2B2118]">{animal.nombre}</p>
                          <p className="text-xs text-[#5C4E41]">
                            {animal.sexo} {animal.destacado ? '· Destacado' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#2B2118]">
                      {animal.especie} · {animal.tamano}
                    </td>
                    <td className="py-3 px-4 text-[#5C4E41]">{animal.edad}</td>
                    <td className="py-3 px-4">
                      <StatusLabel status={animal.estado} />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setEditingAnimal(animal)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 btn-secundario text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Editar</span>
                      </button>
                      {confirmDeleteAnimal === animal.id ? (
                        <span className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              deleteAnimal(animal.id);
                              setConfirmDeleteAnimal(null);
                            }}
                            className="px-2.5 py-1.5 rounded-[8px] bg-[#A33A2A] text-[#FFFBF5] text-xs font-semibold"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteAnimal(null)}
                            className="px-2 py-1.5 text-xs text-[#5C4E41] underline"
                          >
                            Cancelar
                          </button>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteAnimal(animal.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#A33A2A] hover:bg-[#A33A2A]/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.news.map((article) => (
            <div key={article.id} className="card-artesanal p-5 flex flex-col justify-between gap-4">
              <div className="flex gap-4">
                <div className="w-24 h-20 rounded-[8px] overflow-hidden shrink-0 border border-[#D9CBB3]">
                  <SafeImage src={article.imagen} alt={article.titulo} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-[#5C4E41]">
                    {article.categoria} · {formatDateEs(article.fecha)}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-[#2B2118] line-clamp-2">
                    {article.titulo}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-[#5C4E41] line-clamp-2">{article.resumen}</p>
              <div className="flex justify-end gap-2 border-t border-[#D9CBB3] pt-3">
                <button
                  type="button"
                  onClick={() => setEditingNews(article)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 btn-secundario text-xs"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Editar</span>
                </button>
                {confirmDeleteNews === article.id ? (
                  <span className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        deleteNews(article.id);
                        setConfirmDeleteNews(null);
                      }}
                      className="px-2.5 py-1.5 rounded-[8px] bg-[#A33A2A] text-[#FFFBF5] text-xs font-semibold"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteNews(null)}
                      className="px-2 py-1.5 text-xs text-[#5C4E41] underline"
                    >
                      Cancelar
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteNews(article.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#A33A2A] hover:bg-[#A33A2A]/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Eliminar</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Editar / Crear Animal */}
      {editingAnimal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2118]/50">
          <div className="w-full max-w-2xl bg-[#FFFBF5] rounded-[12px] border border-[#D9CBB3] max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#F6EFE4] border-b border-[#D9CBB3] flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                {editingAnimal.id ? `Editar ficha de ${editingAnimal.nombre}` : 'Nuevo animal'}
              </h3>
              <button type="button" onClick={() => setEditingAnimal(null)} aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveAnimal} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={editingAnimal.nombre || ''}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Edad *</label>
                  <input
                    type="text"
                    required
                    value={editingAnimal.edad || ''}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, edad: e.target.value })}
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Especie</label>
                  <select
                    value={editingAnimal.especie || 'Perro'}
                    onChange={(e) =>
                      setEditingAnimal({ ...editingAnimal, especie: e.target.value as AnimalSpecies })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tamaño</label>
                  <select
                    value={editingAnimal.tamano || 'Mediano'}
                    onChange={(e) =>
                      setEditingAnimal({ ...editingAnimal, tamano: e.target.value as AnimalSize })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  >
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sexo</label>
                  <select
                    value={editingAnimal.sexo || 'Macho'}
                    onChange={(e) =>
                      setEditingAnimal({
                        ...editingAnimal,
                        sexo: e.target.value as 'Macho' | 'Hembra',
                      })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={editingAnimal.estado || 'Disponible'}
                    onChange={(e) =>
                      setEditingAnimal({ ...editingAnimal, estado: e.target.value as AnimalStatus })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Adoptado">Adoptado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fotografía</label>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={editingAnimal.fotos?.[0] || PRESET_ANIMAL_PHOTOS[0]}
                    onChange={(e) => setEditingAnimal({ ...editingAnimal, fotos: [e.target.value] })}
                    className="flex-1 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                  >
                    {PRESET_ANIMAL_PHOTOS.map((p, i) => (
                      <option key={p} value={p}>
                        Fotografía de archivo #{i + 1}
                      </option>
                    ))}
                  </select>
                  <label className="px-3 py-2 btn-secundario text-xs cursor-pointer">
                    Subir imagen propia
                    <input type="file" accept="image/*" onChange={handleAnimalPhotoUpload} className="sr-only" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comportamiento *</label>
                <textarea
                  rows={2}
                  required
                  value={editingAnimal.comportamiento || ''}
                  onChange={(e) =>
                    setEditingAnimal({ ...editingAnimal, comportamiento: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Historia de rescate</label>
                <textarea
                  rows={2}
                  value={editingAnimal.historia || ''}
                  onChange={(e) => setEditingAnimal({ ...editingAnimal, historia: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>

              <div className="p-3.5 rounded-[10px] bg-[#F6EFE4] border border-[#D9CBB3] space-y-2">
                <div className="flex flex-wrap gap-5 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(editingAnimal.estadoSalud?.vacunado)}
                      onChange={(e) =>
                        setEditingAnimal({
                          ...editingAnimal,
                          estadoSalud: {
                            vacunado: e.target.checked,
                            esterilizado: Boolean(editingAnimal.estadoSalud?.esterilizado),
                            desparasitado: Boolean(editingAnimal.estadoSalud?.desparasitado),
                            notasMedicas: editingAnimal.estadoSalud?.notasMedicas || '',
                          },
                        })
                      }
                    />
                    Vacunado
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(editingAnimal.estadoSalud?.esterilizado)}
                      onChange={(e) =>
                        setEditingAnimal({
                          ...editingAnimal,
                          estadoSalud: {
                            vacunado: Boolean(editingAnimal.estadoSalud?.vacunado),
                            esterilizado: e.target.checked,
                            desparasitado: Boolean(editingAnimal.estadoSalud?.desparasitado),
                            notasMedicas: editingAnimal.estadoSalud?.notasMedicas || '',
                          },
                        })
                      }
                    />
                    Esterilizado
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(editingAnimal.estadoSalud?.desparasitado)}
                      onChange={(e) =>
                        setEditingAnimal({
                          ...editingAnimal,
                          estadoSalud: {
                            vacunado: Boolean(editingAnimal.estadoSalud?.vacunado),
                            esterilizado: Boolean(editingAnimal.estadoSalud?.esterilizado),
                            desparasitado: e.target.checked,
                            notasMedicas: editingAnimal.estadoSalud?.notasMedicas || '',
                          },
                        })
                      }
                    />
                    Desparasitado
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Notas médicas"
                  value={editingAnimal.estadoSalud?.notasMedicas || ''}
                  onChange={(e) =>
                    setEditingAnimal({
                      ...editingAnimal,
                      estadoSalud: {
                        vacunado: Boolean(editingAnimal.estadoSalud?.vacunado),
                        esterilizado: Boolean(editingAnimal.estadoSalud?.esterilizado),
                        desparasitado: Boolean(editingAnimal.estadoSalud?.desparasitado),
                        notasMedicas: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-[8px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(editingAnimal.destacado)}
                  onChange={(e) =>
                    setEditingAnimal({ ...editingAnimal, destacado: e.target.checked })
                  }
                />
                Mostrar como destacado en la página de inicio
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAnimal(null)}
                  className="px-4 py-2 btn-secundario text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 btn-terracota text-sm">
                  Guardar ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar / Crear Noticia */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2118]/50">
          <div className="w-full max-w-2xl bg-[#FFFBF5] rounded-[12px] border border-[#D9CBB3] max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#F6EFE4] border-b border-[#D9CBB3] flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                {editingNews.id ? 'Editar noticia' : 'Publicar nueva noticia'}
              </h3>
              <button type="button" onClick={() => setEditingNews(null)} aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNews} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input
                  type="text"
                  required
                  value={editingNews.titulo || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, titulo: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <input
                    type="text"
                    value={editingNews.categoria || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, categoria: e.target.value })}
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Autor</label>
                  <input
                    type="text"
                    value={editingNews.autor || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, autor: e.target.value })}
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input
                    type="date"
                    value={editingNews.fecha || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, fecha: e.target.value })}
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Imagen de portada</label>
                <div className="flex flex-wrap gap-2 items-center">
                  <select
                    value={editingNews.imagen || PRESET_NEWS_PHOTOS[0]}
                    onChange={(e) => setEditingNews({ ...editingNews, imagen: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                  >
                    {PRESET_NEWS_PHOTOS.map((p, i) => (
                      <option key={p} value={p}>
                        Imagen editorial #{i + 1}
                      </option>
                    ))}
                  </select>
                  <label className="px-3 py-2 btn-secundario text-xs cursor-pointer">
                    Subir imagen
                    <input type="file" accept="image/*" onChange={handleNewsPhotoUpload} className="sr-only" />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Resumen breve *</label>
                <textarea
                  rows={2}
                  required
                  value={editingNews.resumen || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, resumen: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contenido completo *</label>
                <textarea
                  rows={5}
                  required
                  value={editingNews.contenido || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, contenido: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 btn-secundario text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 btn-terracota text-sm">
                  Guardar noticia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
