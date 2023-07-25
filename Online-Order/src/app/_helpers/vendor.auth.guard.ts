import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenStorageService } from './TokenStorageService';
import { OMSServicedbService } from '../services/omsservicedb.service';
import { Account } from '../shared/Account';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class vendorAuthGuard implements CanActivate {


  constructor(private router: Router, private tokenStorageService:TokenStorageService, private oms:OMSServicedbService) {}
  account!:Account;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
    {
      this.account = this.oms.getAccount();
      if (this.account != null)
      {
        if (this.tokenStorageService.getToken != undefined && (this.account.role == "Vndor"))
        {
          return true;
        }
        else
        {
          this.router.navigate(['/login']);
          return false;
        }
      }
      else
      {
        this.router.navigate(['/login']);
        return false;
      }
    }
}