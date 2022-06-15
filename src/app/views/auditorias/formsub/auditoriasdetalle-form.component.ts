import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Auditoriasdetalle} from '../../../_data/_models/auditoriasdetalle';
import { Catresponsables} from '../../../_data/_models/catresponsables';

import { AuditoriasdetalleService } from '../services/auditoriasdetalle.service';
import { AuditoriasanexosService } from '../services/auditoriasanexos.service';
import { CatresponsablesService } from '../../catalogos/catresponsables/services/catresponsables.service';

import { ValidationSummaryComponent } from '../../_shared/validation/validation-summary.component';
import { environment,actionsButtonSave, titulosModal } from '../../../../../src/environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../_services/is-loading/is-loading.service';

import { ModaluploadFormComponent } from '../../_shared/upload_fisico/table/modalupload-form.component';
import { TablaUploadFisicoComponent } from '../../_shared/upload_fisico/table/table-uploadFisico.component';
import { Archivos} from '../../../_data/_models/archivos';
import { ArchivosService } from '../../catalogos/archivos/services/archivos.service';
import { UploadFisicoFileService } from '../../_shared/upload_fisico/uploadFisico-file.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-auditoriasdetalle-form',
  templateUrl: './auditoriasdetalle-form.component.html',
  styleUrls: ['./auditoriasdetalle-form.component.css']
})

export class AuditoriasdetalleFormComponent implements OnInit, OnDestroy {
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
    , fkey: 'id_auditoriasdetalle'
    , fkeyvalue: 0
    , modo: 2
  };

  NumberOfMembers = 0;
  API_URL = environment.APIS_URL;

  nombreModulo = 'Auditoriasanexos';

  headersAdmin: any;

  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModalDetalle') basicModalDetalle: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild(ModaluploadFormComponent) modalUpload: ModaluploadFormComponent;
  @ViewChild(TablaUploadFisicoComponent) tablaUpload: TablaUploadFisicoComponent;
  
  record: Auditoriasdetalle;
  recordFile:Archivos;
  catresponsablesCat:Catresponsables[];


  constructor(private isLoadingService: IsLoadingService,
    private el: ElementRef,
    private CatresponsablesSvc: CatresponsablesService,
    private auditoriasdetalleService: AuditoriasdetalleService,
    private auditoriasanexosService: AuditoriasanexosService,
    private uploadFisicoFileSvc: UploadFisicoFileService,
    private route: ActivatedRoute,
    private archivosSvc:ArchivosService,
      ) {
      this.elementModal = el.nativeElement;
      
  }

  newRecord(idParent:number): Auditoriasdetalle {
    return {
      id: 0,  id_auditorias:idParent, punto:'', observacion:'', fechalimite:"",fecharecepcion:"",
      oficio:'', id_archivos:0, state: ''
    };
  }
  ngOnInit(): void {

    this.record =this.newRecord(0);

    let modal = this;

    // ensure id attribute exists
    if (!modal.id) {//idModal {
        console.error('modal must have an id');
        return;
    }
    // add self (this modal instance) to the modal service so it's accessible from controllers
    modal.auditoriasdetalleService.add(modal);

    //subtabla datatable
    this.headersAdmin = JSON.parse(this.route.snapshot.data.userdataAnexos.data[0].cabeceras); // get data from resolver

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

    //loading
    this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.auditoriasdetalleService.remove(this.id); //idModal
      this.elementModal.remove();
  }


  async submitAction(form) {

    if(this.actionForm.toUpperCase()!=="VER"){

      this.validSummary.resetErrorMessages(form);

      const resp=await this.auditoriasdetalleService.setRecord(this.record,this.actionForm);
      if (resp.hasOwnProperty('error')) {
        this.validSummary.generateErrorMessagesFromServer(resp.message);
      }
      else if(resp.message=="success"){
        if(this.actionForm.toUpperCase()=="NUEVO") this.actionForm="editar";
        this.record.id=resp.id;
        //actualizar la referencia en el archivo
        this.recordFile.id_tabla=this.record.id;
        await this.archivosSvc.setRecordReferencia(this.recordFile,this.actionForm)
        this.successModal.show();
        setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
      }
    }
  }

  //Archivo cargado. Eventos disparado desde el componente
  async onLoadedFile(datos:any){
    this.tablaUpload.showFiles(this.record.id,"auditoriasdetalle")
  }

  async onRemovedFile(datos:any){
    //if(this.record.id_archivos==datos.id){this.record.id_archivos=0;}
  }

  // open modal
  async open(idItem: string, accion: string,idParent:number):  Promise<void> {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Detalle de auditoría - " + titulosModal[accion] + " registro";

    this.catresponsablesCat = await this.CatresponsablesSvc.getCatalogo()


    if(idItem=="0"){
      this.record =this.newRecord(idParent);
      //inicializar
      this.tablaUpload.showFiles(0,"auditoriasdetalle");
      
    } else {
      this.record = await this.auditoriasdetalleService.getRecord(idItem);
      //inicializar
      this.tablaUpload.showFiles(this.record.id,"auditoriasdetalle")
    }
    this.reDraw(null);
    // console.log($('#modalTest').html()); poner el id a algun elemento para testear
    this.basicModalDetalle.show();
  }

  // close modal
  close(): void {
      this.basicModalDetalle.hide();
      if(this.actionForm.toUpperCase()!="VER"){
        this.redrawEvent.emit(null);
      }
  }

  // log contenido de objeto en formulario
  get diagnosticValidate() { return JSON.stringify(this.record); }


  //Sub formulario
  openModal(id: string, accion: string, idItem: number, idParent: number) {
    if(id=="openModal")
    this.uploadFisicoFileSvc.open(id, accion, idItem, idParent);
    else
      this.auditoriasanexosService.open(id, accion, idItem, idParent);
  }

  closeModal(id: string) {
    this.auditoriasanexosService.close(id);
  }

  async reDraw(parametro: any): Promise<void> {


    this.dtOptionsAdicional.raw++;
    this.dtOptionsAdicional.fkeyvalue = this.record.id;
    this.dataTablesParameters.opcionesAdicionales = this.dtOptionsAdicional;

    const resp=await this.auditoriasanexosService.getAdmin(this.dataTablesParameters)

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
