// Song model
export default class Song {
  id: number;
  artist: String;
  title: String;
  constructor(id: number, artist: String, title: String) {
    this.id = id;
    this.artist = artist;
    this.title = title;
  }
}
