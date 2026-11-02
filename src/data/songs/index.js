import vannudicchallo from './VANNUDICCHALLO-EE-RAVIL.js';
import paadiPaadi from './PAADI-PAADI-PAADI-POYEEDAAM.js';
import mariyaame from './Mariyaame-naarigalil.js';
import rajadhiRajan from './Rajadhi-Rajan.js';
import seeyonManavalan from './Seeyon-Manavalan.js';
import tharagam from './Tharagam-pon-tharagam-pon.js';
import rajanayi from './Rajanayi-bhuviyil-Jadhanayi.js';
import haJayageetham from './Ha-Jayageetham-naam-paadidam.js';
import innidha from './Innidha-Vinsudhan-Jadhanayi.js';
import samSamSam from './Sam-Sam-Sam.js';
import sundhara from './Sundhara-sudhinam.js';
import aanandhame from './Aanandhame-Daiva.js';
import bethehem from './Bethehem-puriyilae-vannu.js';
import prabhaThooki from './Prabha-Thooki.js';
import poyidam from './Poyidam.js';
import ponnallle from './Ponnallle-Poovalle.js';
import anaswara from './Anaswara-Sneha-Swaroopanayi.js';
import daivamPirakkunnu from './Daivam-pirakkunnu.js';
import dhanumaasa from './Dhanumaasa-Kulirinte.js';
import Parithilinnoru from './Parithilinnoru-rajakumaranayi.js';

// Set active to false to keep a song in the catalog without showing it in the app.
// For a new song, add its file above and an entry here. Changes take effect on deployment.
export const songCatalog = [
  { content: vannudicchallo, active: true },
  { content: paadiPaadi, active: true },
  { content: mariyaame, active: true },
  { content: rajadhiRajan, active: true },
  { content: seeyonManavalan, active: true },
  { content: tharagam, active: true },
  { content: rajanayi, active: true },
  { content: haJayageetham, active: true },
  { content: innidha, active: true },
  { content: samSamSam, active: true },
  { content: sundhara, active: true },
  { content: aanandhame, active: true },
  { content: bethehem, active: true },
  { content: prabhaThooki, active: true },
  { content: poyidam, active: true },
  { content: ponnallle, active: true },
  { content: anaswara, active: true },
  { content: daivamPirakkunnu, active: true },
  { content: dhanumaasa, active: true },
  { content: Parithilinnoru, active: true },
];

export function activeSongs(catalog) {
  return catalog.filter(({ active }) => active).map(({ content }) => {
    const str = String(content || '');
    const idx = str.indexOf('$');
    if (idx === -1) throw new Error(`Song is missing the title/lyrics separator ($): ${str.slice(0, 60)}`);
    return { title: str.slice(0, idx).trim(), lyrics: str.slice(idx + 1).trim() };
  });
}

export default activeSongs(songCatalog);
