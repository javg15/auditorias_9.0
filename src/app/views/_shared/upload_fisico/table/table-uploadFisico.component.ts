import { Component, OnInit,Input,Output,EventEmitter,TemplateRef } from '@angular/core';
import { UploadFisicoFileService } from '../uploadFisico-file.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'table-uploadFisico',
  templateUrl: './table-uploadFisico.component.html',
  styleUrls: ['./table-uploadFisico.component.css']
})
export class TablaUploadFisicoComponent implements OnInit {
  modalRef: BsModalRef;
  showFile = false;
  fileUploads: any[]=[{}];
  id:string;
  ruta:string;
  id_parent:number;
  tabla:string;

  @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();

  constructor(private uploadFisicoFileSvc:UploadFisicoFileService
      ,private modalService: BsModalService) { }

  ngOnInit() {
    this.showFiles(0,"");
  }

  async showFiles(id_parent:number,tabla:string) {//enable: boolean
    if(id_parent>0){
      this.id_parent=id_parent;
      this.tabla=tabla;
      this.fileUploads = await this.uploadFisicoFileSvc.listTablaFile(id_parent,tabla);
    }
    else
      this.fileUploads=null;
  }

  getFile(ruta){
    this.uploadFisicoFileSvc.getFile(ruta);
  }

  /**
   * 
   * Mensaje para confirma el quitar archivo
   */
   removeFile(template: TemplateRef<any>,id,ruta) {
    this.id=id;
    this.ruta=ruta;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  async confirm(): Promise<void> {
    await this.uploadFisicoFileSvc.removeFile(this.id,this.ruta);
    this.fileUploads = await this.uploadFisicoFileSvc.listTablaFile(this.id_parent,this.tabla);
    this.onRemoved.emit({id:this.id,ruta:this.ruta})
    this.modalRef.hide();
  }

  decline(): void {
    this.modalRef.hide();
  }
  
}