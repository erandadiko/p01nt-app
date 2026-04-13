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
    imageUrl:'https://admin.albanianpost.com/wp-content/uploads/2025/07/shqiperia.jpg',
    title: 'Albanian National Team Prepares for Euro Qualifiers',
    description: 'The Albanian national football team has begun preparations for the upcoming European Championship qualifiers with intensive training sessions.',
    date: new Date().toISOString(),
    federation: 'FSHF',
  },
  {
    id: '2',
    imageUrl:'https://shqiptarja.com/uploads/780x440/1769352707_superliga.jpg',
    title: 'KF Tirana Wins Superliga Championship',
    description: 'KF Tirana has secured their 26th league title after a dominant season performance, cementing their status as the most successful club in Albania.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHF',
  },
  {
    id: '3',
    imageUrl:'https://botasot.info/media/botasot.info/images/2023/September/22/auto_unnamed_41695384940.jpg',
    title: 'Basketball League Season Kicks Off',
    description: 'The new season of the Albanian Basketball League has officially started with exciting matchups and renewed competition among top teams.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHB',
  },
  {
    id: '4',
    imageUrl:'https://faktor.al/wp-content/uploads/2024/11/hidri.jpg',
    title: 'Ibrahim Hidri Wins Gold at European Championship',
    description: 'Albanian taekwondo athlete Ibrahim Hidri secures gold medal at the European Championship, bringing pride to the nation.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'ATF',
  },
  {
    id: '5',
    imageUrl:'https://shqiptarja.com/uploads/780x440/1583846120_IMG20170625195844.jpg',
    title: 'Volleyball Federation Announces New Season Schedule',
    description: 'The full schedule for the upcoming volleyball season has been released, with matches starting next month.',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    federation: 'FSHV',
  },
  {
    id: '6',
    imageUrl:'https://fshf.org/app/uploads/2026/04/kombetarja-e-vajzave-stervitet-ne-Uells-prill-2026.jpeg',
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
