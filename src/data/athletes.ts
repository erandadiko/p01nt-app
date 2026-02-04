export interface Athlete {
  id: string;
  name: string;
  age: number;
  gender: string;
  sport: string;
  position?: string;
  teamId?: string;
  teamName?: string;
  federation: string;
  imageUrl?: string;
  stats?: Record<string, number | string>;
}

export const athletes: Athlete[] = [
  // Football Players
  { id: 'p1', name: 'Thomas Strakosha', age: 29, gender: 'Male', sport: 'football', position: 'Goalkeeper', teamId: 'kf-tirana', teamName: 'KF Tirana', federation: 'FSHF', stats: { appearances: 45, cleanSheets: 18 } },
  { id: 'p2', name: 'Berat Gjimshiti', age: 31, gender: 'Male', sport: 'football', position: 'Defender', teamId: 'fk-partizani', teamName: 'FK Partizani', federation: 'FSHF', stats: { appearances: 52, goals: 3 } },
  { id: 'p3', name: 'Elseid Hysaj', age: 30, gender: 'Male', sport: 'football', position: 'Defender', teamId: 'kf-vllaznia', teamName: 'KF Vllaznia', federation: 'FSHF', stats: { appearances: 48, assists: 5 } },
  { id: 'p4', name: 'Myrto Uzuni', age: 28, gender: 'Male', sport: 'football', position: 'Forward', teamId: 'fk-dinamo', teamName: 'FK Dinamo Tirana', federation: 'FSHF', stats: { appearances: 40, goals: 22 } },
  { id: 'p5', name: 'Armando Broja', age: 22, gender: 'Male', sport: 'football', position: 'Forward', teamId: 'kf-teuta', teamName: 'KF Teuta', federation: 'FSHF', stats: { appearances: 35, goals: 15 } },
  
  // Basketball Players
  { id: 'b1', name: 'Franko Bushati', age: 26, gender: 'Male', sport: 'basketball', position: 'Point Guard', teamId: 'bc-partizani', teamName: 'BC Partizani', federation: 'FSHB', stats: { ppg: 18.5, apg: 6.2 } },
  { id: 'b2', name: 'Klaudio Ndoja', age: 28, gender: 'Male', sport: 'basketball', position: 'Center', teamId: 'bc-tirana', teamName: 'BC Tirana', federation: 'FSHB', stats: { ppg: 14.3, rpg: 9.1 } },
  { id: 'b3', name: 'Edon Maxhuni', age: 24, gender: 'Male', sport: 'basketball', position: 'Shooting Guard', teamId: 'kb-vllaznia', teamName: 'KB Vllaznia', federation: 'FSHB', stats: { ppg: 16.8, '3pt': '38.5%' } },
  
  // Volleyball Players
  { id: 'v1', name: 'Ermal Hoxha', age: 27, gender: 'Male', sport: 'volleyball', position: 'Outside Hitter', teamId: 'vk-tirana', teamName: 'VK Tirana', federation: 'FSHV', stats: { pointsPerSet: 4.2, attackPct: 45 } },
  { id: 'v2', name: 'Arbër Shehu', age: 25, gender: 'Male', sport: 'volleyball', position: 'Setter', teamId: 'vk-partizani', teamName: 'VK Partizani', federation: 'FSHV', stats: { assistsPerSet: 8.5 } },
  
  // Taekwondo Athletes
  { id: 't1', name: 'Ibrahim Hidri', age: 24, gender: 'Male', sport: 'taekwondo', position: '-68kg', teamId: 'tkd-tirana', teamName: 'TKD Tirana Club', federation: 'ATF', stats: { goldMedals: 5, silverMedals: 3, bronzeMedals: 2 } },
  { id: 't2', name: 'Dritan Kuka', age: 26, gender: 'Male', sport: 'taekwondo', position: '-80kg', teamId: 'tkd-durres', teamName: 'TKD Durrës', federation: 'ATF', stats: { goldMedals: 3, silverMedals: 4 } },
  { id: 't3', name: 'Arta Dervishi', age: 22, gender: 'Female', sport: 'taekwondo', position: '-57kg', teamId: 'tkd-shkoder', teamName: 'TKD Shkodër', federation: 'ATF', stats: { goldMedals: 4, silverMedals: 2 } },
];

export const getAthletesByFederation = (federation: string): Athlete[] => {
  return athletes.filter(a => a.federation === federation);
};

export const getAthletesBySport = (sport: string): Athlete[] => {
  return athletes.filter(a => a.sport === sport);
};

export const getAthleteById = (id: string): Athlete | undefined => {
  return athletes.find(a => a.id === id);
};

export const getAthletesByTeam = (teamId: string): Athlete[] => {
  return athletes.filter(a => a.teamId === teamId);
};
