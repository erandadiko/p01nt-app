export interface Match {
  id: string;
  team1: { id: string; name: string; logoUrl?: string };
  team2: { id: string; name: string; logoUrl?: string };
  date: string;
  score?: string;
  status: 'scheduled' | 'live' | 'completed';
  venue?: string;
  federation: string;
  sport: string;
}

const now = new Date();

export const matches: Match[] = [
  // Football Matches
  {
    id: 'm1',
    team1: { id: 'kf-tirana', name: 'KF Tirana' },
    team2: { id: 'fk-partizani', name: 'FK Partizani' },
    date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    venue: 'Selman Stërmasi Stadium',
    federation: 'FSHF',
    sport: 'football',
  },
  {
    id: 'm2',
    team1: { id: 'kf-vllaznia', name: 'KF Vllaznia' },
    team2: { id: 'fk-dinamo', name: 'FK Dinamo Tirana' },
    date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    venue: 'Loro Boriçi Stadium',
    federation: 'FSHF',
    sport: 'football',
  },
  {
    id: 'm3',
    team1: { id: 'kf-teuta', name: 'KF Teuta' },
    team2: { id: 'kf-laci', name: 'KF Laçi' },
    date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    score: '2-1',
    status: 'completed',
    venue: 'Niko Dovana Stadium',
    federation: 'FSHF',
    sport: 'football',
  },
  
  // Basketball Matches
  {
    id: 'm4',
    team1: { id: 'bc-partizani', name: 'BC Partizani' },
    team2: { id: 'bc-tirana', name: 'BC Tirana' },
    date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    venue: 'Asllan Rusi Arena',
    federation: 'FSHB',
    sport: 'basketball',
  },
  {
    id: 'm5',
    team1: { id: 'kb-vllaznia', name: 'KB Vllaznia' },
    team2: { id: 'bc-teuta', name: 'BC Teuta' },
    date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    score: '78-72',
    status: 'completed',
    venue: 'Pallati i Sportit',
    federation: 'FSHB',
    sport: 'basketball',
  },
  
  // Volleyball Matches
  {
    id: 'm6',
    team1: { id: 'vk-tirana', name: 'VK Tirana' },
    team2: { id: 'vk-partizani', name: 'VK Partizani' },
    date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'scheduled',
    venue: 'Pallati i Sportit Tirana',
    federation: 'FSHV',
    sport: 'volleyball',
  },
];

export const getMatchesByFederation = (federation: string): Match[] => {
  return matches.filter(m => m.federation === federation);
};

export const getUpcomingMatches = (limit: number = 5): Match[] => {
  return matches
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
};

export const getRecentMatches = (limit: number = 5): Match[] => {
  return matches
    .filter(m => m.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};
