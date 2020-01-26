// Song model class for database

export class Song {
  public id: number;
  public title: string;
  public artist: string;
  constructor(id: number, title: string, artist: string) {
    this.id = id;
    this.title = title;
    this.artist = artist;
  }

  static schema: Realm.ObjectSchema = {
    name: 'Song',
    primaryKey: 'id',
    properties: {
      id: 'int',
      title: 'string',
      artist: 'string',
    },
  };
}
