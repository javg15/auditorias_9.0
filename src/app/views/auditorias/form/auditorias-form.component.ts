import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Auditorias} from '../../../_data/_models/auditorias';
import { Cattiposauditoria} from '../../../_data/_models/cattiposauditoria';
import { Catentidades} from '../../../_data/_models/catentidades';
import { Catejercicios} from '../../../_data/_models/catejercicios';
import { Catservidores} from '../../../_data/_models/catservidores';
import { Catresponsables} from '../../../_data/_models/catresponsables';

import { AuditoriasService } from '../services/auditorias.service';
import { AuditoriasdetalleService } from '../services/auditoriasdetalle.service';
import { CattiposauditoriaService } from '../../catalogos/cattiposauditoria/services/cattiposauditoria.service';
import { CatservidoresService } from '../../catalogos/catservidores/services/catservidores.service';
import { CatentidadesService } from '../../catalogos/catentidades/services/catentidades.service';
import { CatejerciciosService } from '../../catalogos/catejercicios/services/catejercicios.service';
import { CatresponsablesService } from '../../catalogos/catresponsables/services/catresponsables.service';

import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';

import { ListUploadFisicoComponent } from '../../_shared/upload_fisico/list-uploadFisico.component';
import { FormUploadFisicoComponent } from '../../_shared/upload_fisico/form-uploadFisico.component';
import { UploadFisicoFileService } from '../../_shared/upload_fisico/uploadFisico-file.service';
import { Archivos} from '../../../_data/_models/archivos';
import { ArchivosService } from '../../catalogos/archivos/services/archivos.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-auditorias-form',
  templateUrl: './auditorias-form.component.html',
  styleUrls: ['./auditorias-form.component.css']
})

