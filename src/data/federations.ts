export interface Federation {
  id: string;
  name: string;
  fullName: string;
  sport: string;
  description: string;
  logoUrl?: string;
  website?: string;
  teamsCount: number;
  athletesCount: number;
}

export const federations: Federation[] = [
  {
    id: 'FSHF',
    name: 'FSHF',
    fullName: 'Federata Shqiptare e Futbollit',
    sport: 'football',
    description: 'The Albanian Football Association is the governing body of football in Albania, responsible for organizing the national team and domestic leagues.',
    website: 'https://fshf.org',
    teamsCount: 14,
    athletesCount: 280,
  },
  {
    id: 'FSHB',
    name: 'FSHB',
    fullName: 'Federata Shqiptare e Basketbollit',
    sport: 'basketball',
    description: 'The Albanian Basketball Federation oversees basketball activities in Albania, including the national team and professional leagues.',
    website: 'https://fshb.al',
    teamsCount: 8,
    athletesCount: 120,
  },
  {
    id: 'FSHV',
    name: 'FSHV',
    fullName: 'Federata Shqiptare e Volejbollit',
    sport: 'volleyball',
    description: 'The Albanian Volleyball Federation manages volleyball in Albania, organizing national competitions and representing the country internationally.',
    website: 'https://fshv.al',
    teamsCount: 6,
    athletesCount: 90,
  },
  {
    id: 'ATF',
    name: 'ATF',
    fullName: 'Albanian Taekwondo Federation',
    sport: 'taekwondo',
    description: 'The Albanian Taekwondo Federation promotes and develops taekwondo in Albania, training athletes for national and international competitions.',
    website: 'https://atf.al',
    teamsCount: 5,
    athletesCount: 75,
  },
];

export const getFederationById = (id: string): Federation | undefined => {
  return federations.find(f => f.id.toLowerCase() === id.toLowerCase());
};

export const getFederationBySport = (sport: string): Federation | undefined => {
  return federations.find(f => f.sport === sport);
};
