import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../shared/User';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OMSServicedbService {

  constructor(private http: HttpClient) { }

  
    //returns employees from API
    readUsers(): Observable<User[]>{
      return this.http.get<User[]>(environment.apiUrl+'OMS/getUsers')
    }

      //Get Selected Account
  setAccount(value : User)
  {
    localStorage.setItem('Account',JSON.stringify(value));
  }

  //Returns selected Account
  getAccount()
  {
    return JSON.parse(localStorage.getItem('Account')!);
  }

  //Clears Account
  clearAccount()
  {
    localStorage.removeItem('Account');
  } 


}
