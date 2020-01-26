import {Song} from './song';

// Playlist model class for database

export class Playlist {
  public id: number;
  public name: string;
  public color: string;
  public songs: Song[];
  constructor(id: number, name: string, color: string, songs: Song[]) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.songs = songs;
  }

  static schema: Realm.ObjectSchema = {
    name: 'Playlist',
    primaryKey: 'id',
    properties: {
      id: 'int',
      name: 'string',
      color: 'string',
      songs: 'Song[]',
    },
  };
}
