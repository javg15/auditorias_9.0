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

import { ListUploadFisicoComponent } from '../../_shared/upload_fisico/list/list-uploadFisico.component';
import { FormUploadFisicoComponent } from '../../_shared/upload_fisico/list/form-uploadFisico.component';
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

  record: Auditorias;
  recordFile:Archivos;
  cattiposauditoriaCat: Cattiposauditoria[];
  catservidoresCat: Catservidores[];
  catentidadesCat: Catentidades[];
  catejerciciosCat: Catejercicios[];
  catresponsablesCat: Catresponsables[]; 
  record_id_catejercicios:number[];
  //tipofileUpload:string;//para conocer que fileupload se esta guardando
  

  constructor(private isLoadingService: IsLoadingService,
    private auditoriasService: AuditoriasService, private el: ElementRef,
    private auditoriasdetalleService: AuditoriasdetalleService,
    private cattiposauditoriaSvc: CattiposauditoriaService,
    private catservidoresSvc: CatservidoresService,
    private catentidadesSvc: CatentidadesService,
    private catejerciciosSvc: CatejerciciosService,
    private catresponsablesSvc: CatresponsablesService,
    private route: ActivatedRoute,
    private uploadFileSvc:UploadFisicoFileService,
    private archivosSvc:ArchivosService,
  ) {
    this.elementModal = el.nativeElement;
  }

  newRecord(): Auditorias {
    return {
      id: 0, id_catentidades: 0, id_catservidores: 0, nombre: '', numerooficio: '', id_archivos_numerooficio:0,
      id_catejercicios: '', fecha: '', periodoini: '', periodofin: '', id_cattiposauditoria: 0,
      marcolegal: '', id_catresponsables:0,
      rubros: '',    numeroauditoria: '',  objetivo: '', state:'',
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

      let archivoModificado=false;//para saber si ya se realizo algun upload, y con él, la llamada a la funcion setRecord()

      if(this.actionForm.toUpperCase()==="NUEVO" || this.actionForm.toUpperCase()==="EDITAR"){
        //el metodo .upload, emitirá el evento que cachará el metodo  onLoadedFile de este archivo
        if(this.formUploadoficio.selectedFiles){
          archivoModificado=true;
          this.formUploadoficio.ruta="auditoria/" + 
            this.record.id.toString().padStart(5 , "0"); 
            await this.formUploadoficio.upload();
          }
      }
      
      if(archivoModificado==false || this.actionForm.toUpperCase()==="ELIMINAR"){
        await this.isLoadingService.add(this.setRecord(),{ key: 'loading' });
      }
    }
  }

  async setRecord(){
    {
      //parsear los valores de ejercicios
      this.record.id_catejercicios=(this.record_id_catejercicios || []).join(",");

      const resp=await this.auditoriasService.setRecord(this.record,this.actionForm);
      await this.auditoriasService.updateEjercicios(resp.id,this.record.id_catejercicios)

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
      tipo: datos.tipo,  nombre:  datos.nombre,numero:0,
      uuid:datos.uuid 
    };
    
    await this.setRecordFile();
}

async onRemoveFile(datos:any){
  if(this.record.id_archivos_numerooficio==datos.id){this.record.id_archivos_numerooficio=0;}
}

async setRecordFile(){
  {
    
    let respFile=await this.archivosSvc.setRecord(this.recordFile,this.actionForm);
        this.record.id_archivos_numerooficio=respFile.id;
        this.recordFile.id=respFile.id;
    
    //registrar la auditoria
    let respUpdate=await this.auditoriasService.setRecord(this.record, this.actionForm);

    if (respUpdate.hasOwnProperty('error')) {
      this.validSummary.generateErrorMessagesFromServer(respUpdate.message);
    }
    else if (respUpdate.message == "success") {
      
      await this.auditoriasService.updateEjercicios(respUpdate.id,this.record.id_catejercicios)

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

    if (idItem == "0") {
      this.record = this.newRecord();
      this.record_id_catejercicios=[];
      //inicializar
      this.formUploadoficio.showFile();
      this.listUploadoficio.showFiles(0);
    } else {
      this.record = await this.auditoriasService.getRecord(idItem);
      this.record_id_catejercicios=this.record.id_catejercicios.split(",").map(Number).filter(Boolean);
      //inicializar
      if((this.record.id_archivos_numerooficio??0)>0){this.formUploadoficio.hideFile();this.listUploadoficio.showFiles(this.record.id_archivos_numerooficio);}
      else{this.formUploadoficio.showFile();this.listUploadoficio.showFiles(0);}
    }
    this.reDraw(null);

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
