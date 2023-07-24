import { Component } from '@angular/core';
import { TokenStorageService } from '../_helpers/TokenStorageService';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service';
import { OMSServicedbService } from '../services/omsservicedb.service';
import { PathService } from '../services/path-service.service';
import { Account } from '../shared/Account';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  account!:Account;
  path:String;
  isCollapsed = true; // Initial state of the sidebar
  // Define adminMenuItems here
  adminMenuItems = [
    { label: 'User', routerLink: '/read-user' },
    { label: 'Backup/Restore', routerLink: '/backup-restore' },
    { label: 'Supplier', routerLink: '/read-supplier' },
    // Add more admin menu items as needed
  ];

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService, private location:Location)
  {}
  ngOnInit(): void 
  {
    this.account = this.omsservicedbservice.getAccount();
    console.log(this.account.role)
    this.path=  this.pathService.getPath();
  }

  back()
  {
    this.location.back();
  }

  dashboard()
  {
    this.router.navigate(['/dashboard']);  }


  logout()
  {
    this.authenticationService.logout();
  }

  orders()
  {
    if(this.account.role == 'Client')
    {
      this.router.navigate(['/client-orders']);
    }
    else
    {
      this.router.navigate(['/read-clientorder']);
    }
  }

  products()
  {
    if(this.account.role == 'Client')
    {
      this.router.navigate(['/client-portal']);
    }
    else
    {
      this.router.navigate(['/read-clientorder']);
    }
  }
}