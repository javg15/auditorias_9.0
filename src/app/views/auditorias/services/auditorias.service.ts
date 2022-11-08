
import { Injectable } from '@angular/core';
import { Auditorias } from 'src/app/_data/_models/auditorias';
import { Auditoriasejercicios } from 'src/app/_data/_models/auditoriasejercicios';
import { TokenStorageService } from '../../../_services/token-storage.service';

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
export class AuditoriasService {
  private modals: any[] = [];
  private conn:Connection;

  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor(private dbSvc: DatabaseService,
        private tokenStorage:TokenStorageService,
        private qa:AdminQry) { 
    
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
      //const rawData = DB().query(`SELECT * FROM auditoria where id=?`, [1]);
      
      if (req.solocabeceras == 1) {
          query = await this.qa.getAdmin('SELECT 0 AS ID,"" AS ORFIS' +
              ',"" AS Nombre ' +
              ',"" AS Ejercicio ' +
              ',"" AS Tipo ' +
              ',"" AS Rubros ' +
              ',"" AS "Oficio de notificación" ' +
              ',"" AS Acciones', '&modo=10&id_usuario=0',this.conn);
            
      } else {
          query = await this.qa.getAdmin('SELECT a.id AS ID ' +
              ',e.nombrecorto AS ORFIS ' +
              ',a.nombre AS Nombre ' +
              ',GROUP_CONCAT(cej.ejercicio) AS Ejercicio ' +
              ',ta.nombre AS Tipo ' +
              ',a.rubros AS Rubros ' +
              ',a.numerooficio AS "Oficio de notificación" ' +
              ',' + 
              (this.tokenStorage.getUser().id_permgrupos=="AD"
                  ?'"editar,eliminar,reporte"'
                  :'"ver,reporte"'
              ) +
              ' AS Acciones ' +
              'FROM auditorias AS a ' +
              ' LEFT JOIN catentidades AS e ON a.id_catentidades=e.id ' +
              ' LEFT JOIN auditoriasejercicios AS ej ON a.id=ej.id_auditorias ' +
              ' 	LEFT JOIN catejercicios AS cej ON ej.id_catejercicios=cej.id ' +
              ' LEFT JOIN cattiposauditoria AS ta ON a.id_cattiposauditoria=ta.id '
              ,
              "&modo=0&id_usuario=0" +
              "&inicio=" + (req.start!==null && req.start!==undefined ? req.start : 0) + "&largo=" + (req.length!==null && req.length!==undefined ? req.length : 0) +
              "&scampo=" + req.opcionesAdicionales.datosBusqueda.campo + "&soperador=" + req.opcionesAdicionales.datosBusqueda.operador + "&sdato=" + req.opcionesAdicionales.datosBusqueda.valor +
              "&ordencampo=" + req.columns[req.order[0].column].data +
              "&ordensentido=" + req.order[0].dir + "&groupby=a.id"
              ,this.conn)
          
      }
      
      datos=await this.conn.query(query);
      /*if (req.solocabeceras != 1) {
        for(let i=0;i<datos.length;i++){
          datos[i]["Acciones"]=this.qa.getAcciones(0,"todo",datos[i]["Acciones"]);
        }
      }*/

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
    const rep = await this.conn.manager.getRepository(Auditorias)
    const repE = await this.conn.manager.getRepository(Auditoriasejercicios)
    const Auditoria=await rep.findOne({    id: id })
    const AuditoriaE=await repE.find({    id_auditorias: id })
    
    if (!Auditoria) {
        return { message: "Auditoria Not found." };
    }
    //unir los id de ejercicios en el campo id_catejercicios del objeto Auditoria
    Auditoria.id_catejercicios=AuditoriaE.map(e=>e.id_catejercicios).join(",");
    //console.log("Auditoria.id_catejercicios=>",Auditoria.id_catejercicios)
    return Auditoria;
  }

  /* El siguiente método graba un registro nuevo, o uno editado. */
  async setRecord(dataPack, actionForm): Promise<any>  {

    Object.keys(dataPack).forEach(function(key) {
      if (key.indexOf("id_catejercicios", 0) < 0 &&
          (key.indexOf("id_", 0) >= 0)) {
          if (dataPack[key] != '')
              dataPack[key] = parseInt(dataPack[key]);
      }
      if (key.indexOf("id_catejercicios", 0) >= 0) {
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
        nombre: { type: "string", empty: false},
        numerooficio: { type: "string", empty: false},
        numeroauditoria: { type: "string", empty: false},
        fecha: { type: "string", 
            custom(value, errors) {
              let dateIni = new Date(value)
              let dateFin = new Date()

              if (dateIni > dateFin)
                  errors.push({ type: "dateMax", field: "fecha", expected: dateFin.toISOString().split('T')[0] })

              if (!moment(value).isValid() || !moment(value).isBefore(new Date()) || !moment(value).isAfter('1900-01-01'))
                  errors.push({ type: "date" })
              return value;
          },
        },
        periodoini: { type: "string", empty: false},
        periodofin: { type: "string", empty: false},
        marcolegal: { type: "string", empty: false},
        id_catservidores: { type: "number", 
          custom(value, errors) {
              if (value <= 0) errors.push({ type: "selection" })
              return value; // Sanitize: remove all special chars except numbers
          }
        },
        id_cattiposauditoria: { type: "number", 
          custom(value, errors) {
              if (value <= 0) errors.push({ type: "selection" })
              return value; // Sanitize: remove all special chars except numbers
          }
        },
        id_catentidades: { type: "number", 
          custom(value, errors) {
              if (value <= 0) errors.push({ type: "selection" })
              return value; // Sanitize: remove all special chars except numbers
          }
        },
        id_catejercicios: { type: "string", 
          custom(value, errors) {
              if (value.length <= 0) errors.push({ type: "selection" })
              return value; // Sanitize: remove all special chars except numbers
          }
        },
        id_catresponsables: { type: "number", 
          custom(value, errors) {
              if (value <= 0) errors.push({ type: "selection" })
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
    const rep = await this.conn.manager.getRepository(Auditorias)
    const auditoria =  await rep.findOne({    id: dataPack.id })
    dataPack.state = gral.GetStatusSegunAccion(actionForm);

    if (!auditoria) {
        delete dataPack.id;
        dataPack.created_at=moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
        try{
          const self=await rep.insert(dataPack)
          
                // here self is your instance, but updated
          return { message: "success", id: Number(self.identifiers[0].id) };
        }catch(err){
            return { error: true, message: [err.errors[0].message] };
        };
    } else {
      dataPack.updated_at=moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      await rep.update(dataPack.id, dataPack)
      // here self is your instance, but updated
      return { message: "success", id: dataPack.id };
    }
  }

  async updateEjercicios(id,catejercicios){
    this.conn= await this.dbSvc.connection;
    const repE = await this.conn.manager.getRepository(Auditoriasejercicios)

    //eliminar todos los registros segun auditoria
    repE.delete({ id_auditorias: id }).then(async (resp)=>{
      //convertir en array
      let ce=catejercicios.split(",")
      for(let i=0;i<ce.length;i++){
        //buscar si existe el registro
        repE.find({   id_auditorias: id,id_catejercicios:ce[i] }).then(async (repAE)=>{
          if(repAE.length==0)//si no existe
            await repE.insert({ id_auditorias: id,id_catejercicios:ce[i] })
        })
      }
    })

    
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
    modal.open(idItem, accion, idItem);
  }

  public close(id: string) {
    let modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
