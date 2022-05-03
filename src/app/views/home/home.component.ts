import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { Router } from '@angular/router';

import { HomeService } from './services/home.service';

import { PersonalService } from '../catalogos/personal/services/personal.service';
import * as $ from "jquery"

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent  {

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
