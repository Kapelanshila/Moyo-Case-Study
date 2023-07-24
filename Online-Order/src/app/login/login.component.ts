import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OMSServicedbService } from '../services/omsservicedb.service';
import { AuthenticationService } from '../services/authentication-service';
import { PathService } from '../services/path-service.service';
import { User } from '../shared/User';
import Swal from 'sweetalert2';
import { TokenStorageService } from '../_helpers/TokenStorageService';
import { Account } from '../shared/Account';
import { UserRole } from '../shared/UserRole';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginform : FormGroup;
  submitted:boolean;
  responsedata: any;
  account!:Account;
  user!:User;
  users:User[] = [];
  userRoles:UserRole[] = [];
  role!:UserRole;

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
  
            this.omsservicedbservice.readUsers()
            .subscribe(response => {
              this.users = response;

              
              this.omsservicedbservice.readUserRoles()
              .subscribe(response => {
                this.userRoles = response;

                //Gathering account information
                this.user = this.users.find(x => x.userName == this.loginform.get('userName')?.value)!;
                this.role = this.userRoles.find(x => x.userRoleID == this.user.userRoleID)!;


                this.account =
                { 
                  userID: this.user.userID,
                  userName : this.user.userName,  
                  password_Hashed: '',
                  userRoleID: this.user.userRoleID,
                  role: this.role.description
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
                      //Route to relevant pages based on account type
                      if (this.account.role == "Client")
                      {
                        this.pathService.clearRequest();
                        this.pathService.setPath('/client-portal');
                        this.router.navigate(['/client-portal']).then(() => {
                        });
                      }
                      else
                      {
                        this.router.navigate(['/oms']).then(() => {
                        });
                      }
                  }
                })  
              });
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
