import { Injectable } from '@angular/core';
import {ArchivosService} from 'src/app/views/catalogos/archivos/services/archivos.service';
import { shell } from 'electron';
const electron = require('electron');
const fs = require('fs');
let uploadDir = './uploads';

@Injectable({
  providedIn: 'root'
})
export class UploadFisicoFileService {


  constructor(private archivosSvc: ArchivosService) { }

  pushFileToStorage(fileSrc: File,ruta:string): Promise<any> {
    //buscar si existe el registro
    let path = uploadDir + '/' + ruta;
    console.log("ruta=>", path)
        /*nombre: req.file.originalname,
        datos: req.file.buffer*/

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
   
    fs.copyFile(fileSrc.path, path + '/' + fileSrc.name, (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });
    return null;
  }

  async listFile(id): Promise<any> {
    return await this.archivosSvc.getRecord(id)
  }

  //getFile(id): Observable<any> {
  async getFile(ruta){
    /*let re = /\//g;//reemplazar diagonal
    ruta=ruta.replace(re, "!");*/

    shell.openPath((electron.app || electron.remote.app).getAppPath() + "/uploads/" + ruta);
  }
}
