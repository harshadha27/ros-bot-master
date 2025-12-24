
export interface BOMItem {
  id: string;
  name: string;
  category: 'Electronics' | 'Mechanical' | 'Power' | 'Sensors';
  role: string;
  justification: string;
  link: string;
  costEstimate: number;
}

export interface ROSCommand {
  command: string;
  description: string;
  category: 'System' | 'Control' | 'Sensors' | 'Nav';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
