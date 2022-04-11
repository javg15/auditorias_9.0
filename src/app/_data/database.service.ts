import {Injectable} from '@angular/core';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Auditorias} from './_models/auditorias';
import {Auditoriasdetalle} from './_models/auditoriasdetalle';
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
    //let serve: boolean = args.some(val => val === '--serve');
    
    this.options = {
      type: 'sqlite',
      database: './src/data/sqlite3.db',
      entities: [Catejercicios,Catentidades,Catresponsables,Catservidores,Cattiposauditoria,Auditorias,Auditoriasdetalle],
      synchronize: false,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}