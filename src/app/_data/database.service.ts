import {Injectable} from '@angular/core';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Catejercicios} from './_models/catejercicios';
import {Catentidades} from './_models/catentidades';
import {Catresponsables} from './_models/catresponsables';
import {Catservidores} from './_models/catservidores';
import {Cattiposauditoria} from './_models/cattiposauditoria';
import * as path from 'path';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;

  constructor() {
    const args = process.argv.slice(1);
    let serve: boolean = args.some(val => val === '--serve');
    console.log("path=>",path.join(__dirname, `/data/sqlite3.db`))
    this.options = {
      type: 'sqlite',
      database: (serve ? path.join(__dirname, `/data/sqlite3.db`) : './src/data/sqlite3.db'),
      entities: [Catejercicios,Catentidades,Catresponsables,Catservidores,Cattiposauditoria],
      synchronize: false,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}