import React from 'react';
import { Card } from '@embed-tools/components';
import { TRANSLATIONS, STYLE_CLASSES } from '../data/constants';
import ElementIcon from './ElementIcon';

// Mapping tables for translation
const YINYANG_MAP = {
  Yang: 'Dương',
  Yin:  'Âm'
};
const ELEMENT_MAP = {
  Wood:  'Mộc',
  Fire:  'Hỏa',
  Earth: 'Thổ',
  Metal: 'Kim',
  Water: 'Thủy'
};
function translateYinYangElement(term) {
  if (!term) return '';
  const [yinYang, element] = term.split(' ');
  return `${YINYANG_MAP[yinYang] || yinYang} ${ELEMENT_MAP[element] || element}`;
}

const Pillar = ({ stem, branch, label, className = '' }) => {
  if (!stem || !branch) {
    return (
      <Card className={`pillar-card flex-1 p-4 rounded-lg bg-gray-100 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Không rõ</span>
      </Card>
    );
  }

  // Debug logging
  // console.log('Pillar stem:', stem);
  // if (stem.name && stem.polarity && stem.elementEn) {
  //   console.log('translateYinYangElement input:', `${stem.polarity} ${stem.elementEn}`);
  // } else {
  //   console.log('Missing for translateYinYangElement:', { name: stem.name, polarity: stem.polarity, elementEn: stem.elementEn });
  // }

  const stemElementVi = TRANSLATIONS.elements[stem.element];
  const branchElementVi = TRANSLATIONS.elements[branch.element];
  const stemStyle = STYLE_CLASSES[stemElementVi] || {};
  const branchStyle = STYLE_CLASSES[branchElementVi] || {};
  const tenGod = stem.tenGod ? TRANSLATIONS.tenGods[stem.tenGod.name] : null;

  return (
    <Card className={`pillar-card flex-1 p-4 rounded-lg bg-gray-50 flex flex-col items-center ${className}`}>
      {label && <div className="text-sm font-semibold text-gray-500 mb-2">{label}</div>}
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-col items-center mb-1">
          <div className={`flex items-center gap-1 text-xl font-bold ${stemStyle.text || 'text-gray-700'}`}> 
            <ElementIcon element={stemElementVi} size="md" />
            <span>{TRANSLATIONS.stems[stem.stem] || stem.stem}</span>
            <span className={`text-lg font-semibold ml-1 ${stemStyle.text || 'text-gray-700'}`}>{stemElementVi}</span>
          </div>
          {stem.name && stem.polarity && stem.elementEn && (
            <span className="text-xs text-gray-500 mt-0.5">{translateYinYangElement(`${stem.polarity} ${stem.elementEn}`)}</span>
          )}
        </div>
        <div className={`flex items-center gap-1 text-base font-medium ${branchStyle.text || 'text-gray-700'}`}>
          <ElementIcon element={branchElementVi} size="md" />
          <span>{TRANSLATIONS.branches[branch.branch] || branch.branch}</span>
          <span className="text-xs text-gray-500 ml-1">({TRANSLATIONS.animals[branch.animal] || branch.animal})</span>
        </div>
        {tenGod && (
          <div className="mt-2 text-xs font-semibold text-white bg-gray-400 rounded-full px-2 py-0.5 inline-block">
            {tenGod}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Pillar; 