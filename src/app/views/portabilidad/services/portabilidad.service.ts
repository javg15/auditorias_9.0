
import { Injectable } from '@angular/core';

const fse = require('fs-extra');
const fs = require('fs');
const AdmZip = require("adm-zip");
const path = require("path");


@Injectable({
  providedIn: 'root'
})
export class PortabilidadService {
  private modals: any[] = [];
  /* En el constructor creamos el objeto http de la clase HttpClient,
  que estará disponible en toda la clase del servicio.
  Se define como public, para que sea accesible desde los componentes necesarios */
  constructor() { 
    
  }

  async execPortabilidad(pathTarget:string,zip:boolean): Promise<any> {
    if(zip){
      this.zipDirectory('./src/data/;./uploads/',pathTarget )
      return Promise.resolve({"error":0,"msg":'Archivos copiados a su destino [' + 
        pathTarget + '/auditorias.zip'
        + ']'
      });
    }
    else{
      //base de datos
      //si no existe el directorio auditorias en la carpeta seleccionada
      if (!fs.existsSync(pathTarget + '/auditorias/src/data')){
        fs.mkdirSync(pathTarget + '/auditorias/src/data', { recursive: true });
      }
      
      try {
        await fs.copyFileSync('./src/data/sqlite3.db', pathTarget + '/auditorias/src/data/sqlite3.db')
      } catch (err) {
        console.log("err=>",err)
        return {"error":err,"msg":'Error'};
      }

      //uploads
      //si no existe el directorio auditorias en la carpeta seleccionada
      if (!fs.existsSync(pathTarget + '/auditorias/uploads')){
        fs.mkdirSync(pathTarget + '/auditorias/uploads', { recursive: true });
      }
      try {
        await fse.copySync('./uploads', pathTarget + '/auditorias/uploads', { overwrite: true})
      } catch (err) {
        console.log("err=>",err)
        return {"error":err,"msg":'Error'};
      }
      return Promise.resolve({"error":0,"msg":'Archivos copiados a su destino [' + 
        pathTarget + '/auditorias'
        + ']'
      });
    }
    
  }

  zipDirectory(sourceDir, outPath) {
    try {
      const zip = new AdmZip();
      fs.chmodSync(outPath, fs.constants.S_IRUSR | fs.constants.S_IWUSR);
      const outputFile = outPath + '/auditorias.zip' ;
      const dirs=sourceDir.split(';')

      for(let i=0;i<dirs.length;i++)
        zip.addLocalFolder(dirs[i],dirs[i]);

      zip.writeZip(outputFile);
      console.log(`Created ${outputFile} successfully`);
    } catch (e) {
      console.log(`Something went wrong. ${e}`);
    }
  }

  extractArchive(filepath) {
    try {
      const zip = new AdmZip(filepath);
      //const outputDir = `${path.parse(filepath).name}_extracted`;
      zip.extractAllTo('./');

      return `Archivo desempaquetado correctamente`;
    } catch (e) {
      return `Algo salió mal. ${e}`;
    }
  }

}