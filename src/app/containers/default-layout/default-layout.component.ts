import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ArchivosService } from '../../views/catalogos/archivos/services/archivos.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../_services/user.service';
import { INavData } from '@coreui/angular';

@Component({
  selector: 'app-default',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems : INavData[]=navItems;

  usuario:any=this.tokenStorage.getUser();
  
  imageDefault:boolean=false;
  
  constructor(private tokenStorage: TokenStorageService,
      private archivoSvc: ArchivosService,
      private userSvc: UserService,
      private router: Router,
      private _sanitizer: DomSanitizer,
    ) {

      
  }


  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  logout(): void {
    this.tokenStorage.signOut();

    //this.router.navigate(['/login']);
  }

  
}
