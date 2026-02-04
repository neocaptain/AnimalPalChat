
import React from 'react';
import { AnimalType, Language } from '../types';
import { PERSONAS } from '../constants';

interface PersonaSelectorProps {
  selectedType: AnimalType;
  onSelect: (type: AnimalType) => void;
  language: Language;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedType, onSelect, language }) => {
  const types = Object.values(AnimalType);

  const getLabel = (type: AnimalType) => {
    if (language === Language.KO) {
      switch (type) {
        case AnimalType.CAT: return '고양이';
        case AnimalType.DOG: return '강아지';
        case AnimalType.KOALA: return '코알라';
        case AnimalType.RABBIT: return '토끼';
      }
    }
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <div className="flex justify-start md:justify-center gap-4 px-2 min-w-max">
      {types.map((type) => {
        const persona = PERSONAS[type];
        const isActive = selectedType === type;

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`
              group flex flex-col items-center transition-all duration-300
              ${isActive ? 'scale-105' : 'opacity-60 hover:opacity-100'}
            `}
          >
            <div className={`
              w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm
              transition-all duration-300 border-2
              ${isActive ? `${persona.bgColor} border-current ${persona.color}` : 'bg-gray-50 border-transparent'}
            `}>
              {persona.icon}
            </div>
            <span className={`
              mt-1 text-[9px] font-bold transition-colors uppercase tracking-tight
              ${isActive ? persona.color : 'text-gray-500'}
            `}>
              {getLabel(type)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PersonaSelector;
