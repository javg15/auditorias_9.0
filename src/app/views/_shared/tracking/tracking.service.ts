import { Injectable } from '@angular/core';
import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  private conn:Connection;

  constructor(private dbSvc: DatabaseService) { }

  async getTracking(tabla: any,id_record:any) : Promise<any>  {
      this.conn= await this.dbSvc.connection;
      let datos="";
      try {
        //const rawData = DB().query(`SELECT * FROM auditoriareporte where id=?`, [1]);
        
        datos = await this.conn.query("SELECT t.id,'[' || replace(replace(t.contenido,'},','}'),'}{','},{') || ']' as contenido,t.fecha,coalesce(u.username,'') AS usuario,usuarios_pc " +
                  "FROM " + tabla + " AS t " +
                  "   LEFT JOIN usuarios AS u ON u.id=t.id_usuarios_r " +
                  "WHERE id_tabla=$1 " +
                  "ORDER BY fecha DESC "
              ,[id_record])
        if(datos.length>0)
          return datos
        else
          return null;
  
      } catch (err) {
          throw err;
      }
  }
}
