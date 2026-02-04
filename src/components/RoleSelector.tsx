'use client';

import clsx from 'clsx';

interface RoleSelectorProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

const roles = [
  { id: 'trainer', name: 'Trainer', description: 'Manage teams and players', icon: '👨‍🏫' },
  { id: 'player', name: 'Player', description: 'View profile and stats', icon: '🏃' },
  { id: 'sportlover', name: 'Sport Lover', description: 'Follow your favorite sports', icon: '❤️' },
];

export default function RoleSelector({ selectedRole, onRoleChange }: RoleSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-dark-blue">
        Select your role
      </label>
      <div className="grid grid-cols-1 gap-3">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            className={clsx(
              'flex items-center p-4 rounded-lg border-2 transition-all text-left',
              selectedRole === role.id
                ? 'border-primary-red bg-red-50'
                : 'border-card-border hover:border-grayish-blue bg-white'
            )}
          >
            <span className="text-2xl mr-3">{role.icon}</span>
            <div>
              <div className={clsx(
                'font-medium',
                selectedRole === role.id ? 'text-primary-red' : 'text-dark-blue'
              )}>
                {role.name}
              </div>
              <div className="text-sm text-grayish-blue">{role.description}</div>
            </div>
            {selectedRole === role.id && (
              <svg className="w-5 h-5 ml-auto text-primary-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
