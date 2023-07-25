import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_helpers/TokenStorageService';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { OMSServicedbService } from 'src/app/services/omsservicedb.service';
import { PathService } from 'src/app/services/path-service.service';
import { Account } from 'src/app/shared/Account';
import { Cart } from 'src/app/shared/Cart';
import { OrderVM } from 'src/app/shared/OrderVM';
import { Product } from 'src/app/shared/Product';
import { SearchOrderVM } from 'src/app/shared/SearchOrderVM';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ProductVM } from 'src/app/shared/ProductVM';
import { Order } from 'src/app/shared/Order';

@Component({
  selector: 'app-read-product',
  templateUrl: './read-product.component.html',
  styleUrls: ['./read-product.component.css']
})
export class ReadProductComponent {
  products:any[] = [];
  config: any; 
  noOfRows = 10;
  p: number = 1;
  cartItems:Cart[] = []; 
  countproducts = 0;

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService, private location:Location)
  {}

  //Search query 
  query:string = '';
  ngOnInit(): void 
  {
    this.pathService.clearPath();
    this.pathService.setPath('/read-products');
    //Get asset from api
    this.omsservicedbservice.readProducts()
    .subscribe(response => {
      this.products = response;

        })
  }

  addProduct()
  {
    this.router.navigate(['/create-product']);
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
  
}
