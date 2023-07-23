import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TokenStorageService } from '../_helpers/TokenStorageService';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient, private tokenStorageService:TokenStorageService) { }
    
    login(obj:any){
        return this.http.post(environment.apiUrl+'/Access/Login',obj, { responseType: 'text' })
    }

    logout()
    {
        this.tokenStorageService.clearToken();
    }
 
  }