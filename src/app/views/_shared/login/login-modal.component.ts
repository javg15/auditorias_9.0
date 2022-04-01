import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LoginModalService } from './services/login-modal.service';
import { AuthService } from '../../../_services/auth.service';
import { TokenStorageService } from '../../../_services/token-storage.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})

export class LoginModalComponent implements OnInit {
  form: any = {};
  @Input() id: string; //idModal
  @Output() onLoginEvent = new EventEmitter<any>();

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  tituloForm:string='';
  private elementModal: any;
  @ViewChild('basicModal') basicModal: ModalDirective;


  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private loginModalService: LoginModalService,
    private el: ElementRef,
    ) {
      this.elementModal = el.nativeElement;
    }

  ngOnInit(): void {

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
    else{
      let modal = this;
      // ensure id attribute exists
      if (!modal.id) {//idModal {
        console.error('modal must have an id');
        return;
      }
      // add self (this modal instance) to the modal service so it's accessible from controllers
      modal.loginModalService.add(modal);
    }
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.loginModalService.remove(this.id); //idModal
    this.elementModal.remove();
}

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        //this.tokenStorage.savePeriodo(this.form.periodo)

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.onLoginEvent.emit();
        this.close();
        //this.reloadPage();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  // open modal
  open(idItem: string):  void {
    this.basicModal.show();
  }


  // close modal
  close(): void {
      this.basicModal.hide();
  }

}
