export type ContainerStatus = "En transit" | "Au port" | "Dédouanement" | "Livré" | "Retardé";

export interface ContainerItem {
  id: string;
  client: string;
  origin: string;
  destination: string;
  status: ContainerStatus;
  eta: string;
  progress: number;
  vessel: string;
  weight: string;
}

export const containers: ContainerItem[] = [
  { id: "MSHU1038236", client: "Sahel Imports SARL", origin: "Shanghai, CN", destination: "Dakar, SN", status: "En transit", eta: "2026-05-18", progress: 62, vessel: "MV Atlantic Star", weight: "24 t" },
  { id: "MSCU7720981", client: "Africa Trade Co", origin: "Rotterdam, NL", destination: "Dakar, SN", status: "Au port", eta: "2026-05-09", progress: 92, vessel: "Maersk Sentinel", weight: "18 t" },
  { id: "TCLU4456102", client: "Baobab Logistics", origin: "Mumbai, IN", destination: "Abidjan, CI", status: "Dédouanement", eta: "2026-05-07", progress: 96, vessel: "CMA Horizon", weight: "30 t" },
  { id: "HLXU9981023", client: "Teranga Foods", origin: "Hamburg, DE", destination: "Dakar, SN", status: "Livré", eta: "2026-05-02", progress: 100, vessel: "Hapag Express", weight: "12 t" },
  { id: "OOLU3344987", client: "West Coast Auto", origin: "Yokohama, JP", destination: "Dakar, SN", status: "Retardé", eta: "2026-05-22", progress: 41, vessel: "OOCL Pioneer", weight: "27 t" },
  { id: "EGHU2210456", client: "Sahel Imports SARL", origin: "Antwerp, BE", destination: "Bamako, ML", status: "En transit", eta: "2026-05-20", progress: 55, vessel: "Evergreen Lux", weight: "20 t" },
  { id: "BMOU8812340", client: "Atlas Distribution", origin: "Algeciras, ES", destination: "Dakar, SN", status: "En transit", eta: "2026-05-15", progress: 73, vessel: "MSC Aurora", weight: "16 t" },
  { id: "GESU5567112", client: "Niger Tech", origin: "Busan, KR", destination: "Niamey, NE", status: "Dédouanement", eta: "2026-05-08", progress: 94, vessel: "HMM Genesis", weight: "22 t" },
];

export interface Invoice {
  id: string;
  client: string;
  containerId: string;
  amount: number;
  status: "Payée" | "En attente" | "En retard";
  date: string;
}

export const invoices: Invoice[] = [
  { id: "INV-2026-0142", client: "Sahel Imports SARL", containerId: "MSHU1038236", amount: 1850000, status: "En attente", date: "2026-05-01" },
  { id: "INV-2026-0141", client: "Africa Trade Co", containerId: "MSCU7720981", amount: 920000, status: "Payée", date: "2026-04-28" },
  { id: "INV-2026-0140", client: "Baobab Logistics", containerId: "TCLU4456102", amount: 2340000, status: "Payée", date: "2026-04-25" },
  { id: "INV-2026-0139", client: "Teranga Foods", containerId: "HLXU9981023", amount: 540000, status: "Payée", date: "2026-04-20" },
  { id: "INV-2026-0138", client: "West Coast Auto", containerId: "OOLU3344987", amount: 3120000, status: "En retard", date: "2026-04-15" },
  { id: "INV-2026-0137", client: "Atlas Distribution", containerId: "BMOU8812340", amount: 1280000, status: "En attente", date: "2026-04-30" },
];

export interface Delivery {
  id: string;
  client: string;
  address: string;
  containerId: string;
  status: "Programmée" | "En cours" | "Livrée" | "À planifier";
  driver: string;
  date: string;
}

