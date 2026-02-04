'use client';

interface SportSelectorProps {
  selectedSport: string | null;
  onSportChange: (sport: string | null) => void;
}

const sports = [
  { id: 'all', name: 'All Sports', icon: '🏆' },
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'taekwondo', name: 'Taekwondo', icon: '🥋' },
];

export default function SportSelector({ selectedSport, onSportChange }: SportSelectorProps) {
  return (
    <select
      value={selectedSport || 'all'}
      onChange={(e) => onSportChange(e.target.value === 'all' ? null : e.target.value)}
      className="px-4 py-2 border border-card-border rounded-lg bg-white text-dark-blue focus:outline-none focus:ring-2 focus:ring-primary-red focus:border-transparent"
    >
      {sports.map((sport) => (
        <option key={sport.id} value={sport.id}>
          {sport.icon} {sport.name}
        </option>
      ))}
    </select>
  );
}
