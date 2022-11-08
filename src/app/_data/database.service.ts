import {Injectable} from '@angular/core';
import {Connection, ConnectionOptions, createConnection} from 'typeorm';
import {Archivos} from './_models/archivos';
import {Auditorias} from './_models/auditorias';
import {Auditoriasdetalle} from './_models/auditoriasdetalle';
import {Auditoriasanexos} from './_models/auditoriasanexos';
import {Auditoriasejercicios} from './_models/auditoriasejercicios';
import {Catejercicios} from './_models/catejercicios';
import {Catentidades} from './_models/catentidades';
import {Catresponsables} from './_models/catresponsables';
import {Catservidores} from './_models/catservidores';
import {Cattiposauditoria} from './_models/cattiposauditoria';
import { Catestatus } from './_models/catestatus';
import { Usuarios } from './_models/usuarios';
import * as path from 'path';


import fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public connection: Promise<Connection>;
  private readonly options: ConnectionOptions;

  constructor() {
    const args = process.argv.slice(1);
    //let serve: boolean = args.some(val => val === '--serve');
    const data = fs.readFileSync('./config.json');
    const json = data.toString('utf8');
    //console.log(`settings JSON: ${json}`);
    let jsonSettings = JSON.parse(json);
    
    this.options = {
      type: 'sqlite',
      database: jsonSettings.path_data + '/src/data/sqlite3.db',
      entities: [Usuarios,Catejercicios,Catentidades,Catresponsables,Catservidores,Cattiposauditoria,Auditorias,Auditoriasdetalle,Auditoriasanexos,Auditoriasejercicios,Archivos,Catestatus],
      synchronize: false,
      logging: 'all'
    };
    this.connection = createConnection(this.options);
  }
}