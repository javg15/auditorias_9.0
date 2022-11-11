import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Auditoriasanexos} from '../../../_data/_models/auditoriasanexos';
import { AuditoriasanexosService } from '../services/auditoriasanexos.service';
import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

import { ModaluploadFormComponent } from '../../_shared/upload_fisico/table/modalupload-form.component';
import { TablaUploadFisicoComponent } from '../../_shared/upload_fisico/table/table-uploadFisico.component';
import { Archivos} from '../../../_data/_models/archivos';
import { ArchivosService } from '../../catalogos/archivos/services/archivos.service';
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
  ruta:string="anexos";//variables para modalUploadAnexos
  tabla:string="auditoriasanexos";//variables para modalUploadAnexos
  private elementModal: any;

  @ViewChild('basicModalAnexos') basicModalAnexos: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild(ModaluploadFormComponent) modalUploadAnexos: ModaluploadFormComponent;
  @ViewChild('tablaArchivosAnexos') tablaUploadAnexos: TablaUploadFisicoComponent;

  record: Auditoriasanexos;
  recordFile:Archivos;
  keywordSearch = 'full_name';
  isLoadingSearch: boolean;
  esinterina: boolean=false;
  nombreTablaTracking:string="auditoriasanexos_track";
  userrol:string="";

  constructor(
    private isLoadingService: IsLoadingService,
    private auditoriasanexosService: AuditoriasanexosService,
    private el: ElementRef,
    private archivosSvc:ArchivosService,
    private uploadFisicoFileSvc: UploadFisicoFileService,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
  ) {
    this.elementModal = el.nativeElement;
    this.userrol=this.tokenStorage.getUser().id_permgrupos;
  }

  newRecord(idParent: number): Auditoriasanexos {
    return {
      id: 0, id_auditoriasdetalle: idParent, puntoanexo: '', nombre:'',id_archivos: 0,
      state:'',orden:0,created_at: '', updated_at: '', id_usuarios_r:0,usuarios_pc:''
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
      //Solo se edita información, el archivo no se puede reemplazar, solo eliminar
      const resp=await this.auditoriasanexosService.setRecord(this.record, this.actionForm)
      if (resp.hasOwnProperty('error')) {
        this.validSummary.generateErrorMessagesFromServer(resp.message);
      }
      else if (resp.message == "success") {
        if(this.actionForm.toUpperCase()=="NUEVO") this.actionForm="editar";
        this.record.id=resp.id;
        
        this.successModal.show();
        setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
      }
    }
  }


  //Archivo cargado. Eventos disparado desde el componente
  async onLoadedFile(datos:any){
    this.tablaUploadAnexos.showFiles(this.record.id,"auditoriasanexos")          
  }
  
  async onRemoveFile(datos:any){
    //if(this.record.id_archivos==datos.id){this.record.id_archivos=0;}
  }

  // open modal
  async open(idItem: string, accion: string, idPersonal: number): Promise<void> {
    this.actionForm = accion;
    this.botonAccion = actionsButtonSave[accion];
    this.tituloForm = "Anexos - " + titulosModal[accion] + " registro";
    
    if (idItem == "0") {
      this.record = this.newRecord(idPersonal);
      //inicializar
      this.tablaUploadAnexos.showFiles(0,"auditoriasanexos");
    } else {
      //obtener el registro
      this.record=await this.auditoriasanexosService.getRecord(idItem)
      //inicializar
      this.tablaUploadAnexos.showFiles(this.record.id,"auditoriasanexos")
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

  //Sub formulario
  openModal(id: string, accion: string, idItem: number, idParent: number) {
    this.uploadFisicoFileSvc.open(id, accion, idItem, idParent);
  }

  closeModal(id: string) {
    this.uploadFisicoFileSvc.close(id);
  }
  // log contenido de objeto en adminulario
  get diagnosticValidate() { return JSON.stringify(this.record); }

}
