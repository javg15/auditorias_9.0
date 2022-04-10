
import { Injectable } from '@angular/core';
import { Catejercicios } from 'src/app/_data/_models/catejercicios';

import {DatabaseService} from 'src/app/_data/database.service';
import {Connection} from 'typeorm';
import { AdminQry } from 'src/app/_data/queries/admin.qry'; 
const gral = require('src/app/_data/general.js')
const mensajesValidacion = require("src/app/_data/config/validate.config");

let Validator = require('fastest-validator');
/* create an instance of the validator */
let dataValidator = new Validator({
    useNewCustomCheckerFunction: true, // using new version
    messages: mensajesValidacion
});



@Injectable({
  providedIn: 'root'
})
export class CatejerciciosService {
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
      //const rawData = DB().query(`SELECT * FROM catejercicios where id=?`, [1]);
      
      if (req.solocabeceras == 1) {
          query = await this.qa.getAdmin('SELECT 0 AS ID,"" AS "Descripción"' +
              ',"" AS Ejercicio ' +
              ',"" AS Acciones', '&modo=10&id_usuario=0',this.conn);
            
      } else {
          query = await this.qa.getAdmin('SELECT a.id AS ID ' +
              ',a.descripcion AS "Descripción" ' +
              ',a.ejercicio AS Ejercicio ' +
              ',a.state AS Acciones ' +
              'FROM catejercicios AS a',
              "&modo=0&id_usuario=0" +
              "&inicio=" + (req.start!==null && req.start!==undefined ? req.start : 0) + "&largo=" + (req.length!==null && req.length!==undefined ? req.length : 0) +
              "&scampo=" + req.opcionesAdicionales.datosBusqueda.campo + "&soperador=" + req.opcionesAdicionales.datosBusqueda.operador + "&sdato=" + req.opcionesAdicionales.datosBusqueda.valor +
              "&ordencampo=" + req.columns[req.order[0].column].data +
              "&ordensentido=" + req.order[0].dir,this.conn)
          
      }
      
      
      datos=await this.conn.query(query);
      if (req.solocabeceras != 1) {
        for(let i=0;i<datos.length;i++){
          datos[i]["Acciones"]=this.qa.getAcciones(0,"todo",datos[i]["Acciones"]);
        }
      }
      
      

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

  /* El siguiente método lee los datos de un registro seleccionado para edición. */
  async getRecord(id: any): Promise<any> {
    
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Catejercicios)
    const Catejercicio=await rep.findOne({    id: id })
    if (!Catejercicio) {
        return { message: "Catejercicio Not found." };
    }
    return Catejercicio;
  }

  /* El siguiente método graba un registro nuevo, o uno editado. */
  async setRecord(dataPack, actionForm): Promise<any>  {

    Object.keys(dataPack).forEach(function(key) {
      if (key.indexOf("id_", 0) >= 0 
            || key.indexOf("ejercicio", 0) >= 0) {
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
        descripcion: { type: "string", min: 5, max: 100 },
        ejercicio: { type: "number", 
          custom(value, errors) {
              if ((value <= 1900 || value>=2050)) errors.push({ type: "required" })
              return value; // Sanitize: remove all special chars except numbers
          }
       },
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
    const rep = await this.conn.manager.getRepository(Catejercicios)
    const catejercicios =  await rep.findOne({    id: dataPack.id })
    dataPack.state = gral.GetStatusSegunAccion(actionForm);

    if (!catejercicios) {
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

  async getCatalogo(): Promise<any> {
    
    this.conn= await this.dbSvc.connection;
    return await this.conn.query("SELECT id,ejercicio as text,id as value,ejercicio as label "
      +"FROM catejercicios ORDER BY ejercicio");
    
  }

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
