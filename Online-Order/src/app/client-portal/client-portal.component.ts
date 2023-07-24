import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OMSServicedbService } from '../services/omsservicedb.service';
import { AuthenticationService } from '../services/authentication-service';
import { PathService } from '../services/path-service.service';
import { User } from '../shared/User';
import Swal from 'sweetalert2';
import { TokenStorageService } from '../_helpers/TokenStorageService';
import { Product } from '../shared/Product';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-portal',
  templateUrl: './client-portal.component.html',
  styleUrls: ['./client-portal.component.css']
})
export class ClientPortalComponent {
  products:any[] = [];
  config: any; 
  noOfRows = 10;
  p: number = 1;

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService, private location:Location)
  {}

  //Search query 
  query:string = '';
  ngOnInit(): void 
  {
    //Get asset from api
    this.omsservicedbservice.readProducts()
    .subscribe(response => {
      this.products = response;
        })
  }


  searchProducts()
  { 
    this.products = []
      if (this.query == '')
      {
        this.omsservicedbservice.readProducts()
        .subscribe(response => {
          this.products = response;
            })
      }
      else
      {
        if (this.query.replace(/\s/g, '').length == 0 || this.noWhitespaceValidator(this.query))
        {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Search',
            confirmButtonText: 'OK',
            confirmButtonColor: '#077bff',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) {
                 //Get asset from api
                this.omsservicedbservice.readProducts()
                .subscribe(response => {
                  this.products = response;
                    })
            }
          })  
        }
        else
        {
            this.omsservicedbservice.searchProducts(this.query.toString()).subscribe(response => {
            this.products = response;
            if (this.products.length == 0)
            {
              Swal.fire({
              icon: 'error',
              title: 'No Results Found',
              confirmButtonText: 'OK',
              confirmButtonColor: '#077bff',
              allowOutsideClick: false,
              allowEscapeKey: false
              }).then((result) => {
                if (result.isConfirmed) {
                //Get asset from api
                this.omsservicedbservice.readProducts()
                .subscribe(response => {
                  this.products = response;
                    })
                }
              })  
            }
            })
          }  
      }
      
}

     //Check no white spaces
     public noWhitespaceValidator(query: string) 
     {
       var iCount = 0;
       for(var i = 0; i < query.length; i++)
       {
         if (query[i] == " ")
         {
           iCount += 1
         }
       }
       if (iCount != query.length)
       {
         return  null
       }
       return {'noWhitespaceValidator' : true}
  
   }

addToCart(selectedProduct:Product)
{

}

}
