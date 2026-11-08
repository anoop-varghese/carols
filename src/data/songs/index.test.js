import songsData, { activeSongs, songCatalog } from './index';

test('only active songs are available to the app', () => {
  const catalog = [
    { title: 'Visible song', content: 'First line', active: true },
    { title: 'Hidden song', content: 'Secret line', active: false },
  ];

  expect(activeSongs(catalog)).toEqual([{ title: 'Visible song', lyrics: 'First line', otherLangContent: '' }]);
  expect(songsData).toEqual(activeSongs(songCatalog));
});

test('shows only the title of Parithilinnoru in the songbook', () => {
  const song = songsData.find(({ title }) => title === 'Parithilinnoru rajakumaranayi');

  expect(song).toBeDefined();
  expect(song.lyrics).toMatch(/^Parithilinnoru rajakumaranayi vannu pirannoru sundarane\./);
});

test('includes the paired language song name when provided', () => {
  expect(activeSongs([{ title: 'Song', content: 'Lyrics', active: true, otherLangContent: 'Alternate lyrics' }]))
    .toEqual([{ title: 'Song', lyrics: 'Lyrics', otherLangContent: 'Alternate lyrics' }]);
});
