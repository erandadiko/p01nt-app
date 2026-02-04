export interface Team {
  id: string;
  name: string;
  sport: string;
  federation: string;
  logoUrl?: string;
  city?: string;
  founded?: number;
  stadium?: string;
  playersCount: number;
}

export const teams: Team[] = [
  // Football Teams
  { id: 'kf-tirana', name: 'KF Tirana', sport: 'football', federation: 'FSHF', city: 'Tirana', founded: 1920, stadium: 'Selman Stërmasi', playersCount: 25 },
  { id: 'fk-partizani', name: 'FK Partizani', sport: 'football', federation: 'FSHF', city: 'Tirana', founded: 1946, stadium: 'Elbasan Arena', playersCount: 24 },
  { id: 'kf-vllaznia', name: 'KF Vllaznia', sport: 'football', federation: 'FSHF', city: 'Shkodër', founded: 1919, stadium: 'Loro Boriçi', playersCount: 23 },
  { id: 'fk-dinamo', name: 'FK Dinamo Tirana', sport: 'football', federation: 'FSHF', city: 'Tirana', founded: 1950, stadium: 'Selman Stërmasi', playersCount: 22 },
  { id: 'kf-teuta', name: 'KF Teuta', sport: 'football', federation: 'FSHF', city: 'Durrës', founded: 1920, stadium: 'Niko Dovana', playersCount: 24 },
  { id: 'kf-laci', name: 'KF Laçi', sport: 'football', federation: 'FSHF', city: 'Laç', founded: 1960, stadium: 'Laçi Stadium', playersCount: 21 },
  
  // Basketball Teams
  { id: 'bc-partizani', name: 'BC Partizani', sport: 'basketball', federation: 'FSHB', city: 'Tirana', playersCount: 12 },
  { id: 'bc-tirana', name: 'BC Tirana', sport: 'basketball', federation: 'FSHB', city: 'Tirana', playersCount: 12 },
  { id: 'kb-vllaznia', name: 'KB Vllaznia', sport: 'basketball', federation: 'FSHB', city: 'Shkodër', playersCount: 11 },
  { id: 'bc-teuta', name: 'BC Teuta', sport: 'basketball', federation: 'FSHB', city: 'Durrës', playersCount: 12 },
  
  // Volleyball Teams
  { id: 'vk-tirana', name: 'VK Tirana', sport: 'volleyball', federation: 'FSHV', city: 'Tirana', playersCount: 14 },
  { id: 'vk-partizani', name: 'VK Partizani', sport: 'volleyball', federation: 'FSHV', city: 'Tirana', playersCount: 13 },
  { id: 'vk-vllaznia', name: 'VK Vllaznia', sport: 'volleyball', federation: 'FSHV', city: 'Shkodër', playersCount: 12 },
  
  // Taekwondo Clubs
  { id: 'tkd-tirana', name: 'TKD Tirana Club', sport: 'taekwondo', federation: 'ATF', city: 'Tirana', playersCount: 20 },
  { id: 'tkd-durres', name: 'TKD Durrës', sport: 'taekwondo', federation: 'ATF', city: 'Durrës', playersCount: 15 },
  { id: 'tkd-shkoder', name: 'TKD Shkodër', sport: 'taekwondo', federation: 'ATF', city: 'Shkodër', playersCount: 12 },
];

export const getTeamsByFederation = (federation: string): Team[] => {
  return teams.filter(t => t.federation === federation);
};

export const getTeamsBySport = (sport: string): Team[] => {
  return teams.filter(t => t.sport === sport);
};

export const getTeamById = (id: string): Team | undefined => {
  return teams.find(t => t.id === id);
};
