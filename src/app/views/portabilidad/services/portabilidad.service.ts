
import { Injectable } from '@angular/core';

import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
import { AdminQry } from 'src/app/_data/queries/admin.qry'; 
const gral = require('src/app/_data/general.js')
const mensajesValidacion = require("src/app/_data/config/validate.config");
import { shell } from 'electron';
const electron = require('electron');
const fs = require('fs');
let bdDir = './src/data';


let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});



@Injectable({
  providedIn: 'root'
})
export class PortabilidadService {
  private modals: any[] = [];
  private conn:Connection;
  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor(private dbSvc: DatabaseService,private qa:AdminQry) { 
    
  }

  execPortabilidad(pathTarget:string): Promise<any> {
    //buscar si existe el registro
    let path = bdDir + '/sqlite3.db';
   
    fs.copyFile(path, pathTarget + '/sqlite3.db', (err) => {//fileSrc.name
      if (err){ throw err;}
      console.log('Archivo copiado a su destino');
      return true
    });
    return null;
  }

  
}