export class AuditoriasFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() dtOptions: DataTables.Settings = {};
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción
  @Output() redrawEvent = new EventEmitter<any>();

  /* El decorador @ViewChild recibe la clase DataTableDirective, para luego poder
  crear el dtElement que represente la tabla que estamos creando. */
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtTrigger: Subject<DataTableDirective> = new Subject();

  Members: any[];
  ColumnNames: string[];

  private dataTablesParameters = {
    draw: 1, length: 100, opcionesAdicionales: {},
    order: [{ column: 0, dir: "asc" }],
    search: { value: "", regex: false },
    start: 0
  };
  private dtOptionsAdicional = {
    datosBusqueda: { campo: 0, operador: 0, valor: '' }
    , raw: 0
    , fkey: 'id_auditorias'
    , fkeyvalue: 0
    , modo: 2
  };

  NumberOfMembers = 0;
  API_URL = environment.APIS_URL;

  nombreModulo = 'Auditoriasdetalle';

  headersAdmin: any;

  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild('id_archivos_numerooficio_list') listUploadoficio: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficio') formUploadoficio: FormUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficionoti1_list') listUploadnoti1: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficionoti1') formUploadnoti1: FormUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficionoti2_list') listUploadnoti2: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficionoti2') formUploadnoti2: FormUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficionoti3_list') listUploadnoti3: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numerooficionoti3') formUploadnoti3: FormUploadFisicoComponent;
  @ViewChild('id_archivos_numeroofisol1_list') listUploadsol1: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numeroofisol1') formUploadsol1: FormUploadFisicoComponent;
  @ViewChild('id_archivos_numeroofisol2_list') listUploadsol2: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numeroofisol2') formUploadsol2: FormUploadFisicoComponent;
  @ViewChild('id_archivos_numeroofisol3_list') listUploadsol3: ListUploadFisicoComponent;
  @ViewChild('id_archivos_numeroofisol3') formUploadsol3: FormUploadFisicoComponent;

  record: Auditorias;
  recordFile:Archivos;
  cattiposauditoriaCat: Cattiposauditoria[];
  catservidoresCat: Catservidores[];
  catentidadesCat: Catentidades[];
  catejerciciosCat: Catejercicios[];
  catresponsablesCat: Catresponsables[]; 
  record_id_catejercicios:number[];
  tipofileUpload:string;//para conocer que fileupload se esta guardando

  constructor(private isLoadingService: IsLoadingService,
    private auditoriasService: AuditoriasService, private el: ElementRef,
    private auditoriasdetalleService: AuditoriasdetalleService,
    private cattiposauditoriaSvc: CattiposauditoriaService,
    private catservidoresSvc: CatservidoresService,
    private catentidadesSvc: CatentidadesService,
    private catejerciciosSvc: CatejerciciosService,
    private catresponsablesSvc: CatresponsablesService,
    private uploadFileSvc:UploadFisicoFileService,
    private archivosSvc:ArchivosService,
    private route: ActivatedRoute
  ) {
    this.elementModal = el.nativeElement;
  }

  newRecord(): Auditorias {
    return {
      id: 0, id_catentidades: 0, id_catservidores: 0, nombre: '', numerooficio: '', id_archivos_numerooficio:0,
      id_catejercicios: '', fecha: '', periodoini: '', periodofin: '', id_cattiposauditoria: 0,
      marcolegal: '', id_catresponsables:0,
      rubros: '',    numeroauditoria: '',    numerooficionoti1: '',numerooficionoti2: '',numerooficionoti3: '',
      id_archivos_numerooficionoti1:0,id_archivos_numerooficionoti2:0,id_archivos_numerooficionoti3:0,
      numeroofisol1: '',     numeroofisol2: '',numeroofisol3: '',     objetivo: '', state:'',
      id_archivos_numeroofisol1:0,id_archivos_numeroofisol2:0,id_archivos_numeroofisol3:0
    };
  }
  ngOnInit(): void {

    this.record = this.newRecord();

    let modal = this;

    // ensure id attribute exists
    if (!modal.id) {//idModal {
      console.error('modal must have an id');
      return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    modal.auditoriasService.add(modal);

    //subtabla datatable
    this.headersAdmin = JSON.parse(this.route.snapshot.data.userdataDetalle.data[0].cabeceras); // get data from resolver

    this.dtOptions = {
      pagingType: 'full_numbers',
      paging: false,
      //pageLength: 50,
      //serverSide: true,
      //processing: true,
      ordering: false,
      destroy: true,
      searching: false,
      info: false,
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'Mostrar _MENU_ elementos',
        search: 'Buscar:',
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        },
      },
      columns: this.headersAdmin,
      columnDefs: [{ "visible": false, "targets": 0 }, //state
      { "width": "5%", "targets": 1 }]
    };

  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.auditoriasService.remove(this.id); //idModal
    this.elementModal.remove();
  }

  async submitAction(form) {
    if (this.actionForm.toUpperCase() !== "VER") {

      this.validSummary.resetErrorMessages(form);

        //if(this.actionForm.toUpperCase()==="NUEVO"){
          //primero cargar el archivo
          
          
          
          
          
          
          
          
          //el metodo .upload, emitirá el evento que cachará el metodo  onLoadedFile de este archivo
          if(this.formUploadoficio.selectedFiles){this.formUploadoficio.ruta="auditoria/1-" + this.record.id.toString().padStart(5 , "0"); this.tipofileUpload="formUploadoficio";await this.formUploadoficio.upload();}
          if(this.formUploadnoti1.selectedFiles){this.formUploadnoti1.ruta="auditoria/2-" + this.record.id.toString().padStart(5 , "0");this.tipofileUpload="formUploadnoti1";await this.formUploadnoti1.upload();}
          if(this.formUploadnoti2.selectedFiles){this.formUploadnoti2.ruta="auditoria/3-" + this.record.id.toString().padStart(5 , "0");this.tipofileUpload="formUploadnoti2";await this.formUploadnoti2.upload();}
          if(this.formUploadnoti3.selectedFiles){this.formUploadnoti3.ruta="auditoria/4-" + this.record.id.toString().padStart(5 , "0");this.tipofileUpload="formUploadnoti3";await this.formUploadnoti3.upload();}
          if(this.formUploadsol1.selectedFiles){this.formUploadsol1.ruta="auditoria/5-" + this.record.id.toString().padStart(5 , "0");this.tipofileUpload="formUploadsol1";await this.formUploadsol1.upload();}
          if(this.formUploadsol2.selectedFiles){this.formUploadsol2.ruta="auditoria/6-" + this.record.id.toString().padStart(5 , "0");this.tipofileUpload="formUploadsol2";await this.formUploadsol2.upload();}
          if(this.formUploadsol3.selectedFiles){this.formUploadsol3.ruta="auditoria/7-" + this.record.id.toString().padStart(5 , "0");this.tipofileUpload="formUploadsol3";await this.formUploadsol3.upload();}
        /*}
        else if(this.actionForm.toUpperCase()==="EDITAR" || this.actionForm.toUpperCase()==="ELIMINAR"){
          await this.isLoadingService.add(this.setRecord(),{ key: 'loading' });
        }*/
      }
  }

  async setRecord(){
    {
      //parsear los valores de ejercicios
      this.record.id_catejercicios=this.record_id_catejercicios.join(",");

      const resp=await this.auditoriasService.setRecord(this.record,this.actionForm);
      if (resp.hasOwnProperty('error')) {
        this.validSummary.generateErrorMessagesFromServer(resp.message);
      }
      else if(resp.message=="success"){
        if(this.actionForm.toUpperCase()=="NUEVO") this.actionForm="editar";
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
      tabla:"auditorias",
      id_tabla:0,ruta:datos.ruta,
      tipo: datos.tipo,  nombre:  datos.nombre,numero:0
    };
    console.log("this.tipofileUpload=>",this.tipofileUpload)
    if (this.tipofileUpload=="formUploadoficio"){this.recordFile.numero=1;this.recordFile.id=this.record.id_archivos_numerooficio??0;}
    if (this.tipofileUpload=="formUploadnoti1") {this.recordFile.numero=2;this.recordFile.id=this.record.id_archivos_numerooficionoti1??0;}
    if (this.tipofileUpload=="formUploadnoti2") {this.recordFile.numero=3;this.recordFile.id=this.record.id_archivos_numerooficionoti2??0;}
    if (this.tipofileUpload=="formUploadnoti3") {this.recordFile.numero=4;this.recordFile.id=this.record.id_archivos_numerooficionoti3??0;}
    if (this.tipofileUpload=="formUploadsol1") {this.recordFile.numero=5;this.recordFile.id=this.record.id_archivos_numeroofisol1??0;}
    if (this.tipofileUpload=="formUploadsol2") {this.recordFile.numero=6;this.recordFile.id=this.record.id_archivos_numeroofisol2??0;}
    if (this.tipofileUpload=="formUploadsol3") {this.recordFile.numero=7;this.recordFile.id=this.record.id_archivos_numeroofisol3??0;}

    await this.setRecordFile();
        
}

async setRecordFile(){
  {
    
    let respFile=await this.archivosSvc.setRecord(this.recordFile,this.actionForm);
    if (this.tipofileUpload=="formUploadoficio") this.record.id_archivos_numerooficio=respFile.id;
    if (this.tipofileUpload=="formUploadnoti1") this.record.id_archivos_numerooficionoti1=respFile.id;
    if (this.tipofileUpload=="formUploadnoti2") this.record.id_archivos_numerooficionoti1=respFile.id;
    if (this.tipofileUpload=="formUploadnoti3") this.record.id_archivos_numerooficionoti1=respFile.id;
    if (this.tipofileUpload=="formUploadsol1") this.record.id_archivos_numeroofisol1=respFile.id;
    if (this.tipofileUpload=="formUploadsol2") this.record.id_archivos_numeroofisol2=respFile.id;
    if (this.tipofileUpload=="formUploadsol3") this.record.id_archivos_numeroofisol3=respFile.id;
    this.recordFile.id=respFile.id;
    
    //registrar la auditoria
    let respUpdate=await this.auditoriasService.setRecord(this.record, this.actionForm);
    if (respUpdate.hasOwnProperty('error')) {
      this.validSummary.generateErrorMessagesFromServer(respUpdate.message);
    }
    else if (respUpdate.message == "success") {
      this.record.id=respUpdate.id;
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
  async open(idItem: string, accion: string): Promise<void> {
    this.actionForm = accion;
    this.botonAccion = actionsButtonSave[accion];
    this.tituloForm = "Auditoría - " + titulosModal[accion] + " registro";

    this.cattiposauditoriaCat=await this.cattiposauditoriaSvc.getCatalogo();
    this.catservidoresCat = await this.catservidoresSvc.getCatalogo();
    this.catentidadesCat= await this.catentidadesSvc.getCatalogo();
    this.catejerciciosCat=await this.catejerciciosSvc.getCatalogo();
    this.catresponsablesCat=await this.catresponsablesSvc.getCatalogo();

    this.formUploadoficio.resetFile();
    this.formUploadnoti1.resetFile();
    this.formUploadnoti2.resetFile();
    this.formUploadnoti3.resetFile();
    this.formUploadsol1.resetFile();
    this.formUploadsol2.resetFile();
    this.formUploadsol3.resetFile();

    if (idItem == "0") {
      this.record = this.newRecord();
      //inicializar
      this.formUploadoficio.showFile();
      this.listUploadoficio.showFiles(0);
      this.formUploadnoti1.showFile();
      this.listUploadnoti1.showFiles(0);
      this.formUploadnoti2.showFile();
      this.listUploadnoti2.showFiles(0);
      this.formUploadnoti3.showFile();
      this.listUploadnoti3.showFiles(0);
      this.formUploadsol1.showFile();
      this.listUploadsol1.showFiles(0);
      this.formUploadsol2.showFile();
      this.listUploadsol2.showFiles(0);
      this.formUploadsol3.showFile();
      this.listUploadsol3.showFiles(0);
    } else {
      this.record = await this.auditoriasService.getRecord(idItem);
      this.record_id_catejercicios=this.record.id_catejercicios.split(",").map(Number).filter(Boolean);

      //inicializar
      if((this.record.id_archivos_numerooficio??0)>0){this.formUploadoficio.hideFile();this.listUploadoficio.showFiles(this.record.id_archivos_numerooficio);}
      else{this.formUploadoficio.showFile();this.listUploadoficio.showFiles(0);}
      if((this.record.id_archivos_numerooficionoti1??0)>0){this.formUploadnoti1.hideFile();this.listUploadnoti1.showFiles(this.record.id_archivos_numerooficionoti1);}
      else{this.formUploadnoti1.showFile();this.listUploadnoti1.showFiles(0);}
      if((this.record.id_archivos_numerooficionoti2??0)>0){this.formUploadnoti2.hideFile();this.listUploadnoti2.showFiles(this.record.id_archivos_numerooficionoti2);}
      else{this.formUploadnoti2.showFile();this.listUploadnoti2.showFiles(0);}
      if((this.record.id_archivos_numerooficionoti3??0)>0){this.formUploadnoti3.hideFile();this.listUploadnoti3.showFiles(this.record.id_archivos_numerooficionoti3);}
      else{this.formUploadnoti3.showFile();this.listUploadnoti3.showFiles(0);}
      if((this.record.id_archivos_numeroofisol1??0)>0){this.formUploadsol1.hideFile();this.listUploadsol1.showFiles(this.record.id_archivos_numeroofisol1);}
      else{this.formUploadsol1.showFile();this.listUploadsol1.showFiles(0);}
      if((this.record.id_archivos_numeroofisol2??0)>0){this.formUploadsol2.hideFile();this.listUploadsol2.showFiles(this.record.id_archivos_numeroofisol2);}
      else{this.formUploadsol2.showFile();this.listUploadsol2.showFiles(0);}
      if((this.record.id_archivos_numeroofisol3??0)>0){this.formUploadsol3.hideFile();this.listUploadsol3.showFiles(this.record.id_archivos_numeroofisol3);}
      else{this.formUploadsol3.showFile();this.listUploadsol3.showFiles(0);}
    }
    this.reDraw(null);
    // console.log($('#modalTest').html()); poner el id a algun elemento para testear
    this.basicModal.show();
  }

  // close modal
  close(): void {
    this.basicModal.hide();
    if (this.actionForm.toUpperCase() != "VER") {
      this.redrawEvent.emit(null);
    }
  }

  // log contenido de objeto en formulario
  get diagnosticValidate() { return JSON.stringify(this.record); }

  //muestra el archivo
  getFile(ruta){
    this.uploadFileSvc.getFile(ruta);
  }

  //Sub formulario
  openModal(id: string, accion: string, idItem: number, idParent: number) {
    this.auditoriasdetalleService.open(id, accion, idItem, idParent);
  }

  closeModal(id: string) {
    this.auditoriasdetalleService.close(id);
  }

  async reDraw(parametro: any): Promise<void> {


    this.dtOptionsAdicional.raw++;
    this.dtOptionsAdicional.fkeyvalue = this.record.id;
    this.dataTablesParameters.opcionesAdicionales = this.dtOptionsAdicional;

    const resp=await this.auditoriasdetalleService.getAdmin(this.dataTablesParameters)

      this.ColumnNames = resp.columnNames;
      this.Members = resp.data;
      this.NumberOfMembers = resp.data.length;
      $('.dataTables_length>label>select, .dataTables_filter>label>input').addClass('form-control-sm');
      //$('#tblAuditoriasdetalle').dataTable({searching: false, paging: false, info: false});
      if (this.NumberOfMembers > 0) {
        $('.dataTables_empty').css('display', 'none');
      }
  }
}
