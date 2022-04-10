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

  record: Auditorias;
  cattiposauditoriaCat: Cattiposauditoria[];
  catcatservidoresCat: Catservidores[];
  catentidadesCat: Catentidades[];
  catejerciciosCat: Catejercicios[];
  catresponsablesCat: Catresponsables[]; 

  constructor(private isLoadingService: IsLoadingService,
    private auditoriasService: AuditoriasService, private el: ElementRef,
    private auditoriasdetalleService: AuditoriasdetalleService,
    private cattiposauditoriaSvc: CattiposauditoriaService,
    private catservidoresSvc: CatservidoresService,
    private catentidadesSvc: CatentidadesService,
    private catejerciciosSvc: CatejerciciosService,
    private catresponsablesSvc: CatresponsablesService,
    private route: ActivatedRoute
  ) {
    this.elementModal = el.nativeElement;
  }

  newRecord(): Auditorias {
    return {
      id: 0, id_catentidades: 0, id_catservidores: 0, nombre: '', oficio: '', numero: '',
      id_catejercicios: 0, fecha: '', periodoini: '', periodofin: '', id_cattipoauditoria: 0,
      marcolegal: '', id_catresponsables:0,state:''
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

    if(this.actionForm.toUpperCase()!=="VER"){

      this.validSummary.resetErrorMessages(form);

      await this.isLoadingService.add(this.setRecord(),{ key: 'loading' });
    }
  }

  async setRecord(){
    {
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

  

  // open modal
  async open(idItem: string, accion: string): Promise<void> {
    this.actionForm = accion;
    this.botonAccion = actionsButtonSave[accion];
    this.tituloForm = "Horas clase - " + titulosModal[accion] + " registro";

    this.cattiposauditoriaCat=await this.cattiposauditoriaSvc.getCatalogo();
    this.catcatservidoresCat = await this.catservidoresSvc.getCatalogo();
    this.catentidadesCat= await this.catentidadesSvc.getCatalogo();
    this.catejerciciosCat=await this.catejerciciosSvc.getCatalogo();
    this.catresponsablesCat=await this.catresponsablesSvc.getCatalogo();

    if (idItem == "0") {
      this.record = this.newRecord();
      this.reDraw(null);
    } else {
      this.record = await this.auditoriasService.getRecord(idItem);
    }

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
