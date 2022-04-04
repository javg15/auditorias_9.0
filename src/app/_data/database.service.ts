import {Injectable} from '@angular/core';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Catejercicios} from './_models/catejercicios';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;

  constructor() {
    this.options = {
      type: 'sqlite',
      database: 'src/app/_data/sqlite3.db',
      entities: [Catejercicios],
      synchronize: false,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}