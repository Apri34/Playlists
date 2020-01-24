import Song from './song';

// Playlist model

export default class Playlist {
  id: number;
  name: String;
  color: string;
  songs: Song[];
  constructor(id: number, name: String, color: string) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.songs = [];
  }
}
