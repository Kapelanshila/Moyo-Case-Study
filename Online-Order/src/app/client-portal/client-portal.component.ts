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
import { Cart } from '../shared/Cart';

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
  cartItems:Cart[] = []; 
  countproducts = 0;

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService, private location:Location)
  {}

  //Search query 
  query:string = '';
  ngOnInit(): void 
  {
    this.omsservicedbservice.clearCart();
    //Get asset from api
    this.omsservicedbservice.readProducts()
    .subscribe(response => {
      this.products = response;
       this.products.filter((product) => product.stock > 0);
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
                  this.products.filter((product) => product.stock > 0);
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
                  this.products.filter((product) => product.stock > 0);
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
      //Check Stock Levels
      if (selectedProduct.stock.valueOf() - 1 != 0)
      {
        Swal.fire({
          icon: 'error',
          title: 'Product is out of stock',
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
      }
      else
      {
        Swal.fire({
          icon: 'warning',
          title: 'Are you sure you want add this item to cart?',
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.countproducts = 0;

            this.omsservicedbservice.setCart(selectedProduct);
            this.cartItems = this.omsservicedbservice.getCart();

            this.cartItems.forEach(element => {
              this.countproducts = this.countproducts + element.quantity;
            });

            Swal.fire({
              icon: 'success',
              title: 'Product Added To Cart',
              html:
              '<p>Item(s) in Cart: '+this.countproducts+'</p>',
              confirmButtonText: 'OK',
              confirmButtonColor: '#077bff',
              allowOutsideClick: false,
              allowEscapeKey: false
              })
          }
        })   
      }       
  }

}
