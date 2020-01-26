import Realm from 'realm';
import {Song} from './song';
import {Playlist} from './playlist';

// initData method to create the data the first time the app is started

export const initData = () => {
  const songs = [
    new Song(0, 'Avicii', 'Heaven'),
    new Song(1, 'Shakira', 'Waka Waka'),
    new Song(2, 'Post Malone', 'Circles'),
    new Song(3, 'Katy Perry', 'Dark Horse'),
    new Song(4, 'Ed Sheeran', 'Shape of You'),
    new Song(5, 'Maroon 5', 'Sugar'),
    new Song(6, 'Adele', 'Hello'),
    new Song(7, 'OneRepublic', 'Counting Stars'),
    new Song(8, 'Queen', 'Bohemian Rhapsody'),
    new Song(9, 'Deep Purple', 'Smoke On The Water'),
    new Song(10, 'Nirvana', 'Smells Like Teen Spirit'),
    new Song(11, 'Steppenwolf', 'Born To Be Wild'),
    new Song(12, 'Kina', 'Get You the Moon'),
    new Song(13, 'Petit Biscuit', 'Sunset Lover'),
    new Song(14, 'Avicii', 'Levels'),
    new Song(15, 'Avicii', 'Wake Me Up'),
  ];

  const playlists = [
    new Playlist(0, 'Favorite Songs', 'purple', []),
    new Playlist(1, 'Rock', 'green', []),
    new Playlist(2, 'Pop', 'blue', []),
    new Playlist(3, 'Electronic', 'yellow', []),
  ];

  Realm.open({schema: [Song.schema, Playlist.schema]})
    .then(realm => {
      songs.forEach(song => {
        realm.write(() => {
          realm.create(Song.schema.name, song);
        });
      });
      playlists.forEach(playlist => {
        realm.write(() => {
          realm.create(Playlist.schema.name, playlist);
        });
      });

      realm.close();
    })
    .catch(error => {
      console.log(error);
    });
};
