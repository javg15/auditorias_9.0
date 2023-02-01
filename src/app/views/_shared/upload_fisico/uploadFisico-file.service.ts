import { Injectable } from '@angular/core';
import {ArchivosService} from 'src/app/views/catalogos/archivos/services/archivos.service';
import { shell } from 'electron';
const electron = require('electron');
const fs = require('fs');
//let uploadDir = 'C:/auditoria_files/uploads';

@Injectable({
  providedIn: 'root'
})
export class UploadFisicoFileService {
  private modals: any[] = [];

  constructor(private archivosSvc: ArchivosService) { }

  pushFileToStorage(fileSrc: File,ruta:string): Promise<any> {
    //generar un uuid aleatorio para el nombre de archivo interno, así no se sobreesriben los archivos
    let nombreUuid='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    })
    //buscar si existe el registro
    const data = fs.readFileSync('./config.json');
    const json = data.toString('utf8');

    let jsonSettings = JSON.parse(json);
    let uploadDir=jsonSettings.path_data;
    let path = uploadDir + '/uploads/' + ruta;
        /*nombre: req.file.originalname,
        datos: req.file.buffer*/

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
   //console.log("file=>",path + '/' + nombreUuid + '.' + fileSrc.name.split('.').pop())
    fs.copyFile(fileSrc.path, path + '/' + nombreUuid + '.' + fileSrc.name.split('.').pop(), (err) => {//fileSrc.name
      if (err){ throw err;}
      console.log('source.txt was copied to destination.txt');
      return {"uuid":nombreUuid};
    });
    return Promise.resolve({"uuid":nombreUuid});
  }

  async listFile(id): Promise<any> {
    return await this.archivosSvc.getRecord(id)
  }

  async listTablaFile(id_parent,tabla): Promise<any> {
    return await this.archivosSvc.getRecords(id_parent,tabla)
  }
  

  //getFile(id): Observable<any> {
  async getFile(ruta){
    //let dir=(electron.app || electron.remote.app).getAppPath()
    const data = fs.readFileSync('./config.json');
    const json = data.toString('utf8');

    let jsonSettings = JSON.parse(json);
    let dir=jsonSettings.path_data;

    //console.log("(antes)dir=>",dir)
    if(dir.indexOf("\\resources\\app")>=0)
      dir=dir.replace("\\resources\\app","")
    //console.log("(desp)dir=>",dir)
    //console.log("dir=>",dir + "/uploads/" + ruta)
    shell.openPath( dir + "/uploads/" + ruta);
  }

  async removeFile(id,ruta){
    await this.archivosSvc.removeRecord(id)
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
