export enum MessageType {
  USER = 'user',
  AI = 'ai'
}

export interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  isEDI?: boolean;
}

export interface EDIStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface SimulationData {
  buyerName: string;
  buyerNameCN: string;
  supplierName: string;
  supplierNameCN: string;
  itemName: string;
  itemNameCN: string;
  quantity: number;
  price: number;
  poNumber: string;
}