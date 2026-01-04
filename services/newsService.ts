
import { NewsArticle } from "../types";

const NEWS_API_KEY = '1951279e101a4b2a8d9dd8069d1a9997';
const NEWS_URL = `https://newsapi.org/v2/everything?q=vehicle+emission+pollution+india+environment&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;

export const fetchEmissionNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(NEWS_URL);
    const data = await response.json();
    
    if (data.status === 'ok') {
      return data.articles.slice(0, 10);
    }
    
    throw new Error(data.message || 'Failed to fetch news');
  } catch (error) {
    console.error('News API Error:', error);
    // Fallback data for hackathon presentation if CORS or API limit hits
    return [
      {
        title: "India's Push for BS6 Phase II Emissions Norms",
        description: "How the new real-driving emission norms are reshaping the Indian automotive landscape.",
        url: "https://example.com/news1",
        urlToImage: "https://images.unsplash.com/photo-1521227889351-bf6f5b2e4e37?auto=format&fit=crop&q=80&w=400",
        publishedAt: new Date().toISOString(),
        source: { name: "Auto Vision" }
      },
      {
        title: "The Health Cost of Vehicular Pollution in Metro Cities",
        description: "New study reveals a 15% increase in respiratory issues linked to heavy vehicle smoke.",
        url: "https://example.com/news2",
        urlToImage: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=400",
        publishedAt: new Date().toISOString(),
        source: { name: "Eco Daily" }
      }
    ];
  }
};
