
import { Injectable } from '@angular/core';
import { Auditoriasdetalle } from 'src/app/_data/_models/auditoriasdetalle';

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
export class AuditoriasdetalleService {
  private modals: any[] = [];
  private conn:Connection;

  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor(private dbSvc: DatabaseService,private qa:AdminQry) { 
    
  }

  async getHeaders(): Promise<any>  {
    return this.getAdmin(
      { solocabeceras: 1, opcionesAdicionales: { raw: 0 } }
    );
  }

  async getAdmin(dataTablesParameters: any): Promise<any> {
    
    this.conn= await this.dbSvc.connection;
    try {
      
      let req:any = dataTablesParameters,
          datos:any = "",
          query = "";
      //const rawData = DB().query(`SELECT * FROM auditoriadetalle where id=?`, [1]);
      
      if (req.solocabeceras == 1) {
          query = await this.qa.getAdmin('SELECT 0 AS ID,"" AS Punto' +
              ',"" AS Nombre ' +
              ',"" AS "Fecha de recepción" ' +
              ',"" AS "Fecha límite" ' +
              ',"" AS Oficio ' +
              ',"" AS Acciones', '&modo=10&id_usuario=0',this.conn);
            
      } else {
          query = await this.qa.getAdmin('SELECT a.id AS ID ' +
              ',a.punto AS Punto ' +
              ',a.observacion AS Nombre ' +
              ',a.fecharecepcion AS "Fecha de recepción" ' +
              ',a.fechalimite AS "Fecha límite" ' +
              ',a.oficio AS Oficio ' +
              ',a.state AS Acciones ' +
              'FROM auditoriasdetalle AS a ' 
              ,
              "&modo=" + req.opcionesAdicionales.modo + "&id_usuario=0" +
              "&inicio=" + (req.start!==null && req.start!==undefined ? req.start : 0) + "&largo=" + (req.length!==null && req.length!==undefined ? req.length : 0) +
              "&fkey=" + req.opcionesAdicionales.fkey +
              "&fkeyvalue=" + req.opcionesAdicionales.fkeyvalue,this.conn)
          
      }
      
      
      datos=await this.conn.query(query);
      if (req.solocabeceras != 1) {
        for(let i=0;i<datos.length;i++){
          datos[i]["Acciones"]=this.qa.getAcciones(0,"todo",datos[i]["Acciones"]);
        }
      }

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
  }

  /* El siguiente método lee los datos de un registro seleccionado para edición. */
  async getRecord(id: any): Promise<any> {
    
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Auditoriasdetalle)
    const Auditoriadetalle=await rep.findOne({    id: id })
    if (!Auditoriadetalle) {
        return { message: "Auditoriadetalle Not found." };
    }
    return Auditoriadetalle;
  }

  /* El siguiente método graba un registro nuevo, o uno editado. */
  async setRecord(dataPack, actionForm): Promise<any>  {

    Object.keys(dataPack).forEach(function(key) {
      if (key.indexOf("id_", 0) >= 0) {
          if (dataPack[key] != '')
              dataPack[key] = parseInt(dataPack[key]);
      }
      if (key.indexOf("clave", 0) >= 0) {
          dataPack[key] = dataPack[key].toString();
      }
      if (typeof dataPack[key] == 'number' && isNaN(parseFloat(dataPack[key]))) {
          dataPack[key] = null;
      }
    })

    /* customer validator shema */
    const dataVSchema = {
        /*first_name: { type: "string", min: 1, max: 50, pattern: namePattern },*/

        id: { type: "number" },
        id_auditorias: { type: "number" },
        punto: { type: "string"},
        observacion: { type: "string", empty: false },
        fecharecepcion: { type: "string", 
            custom(value, errors) {
              let dateIni = new Date(value)
              let dateFin = new Date()

              if (dateIni > dateFin)
                  errors.push({ type: "dateMax", field: "fechaobservacion", expected: dateFin.toISOString().split('T')[0] })

              if (!moment(value).isValid() || !moment(value).isBefore(new Date()) || !moment(value).isAfter('1900-01-01'))
                  errors.push({ type: "date" })
              return value;
          },
        },
        fechalimite: { type: "string", 
            custom(value, errors) {
              let dateIni = new Date(value)
              let dateFin = new Date()

              if (!moment(value).isValid() || !moment(value).isAfter('1900-01-01'))
                  errors.push({ type: "date" })
              return value;
          },
        },
        oficio: { type: "string", empty: false },
        
    };

    var vres:any = true;
    if (actionForm.toUpperCase() == "NUEVO" ||
        actionForm.toUpperCase() == "EDITAR") {
        vres = await dataValidator.validate(dataPack, dataVSchema);
    }

    /* validation failed */
    if (!(vres === true)) {
        let errors = {},
            item;

        for (const index in vres) {
            item = vres[index];

            errors[item.field] = item.message;
        }

        return {
            "error": true,
            "message": errors
        };
    }


    //buscar si existe el registro y almacenarlo
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Auditoriasdetalle)
    const auditoriadetalle =  await rep.findOne({    id: dataPack.id })
    dataPack.state = gral.GetStatusSegunAccion(actionForm);

    if (!auditoriadetalle) {
        delete dataPack.id;
        
        try{
          const self=await rep.insert(dataPack)
        
          console.log("self.id=>", Number(self.identifiers[0].id))
                // here self is your instance, but updated
          return { message: "success", id: Number(self.identifiers[0].id) };
        }catch(err){
            return { error: true, message: [err.errors[0].message] };
        };
    } else {

      await rep.update(dataPack.id, dataPack)
      // here self is your instance, but updated
      return { message: "success", id: dataPack.id };
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
