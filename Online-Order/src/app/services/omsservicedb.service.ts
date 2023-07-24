import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../shared/User';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Account } from '../shared/Account';
import { UserRole } from '../shared/UserRole';
import { Product } from '../shared/Product';

@Injectable({
  providedIn: 'root'
})
export class OMSServicedbService {

  constructor(private http: HttpClient) { }

  //returns employees from API
  readUsers(): Observable<User[]>{
    return this.http.get<User[]>(environment.apiUrl+'/OMS/getUsers')
  }

  //returns user roles form API
  readUserRoles(): Observable<UserRole[]>{
    return this.http.get<UserRole[]>(environment.apiUrl+'/OMS/getUserRoles')
  }

  //returns products from API
  readProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(environment.apiUrl+'/OMS/getProducts')
  }

  //Searches Product through use of the API
    searchProducts(value:string){
    return this.http.get<any>(environment.apiUrl+'/OMS/SearchProducts?search='+value)
  }


  //Get Selected Account
  setAccount(value : Account)
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
