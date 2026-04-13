'use client';

import { useState, useEffect } from 'react';
import NewsCard from '@/components/NewsCard';
import SectionHeader from '@/components/SectionHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { news as fallbackNews } from '@/data/news';

interface NewsItem {
  id: number | string;
  title: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  link: string | null;
  federation: string;
  date: string;
}

const toNewsItems = (items: typeof fallbackNews): NewsItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    content: item.content ?? null,
    imageUrl: item.imageUrl ?? null,
    link: item.link ?? null,
    federation: item.federation,
    date: item.date,
  }));

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFederation, setSelectedFederation] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = [...news];

    if (selectedFederation) {
      filtered = filtered.filter(n => n.federation === selectedFederation);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredNews(filtered);
  }, [news, selectedFederation]);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/news?limit=50');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      const apiNews = data.news || [];
      setNews(apiNews.length > 0 ? apiNews : toNewsItems(fallbackNews));
    } catch (err) {
      console.error('Falling back to local news data:', err);
      setNews(toNewsItems(fallbackNews));
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };


  const federations = [
    { id: null, name: 'All Federations' },
    { id: 'FSHF', name: 'FSHF - Football' },
    { id: 'FSHB', name: 'FSHB - Basketball' },
    { id: 'FSHV', name: 'FSHV - Volleyball' },
    { id: 'ATF', name: 'ATF - Taekwondo' },
  ];

  return (
    <div className="min-h-screen bg-light-gray py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader 
          title="News" 
          subtitle="Latest updates from Albanian sports federations"
        />

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-dark-blue mb-1">Federation</label>
              <select
                value={selectedFederation || ''}
                onChange={(e) => setSelectedFederation(e.target.value || null)}
                className="w-full px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red"
              >
                {federations.map((fed) => (
                  <option key={fed.id || 'all'} value={fed.id || ''}>
                    {fed.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={fetchNews}
              className="mt-4 px-4 py-2 bg-primary-red text-white rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📰</div>
            <p className="text-grayish-blue">No news found</p>
            <p className="text-sm text-grayish-blue mt-2">
              {news.length === 0 
                ? 'No news articles have been added yet.'
                : 'Try adjusting your filters to see more results.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <NewsCard
                key={item.id}
                id={item.id}
                title={item.title}
                description={item.description}
                date={item.date}
                federation={item.federation}
                imageUrl={item.imageUrl || undefined}
                link={item.link || undefined}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredNews.length > 0 && (
          <div className="mt-8 text-center text-grayish-blue">
            Showing {filteredNews.length} of {news.length} articles
          </div>
        )}
      </div>
    </div>
  );
}
