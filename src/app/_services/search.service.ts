import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
/* Importamos los environments, para determinar la URL base de las API's */
import { environment } from '../../../src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class SearchService {

  public API_URL = environment.APIS_URL;
  private conn:Connection;

  constructor(private dbSvc: DatabaseService,private http: HttpClient) { }

  async getSearchcampos(nombreModulo: string): Promise<any> {

    this.conn= await this.dbSvc.connection;
    const query = "SELECT s.id,s.etiqueta as idesc,s.orden,s.edicion " +
        ",s.campo " +
        "FROM searchcampos as s " +
        "LEFT JOIN modulos AS m ON s.id_modulos=m.id " +
        "WHERE s.state='A' AND upper(m.ruta)=UPPER(?) " +
        "ORDER BY s.orden";
      
    const datos = await this.conn.query(query,[nombreModulo]);

    //console.log(JSON.stringify(respuesta));
    return {
      data: datos
    };
  }

  async getSearchoperadores(id_campo: number): Promise<any> {
    this.conn= await this.dbSvc.connection;
    const query = "SELECT so.id,so.etiqueta as idesc,so.orden " +
        "FROM searchoperador AS so " +
        "    INNER JOIN searchcampos AS sc ON so.tipo =sc.tipo " +
        "WHERE so.state='A' AND sc.id=? " +
        "ORDER BY so.orden,so.etiqueta";
      
    const datos = await this.conn.query(query,[id_campo]);

    //console.log(JSON.stringify(respuesta));
    return {
      data: datos
    };
  }
}
