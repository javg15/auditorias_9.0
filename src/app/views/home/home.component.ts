import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Router } from '@angular/router';

import { HomeService } from './services/home.service';

import { Personal } from '../../_data/_models';
import { PersonalService } from '../catalogos/personal/services/personal.service';
import * as $ from "jquery"

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent  {

  record_personal: Personal= {
    id: 0,curp: '', rfc: '',  homoclave: '',
    state: '', nombre: '', apellidopaterno: '', apellidomaterno:'',id_catestadocivil:0,
    fechanacimiento: null, id_catestadosnaci: 0, id_catmunicipiosnaci: 0, id_catlocalidadesnaci: 0,
    id_archivos_avatar:0,id_usuarios_sistema:0,numeemp:'',
    telefono: '', email: '', emailoficial:'',observaciones:'',sexo:0,
    id_catestadosresi: 0, id_catmunicipiosresi: 0, id_catlocalidadesresi: 0,
    domicilio:'',colonia:'',cp:'',telefonomovil:'',numimss:'',numissste:'',otronombre:'', numotro:'',tipopension:'',
    created_at: new Date(),  updated_at: new Date(), id_usuarios_r: 0,fechaingreso:null,primaantiguedad:0,
    id_catbanco_deposito:0,cuentadeposito:'',formacobro:0,
  };

  usuario:any=this.tokenStorage.getUser();
  images=[1,1,1,1,1,1];
  imageDefault:boolean=false;

  constructor(private tokenStorage: TokenStorageService,
    private homeService: HomeService,
    private personalSvc: PersonalService,
    private router: Router,
  ) {

    /*this.personalSvc.getRecordSegunUsuario(this.usuario.id).subscribe(resp => {
      this.record_personal = resp;
    });*/
  }

  ngOnInit(): void {
    // generate random values for mainChart
  }

  openModal(id: string) {
    this.homeService.open(id);
  }

  closeModal(id: string) {
    this.homeService.close(id);
  }

}
