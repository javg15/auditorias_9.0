import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Auditoriasanexos} from '../../../_data/_models/auditoriasanexos';
import { Archivos} from '../../../_data/_models/archivos';
import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';

import { ArchivosService } from '../../catalogos/archivos/services/archivos.service';
import { AuditoriasanexosService } from '../services/auditoriasanexos.service';
import { ListUploadFisicoComponent } from '../../_shared/upload_fisico/list-uploadFisico.component';
import { FormUploadFisicoComponent } from '../../_shared/upload_fisico/form-uploadFisico.component';
import { UploadFisicoFileService } from '../../_shared/upload_fisico/uploadFisico-file.service';
import { relativeTimeThreshold } from 'moment';


declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-auditoriasanexos-form',
  templateUrl: './auditoriasanexos-form.component.html',
  styleUrls: ['./auditoriasanexos-form.component.css']
})

export class AuditoriasanexosFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción
  @Output() redrawEvent = new EventEmitter<any>();

  nombreModulo = 'Auditoriasanexos';

  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;

  @ViewChild('basicModalAnexos') basicModalAnexos: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild(ListUploadFisicoComponent) listUpload: ListUploadFisicoComponent;
  @ViewChild(FormUploadFisicoComponent) formUpload: FormUploadFisicoComponent;


  record: Auditoriasanexos;
  recordFile:Archivos;
  keywordSearch = 'full_name';
  isLoadingSearch: boolean;
  esinterina: boolean=false;
  //recordJsonTipodoc1:any={UltimoGradodeEstudios:0,AreadeCarrera:0,Carrera:0,Estatus:0};

  constructor(
    private isLoadingService: IsLoadingService,
    private auditoriasanexosService: AuditoriasanexosService,
    private el: ElementRef,
    private archivosSvc:ArchivosService,
    private uploadFileSvc:UploadFisicoFileService,
    private route: ActivatedRoute
  ) {
    this.elementModal = el.nativeElement;

  }

  newRecord(idParent: number): Auditoriasanexos {
    return {
      id: 0, id_auditoriasdetalle: idParent, punto: 0, id_archivos: 0,
    };
  }
  ngOnInit(): void {

    this.record = this.newRecord(0);

    let modal = this;

    // ensure id attribute exists
    if (!modal.id) {//idModal {
      console.error('modal must have an id');
      return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    modal.auditoriasanexosService.add(modal);

    //loading
    this.userFormIsPending = this.isLoadingService.isLoading$({ key: 'loading' });

    //quincena activa
    //this.record_quincena_activa = this.route.snapshot.data.dataHoraAsignacion;
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.auditoriasanexosService.remove(this.id); //idModal
    this.elementModal.remove();
  }


  async submitAction(admin) {

    if (this.actionForm.toUpperCase() !== "VER") {

      this.validSummary.resetErrorMessages(admin);

        if(this.actionForm.toUpperCase()==="NUEVO"){
          //primero cargar el archivo
          this.formUpload.ruta="anexos/" +
            this.record.id_auditoriasdetalle.toString().padStart(5 , "0")
          //el metodo .upload, emitirá el evento que cachará el metodo  onLoadedFile de este archivo
          this.formUpload.upload()
        }
        else if(this.actionForm.toUpperCase()==="EDITAR" || this.actionForm.toUpperCase()==="ELIMINAR"){
          
          await this.isLoadingService.add(this.setRecord(),{ key: 'loading' });
        }
      
    }
  }

  async setRecord(){
    {
      //Solo se edita información, el archivo no se puede reemplazar, solo eliminar
      const resp=await this.auditoriasanexosService.setRecord(this.record, this.actionForm)
      if (resp.hasOwnProperty('error')) {
        this.validSummary.generateErrorMessagesFromServer(resp.message);
      }
      else if (resp.message == "success") {
        this.record.id=resp.id;

          this.successModal.show();
          setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
      }
    }
  }

  //Archivo cargado. Eventos disparado desde el componente
  async onLoadedFile(datos:any){

      //ingresar el registro de la tabla archivos
      this.recordFile={
        id:0,
        tabla:"auditoriasanexos",
        id_tabla:0,ruta:datos.ruta,
        tipo: datos.tipo,  nombre:  datos.nombre,numero:0
      };
      await this.setRecordFile();
          
  }

  async setRecordFile(){
    {

      let respFile=await this.archivosSvc.setRecord(this.recordFile,this.actionForm);
        this.record.id_archivos=respFile.id;
        this.recordFile.id=respFile.id;
      
      //registrar el anexo
      let respUpdateAnexo=await this.auditoriasanexosService.setRecord(this.record, this.actionForm);
      if (respUpdateAnexo.hasOwnProperty('error')) {
        this.validSummary.generateErrorMessagesFromServer(respUpdateAnexo.message);
      }
      else if (respUpdateAnexo.message == "success") {
        this.record.id=respUpdateAnexo.id;
        if (this.actionForm.toUpperCase() == "NUEVO") this.actionForm = "editar";

        //actualizar la referencia en el archivo
        this.recordFile.id_tabla=this.record.id;
        await this.archivosSvc.setRecordReferencia(this.recordFile,this.actionForm)
        this.successModal.show();
        setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
      }
    }
  }

  // open modal
  async open(idItem: string, accion: string, idPersonal: number): Promise<void> {
    this.actionForm = accion;
    this.botonAccion = actionsButtonSave[accion];
    this.tituloForm = "Anexos - " + titulosModal[accion] + " registro";
    this.formUpload.resetFile();
    if (idItem == "0") {
      this.record = this.newRecord(idPersonal);
      this.formUpload.showFile();
      this.listUpload.showFiles(0);
    } else {
      //obtener el registro
      this.record=await this.auditoriasanexosService.getRecord(idItem)
      this.formUpload.hideFile();
      this.listUpload.showFiles(this.record.id_archivos);
      
    }

    // console.log($('#modalTest').html()); poner el id a algun elemento para testear
    this.basicModalAnexos.show();
  }

  // close modal
  close(): void {
    this.basicModalAnexos.hide();
    if (this.actionForm.toUpperCase() != "VER") {
      this.redrawEvent.emit(null);
    }
  }

  //muestra el archivo
  getFile(ruta){
    this.uploadFileSvc.getFile(ruta);
  }

  // log contenido de objeto en adminulario
  get diagnosticValidate() { return JSON.stringify(this.record); }

}
