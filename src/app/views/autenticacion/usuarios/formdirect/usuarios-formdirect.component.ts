import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Usuarios } from 'src/app/_data/_models/';
import { ValidationSummaryComponent } from '../../../_shared/validation/validation-summary.component';

import { Archivos } from 'src/app/_data/_models/archivos';
import { ArchivosService } from '../../../catalogos/archivos/services/archivos.service';

import { ListUploadComponent } from '../../../_shared/upload/list-upload.component';
import { FormUploadComponent } from '../../../_shared/upload/form-upload.component';

import { TokenStorageService } from '../../../../_services/token-storage.service';
import { Observable } from 'rxjs';
import { IsLoadingService } from '../../../../_services/is-loading/is-loading.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-usuarios-formdirect',
  templateUrl: './usuarios-formdirect.component.html',
  styleUrls: ['./usuarios-formdirect.component.css']
})

export class UsuariosFormdirectComponent implements OnInit {
  userFormIsPending: Observable<boolean>; //Procesando información en el servidor
  @Input() idRecord: string;

  actionForm: string="editar";
  tituloForm: string;

  private elementModal: any;
  @ViewChild('successModal') public successModal: ModalDirective;
  @ViewChild(ValidationSummaryComponent) validSummary: ValidationSummaryComponent;
  @ViewChild(ListUploadComponent) listUpload: ListUploadComponent;
  @ViewChild(FormUploadComponent) formUpload: FormUploadComponent;

  isLoggedIn = false;
  isLoginFailed = false;

  record: Usuarios;
  passConfirm:String="";
  pass:String="";
  passActual:String="";
  recordFile:Archivos;

  constructor(private isLoadingService: IsLoadingService,
      private usuariosService: UsuariosService, private el: ElementRef,
      private archivosSvc:ArchivosService,
      private tokenStorage: TokenStorageService
      ) {
      this.elementModal = el.nativeElement;

      //obtener el usario desde la sesion
      if (this.tokenStorage.getToken()) {
        this.idRecord=this.tokenStorage.getUser().id;
        this.usuariosService.getRecord(this.tokenStorage.getUser().id).subscribe(resp => {
          this.record = resp;
          this.listUpload.showFiles(this.record.id_archivos_avatar);
        });
      }
  }

  newRecord(): Usuarios {
    return {
      id: 0,  username: '',   pass: '',record_catzonasgeograficas:[],
      uPassenc: '',  perfil: 0,  nombre: '',   numemp: '',   created_at: new Date(),  updated_at: new Date(),
      id_permgrupos: 0, id_usuarios_r: 0, state: '',  email: '', id_archivos_avatar:0
    };
  }
  ngOnInit(): void {

      this.record =this.newRecord();

  }

  async submitAction(form) {

    if(this.actionForm.toUpperCase()!=="VER"){
      this.validSummary.resetErrorMessages(form);

      this.record.id=parseInt(this.idRecord);
      this.record.pass=this.pass.toString();

      await this.isLoadingService.add(
      this.usuariosService.setPerfil(this.record,this.actionForm,this.passConfirm,this.passActual,1,0).subscribe(async resp => {
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
                  tipo: null,  nombre:  null, numero:0
                };

            await this.archivosSvc.setRecordReferencia(this.recordFile,this.actionForm)
            this.successModal.show();
            setTimeout(()=>{ this.successModal.hide(); }, 2000)
          }
          else{
            this.successModal.show();
            setTimeout(()=>{ this.successModal.hide(); }, 2000)
          }
        }
      }),{ key: 'loading' });
    }
  }

  //Archivo cargado
  onLoadedFile(idFile:number){
    this.record.id_archivos_avatar=idFile;
    this.listUpload.showFiles(this.record.id_archivos_avatar);
  }



  // log contenido de objeto en formulario
  get diagnosticValidate() { return JSON.stringify(this.record); }
}
