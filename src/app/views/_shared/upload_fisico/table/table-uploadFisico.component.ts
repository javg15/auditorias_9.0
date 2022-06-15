import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { UploadFisicoFileService } from '../uploadFisico-file.service';

@Component({
  selector: 'table-uploadFisico',
  templateUrl: './table-uploadFisico.component.html',
  styleUrls: ['./table-uploadFisico.component.css']
})
export class TablaUploadFisicoComponent implements OnInit {

  showFile = false;
  fileUploads: any[]=[{}];

  @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();

  constructor(private uploadFisicoService: UploadFisicoFileService) { }

  ngOnInit() {
    this.showFiles(0,"");
  }

  async showFiles(id_parent:number,tabla:string) {//enable: boolean
    if(id_parent>0){
      this.fileUploads = await this.uploadFisicoService.listTablaFile(id_parent,tabla);
    }
    else
      this.fileUploads=null;
  }

  onRemoveFile(datos:any){
    this.onRemoved.emit({id:datos.id,ruta:datos.ruta});
  }
}
