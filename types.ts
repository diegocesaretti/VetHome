export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export enum UrgencyLevel {
  LOW = 'BAJA',
  MEDIUM = 'MEDIA',
  HIGH = 'ALTA',
  UNKNOWN = 'DESCONOCIDA'
}

export interface TriageData {
  name: string;
  phone: string;
  address: string;
  pet: string;
  symptoms: string;
  urgency: UrgencyLevel;
  fullSummary: string;
}

export interface ParsedResponse {
  visibleMessage: string;
  triageData: TriageData | null;
}

// Extend window for Cal.com
declare global {
  interface Window {
    Cal: any;
  }
}