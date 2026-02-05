
import React from 'react';
import { AnimalType, Language } from '../types';
import { PERSONAS } from '../constants';

interface PersonaSelectorProps {
  selectedType: AnimalType;
  onSelect: (type: AnimalType) => void;
  language: Language;
  customNames: Record<AnimalType, string>;
  onUpdateName: (type: AnimalType, newName: string) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
  selectedType, onSelect, language, customNames, onUpdateName
}) => {
  const types = Object.values(AnimalType);
  const [editingType, setEditingType] = React.useState<AnimalType | null>(null);
  const [tempName, setTempName] = React.useState('');

  const handleStartEdit = (e: React.MouseEvent, type: AnimalType, currentName: string) => {
    e.stopPropagation();
    setEditingType(type);
    setTempName(currentName);
  };

  const handleSaveEdit = (type: AnimalType) => {
    if (tempName.trim()) {
      onUpdateName(type, tempName.trim());
    }
    setEditingType(null);
  };

  return (
    <div className="flex justify-start md:justify-center gap-6 px-4 py-2 min-w-max">
      {types.map((type) => {
        const persona = PERSONAS[type];
        const isActive = selectedType === type;
        const currentName = customNames[type];
        const isEditing = editingType === type;

        return (
          <div key={type} className="flex flex-col items-center">
            <button
              onClick={() => onSelect(type)}
              className={`
                group flex flex-col items-center transition-all duration-500
                ${isActive ? 'scale-110' : 'opacity-40 hover:opacity-80 hover:scale-105'}
              `}
            >
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
                transition-all duration-300 border-2 shadow-sm
                ${isActive
                  ? 'bg-white border-[var(--color-warm-peach)] shadow-xl'
                  : 'bg-white/50 border-white/20'}
              `}>
                <span className={`transition-transform duration-500 ${isActive ? 'scale-125 rotate-6' : 'group-hover:rotate-12'}`}>
                  {persona.icon}
                </span>
              </div>
            </button>

            {isEditing ? (
              <input
                autoFocus
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={() => handleSaveEdit(type)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(type)}
                className="mt-2 w-20 text-[10px] text-center font-black border-b border-[var(--color-warm-peach)] focus:outline-none bg-transparent"
              />
            ) : (
              <div
                className={`mt-2 flex items-center gap-1 cursor-pointer group/name ${isActive ? 'text-[var(--color-warm-peach)]' : 'text-gray-400'}`}
                onClick={(e) => handleStartEdit(e, type, currentName)}
              >
                <span className="text-[10px] font-black uppercase tracking-[0.15em] font-heading">
                  {currentName}
                </span>
                <span className="opacity-0 group-hover/name:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PersonaSelector;
