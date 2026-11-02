import songsData, { activeSongs, songCatalog } from './index';

test('only active songs are available to the app', () => {
  const catalog = [
    { content: 'Visible song $ First line', active: true },
    { content: 'Hidden song $ Secret line', active: false },
  ];

  expect(activeSongs(catalog)).toEqual([{ title: 'Visible song', lyrics: 'First line' }]);
  expect(songsData).toEqual(activeSongs(songCatalog));
});

test('shows only the title of Parithilinnoru in the songbook', () => {
  const song = songsData.find(({ title }) => title === 'Parithilinnoru rajakumaranayi');

  expect(song).toBeDefined();
  expect(song.lyrics).toMatch(/^Parithilinnoru rajakumaranayi vannu pirannoru sundarane\./);
});

test('rejects a song without a title/lyrics separator', () => {
  expect(() => activeSongs([{ content: 'Title\nLyrics', active: true }]))
    .toThrow('Song is missing the title/lyrics separator ($)');
});
