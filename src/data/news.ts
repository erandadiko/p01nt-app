export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  federation: string;
  imageUrl?: string;
  link?: string;
}

export const news: NewsItem[] = [
  {
    id: '1',
    title: 'Albanian National Team Prepares for Euro Qualifiers',
    description: 'The Albanian national football team has begun preparations for the upcoming European Championship qualifiers with intensive training sessions.',
    date: new Date().toISOString(),
    federation: 'FSHF',
  },
  {
    id: '2',
    title: 'KF Tirana Wins Superliga Championship',
    description: 'KF Tirana has secured their 26th league title after a dominant season performance, cementing their status as the most successful club in Albania.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHF',
  },
  {
    id: '3',
    title: 'Basketball League Season Kicks Off',
    description: 'The new season of the Albanian Basketball League has officially started with exciting matchups and renewed competition among top teams.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHB',
  },
  {
    id: '4',
    title: 'Ibrahim Hidri Wins Gold at European Championship',
    description: 'Albanian taekwondo athlete Ibrahim Hidri secures gold medal at the European Championship, bringing pride to the nation.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'ATF',
  },
  {
    id: '5',
    title: 'Volleyball Federation Announces New Season Schedule',
    description: 'The full schedule for the upcoming volleyball season has been released, with matches starting next month.',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHV',
  },
  {
    id: '6',
    title: 'Youth Development Program Launched',
    description: 'FSHF announces a comprehensive youth development program to nurture future football talents across Albania.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHF',
  },
];

export const getNewsByFederation = (federation: string): NewsItem[] => {
  return news.filter(n => n.federation === federation);
};

export const getLatestNews = (limit: number = 5): NewsItem[] => {
  return [...news].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
};
