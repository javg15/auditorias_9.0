import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Usuarios,Personal } from 'src/app/_data/_models/';
import { ValidationSummaryComponent } from '../../../_shared/validation/validation-summary.component';
import { actionsButtonSave, titulosModal } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../../_services/is-loading/is-loading.service';
import { Archivos } from 'src/app/_data/_models/archivos';
import { ArchivosService } from '../../../catalogos/archivos/services/archivos.service';
import { UsuariosService } from '../services/usuarios.service';
import { PersonalService } from '../../../catalogos/personal/services/personal.service';

import { TabsetComponent } from 'ngx-bootstrap/tabs';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})

export class UsuariosFormComponent implements OnInit, OnDestroy {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() id: string; //idModal
  @Input() botonAccion: string; //texto del boton según acción
  @Output() redrawEvent = new EventEmitter<any>();
  actionForm: string; //acción que se ejecuta (nuevo, edición,etc)
  tituloForm: string;

  private elementModal: any;
  @ViewChild('basicModal') basicModal: ModalDirective;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild(TabsetComponent) tabSet: TabsetComponent;

  record: Usuarios;
  passConfirm:String="";
  pass:String="";
  passActual:String="";
  recordFile:Archivos;
  record_personal:String;
  personalCat:Personal[];
  record_id_personal:number=0;
  isLoadingSearch:boolean;
  keywordSearch = 'full_name';

  nodes = [];
  
  //se usa en el html
  dropdownSettings = {
    singleSelection: false,
    text:"",
    selectAllText:'Todas',
    unSelectAllText:'Ninguna',
    enableSearchFilter: false,
    classes:"myclass custom-class"
  };

  optionsSelect: any={multiple: true, closeOnSelect: false, width: '300'};

  constructor(private isLoadingService: IsLoadingService,
      private usuariosService: UsuariosService, private el: ElementRef,
      private archivosSvc:ArchivosService,
      private personalSvc: PersonalService,
      ) {
      this.elementModal = el.nativeElement;
  }

  newRecord(): Usuarios {
    return {
      id: 0,  username: '',   pass: '',
      uPassenc: '',  perfil: 0,  nombre: '',   numemp: '',   created_at: new Date(),  updated_at: new Date(),
      record_catzonasgeograficas:[],
      id_permgrupos: 0, id_usuarios_r: 0, state: '',  email: '', id_archivos_avatar:0
    };
  }
  ngOnInit(): void {

      this.record =this.newRecord();

      let modal = this;

      // ensure id attribute exists
      if (!modal.id) {//idModal {
          console.error('modal must have an id');
          return;
      }
      // add self (this modal instance) to the modal service so it's accessible from controllers
      modal.usuariosService.add(modal);

      //loading
      this.userFormIsPending =this.isLoadingService.isLoading$({ key: 'loading' });
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
      this.usuariosService.remove(this.id); //idModal
      this.elementModal.remove();
  }


  async submitAction(form) {

    if(this.actionForm.toUpperCase()!=="VER"){
      this.validSummary.resetErrorMessages(form);

      await this.isLoadingService.add(
      this.usuariosService.setPerfil(this.record,this.actionForm,this.passConfirm,this.passActual,0,this.record_id_personal).subscribe(async resp => {
        if (resp.hasOwnProperty('error')) {
          this.validSummary.generateErrorMessagesFromServer(resp.message);
        }
        else if(resp.message=="success"){
          if(this.actionForm.toUpperCase()=="NUEVO") this.actionForm="editar";
          this.record.id=resp.id;

          //actualizar el registro de la tabla archivos
          if(this.record.id_archivos_avatar>0){
            this.recordFile={id:this.record.id_archivos_avatar,
                  tabla:"usuarios",
                  id_tabla:this.record.id,ruta:"",
                  tipo: null,  nombre:  null
                };

            await this.archivosSvc.setRecordReferencia(this.recordFile,this.actionForm)
            this.successModal.show();
            setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
          }
          else{
            this.successModal.show();
            setTimeout(()=>{ this.successModal.hide(); this.close();}, 2000)
          }
        }
      }),{ key: 'loading' });
    }
  }


  // open modal
  open(idItem: string, accion: string):  void {
    this.actionForm=accion;
    this.botonAccion=actionsButtonSave[accion];
    this.tituloForm="Usuarios - " +titulosModal[accion] + " registro";
    this.passConfirm="";
    this.tabSet.tabs[0].active = true;

    this.record_personal="";
    
    

    if(idItem=="0"){
      this.record =this.newRecord();
      this.nodes =[];
    } else {

      this.usuariosService.getRecord(idItem).subscribe(resp => {
        this.record = resp;
  //obtener las zonas seleccionadas

        this.personalSvc.getRecordSegunUsuario(this.record.id).subscribe(resp => {
          if(resp!=null){
            this.record_personal =resp.numeemp + " - "
                +  resp.nombre + " " + resp.apellidopaterno
                + " " + resp.apellidomaterno + " - " + resp.curp;

            this.record_id_personal=resp.id;
          }
        });

            

        //this.listUpload.showFiles(this.record.id_archivos_avatar);
      });
    }

    // console.log($('#modalTest').html()); poner el id a algun elemento para testear
    this.basicModal.show();
  }

  // close modal
  close(): void {
      this.basicModal.hide();
      if(this.actionForm.toUpperCase()!="VER"){
        this.redrawEvent.emit(null);
      }
  }

  // log contenido de objeto en formulario
  get diagnosticValidate() { return JSON.stringify(this.record); }

  

  
}
