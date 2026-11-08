import vannudicchallo from './VANNUDICCHALLO-EE-RAVIL.js';
import paadiPaadi from './PAADI-PAADI-PAADI-POYEEDAAM.js';
import mariyaame from './Mariyaame-naarigalil.js';
import rajadhiRajan from './Rajadhi-Rajan.js';
import seeyonManavalan from './Seeyon-Manavalan.js';
import seeyonManavalanMalayalam from './Seeyon-Manavalan-Malayalam.js';
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
import VaruAarunodayame from './Varu-arunodayame.js';
import VaruAarunodayameMalayalam from './Varu-arunodayame-Malayalam.js';

// Set active to false to keep a song in the catalog without showing it in the app.
// For a new song, add its file above and an entry here. Changes take effect on deployment.
export const songCatalog = [
  { title: 'VANNUDICCHALLO EE RAVIL', content: vannudicchallo, active: true },
  { title: 'PAADI PAADI PAADI POYEEDAAM', content: paadiPaadi, active: true },
  { title: 'Mariyaame naarigalil', content: mariyaame, active: true },
  { title: 'Rajadhi Rajan', content: rajadhiRajan, active: true },
  { title: 'Seeyon Manavalan', content: seeyonManavalan, active: true, otherLangContent: seeyonManavalanMalayalam },
  { title: 'Tharagam pon tharagam pon', content: tharagam, active: true },
  { title: 'Rajanayi bhuviyil Jadhanayi', content: rajanayi, active: true },
  { title: 'Ha Jayageetham naam paadidam', content: haJayageetham, active: true },
  { title: 'Innidha Vinsudhan Jadhanayi', content: innidha, active: true },
  { title: 'Sam Sam Sam', content: samSamSam, active: true },
  { title: 'Sundhara sudhinam', content: sundhara, active: true },
  { title: 'Aanandhame! Daiva', content: aanandhame, active: true },
  { title: 'Bethehem puriyilae vannu', content: bethehem, active: true },
  { title: 'Prabha Thooki', content: prabhaThooki, active: false },
  { title: 'Poyidam', content: poyidam, active: false },
  { title: 'Ponnallle poovalle', content: ponnallle, active: false },
  { title: 'Anaswara Sneha Swaroopanayi', content: anaswara, active: true },
  { title: 'Daivam pirakkunnu', content: daivamPirakkunnu, active: true },
  { title: 'Dhanumaasa Kulirinte', content: dhanumaasa, active: true },
  { title: 'Parithilinnoru rajakumaranayi', content: Parithilinnoru, active: true },
  { title: 'Varu arunodayame', content: VaruAarunodayame, active: true, otherLangContent: VaruAarunodayameMalayalam },
];

export function activeSongs(catalog) {
  return catalog.filter(({ active }) => active).map(({ title, content, otherLangContent = '' }) => ({
    title,
    lyrics: String(content || '').trim(),
    otherLangContent: String(otherLangContent || '').trim(),
  }));
}

export default activeSongs(songCatalog);
