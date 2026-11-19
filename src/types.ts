export type PublicRoute =
  | 'inicio'
  | 'animales'
  | 'tienda'
  | 'campanas'
  | 'noticias'
  | 'comunidad'
  | 'nosotros'
  | 'admin-login'
  | 'admin';

export type AdminSection =
  | 'resumen'
  | 'animales-noticias'
  | 'adopciones'
  | 'tienda'
  | 'campanas-donaciones'
  | 'comunidad'
  | 'institucion';

export type AnimalSpecies = 'Perro' | 'Gato';
export type AnimalSize = 'Pequeño' | 'Mediano' | 'Grande';
export type AnimalStatus = 'Disponible' | 'En proceso' | 'Adoptado';

export interface AnimalHealth {
  vacunado: boolean;
  esterilizado: boolean;
  desparasitado: boolean;
  notasMedicas: string;
}

export interface Animal {
  id: string;
  nombre: string;
  especie: AnimalSpecies;
  edad: string;
  tamano: AnimalSize;
  sexo: 'Macho' | 'Hembra';
  estado: AnimalStatus;
  fotos: string[];
  comportamiento: string;
  estadoSalud: AnimalHealth;
  historia: string;
  destacado: boolean;
  fechaIngreso: string;
}

export type AdoptionStatus = 'Recibida' | 'En revisión' | 'Aprobada' | 'Rechazada';

export interface AdoptionFollowUp {
  id: string;
  fecha: string;
  notas: string;
  estadoAnimal: string;
}

export interface AdoptionApplication {
  id: string;
  animalId: string;
  animalNombre: string;
  nombreSolicitante: string;
  correo: string;
  telefono: string;
  zona: string;
  tipoVivienda: string;
  estiloVida: string;
  estado: AdoptionStatus;
  fechaSolicitud: string;
  fechaEntrevista?: string;
  notasEntrevista?: string;
  motivoDecision?: string;
  adopcionRegistrada?: {
    fechaAdopcion: string;
    notasEntrega: string;
  };
  seguimientos: AdoptionFollowUp[];
}

export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precioBs: number;
  stock: number;
  stockReservado: number;
  descripcion: string;
  imagen: string;
  activo: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productNombre: string;
  tipo: 'Entrada' | 'Salida';
  cantidad: number;
  motivo: string;
  fecha: string;
  orderCode?: string;
}

export type OrderStatus =
  | 'Pendiente de pago'
  | 'Pago confirmado'
  | 'En preparación'
  | 'Listo para entrega'
  | 'Entregado'
  | 'Cancelado';

export interface OrderItem {
  productId: string;
  nombre: string;
  precioBs: number;
  cantidad: number;
}

export interface Order {
  id: string;
  codigo: string;
  comprador: {
    nombre: string;
    correo: string;
    telefono: string;
  };
  items: OrderItem[];
  totalBs: number;
  metodoPago: 'transferencia' | 'enlace_externo';
  comprobanteNombre?: string;
  comprobanteUrl?: string;
  enlacePagoRef?: string;
  estado: OrderStatus;
  fecha: string;
  notasAdmin?: string;
}

export interface Campaign {
  id: string;
  titulo: string;
  descripcion: string;
  metaBs: number;
  recaudadoBs: number;
  imagen: string;
  fechaFin: string;
  activa: boolean;
}

export type DonationType = 'Económica' | 'En especie';
export type DonationStatus = 'Pendiente' | 'Confirmada' | 'Rechazada';

export interface Donation {
  id: string;
  tipo: DonationType;
  donanteNombre: string;
  correo: string;
  telefono: string;
  montoBs?: number;
  descripcionEspecie?: string;
  campanaId?: string;
  campanaTitulo?: string;
  comprobanteNombre?: string;
  comprobanteUrl?: string;
  estado: DonationStatus;
  fecha: string;
  notasAdmin?: string;
}

export interface NewsArticle {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: string;
  autor: string;
  fecha: string;
  imagen: string;
}

export type CommunitySubmissionType =
  | 'Historia de rescate'
  | 'Animal perdido o encontrado'
  | 'Consulta o sugerencia'
  | 'Solicitud de voluntariado';

export type ModerationStatus = 'Pendiente' | 'Aprobada' | 'Rechazada';

export interface CommunitySubmission {
  id: string;
  tipo: CommunitySubmissionType;
  titulo: string;
  autorNombre: string;
  correo: string;
  telefono: string;
  zona?: string;
  contenido: string;
  subtipoAlerta?: 'Perdido' | 'Encontrado';
  disponibilidad?: string;
  estado: ModerationStatus;
  respuestaAdmin?: string;
  fecha: string;
}

export interface InstitutionInfo {
  nombre: string;
  lema: string;
  historia: string;
  direccion: string;
  zona: string;
  ciudad: string;
  telefono: string;
  correo: string;
  horarios: string;
  bancoNombre: string;
  bancoCuenta: string;
  bancoTitular: string;
  enlacePagoExterno: string;
  latitud: number;
  longitud: number;
}

export interface CartItem {
  productId: string;
  cantidad: number;
}

export interface AppDataState {
  animals: Animal[];
  adoptions: AdoptionApplication[];
  products: Product[];
  categories: string[];
  inventoryMovements: InventoryMovement[];
  orders: Order[];
  campaigns: Campaign[];
  donations: Donation[];
  news: NewsArticle[];
  community: CommunitySubmission[];
  institution: InstitutionInfo;
}
