import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_DATA } from '../data/seedData';
import {
  AdoptionApplication,
  AdoptionFollowUp,
  AdoptionStatus,
  Animal,
  AppDataState,
  Campaign,
  CartItem,
  CommunitySubmission,
  Donation,
  InstitutionInfo,
  NewsArticle,
  Order,
  OrderStatus,
  Product,
} from '../types';
import { generateId, generateOrderCode } from '../utils/format';

const STORAGE_DATA_KEY = 'huellitas_bolivia_data_v1';
const STORAGE_CART_KEY = 'huellitas_bolivia_cart_v1';
const STORAGE_ADMIN_KEY = 'huellitas_bolivia_admin_v1';

interface CreateOrderPayload {
  nombre: string;
  correo: string;
  telefono: string;
  metodoPago: 'transferencia' | 'enlace_externo';
  comprobanteNombre?: string;
  comprobanteUrl?: string;
  enlacePagoRef?: string;
}

interface AppContextValue {
  data: AppDataState;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, password: string) => { ok: boolean; error?: string };
  logoutAdmin: () => void;

  // Cart actions
  addToCart: (productId: string, qty?: number) => { ok: boolean; error?: string };
  updateCartQty: (productId: string, qty: number) => { ok: boolean; error?: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getAvailableStock: (product: Product) => number;

  // Public submissions
  submitAdoption: (
    payload: Omit<AdoptionApplication, 'id' | 'estado' | 'fechaSolicitud' | 'seguimientos'>
  ) => AdoptionApplication;
  createOrder: (payload: CreateOrderPayload) => { ok: boolean; order?: Order; error?: string };
  submitDonation: (
    payload: Omit<Donation, 'id' | 'estado' | 'fecha'>
  ) => Donation;
  submitCommunity: (
    payload: Omit<CommunitySubmission, 'id' | 'estado' | 'fecha'>
  ) => CommunitySubmission;

  // Admin: Animals & News
  saveAnimal: (animal: Omit<Animal, 'id'> & { id?: string }) => void;
  deleteAnimal: (id: string) => void;
  saveNews: (article: Omit<NewsArticle, 'id'> & { id?: string }) => void;
  deleteNews: (id: string) => void;

  // Admin: Adoptions
  updateAdoption: (
    id: string,
    updates: Partial<Pick<AdoptionApplication, 'estado' | 'fechaEntrevista' | 'notasEntrevista' | 'motivoDecision'>>
  ) => void;
  registerAdoptionCompletion: (adoptionId: string, notasEntrega: string) => void;
  addAdoptionFollowUp: (adoptionId: string, followUp: Omit<AdoptionFollowUp, 'id'>) => void;

  // Admin: Store, Inventory, Orders
  saveProduct: (product: Omit<Product, 'id' | 'stockReservado'> & { id?: string }) => void;
  deleteProduct: (id: string) => void;
  addCategory: (cat: string) => { ok: boolean; error?: string };
  deleteCategory: (cat: string) => void;
  adjustInventory: (
    productId: string,
    tipo: 'Entrada' | 'Salida',
    cantidad: number,
    motivo: string
  ) => { ok: boolean; error?: string };
  confirmOrderPayment: (orderId: string) => { ok: boolean; error?: string };
  cancelOrder: (orderId: string, motivo?: string) => void;
  updateOrderStatus: (orderId: string, estado: OrderStatus, notasAdmin?: string) => void;

  // Admin: Campaigns & Donations
  saveCampaign: (campaign: Omit<Campaign, 'id'> & { id?: string }) => void;
  deleteCampaign: (id: string) => void;
  reviewDonation: (donationId: string, estado: 'Confirmada' | 'Rechazada', notasAdmin?: string) => void;

  // Admin: Community & Institution
  moderateCommunity: (id: string, estado: 'Aprobada' | 'Rechazada', respuestaAdmin?: string) => void;
  deleteCommunity: (id: string) => void;
  updateInstitution: (info: InstitutionInfo) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function loadStoredData(): AppDataState {
  try {
    const raw = localStorage.getItem(STORAGE_DATA_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw) as Partial<AppDataState>;
    return {
      ...INITIAL_DATA,
      ...parsed,
      institution: { ...INITIAL_DATA.institution, ...(parsed.institution || {}) },
    };
  } catch {
    return INITIAL_DATA;
  }
}

function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppDataState>(loadStoredData);
  const [cart, setCart] = useState<CartItem[]>(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_ADMIN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors gracefully
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ADMIN_KEY, isAdminLoggedIn ? 'true' : 'false');
    } catch {
      // Ignore
    }
  }, [isAdminLoggedIn]);

  const todayIso = () => new Date().toISOString().slice(0, 10);

  const getAvailableStock = (product: Product) => {
    return Math.max(0, product.stock - (product.stockReservado || 0));
  };

  const loginAdmin = (email: string, password: string) => {
    if (email.trim().toLowerCase() === 'admin@huellitas.bo' && password === 'demo1234') {
      setIsAdminLoggedIn(true);
      return { ok: true };
    }
    return {
      ok: false,
      error: 'Credenciales incorrectas. Usa admin@huellitas.bo y demo1234.',
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const addToCart = (productId: string, qty = 1) => {
    if (qty <= 0) return { ok: false, error: 'La cantidad debe ser mayor a cero.' };
    const product = data.products.find((p) => p.id === productId);
    if (!product || !product.activo) {
      return { ok: false, error: 'Producto no disponible.' };
    }
    const available = getAvailableStock(product);
    const existing = cart.find((c) => c.productId === productId);
    const nextQty = (existing?.cantidad || 0) + qty;
    if (nextQty > available) {
      return {
        ok: false,
        error: `Solo quedan ${available} unidades disponibles de "${product.nombre}".`,
      };
    }
    setCart((prev) => {
      if (existing) {
        return prev.map((c) => (c.productId === productId ? { ...c, cantidad: nextQty } : c));
      }
      return [...prev, { productId, cantidad: qty }];
    });
    return { ok: true };
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return { ok: true };
    }
    const product = data.products.find((p) => p.id === productId);
    if (!product) return { ok: false, error: 'Producto no encontrado.' };
    const available = getAvailableStock(product);
    if (qty > available) {
      return {
        ok: false,
        error: `No puedes superar las ${available} unidades disponibles.`,
      };
    }
    setCart((prev) => prev.map((c) => (c.productId === productId ? { ...c, cantidad: qty } : c)));
    return { ok: true };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  };

  const clearCart = () => setCart([]);

  const submitAdoption: AppContextValue['submitAdoption'] = (payload) => {
    const newApp: AdoptionApplication = {
      ...payload,
      id: generateId('ado'),
      estado: 'Recibida',
      fechaSolicitud: todayIso(),
      seguimientos: [],
    };
    setData((prev) => ({
      ...prev,
      adoptions: [newApp, ...prev.adoptions],
      animals: prev.animals.map((a) =>
        a.id === payload.animalId && a.estado === 'Disponible'
          ? { ...a, estado: 'En proceso' }
          : a
      ),
    }));
    return newApp;
  };

  const createOrder: AppContextValue['createOrder'] = (payload) => {
    if (cart.length === 0) {
      return { ok: false, error: 'Tu carrito está vacío.' };
    }

    const orderItems: Order['items'] = [];
    for (const item of cart) {
      const product = data.products.find((p) => p.id === item.productId);
      if (!product) {
        return { ok: false, error: 'Uno de los productos ya no está disponible.' };
      }
      const available = getAvailableStock(product);
      if (item.cantidad <= 0 || item.cantidad > available) {
        return {
          ok: false,
          error: `Stock insuficiente para "${product.nombre}". Disponibles: ${available}.`,
        };
      }
      orderItems.push({
        productId: product.id,
        nombre: product.nombre,
        precioBs: product.precioBs,
        cantidad: item.cantidad,
      });
    }

    const totalBs = orderItems.reduce((sum, i) => sum + i.precioBs * i.cantidad, 0);
    let codigo = generateOrderCode();
    const existingCodes = new Set(data.orders.map((o) => o.codigo));
    while (existingCodes.has(codigo)) {
      codigo = generateOrderCode();
    }

    const newOrder: Order = {
      id: generateId('ord'),
      codigo,
      comprador: {
        nombre: payload.nombre.trim(),
        correo: payload.correo.trim(),
        telefono: payload.telefono.trim(),
      },
      items: orderItems,
      totalBs,
      metodoPago: payload.metodoPago,
      comprobanteNombre: payload.comprobanteNombre,
      comprobanteUrl: payload.comprobanteUrl,
      enlacePagoRef: payload.enlacePagoRef,
      estado: 'Pendiente de pago',
      fecha: todayIso(),
    };

    setData((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      products: prev.products.map((p) => {
        const ordered = orderItems.find((i) => i.productId === p.id);
        if (!ordered) return p;
        return {
          ...p,
          stockReservado: (p.stockReservado || 0) + ordered.cantidad,
        };
      }),
    }));

    setCart([]);
    return { ok: true, order: newOrder };
  };

  const submitDonation: AppContextValue['submitDonation'] = (payload) => {
    const newDonation: Donation = {
      ...payload,
      id: generateId('don'),
      estado: 'Pendiente',
      fecha: todayIso(),
    };
    setData((prev) => ({
      ...prev,
      donations: [newDonation, ...prev.donations],
    }));
    return newDonation;
  };

  const submitCommunity: AppContextValue['submitCommunity'] = (payload) => {
    const newSub: CommunitySubmission = {
      ...payload,
      id: generateId('com'),
      estado: 'Pendiente',
      fecha: todayIso(),
    };
    setData((prev) => ({
      ...prev,
      community: [newSub, ...prev.community],
    }));
    return newSub;
  };

  const saveAnimal: AppContextValue['saveAnimal'] = (animal) => {
    setData((prev) => {
      if (animal.id) {
        return {
          ...prev,
          animals: prev.animals.map((a) => (a.id === animal.id ? { ...a, ...animal, id: animal.id } : a)),
        };
      }
      const created: Animal = {
        ...animal,
        id: generateId('ani'),
      };
      return {
        ...prev,
        animals: [created, ...prev.animals],
      };
    });
  };

  const deleteAnimal = (id: string) => {
    setData((prev) => ({
      ...prev,
      animals: prev.animals.filter((a) => a.id !== id),
    }));
  };

  const saveNews: AppContextValue['saveNews'] = (article) => {
    setData((prev) => {
      if (article.id) {
        return {
          ...prev,
          news: prev.news.map((n) => (n.id === article.id ? { ...n, ...article, id: article.id } : n)),
        };
      }
      const created: NewsArticle = {
        ...article,
        id: generateId('not'),
      };
      return {
        ...prev,
        news: [created, ...prev.news],
      };
    });
  };

  const deleteNews = (id: string) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.filter((n) => n.id !== id),
    }));
  };

  const updateAdoption: AppContextValue['updateAdoption'] = (id, updates) => {
    setData((prev) => {
      const target = prev.adoptions.find((a) => a.id === id);
      const nextAdoptions = prev.adoptions.map((a) => (a.id === id ? { ...a, ...updates } : a));
      let nextAnimals = prev.animals;

      if (target && updates.estado === 'Rechazada') {
        const otherActive = nextAdoptions.some(
          (a) => a.id !== id && a.animalId === target.animalId && (a.estado === 'Recibida' || a.estado === 'En revisión' || a.estado === 'Aprobada')
        );
        if (!otherActive) {
          nextAnimals = prev.animals.map((ani) =>
            ani.id === target.animalId && ani.estado === 'En proceso'
              ? { ...ani, estado: 'Disponible' }
              : ani
          );
        }
      } else if (target && (updates.estado === 'En revisión' || updates.estado === 'Aprobada')) {
        nextAnimals = prev.animals.map((ani) =>
          ani.id === target.animalId && ani.estado === 'Disponible'
            ? { ...ani, estado: 'En proceso' }
            : ani
        );
      }

      return {
        ...prev,
        adoptions: nextAdoptions,
        animals: nextAnimals,
      };
    });
  };

  const registerAdoptionCompletion = (adoptionId: string, notasEntrega: string) => {
    setData((prev) => {
      const target = prev.adoptions.find((a) => a.id === adoptionId);
      if (!target) return prev;
      return {
        ...prev,
        adoptions: prev.adoptions.map((a) =>
          a.id === adoptionId
            ? {
                ...a,
                estado: 'Aprobada' as AdoptionStatus,
                adopcionRegistrada: {
                  fechaAdopcion: todayIso(),
                  notasEntrega: notasEntrega.trim() || 'Entrega formal con contrato de tenencia responsable.',
                },
              }
            : a
        ),
        animals: prev.animals.map((ani) =>
          ani.id === target.animalId ? { ...ani, estado: 'Adoptado' } : ani
        ),
      };
    });
  };

  const addAdoptionFollowUp = (adoptionId: string, followUp: Omit<AdoptionFollowUp, 'id'>) => {
    setData((prev) => ({
      ...prev,
      adoptions: prev.adoptions.map((a) =>
        a.id === adoptionId
          ? {
              ...a,
              seguimientos: [{ ...followUp, id: generateId('seg') }, ...a.seguimientos],
            }
          : a
      ),
    }));
  };

  const saveProduct: AppContextValue['saveProduct'] = (product) => {
    setData((prev) => {
      if (product.id) {
        return {
          ...prev,
          products: prev.products.map((p) =>
            p.id === product.id ? { ...p, ...product, id: product.id } : p
          ),
        };
      }
      const created: Product = {
        ...product,
        id: generateId('prd'),
        stockReservado: 0,
      };
      return {
        ...prev,
        products: [created, ...prev.products],
        inventoryMovements:
          created.stock > 0
            ? [
                {
                  id: generateId('mov'),
                  productId: created.id,
                  productNombre: created.nombre,
                  tipo: 'Entrada',
                  cantidad: created.stock,
                  motivo: 'Stock inicial al crear producto',
                  fecha: todayIso(),
                },
                ...prev.inventoryMovements,
              ]
            : prev.inventoryMovements,
      };
    });
  };

  const deleteProduct = (id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
    setCart((prev) => prev.filter((c) => c.productId !== id));
  };

  const addCategory = (cat: string) => {
    const clean = cat.trim();
    if (!clean) return { ok: false, error: 'Ingresa un nombre de categoría.' };
    if (data.categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      return { ok: false, error: 'Esa categoría ya existe.' };
    }
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, clean],
    }));
    return { ok: true };
  };

  const deleteCategory = (cat: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const adjustInventory: AppContextValue['adjustInventory'] = (
    productId,
    tipo,
    cantidad,
    motivo
  ) => {
    if (cantidad <= 0) return { ok: false, error: 'La cantidad debe ser positiva.' };
    const product = data.products.find((p) => p.id === productId);
    if (!product) return { ok: false, error: 'Producto no encontrado.' };

    if (tipo === 'Salida') {
      const available = getAvailableStock(product);
      if (cantidad > available) {
        return {
          ok: false,
          error: `No puedes retirar ${cantidad} unidades. Disponibles sin reserva: ${available}.`,
        };
      }
    }

    setData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: tipo === 'Entrada' ? p.stock + cantidad : p.stock - cantidad,
            }
          : p
      ),
      inventoryMovements: [
        {
          id: generateId('mov'),
          productId: product.id,
          productNombre: product.nombre,
          tipo,
          cantidad,
          motivo: motivo.trim() || (tipo === 'Entrada' ? 'Ingreso manual' : 'Salida manual'),
          fecha: todayIso(),
        },
        ...prev.inventoryMovements,
      ],
    }));
    return { ok: true };
  };

  const confirmOrderPayment = (orderId: string) => {
    const order = data.orders.find((o) => o.id === orderId);
    if (!order) return { ok: false, error: 'Pedido no encontrado.' };
    if (order.estado !== 'Pendiente de pago') {
      return { ok: false, error: 'Solo se pueden confirmar pedidos pendientes de pago.' };
    }

    setData((prev) => {
      const newMovements = order.items.map((item) => ({
        id: generateId('mov'),
        productId: item.productId,
        productNombre: item.nombre,
        tipo: 'Salida' as const,
        cantidad: item.cantidad,
        motivo: `Pago confirmado pedido ${order.codigo}`,
        fecha: todayIso(),
        orderCode: order.codigo,
      }));

      return {
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId ? { ...o, estado: 'Pago confirmado' } : o
        ),
        products: prev.products.map((p) => {
          const item = order.items.find((i) => i.productId === p.id);
          if (!item) return p;
          return {
            ...p,
            stock: Math.max(0, p.stock - item.cantidad),
            stockReservado: Math.max(0, (p.stockReservado || 0) - item.cantidad),
          };
        }),
        inventoryMovements: [...newMovements, ...prev.inventoryMovements],
      };
    });
    return { ok: true };
  };

  const cancelOrder = (orderId: string, motivo?: string) => {
    setData((prev) => {
      const order = prev.orders.find((o) => o.id === orderId);
      if (!order || order.estado === 'Cancelado') return prev;

      const wasPendingPayment = order.estado === 'Pendiente de pago';
      const wasDeducted =
        order.estado === 'Pago confirmado' ||
        order.estado === 'En preparación' ||
        order.estado === 'Listo para entrega';

      const returnMovements = wasDeducted
        ? order.items.map((item) => ({
            id: generateId('mov'),
            productId: item.productId,
            productNombre: item.nombre,
            tipo: 'Entrada' as const,
            cantidad: item.cantidad,
            motivo: `Devolución por cancelación de pedido ${order.codigo}`,
            fecha: todayIso(),
            orderCode: order.codigo,
          }))
        : [];

      return {
        ...prev,
        orders: prev.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                estado: 'Cancelado',
                notasAdmin: motivo || o.notasAdmin,
              }
            : o
        ),
        products: prev.products.map((p) => {
          const item = order.items.find((i) => i.productId === p.id);
          if (!item) return p;
          if (wasPendingPayment) {
            return {
              ...p,
              stockReservado: Math.max(0, (p.stockReservado || 0) - item.cantidad),
            };
          }
          if (wasDeducted) {
            return {
              ...p,
              stock: p.stock + item.cantidad,
            };
          }
          return p;
        }),
        inventoryMovements: [...returnMovements, ...prev.inventoryMovements],
      };
    });
  };

  const updateOrderStatus = (orderId: string, estado: OrderStatus, notasAdmin?: string) => {
    setData((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId
          ? { ...o, estado, notasAdmin: notasAdmin !== undefined ? notasAdmin : o.notasAdmin }
          : o
      ),
    }));
  };

  const saveCampaign: AppContextValue['saveCampaign'] = (campaign) => {
    setData((prev) => {
      if (campaign.id) {
        return {
          ...prev,
          campaigns: prev.campaigns.map((c) =>
            c.id === campaign.id ? { ...c, ...campaign, id: campaign.id } : c
          ),
        };
      }
      return {
        ...prev,
        campaigns: [{ ...campaign, id: generateId('cam') }, ...prev.campaigns],
      };
    });
  };

  const deleteCampaign = (id: string) => {
    setData((prev) => ({
      ...prev,
      campaigns: prev.campaigns.filter((c) => c.id !== id),
    }));
  };

  const reviewDonation = (
    donationId: string,
    estado: 'Confirmada' | 'Rechazada',
    notasAdmin?: string
  ) => {
    setData((prev) => {
      const target = prev.donations.find((d) => d.id === donationId);
      if (!target) return prev;

      const shouldAddAmount =
        target.estado !== 'Confirmada' &&
        estado === 'Confirmada' &&
        target.tipo === 'Económica' &&
        Boolean(target.montoBs) &&
        Boolean(target.campanaId);

      const shouldSubtractAmount =
        target.estado === 'Confirmada' &&
        estado === 'Rechazada' &&
        target.tipo === 'Económica' &&
        Boolean(target.montoBs) &&
        Boolean(target.campanaId);

      return {
        ...prev,
        donations: prev.donations.map((d) =>
          d.id === donationId ? { ...d, estado, notasAdmin: notasAdmin ?? d.notasAdmin } : d
        ),
        campaigns: prev.campaigns.map((c) => {
          if (c.id !== target.campanaId) return c;
          if (shouldAddAmount) {
            return { ...c, recaudadoBs: c.recaudadoBs + (target.montoBs || 0) };
          }
          if (shouldSubtractAmount) {
            return { ...c, recaudadoBs: Math.max(0, c.recaudadoBs - (target.montoBs || 0)) };
          }
          return c;
        }),
      };
    });
  };

  const moderateCommunity = (
    id: string,
    estado: 'Aprobada' | 'Rechazada',
    respuestaAdmin?: string
  ) => {
    setData((prev) => ({
      ...prev,
      community: prev.community.map((item) =>
        item.id === id
          ? {
              ...item,
              estado,
              respuestaAdmin: respuestaAdmin !== undefined ? respuestaAdmin : item.respuestaAdmin,
            }
          : item
      ),
    }));
  };

  const deleteCommunity = (id: string) => {
    setData((prev) => ({
      ...prev,
      community: prev.community.filter((c) => c.id !== id),
    }));
  };

  const updateInstitution = (info: InstitutionInfo) => {
    setData((prev) => ({
      ...prev,
      institution: info,
    }));
  };

  const resetDemoData = () => {
    setData(INITIAL_DATA);
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        data,
        cart,
        isCartOpen,
        setIsCartOpen,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        getAvailableStock,
        submitAdoption,
        createOrder,
        submitDonation,
        submitCommunity,
        saveAnimal,
        deleteAnimal,
        saveNews,
        deleteNews,
        updateAdoption,
        registerAdoptionCompletion,
        addAdoptionFollowUp,
        saveProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        adjustInventory,
        confirmOrderPayment,
        cancelOrder,
        updateOrderStatus,
        saveCampaign,
        deleteCampaign,
        reviewDonation,
        moderateCommunity,
        deleteCommunity,
        updateInstitution,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe utilizarse dentro de AppProvider');
  }
  return ctx;
}
