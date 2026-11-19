import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus, Product } from '../../types';
import { formatBs, formatDateEs, readFileAsDataUrl } from '../../utils/format';
import { SafeImage } from '../SafeImage';
import { StatusLabel } from '../StatusLabel';

const PRESET_PRODUCT_PHOTOS = [
  '/src/assets/images/prod_collar_andino_1795047511497.jpg',
  '/src/assets/images/prod_correa_algodon_1795047510889.jpg',
  '/src/assets/images/prod_camiseta_crema_1795047512483.jpg',
  '/src/assets/images/prod_camiseta_bosque_1795047512312.jpg',
  '/src/assets/images/prod_taza_ceramica_1795047513178.jpg',
  '/src/assets/images/prod_taza_esmaltada_1795047513348.jpg',
  '/src/assets/images/prod_comedero_barro_1795047513327.jpg',
  '/src/assets/images/prod_comedero_madera_1795047514064.jpg',
];

export const AdminStore: React.FC = () => {
  const {
    data,
    getAvailableStock,
    saveProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    adjustInventory,
    confirmOrderPayment,
    cancelOrder,
    updateOrderStatus,
  } = useApp();

  const [tab, setTab] = useState<'pedidos' | 'productos' | 'inventario'>('pedidos');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Product modal
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [newCategory, setNewCategory] = useState('');

  // Inventory adjustment form
  const [invProductId, setInvProductId] = useState(data.products[0]?.id || '');
  const [invType, setInvType] = useState<'Entrada' | 'Salida'>('Entrada');
  const [invQty, setInvQty] = useState('5');
  const [invReason, setInvReason] = useState('');

  const notify = (type: 'ok' | 'err', text: string) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleConfirmOrder = (orderId: string) => {
    const res = confirmOrderPayment(orderId);
    if (res.ok) notify('ok', 'Pago confirmado y salida de inventario registrada.');
    else notify('err', res.error || 'Error al confirmar el pago.');
  };

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId, 'Cancelado por el administrador.');
    notify('ok', 'Pedido cancelado y existencias reservadas liberadas.');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.nombre?.trim()) return;
    const price = Number(editingProduct.precioBs);
    const stock = Number(editingProduct.stock);
    if (!Number.isFinite(price) || price <= 0) {
      notify('err', 'El precio debe ser mayor a 0.');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      notify('err', 'El stock no puede ser negativo.');
      return;
    }
    saveProduct({
      id: editingProduct.id,
      nombre: editingProduct.nombre.trim(),
      categoria: editingProduct.categoria || data.categories[0] || 'General',
      precioBs: price,
      stock,
      descripcion: editingProduct.descripcion?.trim() || '',
      imagen: editingProduct.imagen || PRESET_PRODUCT_PHOTOS[0],
      activo: editingProduct.activo !== false,
    });
    setEditingProduct(null);
    notify('ok', 'Producto guardado.');
  };

  const handleProductPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;
    const url = await readFileAsDataUrl(file);
    setEditingProduct({ ...editingProduct, imagen: url });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addCategory(newCategory);
    if (res.ok) {
      setNewCategory('');
      notify('ok', 'Categoría agregada.');
    } else {
      notify('err', res.error || 'No se pudo agregar.');
    }
  };

  const handleInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(invQty);
    const res = adjustInventory(invProductId, invType, qty, invReason);
    if (res.ok) {
      setInvReason('');
      notify('ok', `Movimiento de ${invType.toLowerCase()} registrado.`);
    } else {
      notify('err', res.error || 'Error en el ajuste de inventario.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex flex-wrap gap-1 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
          <button
            type="button"
            onClick={() => setTab('pedidos')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              tab === 'pedidos' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Pedidos ({data.orders.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('productos')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              tab === 'productos' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Productos y categorías ({data.products.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('inventario')}
            className={`px-4 py-2 text-sm font-medium rounded-[9px] ${
              tab === 'inventario' ? 'bg-[#FFFBF5] text-[#2B2118]' : 'text-[#5C4E41]'
            }`}
          >
            Inventario y movimientos
          </button>
        </div>

        {tab === 'productos' && (
          <button
            type="button"
            onClick={() =>
              setEditingProduct({
                nombre: '',
                categoria: data.categories[0] || 'Collares y correas',
                precioBs: 50,
                stock: 10,
                descripcion: '',
                imagen: PRESET_PRODUCT_PHOTOS[0],
                activo: true,
              })
            }
            className="px-4 py-2 btn-terracota text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Nuevo producto</span>
          </button>
        )}
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-[12px] border text-sm flex items-center gap-2 ${
            feedback.type === 'ok'
              ? 'bg-[#3F7D4E]/10 border-[#3F7D4E]/30 text-[#3F7D4E]'
              : 'bg-[#A33A2A]/10 border-[#A33A2A]/30 text-[#A33A2A]'
          }`}
        >
          {feedback.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* PEDIDOS */}
      {tab === 'pedidos' && (
        <div className="space-y-4">
          {data.orders.length === 0 ? (
            <div className="surface-arena p-8 text-center">
              <p className="text-base text-[#5C4E41]">Aún no se registraron pedidos en la tienda.</p>
            </div>
          ) : (
            data.orders.map((order) => (
              <article key={order.id} className="card-artesanal p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D9CBB3] pb-3">
                  <div>
                    <p className="text-sm text-[#5C4E41]">
                      <strong className="text-[#2B2118] tabular-nums">{order.codigo}</strong> ·{' '}
                      {formatDateEs(order.fecha)} ·{' '}
                      {order.metodoPago === 'transferencia'
                        ? 'Transferencia bancaria'
                        : 'Enlace externo'}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                      {order.comprador.nombre}
                    </h3>
                    <p className="text-sm text-[#5C4E41]">
                      {order.comprador.correo} ·{' '}
                      <span className="tabular-nums">{order.comprador.telefono}</span>
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <StatusLabel status={order.estado} />
                    <p className="font-display text-xl font-bold text-[#2B2118] tabular-nums">
                      {formatBs(order.totalBs)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-[#2B2118] mb-1">Artículos reservados:</p>
                    <ul className="space-y-1 text-[#5C4E41]">
                      {order.items.map((i) => (
                        <li key={i.productId} className="tabular-nums">
                          {i.cantidad} × {i.nombre} ({formatBs(i.precioBs * i.cantidad)})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-[#2B2118]">Comprobante / Referencia:</p>
                    {order.comprobanteNombre ? (
                      <p className="text-[#5C4E41]">Archivo: {order.comprobanteNombre}</p>
                    ) : order.enlacePagoRef ? (
                      <p className="text-[#5C4E41]">Ref.: {order.enlacePagoRef}</p>
                    ) : (
                      <p className="text-[#5C4E41]">Sin comprobante adjunto.</p>
                    )}
                    {order.comprobanteUrl && order.comprobanteUrl.startsWith('data:image') && (
                      <img
                        src={order.comprobanteUrl}
                        alt={`Comprobante de ${order.codigo}`}
                        className="mt-2 max-h-32 rounded-[8px] border border-[#D9CBB3]"
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D9CBB3]">
                  <div className="flex flex-wrap gap-2">
                    {order.estado === 'Pendiente de pago' && (
                      <button
                        type="button"
                        onClick={() => handleConfirmOrder(order.id)}
                        className="px-4 py-2 rounded-[10px] bg-[#3F7D4E] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                      >
                        Confirmar pago (Registrar salida)
                      </button>
                    )}
                    {order.estado !== 'Cancelado' && order.estado !== 'Entregado' && (
                      <button
                        type="button"
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 rounded-[10px] bg-[#A33A2A] text-[#FFFBF5] text-sm font-semibold hover:opacity-90"
                      >
                        Cancelar pedido (Liberar stock)
                      </button>
                    )}
                  </div>

                  {order.estado !== 'Pendiente de pago' && order.estado !== 'Cancelado' && (
                    <div className="flex items-center gap-2 text-sm">
                      <label htmlFor={`est-${order.id}`} className="text-[#5C4E41]">
                        Actualizar estado:
                      </label>
                      <select
                        id={`est-${order.id}`}
                        value={order.estado}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="px-3 py-1.5 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                      >
                        <option value="Pago confirmado">Pago confirmado</option>
                        <option value="En preparación">En preparación</option>
                        <option value="Listo para entrega">Listo para entrega</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                    </div>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* PRODUCTOS Y CATEGORÍAS */}
      {tab === 'productos' && (
        <div className="space-y-6">
          <div className="card-artesanal p-5 space-y-3">
            <h3 className="font-display text-lg font-semibold text-[#2F4B3A]">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {data.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#F6EFE4] border border-[#D9CBB3] text-sm"
                >
                  <span>{cat}</span>
                  <button
                    type="button"
                    onClick={() => deleteCategory(cat)}
                    aria-label={`Eliminar categoría ${cat}`}
                    className="text-[#A33A2A] hover:opacity-75"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <form onSubmit={handleAddCategory} className="flex gap-2 max-w-sm pt-1">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nueva categoría..."
                className="flex-1 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
              />
              <button type="submit" className="px-4 py-2 btn-bosque text-sm">
                Agregar
              </button>
            </form>
          </div>

          <div className="card-artesanal overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F6EFE4] border-b border-[#D9CBB3] text-[#5C4E41]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Producto</th>
                    <th className="py-3 px-4 font-semibold">Categoría</th>
                    <th className="py-3 px-4 font-semibold text-right">Precio</th>
                    <th className="py-3 px-4 font-semibold text-right">Físico / Reservado / Disp.</th>
                    <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CBB3]">
                  {data.products.map((p) => {
                    const disp = getAvailableStock(p);
                    return (
                      <tr key={p.id}>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-10 rounded-[8px] overflow-hidden border border-[#D9CBB3] shrink-0">
                              <SafeImage src={p.imagen} alt={p.nombre} />
                            </div>
                            <span className="font-semibold text-[#2B2118]">{p.nombre}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[#5C4E41]">{p.categoria}</td>
                        <td className="py-3 px-4 text-right tabular-nums font-medium">
                          {formatBs(p.precioBs)}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">
                          {p.stock} / {p.stockReservado} /{' '}
                          <strong className={disp <= 5 ? 'text-[#A33A2A]' : 'text-[#3F7D4E]'}>
                            {disp}
                          </strong>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 btn-secundario text-xs"
                          >
                            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#A33A2A] hover:bg-[#A33A2A]/10 rounded-[8px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INVENTARIO */}
      {tab === 'inventario' && (
        <div className="space-y-6">
          <form onSubmit={handleInventorySubmit} className="card-artesanal p-5 space-y-4">
            <h3 className="font-display text-lg font-semibold text-[#2F4B3A]">
              Registrar movimiento manual de inventario
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1">Producto</label>
                <select
                  value={invProductId}
                  onChange={(e) => setInvProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                >
                  {data.products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} (Disp: {getAvailableStock(p)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Tipo</label>
                <select
                  value={invType}
                  onChange={(e) => setInvType(e.target.value as 'Entrada' | 'Salida')}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                >
                  <option value="Entrada">Entrada (+)</option>
                  <option value="Salida">Salida (-)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={invQty}
                  onChange={(e) => setInvQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm tabular-nums"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={invReason}
                onChange={(e) => setInvReason(e.target.value)}
                placeholder="Motivo del movimiento (ej. Reposición de taller, venta presencial en feria)"
                className="flex-1 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
              />
              <button type="submit" className="px-5 py-2 btn-bosque text-sm whitespace-nowrap">
                Registrar movimiento
              </button>
            </div>
          </form>

          <div className="card-artesanal overflow-hidden">
            <div className="px-5 py-3.5 bg-[#F6EFE4] border-b border-[#D9CBB3]">
              <h3 className="font-display text-lg font-semibold text-[#2B2118]">
                Historial de entradas y salidas
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#D9CBB3] text-[#5C4E41]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Fecha</th>
                    <th className="py-2.5 px-4 font-semibold">Producto</th>
                    <th className="py-2.5 px-4 font-semibold">Tipo</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Cantidad</th>
                    <th className="py-2.5 px-4 font-semibold">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9CBB3]">
                  {data.inventoryMovements.map((mov) => (
                    <tr key={mov.id}>
                      <td className="py-2.5 px-4 text-[#5C4E41] tabular-nums">
                        {formatDateEs(mov.fecha)}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-[#2B2118]">
                        {mov.productNombre}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`font-semibold ${
                            mov.tipo === 'Entrada' ? 'text-[#3F7D4E]' : 'text-[#C4572F]'
                          }`}
                        >
                          {mov.tipo}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums font-semibold">
                        {mov.tipo === 'Entrada' ? `+${mov.cantidad}` : `-${mov.cantidad}`}
                      </td>
                      <td className="py-2.5 px-4 text-[#5C4E41]">{mov.motivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Producto */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2118]/50">
          <div className="w-full max-w-lg bg-[#FFFBF5] rounded-[12px] border border-[#D9CBB3] max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#F6EFE4] border-b border-[#D9CBB3] flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#2B2118]">
                {editingProduct.id ? 'Editar producto' : 'Nuevo producto'}
              </h3>
              <button type="button" onClick={() => setEditingProduct(null)} aria-label="Cerrar">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.nombre || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    value={editingProduct.categoria || data.categories[0]}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, categoria: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                  >
                    {data.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Precio (Bs) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingProduct.precioBs ?? ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, precioBs: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock físico *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingProduct.stock ?? 0}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fotografía</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={editingProduct.imagen || PRESET_PRODUCT_PHOTOS[0]}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, imagen: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                  >
                    {PRESET_PRODUCT_PHOTOS.map((p, i) => (
                      <option key={p} value={p}>
                        Foto catálogo #{i + 1}
                      </option>
                    ))}
                  </select>
                  <label className="px-3 py-2 btn-secundario text-xs cursor-pointer">
                    Subir imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductPhotoUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={editingProduct.descripcion || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, descripcion: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-[10px] bg-[#FFFBF5] border border-[#D9CBB3]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 btn-secundario text-sm"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 btn-terracota text-sm">
                  Guardar producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
