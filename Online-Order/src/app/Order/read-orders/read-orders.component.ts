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

@Component({
  selector: 'app-read-orders',
  templateUrl: './read-orders.component.html',
  styleUrls: ['./read-orders.component.css']
})
export class ReadOrdersComponent {
  orders:any[] = [];
  orderlines:any[] = [];
  orderItems:any[] = [];
  orderItem!:OrderVM;
  config: any; 
  noOfRows = 10;
  p: number = 1;
  cartItems:Cart[] = []; 
  countproducts = 0;
  account!:Account;
  queryVM!:SearchOrderVM;

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService, private location:Location)
  {}

  //Search query 
  query:string = '';
  ngOnInit(): void 
  { 
    this.account = this.omsservicedbservice.getAccount();
    this.orderItems = [];

    //Get orderlines from api
    this.omsservicedbservice.readClientOrderLines(this.account.userID.toString())
    .subscribe(response => {
      this.orderlines = response;

      this.omsservicedbservice.readOrders()
      .subscribe(response => {
        this.orders = response;
        
          this.orderlines.forEach(element => {
            this.orderItem =
            {
              orderID: this.orders.find((x => x.orderID == element.orderID)!).orderID,
              description: this.orders.find((x => x.orderID == element.orderID)!).description,
              date: this.orders.find((x => x.orderID == element.orderID)!).date,
              orderLineID: element.orderLineID,
              productID: 0,
              products: [],
              Quantity: 0,
              userID: 0,
            }
            this.orderItems.push(this.orderItem);
          });

          })
        })
  }

  //Modal
  displayStyle = "none";
      //Modal Open and Close Functions
    openPopup() 
    {
      // this.ventrixdbservice.readAssetWriteOff()
      // .subscribe(response => {
      //   this.assetWriteOffs = response;
      //   console.log(this.assetWriteOffs)
        
      //   this.writeoff = this.assetWriteOffs.find(x => x.assetId == selecteditem.assetId) 
      //   console.log(this.writeoff)
      //   this.ventrixdbservice.readWriteOffReason()
      //   .subscribe(response => {
      //     this.reasons = response
      //     this.reason = this.reasons.find(x => x.writeOffReasonId ==  this.writeoff.writeOffReasonId).description 
      //     this.description = this.writeoff.description 
      //   })
      //   this.displayStyle = "block";
      // })
      this.displayStyle = "block";
    }

    closePopup() {
      this.displayStyle = "none";
    }


  searchProducts()
  { 
    this.queryVM =
    {
      search: this.query,
      userID: this.account.userID
    }

    this.orderItems = []
      if (this.query == '')
      {
        this.omsservicedbservice.readProducts()
 this.omsservicedbservice.readClientOrderLines(this.account.userID.toString())
    .subscribe(response => {
      this.orderlines = response;

      this.omsservicedbservice.readOrders()
      .subscribe(response => {
        this.orders = response;
        
          this.orderlines.forEach(element => {
            this.orderItem =
            {
              orderID: this.orders.find((x => x.orderID == element.orderID)!).orderID,
              description: this.orders.find((x => x.orderID == element.orderID)!).description,
              date: this.orders.find((x => x.orderID == element.orderID)!).date,
              orderLineID: element.orderLineID,
              productID: 0,
              products: [],
              Quantity: 0,
              userID: 0,
            }
            this.orderItems.push(this.orderItem);
          });

          })
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
              this.omsservicedbservice.readClientOrderLines(this.account.userID.toString())
              .subscribe(response => {
                this.orderlines = response;
          
                this.omsservicedbservice.readOrders()
                .subscribe(response => {
                  this.orders = response;
                  
                    this.orderlines.forEach(element => {
                      this.orderItem =
                      {
                        orderID: this.orders.find((x => x.orderID == element.orderID)!).orderID,
                        description: this.orders.find((x => x.orderID == element.orderID)!).description,
                        date: this.orders.find((x => x.orderID == element.orderID)!).date,
                        orderLineID: element.orderLineID,
                        productID: 0,
                        products: [],
                        Quantity: 0,
                        userID: 0,
                      }
                      this.orderItems.push(this.orderItem);
                    });
          
                    })
                  })
            }
          })  
        }
        else
        {
            this.omsservicedbservice.searchorderLines(this.queryVM).subscribe(response => {
            this.orderlines = response;

            this.omsservicedbservice.readOrders()
            .subscribe(response => {
              this.orders = response;


              this.orderlines.forEach(element => {
                this.orderItem =
                {
                  orderID: this.orders.find((x => x.orderID == element.orderID)!).orderID,
                  description: this.orders.find((x => x.orderID == element.orderID)!).description,
                  date: this.orders.find((x => x.orderID == element.orderID)!).date,
                  orderLineID: element.orderLineID,
                  productID: 0,
                  products: [],
                  Quantity: 0,
                  userID: 0,
                }
                this.orderItems.push(this.orderItem);
              });
    
              
            if (this.orderlines.length == 0)
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
     
    //Get orderlines from api
    this.omsservicedbservice.readClientOrderLines(this.account.userID.toString())
    .subscribe(response => {
      this.orderlines = response;

      this.omsservicedbservice.readOrders()
      .subscribe(response => {
        this.orders = response;
        
          this.orderlines.forEach(element => {
            this.orderItem =
            {
              orderID: this.orders.find((x => x.orderID == element.orderID)!).orderID,
              description: this.orders.find((x => x.orderID == element.orderID)!).description,
              date: this.orders.find((x => x.orderID == element.orderID)!).date,
              orderLineID: element.orderLineID,
              productID: 0,
              products: [],
              Quantity: 0,
              userID: 0,
            }
            this.orderItems.push(this.orderItem);
          });

          })
        })
                }
              })  
            }
            })
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
