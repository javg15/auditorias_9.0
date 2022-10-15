import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  //periodoCat:any[]=[];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private loginService: LoginService,
    private router: Router) {

    }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }

    /*for(let i=2020;i<=new Date().getFullYear();i++)
      this.periodoCat.push({id:i,descripcion:i});*/
  }

  onSubmit(): void {
    this.authService.login(this.form).subscribe(
      data => {
        if(data){
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          //this.tokenStorage.savePeriodo(this.form.periodo)

          this.isLoginFailed = false;
          this.isLoggedIn = true;

          this.router.navigate(['home']);
          //this.reloadPage();
        }
        else{
          this.isLoginFailed = true;
          this.isLoggedIn = false;
          
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  inicio(): void {
    this.router.navigate(['home']);
  }

  openModal(id: string) {
    this.loginService.open(id);
  }

  closeModal(id: string) {
    this.loginService.close(id);
  }
}
