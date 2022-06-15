import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { ValidationSummaryComponent } from '../../validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../../_services/is-loading/is-loading.service';

import { FormUploadFisicoComponent } from '../list/form-uploadFisico.component';
import { Archivos} from '../../../../_data/_models/archivos';
import { ArchivosService } from '../../../catalogos/archivos/services/archivos.service';
import { UploadFisicoFileService } from '../uploadFisico-file.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-modalupload-form',
  templateUrl: './modalupload-form.component.html',
  styleUrls: ['./modalupload-form.component.css']
})

export class ModaluploadFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción
  @Input() ruta: string; //ruta del archivo
  @Input() tabla: string; //tabla referencia del archivo

  @Output() onLoaded: EventEmitter<any> = new EventEmitter<any>();

  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModalDetalle') basicModalDetalle: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild('formUploadFisico') formUploadFisico: FormUploadFisicoComponent;

  recordFile:Archivos;
  record_id:number;
  record_id_parent:number;
  record_id_archivos:number;

  constructor(private isLoadingService: IsLoadingService,
    private el: ElementRef,
    private route: ActivatedRoute,
    private archivosSvc:ArchivosService,
    private uploadFisicoFileSvc:UploadFisicoFileService
      ) {
      this.elementModal = el.nativeElement;
      
  }

  ngOnInit(): void {

    let modal = this;

    // ensure id attribute exists
    if (!modal.id) {//idModal {
        console.error('modal must have an id');
        return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    modal.uploadFisicoFileSvc.add(modal);

    //loading
    this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.uploadFisicoFileSvc.remove(this.id); //idModal
      this.elementModal.remove();
  }


  async submitAction(form) {

      this.validSummary.resetErrorMessages(form);

      if(this.actionForm.toUpperCase()==="NUEVO" || this.actionForm.toUpperCase()==="EDITAR"){
        //el metodo .upload, emitirá el evento que cachará el metodo  onLoadedFile de este archivo
        if(this.formUploadFisico.selectedFiles){
          this.formUploadFisico.ruta+= 
            this.record_id.toString().padStart(5 , "0"); 
            await this.formUploadFisico.upload();
          }
      }

  }

  //Archivo cargado. Eventos disparado desde el componente
  async onLoadedFile(datos:any){

    //ingresar el registro de la tabla archivos
    this.recordFile={
      id:0,
      tabla:this.tabla,
      id_tabla:0,ruta:datos.ruta,
      tipo: datos.tipo,  nombre:  datos.nombre,numero:0,
      uuid:datos.uuid
    };
    
    let respFile=await this.archivosSvc.setRecord(this.recordFile,this.actionForm);
    await this.onLoaded.emit({id_archivo:respFile.id});

  }



  async upload(tipofileUpload:String="") {

    this.formUploadFisico.upload(tipofileUpload);
  }

  // open modal
  async open(idItem: number, accion: string,idParent:number):  Promise<void> {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Carga de archivo";
    this.record_id_parent=idParent;
    this.record_id=idItem;

    this.formUploadFisico.resetFile();
    this.formUploadFisico.showFile();

    this.basicModalDetalle.show();
  }

  // close modal
  close(): void {
      this.basicModalDetalle.hide();
  }
}
