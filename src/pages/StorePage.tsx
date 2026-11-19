import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, CheckCircle2, AlertCircle, PackageCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { formatBs, formatDateEs } from '../utils/format';
import { SafeImage } from '../components/SafeImage';
import { StatusLabel } from '../components/StatusLabel';

interface StorePageProps {
  lookupCodePrefill?: string;
}

export const StorePage: React.FC<StorePageProps> = ({ lookupCodePrefill }) => {
  const { data, addToCart, getAvailableStock, setIsCartOpen } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Order lookup states
  const [lookupCode, setLookupCode] = useState(lookupCodePrefill || '');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupResult, setLookupResult] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (lookupCodePrefill) {
      setLookupCode(lookupCodePrefill);
      const section = document.getElementById('consultar-pedido');
      section?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lookupCodePrefill]);

  const activeProducts = data.products.filter((p) => p.activo);
  const filteredProducts = activeProducts.filter((p) => {
    if (selectedCategory !== 'Todos' && p.categoria !== selectedCategory) return false;
    if (
      search.trim() &&
      !`${p.nombre} ${p.descripcion} ${p.categoria}`.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleAdd = (productId: string, nombre: string) => {
    const res = addToCart(productId, 1);
    if (res.ok) {
      setFeedback({ type: 'ok', text: `Se agregó "${nombre}" a tu carrito.` });
    } else {
      setFeedback({ type: 'err', text: res.error || 'No se pudo agregar el producto.' });
    }
  };

  const handleLookupOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError('');
    setLookupResult(null);

    const codeClean = lookupCode.trim().toUpperCase();
    const emailClean = lookupEmail.trim().toLowerCase();

    if (!codeClean || !emailClean) {
      setLookupError('Ingresa el código de pedido (HB-XXXXXX) y el correo con el que compraste.');
      return;
    }

    const found = data.orders.find(
      (o) =>
        o.codigo.toUpperCase() === codeClean &&
        o.comprador.correo.toLowerCase() === emailClean
    );

    if (!found) {
      setLookupError(
        'No encontramos un pedido con esa combinación de código y correo. Verifica los datos.'
      );
      return;
    }
    setLookupResult(found);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="border-b border-[#D9CBB3] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2F4B3A]">
            Tienda solidaria
          </h1>
          <p className="mt-2 text-base text-[#5C4E41] max-w-2xl">
            Productos hechos con talleres artesanales bolivianos en bolivianos (Bs). Al confirmar tu
            pedido, las existencias quedan reservadas para ti.
          </p>
        </div>

        <p className="text-sm text-[#5C4E41] bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px] px-4 py-2.5 max-w-sm">
          El pago lo confirma la Asociación manualmente. El sistema no verifica pagos.
        </p>
      </div>

      {/* Búsqueda y categorías */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="w-4 h-4 text-[#5C4E41] absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar collares, tazas, camisetas..."
            aria-label="Buscar productos en la tienda"
            className="w-full pl-10 pr-4 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-[#EADFCB] border border-[#D9CBB3] rounded-[12px]">
          {['Todos', ...data.categories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-sm font-medium rounded-[9px] whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#FFFBF5] text-[#2B2118] shadow-xs'
                  : 'text-[#5C4E41] hover:text-[#2B2118]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-[12px] border flex flex-wrap items-center justify-between gap-3 text-sm ${
            feedback.type === 'ok'
              ? 'bg-[#3F7D4E]/10 border-[#3F7D4E]/30 text-[#3F7D4E]'
              : 'bg-[#A33A2A]/10 border-[#A33A2A]/30 text-[#A33A2A]'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {feedback.type === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{feedback.text}</span>
          </div>
          {feedback.type === 'ok' && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="font-semibold underline underline-offset-4 text-[#2F4B3A]"
            >
              Ver carrito y finalizar pedido
            </button>
          )}
        </div>
      )}

      {/* Grilla de productos */}
      {filteredProducts.length === 0 ? (
        <div className="surface-arena p-10 text-center space-y-3">
          <p className="font-display text-xl text-[#2B2118]">
            No hay productos que coincidan con tu búsqueda
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('Todos');
            }}
            className="px-5 py-2.5 btn-secundario text-sm"
          >
            Ver todo el catálogo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const available = getAvailableStock(product);
            const outOfStock = available <= 0;
            return (
              <article key={product.id} className="card-artesanal overflow-hidden flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-[#EADFCB]">
                  <SafeImage src={product.imagen} alt={product.nombre} />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-medium text-[#5C4E41]">{product.categoria}</p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-[#2B2118] leading-snug">
                    {product.nombre}
                  </h2>
                  <p className="mt-2 text-sm text-[#5C4E41] line-clamp-2 flex-1">
                    {product.descripcion}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D9CBB3]/70 flex items-baseline justify-between">
                    <span className="font-display text-xl font-bold text-[#2B2118] tabular-nums">
                      {formatBs(product.precioBs)}
                    </span>
                    <span
                      className={`text-xs font-medium tabular-nums ${
                        outOfStock ? 'text-[#A33A2A]' : 'text-[#3F7D4E]'
                      }`}
                    >
                      {outOfStock ? 'Agotado' : `${available} disponibles`}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={outOfStock}
                    onClick={() => handleAdd(product.id, product.nombre)}
                    className={`mt-3 w-full py-2.5 px-4 text-sm inline-flex items-center justify-center gap-2 ${
                      outOfStock
                        ? 'rounded-[12px] bg-[#EADFCB] text-[#5C4E41] cursor-not-allowed'
                        : 'btn-terracota'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span>{outOfStock ? 'Sin existencias' : 'Agregar al carrito'}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Consultar mi pedido */}
      <section
        id="consultar-pedido"
        className="surface-arena p-6 sm:p-8 lg:p-10 space-y-6"
        aria-labelledby="titulo-consulta-pedido"
      >
        <div className="max-w-2xl">
          <h2 id="titulo-consulta-pedido" className="font-display text-2xl font-semibold text-[#2F4B3A]">
            Consultar mi pedido
          </h2>
          <p className="mt-1.5 text-base text-[#5C4E41]">
            Ingresa el código privado entregado al finalizar tu compra (formato HB-XXXXXX) y tu
            correo electrónico. Recuerda que el pago lo confirma la Asociación manualmente.
          </p>
        </div>

        <form onSubmit={handleLookupOrder} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="lookup-code" className="block text-sm font-medium text-[#2B2118] mb-1">
              Código de pedido
            </label>
            <input
              id="lookup-code"
              type="text"
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="Ej. HB-482910"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base uppercase tabular-nums"
            />
          </div>
          <div>
            <label htmlFor="lookup-email" className="block text-sm font-medium text-[#2B2118] mb-1">
              Correo electrónico
            </label>
            <input
              id="lookup-email"
              type="email"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              placeholder="tu@correo.bo"
              className="w-full px-3.5 py-2.5 rounded-[12px] bg-[#FFFBF5] border border-[#D9CBB3] text-base"
            />
          </div>
          <button type="submit" className="py-2.5 px-6 btn-bosque text-base h-[46px]">
            Buscar pedido
          </button>
        </form>

        {lookupError && (
          <div
            role="alert"
            className="p-3.5 rounded-[12px] bg-[#A33A2A]/10 border border-[#A33A2A]/30 text-[#A33A2A] text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{lookupError}</span>
          </div>
        )}

        {lookupResult && (
          <div className="card-artesanal p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9CBB3] pb-4">
              <div>
                <p className="text-sm text-[#5C4E41]">
                  Pedido <strong className="text-[#2B2118] tabular-nums">{lookupResult.codigo}</strong> ·{' '}
                  {formatDateEs(lookupResult.fecha)}
                </p>
                <p className="font-display text-xl font-semibold text-[#2B2118] mt-0.5">
                  {lookupResult.comprador.nombre}
                </p>
              </div>
              <StatusLabel status={lookupResult.estado} />
            </div>

            <ul className="space-y-2 text-sm">
              {lookupResult.items.map((item) => (
                <li key={item.productId} className="flex justify-between">
                  <span>
                    {item.cantidad} × {item.nombre}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatBs(item.precioBs * item.cantidad)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-[#D9CBB3] flex flex-wrap items-center justify-between gap-2 text-base">
              <span className="text-[#5C4E41] inline-flex items-center gap-1.5 text-sm">
                <PackageCheck className="w-4 h-4 text-[#2F4B3A]" aria-hidden="true" />
                Método: {lookupResult.metodoPago === 'transferencia' ? 'Transferencia / QR' : 'Enlace externo'}
              </span>
              <span className="font-display text-xl font-bold text-[#2B2118] tabular-nums">
                Total: {formatBs(lookupResult.totalBs)}
              </span>
            </div>

            {lookupResult.notasAdmin && (
              <p className="text-sm text-[#5C4E41] bg-[#F6EFE4] p-3 rounded-[10px] border border-[#D9CBB3]">
                Nota del refugio: {lookupResult.notasAdmin}
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
