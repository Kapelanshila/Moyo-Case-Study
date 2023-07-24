import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class TokenStorageService {
  constructor() { }

  loggedinUser()
  {
    return !!localStorage.getItem('token')
  }

  setToken(value : any)
  {
    localStorage.setItem('token',JSON.stringify(value));
  }

  getToken()
  {
    return localStorage.getItem('token');
  }

  clearToken()
  {
    localStorage.clear();
  }

  
}