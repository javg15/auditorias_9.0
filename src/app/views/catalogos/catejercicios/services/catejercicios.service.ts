
import { Injectable } from '@angular/core';
import { Catejercicios } from '../../../../_data/_models/catejercicios';
import { Observable, of } from 'rxjs';
import {DatabaseService} from '../../../../_data/database.service';
import {Connection} from 'typeorm';

import qa from "../../../../_data/queries/admin.qry.js";

@Injectable({
  providedIn: 'root'
})
export class CatejerciciosService {
  private modals: any[] = [];
  private conn:Connection;
  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor(private dbSvc: DatabaseService) { 
    
  }

  async getHeaders(): Promise<any>  {
    return this.getAdmin(
      { solocabeceras: 1, opcionesAdicionales: { raw: 0 } }
    );
    
    
  }

  async getAdmin(dataTablesParameters: any): Promise<any> {
    
    try {
      
      let req:any = dataTablesParameters,
          datos:any = "",
          query = "";
      //const rawData = DB().query(`SELECT * FROM catejercicios where id=?`, [1]);
      
      if (req.solocabeceras == 1) {
          query = qa.getAdmin('SELECT 0 AS ID,0 AS Clave,"" AS "Descripción"' +
              ',"" AS Ejercicio ' +
              ',"" AS Acciones', '&modo=10&id_usuario=0',this.conn);
            
      } else {
          query = qa.getAdmin('SELECT a.id AS ID ' +
              ',a.descripcion AS "Descripción" ' +
              ',a.ejercicio AS Ejercicio ' +
              ',"" AS Acciones ' +
              'FROM catejercicios AS a',
              "&modo=0&id_usuario=0" +
              "&inicio=" + (req.start!==null && req.start!==undefined ? req.start : 0) + "&largo=" + (req.length!==null && req.length!==undefined ? req.length : 0) +
              "&scampo=" + req.opcionesAdicionales.datosBusqueda.campo + "&soperador=" + req.opcionesAdicionales.datosBusqueda.operador + "&sdato=" + req.opcionesAdicionales.datosBusqueda.valor +
              "&ordencampo=" + req.columns[req.order[0].column].data +
              "&ordensentido=" + req.order[0].dir,this.conn)
          
      }
      console.log("query=>",await this.dbSvc.connection)
      this.conn= await this.dbSvc.connection;
      console.log("this.conn=>",this.conn)
      datos=await this.conn.query(query)
      console.log("datos=>",datos)
      

      /*this.dbSvc
              .connection
              .then(function (c) {
                datos=c.query(query)
                console.log("datos=>",datos)
              })
              */

      var columnNames = (datos.length > 0 ? Object.keys(datos[0]).map(function(key) {
          return key;
      }) : []);
      var quitarKeys = false;

      for (var i = 0; i < columnNames.length; i++) {
          if (columnNames[i] == "total_count") quitarKeys = true;
          if (quitarKeys)
              columnNames.splice(i);
      }

      return {
        draw: req.opcionesAdicionales.raw,
        recordsTotal: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
        recordsFiltered: (datos.length > 0 ? parseInt(datos[0].total_count) : 0),
        data: datos,
        columnNames: columnNames
      };
    } catch (err) {
        throw err;
    }
    /*return of({
      draw: 1,
      recordsTotal: 10,
      recordsFiltered: 100,
      data: ["uno"],
      columnNames: ["uno"]
    });*/
  }

  /*getItems(): Observable<any> {
    try {
      return of({ datos : DB().query("SELECT * FROM catejercicios")}).pipe();
    } catch (err) {
        throw err;
    }
  }*/

  // array de modales
  public add(modal: any) {
    this.modals.push(modal);
  }

  public remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  public open(id: string, accion: string, idItem: number) {
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open(idItem, accion);
  }

  public close(id: string) {
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
