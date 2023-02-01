import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Auditoriasdetalle} from '../../../_data/_models/auditoriasdetalle';
import { Catresponsables} from '../../../_data/_models/catresponsables';
import { Procedimientos} from '../../../_data/_models/procedimientos';

import { AuditoriasdetalleService } from '../services/auditoriasdetalle.service';
import { AuditoriasanexosService } from '../services/auditoriasanexos.service';
import { CatresponsablesService } from '../../catalogos/catresponsables/services/catresponsables.service';

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
import { Console } from 'console';

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
  MembersAll: any[];
  ColumnNames: string[];
  private dataTablesParameters = {
    draw: 1, length: 1000, opcionesAdicionales: {},
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
  successModalTimeOut: null | ReturnType<typeof setTimeout> = null;

  ruta:string="detalle";//variables para modalUpload
  tabla:string="auditoriasdetalle";//variables para modalUpload
  private elementModal: any;
  @ViewChild('basicModalDetalle') basicModalDetalle: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild(ModaluploadFormComponent) modalUpload: ModaluploadFormComponent;
  @ViewChild('tablaArchivos') tablaArchivos: TablaUploadFisicoComponent;
  
  record: Auditoriasdetalle;
  recordFile:Archivos;
  record_procedimiento:string="";
  record_aplica:string="1";
  catresponsablesCat:Catresponsables[];
  procedimientosCat:Procedimientos[];
  
  nombreTablaTracking:string="auditoriasdetalle_track";
  userrol:string="";

  constructor(private isLoadingService: IsLoadingService,
    private el: ElementRef,
    private CatresponsablesSvc: CatresponsablesService,
    private auditoriasdetalleService: AuditoriasdetalleService,
    private auditoriasanexosService: AuditoriasanexosService,
    private uploadFisicoFileSvc: UploadFisicoFileService,
    private route: ActivatedRoute,
    private archivosSvc:ArchivosService,
    private tokenStorage: TokenStorageService,
      ) {
      this.elementModal = el.nativeElement;
      this.userrol=this.tokenStorage.getUser().id_permgrupos;
  }

  newRecord(idParent:number): Auditoriasdetalle {
    return {
      id: 0,  id_auditorias:idParent, punto:'', observacion:'', fechalimite:"",fecharecepcion:"",
      original:0,simple:0,copia:0,
      oficio:'', id_archivos:0, state: '',orden:0, created_at: '', updated_at: '', id_usuarios_r:0,usuarios_pc:''
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
      searching: true,
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
        
        this.successModal.show();
        this.successModalTimeOut=setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
      }
    }
  }

  //Archivo cargado. Eventos disparado desde el componente
  async onLoadedFile(datos:any){
    this.tablaArchivos.showFiles(this.record.id,"auditoriasdetalle")
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
    this.procedimientosCat = await this.auditoriasdetalleService.getProcedimientosCatalogo()

    if(idItem=="0"){
      this.record =this.newRecord(idParent);
      //inicializar
      this.tablaArchivos.showFiles(0,"auditoriasdetalle");
      this.record_aplica="1";
      this.record_procedimiento="";
    } else {
      this.record = await this.auditoriasdetalleService.getRecord(idItem);

      this.record_procedimiento=this.record.punto;
      if(this.record.observacion.toUpperCase().indexOf("NO APLICA")>0)
        this.record_aplica="0";
      else
        this.record_aplica="1";
      //inicializar
      this.tablaArchivos.showFiles(this.record.id,"auditoriasdetalle")
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
    if(id=="modalUpload")
      this.uploadFisicoFileSvc.open(id, accion, idItem, idParent);
    else
      this.auditoriasanexosService.open(id, accion, idItem, idParent);
  }

  closeModal(id: string) {
    if(id=="modalUpload")
      this.uploadFisicoFileSvc.close(id);
    else
      this.auditoriasanexosService.close(id);
    
  }

  async onBlurNumero(value){
    const procedimientosObj = await this.auditoriasdetalleService.getProcedimiento(value)

    if(procedimientosObj)
      this.record.observacion=procedimientosObj.descripcion;
  }

  onSelectProcedimiento(value){
    this.record.punto=value;
    if(value!=""){
      if(this.record_aplica=="1")
        this.record.observacion=this.procedimientosCat.find(a=>a.punto==value).descripcion;
      else
        this.record.observacion=this.procedimientosCat.find(a=>a.punto==value).descripcion + " (NO APLICA)";
    }
    else
      this.record.observacion="";
  }

  onSelectAplica(value){
    if(this.record.punto.length>0){
      if(value=="0")
        this.record.observacion=this.procedimientosCat.find(a=>a.punto==this.record.punto).descripcion + " (NO APLICA)";
      else
        this.record.observacion=this.procedimientosCat.find(a=>a.punto==this.record.punto).descripcion;
    }
  }

  async reDraw(parametro: any): Promise<void> {


    this.dtOptionsAdicional.raw++;
    this.dtOptionsAdicional.fkeyvalue = this.record.id;
    this.dataTablesParameters.opcionesAdicionales = this.dtOptionsAdicional;

    const resp=await this.auditoriasanexosService.getAdmin(this.dataTablesParameters)

    this.ColumnNames = resp.columnNames;
    this.MembersAll = this.Members = resp.data;
    this.NumberOfMembers = resp.data.length;
    $('.dataTables_length>label>select, .dataTables_filter>label>input').addClass('form-control-sm');
    //$('#tblAuditoriasdetalle').dataTable({searching: false, paging: false, info: false});
    if (this.NumberOfMembers > 0) {
      $('.dataTables_empty').css('display', 'none');
    }

    //Cuadro de busqueda
    $('.dataTables_filter input').attr('type', 'text');//para quitar el icono de limpiar

    let that = this;
    //getting the value of search box
    $('.dataTables_filter input').unbind().on('keyup change', function () {
      var value = $(this).val();
      if (value.length>0) {
        that.Members = that.MembersAll.filter(a=>a.Nombre.toUpperCase().indexOf(this['value'].toUpperCase())>=0
          );
      } else {     
          //optional, reset the search if the phrase 
          //is less then 3 characters long
          that.Members = that.MembersAll
      }        
      that.dtTrigger.next();
    });
  }

  continuarEditando(){
    if(this.successModalTimeOut) {
      clearTimeout(this.successModalTimeOut);
      this.successModal.hide();
    }
  }
}
