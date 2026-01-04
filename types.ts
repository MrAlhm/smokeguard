
export enum Page {
  Detection = 'Detection',
  EChallan = 'EChallan',
  Dashboard = 'Dashboard',
  History = 'History',
  Consultant = 'Consultant',
  News = 'News',
  About = 'About'
}

export interface ViolationData {
  violationId: string;
  vehicleNumber: string;
  vehicleType: string;
  vehicleColor: string;
  smokeSeverity: 'Low' | 'Moderate' | 'High';
  smokeScore: number;
  aiConfidence: number;
  timestamp: string;
  penalty: string;
  imageUrl: string;
  location?: string;
}

export interface GeminiAnalysis {
  vehicleType: string;
  vehicleColor: string;
  smokeSeverity: 'Low' | 'Moderate' | 'High';
  smokeScore: number;
  confidence: number;
  description: string;
  environmentalFactors?: string;
  maintenanceTip?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}
