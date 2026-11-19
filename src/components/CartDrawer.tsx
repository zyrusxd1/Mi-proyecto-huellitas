import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Upload,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatBs, isValidEmail, isValidPhoneBolivia, readFileAsDataUrl } from '../utils/format';
import { SafeImage } from './SafeImage';

interface CartDrawerProps {
  onGoToStoreLookup: (code?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onGoToStoreLookup }) => {
  const {
    data,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    getAvailableStock,
    createOrder,
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [metodoPago, setMetodoPago] = useState<'transferencia' | 'enlace_externo'>('transferencia');
  const [comprobanteNombre, setComprobanteNombre] = useState('');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [enlacePagoRef, setEnlacePagoRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  const cartLines = cart
    .map((item) => {
      const product = data.products.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        product,
        cantidad: item.cantidad,
        available: getAvailableStock(product),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const subtotalBs = cartLines.reduce(
    (sum, line) => sum + line.product.precioBs * line.cantidad,
    0
  );

  const handleClose = () => {
    setIsCartOpen(false);
    setErrorMsg('');
    if (step === 'success') {
      setStep('cart');
      setConfirmedOrder(null);
    }
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
      setErrorMsg('No se pudo cargar el archivo seleccionado.');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!isValidEmail(correo)) {
      setErrorMsg('Ingresa un correo electrónico válido.');
      return;
    }
    if (!isValidPhoneBolivia(telefono)) {
      setErrorMsg('Ingresa un número de teléfono o celular válido (mínimo 7 dígitos).');
      return;
    }
    if (metodoPago === 'transferencia' && !comprobanteNombre) {
      setErrorMsg('Sube el comprobante de tu transferencia o QR para registrar el pedido.');
      return;
    }

    const res = createOrder({
      nombre,
      correo,
      telefono,
      metodoPago,
      comprobanteNombre: comprobanteNombre || undefined,
      comprobanteUrl: comprobanteUrl || undefined,
      enlacePagoRef: enlacePagoRef.trim() || undefined,
    });

    if (!res.ok || !res.order) {
      setErrorMsg(res.error || 'No se pudo procesar el pedido.');
      return;
    }

    setConfirmedOrder(res.order);
    setStep('success');
    setNombre('');
    setCorreo('');
    setTelefono('');
    setComprobanteNombre('');
    setComprobanteUrl('');
    setEnlacePagoRef('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#2B2118]/45"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de tienda solidaria"
    >
      <div className="relative w-full max-w-lg bg-[#FFFBF5] h-full flex flex-col border-l border-[#D9CBB3] shadow-xl">
        <div className="px-6 py-4 border-b border-[#D9CBB3] flex items-center justify-between bg-[#F6EFE4]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#2F4B3A]" strokeWidth={1.75} aria-hidden="true" />
            <h2 className="font-display text-xl font-semibold text-[#2B2118]">
              {step === 'cart' && 'Tu carrito solidario'}
              {step === 'checkout' && 'Finalizar pedido'}
              {step === 'success' && 'Pedido registrado'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar carrito"
            className="w-10 h-10 inline-flex items-center justify-center rounded-[12px] text-[#2B2118] hover:bg-[#EADFCB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {errorMsg && (
            <div
              role="alert"
              className="mb-4 p-3.5 rounded-[12px] bg-[#A33A2A]/10 border border-[#A33A2A]/30 text-[#A33A2A] text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'success' && confirmedOrder ? (
            <div className="space-y-5">
              <div className="p-5 rounded-[12px] bg-[#3F7D4E]/10 border border-[#3F7D4E]/30">
                <div className="flex items-center gap-2 text-[#3F7D4E] font-semibold text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                  <span>Pedido reservado correctamente</span>
                </div>
                <p className="mt-2 text-sm text-[#2B2118]">
                  Tu código privado de seguimiento es:
                </p>
                <p className="mt-1 font-display text-3xl font-bold text-[#2F4B3A] tabular-nums tracking-tight">
                  {confirmedOrder.codigo}
                </p>
                <p className="mt-2 text-sm text-[#5C4E41]">
                  Guarda este código junto con tu correo ({confirmedOrder.comprador.correo}) para
                  consultar el estado en la sección «Consultar mi pedido».
                </p>
              </div>

              <div className="p-4 rounded-[12px] bg-[#EADFCB]/60 border border-[#D9CBB3] text-sm text-[#2B2118]">
                <p className="font-semibold">Importante sobre la confirmación</p>
                <p className="mt-1 text-[#5C4E41]">
                  El pago lo confirma la Asociación manualmente. El sistema no verifica pagos.
                </p>
              </div>

              <div className="border-t border-[#D9CBB3] pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#5C4E41]">Estado actual</span>
                  <span className="font-semibold text-[#B7791F]">{confirmedOrder.estado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C4E41]">Total reservado</span>
                  <span className="font-semibold tabular-nums">{formatBs(confirmedOrder.totalBs)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const code = confirmedOrder.codigo;
                  handleClose();
                  onGoToStoreLookup(code);
                }}
                className="w-full py-3 px-4 btn-bosque text-base"
              >
                Consultar mi pedido en la tienda
              </button>
            </div>
          ) : cartLines.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <p className="font-display text-xl text-[#2B2118]">Tu carrito está vacío</p>
              <p className="text-sm text-[#5C4E41] max-w-xs mx-auto">
                Cada compra en nuestra tienda artesanal ayuda a financiar vacunas y alimento para
                los animales rescatados en La Paz.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-5 py-2.5 btn-secundario text-sm"
              >
                Seguir viendo productos
              </button>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {cartLines.map(({ product, cantidad, available }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-[12px] bg-[#F6EFE4] border border-[#D9CBB3]"
                >
                  <div className="w-20 h-20 rounded-[8px] overflow-hidden shrink-0 border border-[#D9CBB3]">
                    <SafeImage src={product.imagen} alt={product.nombre} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base text-[#2B2118] truncate">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-[#5C4E41] tabular-nums">
                      {formatBs(product.precioBs)} c/u · {available} disp.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D9CBB3] rounded-[10px] bg-[#FFFBF5]">
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMsg('');
                            updateCartQty(product.id, cantidad - 1);
                          }}
                          aria-label={`Reducir cantidad de ${product.nombre}`}
                          className="w-8 h-8 inline-flex items-center justify-center hover:bg-[#EADFCB] rounded-l-[10px]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-sm font-semibold tabular-nums">{cantidad}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const res = updateCartQty(product.id, cantidad + 1);
                            if (!res.ok && res.error) setErrorMsg(res.error);
                            else setErrorMsg('');
                          }}
                          aria-label={`Aumentar cantidad de ${product.nombre}`}
                          className="w-8 h-8 inline-flex items-center justify-center hover:bg-[#EADFCB] rounded-r-[10px]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Quitar ${product.nombre} del carrito`}
                        className="text-sm text-[#A33A2A] hover:underline inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        <span>Quitar</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="p-3.5 rounded-[12px] bg-[#EADFCB]/60 border border-[#D9CBB3] text-sm text-[#2B2118]">
                El pago lo confirma la Asociación manualmente. El sistema no verifica pagos.
              </div>

              <div>
                <label htmlFor="chk-nombre" className="block text-sm font-medium text-[#2B2118] mb-1">
                  Nombre completo *
                </label>
                <input
                  id="chk-nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Mariana Quispe Mamani"
                  className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="chk-correo" className="block text-sm font-medium text-[#2B2118] mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    id="chk-correo"
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="nombre@correo.bo"
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                  />
                </div>
                <div>
                  <label htmlFor="chk-tel" className="block text-sm font-medium text-[#2B2118] mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    id="chk-tel"
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="71500000"
                    className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
                  />
                </div>
              </div>

              <fieldset className="pt-2">
                <legend className="text-sm font-medium text-[#2B2118] mb-2">
                  Método de pago *
                </legend>
                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 p-3.5 rounded-[12px] border border-[#D9CBB3] bg-[#F6EFE4] cursor-pointer">
                    <input
                      type="radio"
                      name="metodoPago"
                      checked={metodoPago === 'transferencia'}
                      onChange={() => setMetodoPago('transferencia')}
                      className="mt-1 accent-[#C4572F]"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-[#2B2118] block">
                        Transferencia bancaria o QR
                      </span>
                      <span className="text-[#5C4E41] block mt-0.5">
                        {data.institution.bancoNombre} · Cta. {data.institution.bancoCuenta} (
                        {data.institution.bancoTitular})
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-[12px] border border-[#D9CBB3] bg-[#F6EFE4] cursor-pointer">
                    <input
                      type="radio"
                      name="metodoPago"
                      checked={metodoPago === 'enlace_externo'}
                      onChange={() => setMetodoPago('enlace_externo')}
                      className="mt-1 accent-[#C4572F]"
                    />
                    <div className="text-sm">
                      <span className="font-semibold text-[#2B2118] block">
                        Enlace de pago externo (opcional)
                      </span>
                      <span className="text-[#5C4E41] block mt-0.5">
                        Paga mediante pasarela externa y registra tu referencia de operación.
                      </span>
                    </div>
                  </label>
                </div>
              </fieldset>

              {metodoPago === 'transferencia' ? (
                <div>
                  <label
                    htmlFor="chk-comprobante"
                    className="block text-sm font-medium text-[#2B2118] mb-1"
                  >
                    Subir comprobante de transferencia *
                  </label>
                  <label
                    htmlFor="chk-comprobante"
                    className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-[12px] border border-dashed border-[#D9CBB3] bg-[#F6EFE4] hover:bg-[#EADFCB] cursor-pointer text-sm font-medium text-[#2B2118] transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#C4572F]" aria-hidden="true" />
                    <span>
                      {comprobanteNombre
                        ? `Archivo: ${comprobanteNombre}`
                        : 'Seleccionar imagen o captura del comprobante'}
                    </span>
                  </label>
                  <input
                    id="chk-comprobante"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </div>
              ) : (
                <div className="space-y-3 p-3.5 rounded-[12px] bg-[#F6EFE4] border border-[#D9CBB3]">
                  <a
                    href={data.institution.enlacePagoExterno}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C4572F] hover:underline"
                  >
                    <span>Ir al enlace de pago externo</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <div>
                    <label
                      htmlFor="chk-ref"
                      className="block text-sm font-medium text-[#2B2118] mb-1"
                    >
                      Número o referencia de transacción (opcional)
                    </label>
                    <input
                      id="chk-ref"
                      type="text"
                      value={enlacePagoRef}
                      onChange={(e) => setEnlacePagoRef(e.target.value)}
                      placeholder="Ej. REF-993812"
                      className="w-full px-3.5 py-2 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-sm"
                    />
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {cartLines.length > 0 && step !== 'success' && (
          <div className="px-6 py-4 border-t border-[#D9CBB3] bg-[#F6EFE4] space-y-3">
            <div className="flex items-center justify-between text-base">
              <span className="font-medium text-[#5C4E41]">Total a pagar</span>
              <span className="font-display text-2xl font-bold text-[#2B2118] tabular-nums">
                {formatBs(subtotalBs)}
              </span>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setStep('checkout');
                }}
                className="w-full py-3 px-4 btn-terracota text-base"
              >
                Continuar con el pedido
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setStep('cart');
                  }}
                  className="px-4 py-3 btn-secundario text-sm"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-3 px-4 btn-terracota text-base"
                >
                  Enviar pedido y reservar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