export const deliveries: Delivery[] = [
  { id: "LIV-0231", client: "Sahel Imports SARL", address: "Zone industrielle, Dakar", containerId: "MSHU1038236", status: "À planifier", driver: "—", date: "2026-05-19" },
  { id: "LIV-0230", client: "Africa Trade Co", address: "Plateau, Dakar", containerId: "MSCU7720981", status: "Programmée", driver: "Mamadou Diop", date: "2026-05-10" },
  { id: "LIV-0229", client: "Baobab Logistics", address: "Treichville, Abidjan", containerId: "TCLU4456102", status: "En cours", driver: "Ibrahim Koné", date: "2026-05-07" },
  { id: "LIV-0228", client: "Teranga Foods", address: "Rufisque, Dakar", containerId: "HLXU9981023", status: "Livrée", driver: "Cheikh Sy", date: "2026-05-02" },
];

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  containers: number;
  revenue: number;
}

export const clients: Client[] = [
  { id: "CLI-001", name: "Sahel Imports SARL", contact: "Fatou Ndiaye", email: "f.ndiaye@sahelimports.sn", phone: "+221 77 123 45 67", containers: 24, revenue: 32500000 },
  { id: "CLI-002", name: "Africa Trade Co", contact: "Omar Ba", email: "omar@africatrade.co", phone: "+221 76 998 11 22", containers: 18, revenue: 21800000 },
  { id: "CLI-003", name: "Baobab Logistics", contact: "Awa Camara", email: "a.camara@baobab.ci", phone: "+225 07 88 99 10", containers: 31, revenue: 48200000 },
  { id: "CLI-004", name: "Teranga Foods", contact: "Moussa Sow", email: "moussa@teranga.sn", phone: "+221 78 445 33 21", containers: 12, revenue: 14600000 },
  { id: "CLI-005", name: "West Coast Auto", contact: "Ibrahima Fall", email: "i.fall@wcauto.sn", phone: "+221 77 222 88 44", containers: 9, revenue: 27300000 },
  { id: "CLI-006", name: "Atlas Distribution", contact: "Khady Diouf", email: "khady@atlasdist.sn", phone: "+221 76 555 12 90", containers: 15, revenue: 19400000 },
];

export interface Alert {
  id: string;
  type: "info" | "warning" | "danger" | "success";
  title: string;
  message: string;
  time: string;
}

export const alerts: Alert[] = [
  { id: "A1", type: "warning", title: "Retard détecté", message: "Le conteneur OOLU3344987 accuse un retard de 3 jours.", time: "Il y a 12 min" },
  { id: "A2", type: "success", title: "Dédouanement validé", message: "TCLU4456102 a passé la douane à Abidjan.", time: "Il y a 1 h" },
  { id: "A3", type: "info", title: "Nouveau conteneur", message: "MSHU1038236 enregistré pour Sahel Imports.", time: "Il y a 3 h" },
  { id: "A4", type: "danger", title: "Facture en retard", message: "INV-2026-0138 dépasse l'échéance de 22 jours.", time: "Hier" },
  { id: "A5", type: "info", title: "Demande de livraison", message: "Sahel Imports a soumis une demande pour MSHU1038236.", time: "Hier" },
];

export interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const messages: Message[] = [
  { id: "M1", from: "Fatou Ndiaye", subject: "Question sur MSHU1038236", preview: "Bonjour, pourriez-vous confirmer la date d'arrivée prévue...", time: "10:24", unread: true },
  { id: "M2", from: "Omar Ba", subject: "Facture INV-2026-0141", preview: "Bonjour, j'ai bien reçu la facture, le règlement est en cours.", time: "09:12", unread: true },
  { id: "M3", from: "Awa Camara", subject: "Modification adresse livraison", preview: "Merci de noter le changement d'adresse pour la livraison...", time: "Hier", unread: false },
  { id: "M4", from: "Moussa Sow", subject: "Remerciements", preview: "Merci pour la livraison rapide, tout est conforme.", time: "Hier", unread: false },
  { id: "M5", from: "Khady Diouf", subject: "Devis nouveau lot", preview: "Pourriez-vous nous établir un devis pour 4 conteneurs...", time: "2 mai", unread: false },
];

export const statusColor = (s: ContainerStatus) => {
  switch (s) {
    case "En transit": return "bg-primary/10 text-primary border-primary/20";
    case "Au port": return "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-300";
    case "Dédouanement": return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300";
    case "Livré": return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300";
    case "Retardé": return "bg-red-500/10 text-red-700 border-red-500/20 dark:text-red-300";
  }
};
