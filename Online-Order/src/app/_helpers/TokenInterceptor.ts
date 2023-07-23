import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenStorageService } from './TokenStorageService';

@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenStorageService:TokenStorageService) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.tokenStorageService.getToken()}`
      }
    })
    return next.handle(tokenizedReq);
  }
}