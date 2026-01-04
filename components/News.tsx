
import React, { useEffect, useState } from 'react';
import { fetchEmissionNews } from '../services/newsService';
import { NewsArticle } from '../types';

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmissionNews().then(data => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-slate-900/50 h-64 rounded-3xl border border-slate-800"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2">Environmental Hub</h2>
          <p className="text-blue-100 opacity-80 max-w-xl">Stay informed with the latest updates on emission norms, environmental policy, and air quality innovations from across India.</p>
        </div>
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-10 rotate-12">📰</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, idx) => (
          <a 
            key={idx} 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={article.urlToImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600'} 
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                {article.source.name}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase mb-2 tracking-widest">
                {new Date(article.publishedAt).toLocaleDateString()}
              </span>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 mb-6">
                {article.description}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-blue-500">Read Full Story</span>
                <span className="text-lg group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default News;
