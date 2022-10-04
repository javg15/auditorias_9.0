
import { Injectable } from '@angular/core';
import { Archivos } from 'src/app/_data/_models/archivos';

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
export class ArchivosService {
  private modals: any[] = [];
  private conn:Connection;


  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor(private dbSvc: DatabaseService,private qa:AdminQry) { }

  
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
   /* const dataVSchema = {
     

        id: { type: "number" },
    };

    var vres:any = true;
    if (actionForm.toUpperCase() == "NUEVO" ||
        actionForm.toUpperCase() == "EDITAR") {
        vres = await dataValidator.validate(dataPack, dataVSchema);
    }

    // validation failed 
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
    }*/


    //buscar si existe el registro y almacenarlo
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Archivos)
    const archivos =  await rep.findOne({    id: dataPack.id, numero:dataPack.numero })


    if (!archivos) {
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
      console.log("dataPack.id=>", dataPack.id)
      // here self is your instance, but updated
      return { message: "success", id: dataPack.id };
    }
  }

  /* El siguiente método graba un registro nuevo, o uno editado. */
  async setRecordReferencia(dataPack, actionForm): Promise<any>  {

    //buscar si existe el registro y almacenarlo
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Archivos)
    const archivos =  await rep.findOne({    id: dataPack.id })

    if (archivos) {
      await rep.update(dataPack.id, dataPack)
      // here self is your instance, but updated
      return { message: "success", id: dataPack.id };
    }
  }

  async getRecord(id: any): Promise<any> {
    
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Archivos)
    const Archivo=await rep.find({    id: id })
    if (!Archivo) {
        return { message: "Archivo Not found." };
    }
    return Archivo;
  }

  async getRecords(id_parent:number,tabla:string){
    let query = 'SELECT * ' +
      'FROM archivos ' +
      'WHERE tabla="'+ tabla +'" AND id_tabla='+id_parent;

    let datos=await this.conn.query(query);

    for(let i=0;i<datos.length;i++){
      datos[i]["Acciones"]=this.qa.getAcciones(0,"todo",datos[i]["Acciones"]);
    }
    
    return datos;
  }

  /* El siguiente método graba un registro nuevo, o uno editado. */
  async removeRecord(id): Promise<any>  {
    //buscar si existe el registro y almacenarlo
    this.conn= await this.dbSvc.connection;
    const rep = await this.conn.manager.getRepository(Archivos)
        
    try{
      const self=await rep.delete({    id: id })
      // here self is your instance, but updated
      return { message: "success" };
    }catch(err){
      return { error: true, message: [err.errors[0].message] };
    };
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
