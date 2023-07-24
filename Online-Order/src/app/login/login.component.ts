import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OMSServicedbService } from '../services/omsservicedb.service';
import { AuthenticationService } from '../services/authentication-service';
import { PathService } from '../services/path-service.service';
import { User } from '../shared/User';
import Swal from 'sweetalert2';
import { TokenStorageService } from '../_helpers/TokenStorageService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginform : FormGroup;
  submitted:boolean;
  responsedata: any;
  account!:User;
  users:User[] = [];

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService)
  { 
    this.loginform = fbuilder.group({
      userName: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
      password_Hashed: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
    });
  }

  
  ngOnInit(): void 
  {
    this.pathService.clearPath();
    this.authenticationService.logout();
  }

  
  login()
  {
    this.submitted = true;
    if (this.loginform.valid == true)
    {
      this.authenticationService.login(this.loginform.value).subscribe(
        result => {
          if (result!= null)
          {
            this.responsedata = result;
            localStorage.setItem('token',this.responsedata);
            console.log(this.tokenStorageService.getToken());
  
            this.omsservicedbservice.readUsers()
            .subscribe(response => {
              this.users = response;
        
              //Gathering account information
              this.account = this.users.find(x => x.userName == this.loginform.get('userName')?.value)!;
              this.account =
              { 
                userID: this.account.userID,
                userName : this.account.userName,  
                password_Hashed: '',
                userRoleID: this.account.userRoleID,
              }
              this.omsservicedbservice.setAccount(this.account);
              Swal.fire({
                  icon: 'success',
                  title: "Logged In",
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#077bff',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                  }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['/client-portal']).then(() => {
                    window.location.reload();
                  });
                }
              })  
            });
          }
      })
    }
   }

     //Check no white spaces
   public noWhitespaceValidator(someFormControl: FormControl) 
   {
     var iCount = 0;
     for(var i = 0; i < someFormControl.value.length; i++)
     {
       if (someFormControl.value[i] == " ")
       {
         iCount += 1
       }
     }
     if (iCount != someFormControl.value.length)
     {
       return  null
     }
     return {'noWhitespaceValidator' : true}

 }
  
   get f() { return this.loginform.controls!; }
}
