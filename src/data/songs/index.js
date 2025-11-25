// imports each song module and exports parsed array
import song1 from './VANNUDICCHALLO-EE-RAVIL.js';
import song2 from './PAADI-PAADI-PAADI-POYEEDAAM.js';
import song3 from './Mariyaame-naarigalil.js';
import song4 from './Rajadhi-Rajan.js';
import song5 from './Seeyon-Manavalan.js';
import song6 from './Tharagam-pon-tharagam-pon.js';
import song7 from './Rajanayi-bhuviyil-Jadhanayi.js';
import song8 from './Ha-Jayageetham-naam-paadidam.js';
import song9 from './Innidha-Vinsudhan-Jadhanayi.js';
import song10 from './Sam-Sam-Sam.js';
import song11 from './Sundhara-sudhinam.js';
import song12 from './Aanandhame-Daiva.js';
import song13 from './Bethehem-puriyilae-vannu.js';
import song14 from './Prabha-Thooki.js';
import song15 from './Poyidam.js';
import song16 from './Ponnallle-Poovalle.js';
import song17 from './Anaswara-Sneha-Swaroopanayi.js';
import song18 from './Daivam-pirakkunnu.js';
import song19 from './Dhanumaasa-Kulirinte.js';

const modules = [
  song1,
  song2,
  song3,
  song4,
  song5,
  song6,
  song7,
  song8,
  song9,
  song10,
  song11,
  song12,
  song13,
  song14,
  song15,
  song16,
  song17,
  song18,
  song19,
];

const songsData = modules.map((content) => {
  const str = String(content || '');
  const idx = str.indexOf('$');
  if (idx === -1) return { title: str.trim(), lyrics: '' };
  const title = str.slice(0, idx).trim();
  const lyrics = str.slice(idx + 1).trim();
  return { title, lyrics };
});

export default songsData;
