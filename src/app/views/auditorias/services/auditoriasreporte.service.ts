
import { Injectable } from '@angular/core';
import { Auditoriasreporte } from 'src/app/_data/_models/auditoriasreporte';
import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
import { AdminQry } from 'src/app/_data/queries/admin.qry'; 
const gral = require('src/app/_data/general.js')
const mensajesValidacion = require("src/app/_data/config/validate.config");
var moment = require('moment');

let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});

@Injectable({
  providedIn: 'root'
})
export class AuditoriasreporteService {
  private modals: any[] = [];
  private conn:Connection;

  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor(private dbSvc: DatabaseService,private qa:AdminQry) { 
    
  }

  async getAdmin(id_auditoria: any): Promise<any> {
    
    this.conn= await this.dbSvc.connection;
    let datos="";
    try {
      //const rawData = DB().query(`SELECT * FROM auditoriareporte where id=?`, [1]);
      
      datos = await this.conn.query("SELECT a.id,"
            + "a.nombre,"
            + "ce.nombrecorto AS desc_catentidades,"
            + "a.numerooficio,"
            + "GROUP_CONCAT(DISTINCT ae.id_catejercicios) AS id_catejercicios,"
            + "a.fecha,"
            + "a.periodoini,"
            + "a.periodofin,"
            + "ca.nombre AS desc_cattiposauditoria,"
            + "cs.nombre AS desc_catservidores,"
            + "cr.nombre AS desc_catresponsables,"
            + "a.rubros,"
            + "a.numeroauditoria,"
            + "a.objetivo,"
            + "a.marcolegal,"
            + "GROUP_CONCAT(DISTINCT '{\"punto\":\"' || ad.punto || '\",\"observacion\":\"' || ad.observacion || '\",\"fecharecepcion\":\"' || ad.fecharecepcion || '\",\"fechalimite\":\"' || ad.fechalimite || '\",\"oficio\":\"' || ad.oficio || '\",\"id\":\"' || ad.id || '\"}') AS Detalle, "
            + "GROUP_CONCAT('{\"puntoanexo\":\"' || aa.puntoanexo || '\",\"nombre\":\"' || aa.nombre || '\",\"id_auditoriasdetalle\":\"' || aa.id_auditoriasdetalle || '\"}') AS Anexo "
            + "FROM auditorias AS a "
            + " LEFT JOIN auditoriasdetalle AS ad ON a.id=ad.id_auditorias "
            + " LEFT JOIN auditoriasanexos AS aa ON ad.id=aa.id_auditoriasdetalle "
            + " LEFT JOIN auditoriasejercicios AS ae ON a.id=ae.id_auditorias "
            + " LEFT JOIN catentidades AS ce ON a.id_catentidades=ce.id "
            + " LEFT JOIN cattiposauditoria AS ca ON a.id_cattiposauditoria=ca.id "
            + " LEFT JOIN catservidores AS cs ON a.id_catservidores=cs.id "
            + " LEFT JOIN catresponsables AS cr ON a.id_catresponsables=cr.id "
            + "WHERE a.id=$1 "
            + "GROUP BY a.id"
            ,[id_auditoria])
      if(datos.length>0)
        return datos[0];
      else
        return new Auditoriasreporte();

    } catch (err) {
        throw err;
    }
  }


  


  // array de modales
  public add(modal: any) {
      this.modals.push(modal);
  }

  public remove(id: string) {
      this.modals = this.modals.filter(x => x.id !== id);
  }

  public open(id: string, accion: string, idItem: number,idParent:number) {
      let modal: any = this.modals.filter(x => x.id === id)[0];
      modal.open(idItem, accion,idParent);
  }

  public close(id: string) {
      let modal: any = this.modals.filter(x => x.id === id)[0];
      modal.close();
  }
}
