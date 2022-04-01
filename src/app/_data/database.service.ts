import {Injectable} from '@angular/core';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {User} from './_models/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;

  constructor() {
    this.options = {
      type: 'sqlite',
      database: 'sqlite3.db',
      entities: [User],
      synchronize: true,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}