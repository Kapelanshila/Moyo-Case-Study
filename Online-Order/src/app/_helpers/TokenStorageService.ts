import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class TokenStorageService {
  constructor() { }

  loggedinUser()
  {
    return !!localStorage.getItem('token')
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