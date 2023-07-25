import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-create-orders',
  templateUrl: './create-orders.component.html',
  styleUrls: ['./create-orders.component.css']
})
export class CreateOrdersComponent {
  orderform : FormGroup;
  submitted = false;
  clicked = false;
  selectedorder:any;
  selected!: FileList;
  disabled = false;
  placeOrder:OrderVM;
  cart:Cart[] = [];
  enabled!:boolean;
  orders:any[] = [];

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService)
  {
      //Additional Validation can be added here
      this.orderform = fbuilder.group({
        description: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
      });
  }

  ngOnInit(): void 
  {
    this.pathService.clearPath();
    this.pathService.setPath("/place-orders")
    this.cart =  this.omsservicedbservice.getCart();

    if (this.cart.length != 0)
    {
      this.enabled = false;
    }
    else
    {
      this.enabled = true;
    }
  }

  get f() { return this.orderform.controls!; }

  addOrder()
  {
    this.submitted = true;
    this.omsservicedbservice.readOrders()
    .subscribe(response => {
      this.orders = response;


    this.submitted = true;
    if (this.orderform.valid == true)
    {

      //No duplicate description fro client order
      if(this.orders.find(x => x.description.toLowerCase() == this.orderform.get('description')?.value.toLowerCase()) != undefined )
      {
        Swal.fire({
          icon: 'warning',
          title: 'Duplicate Order Description',
          confirmButtonText: 'OK',
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false
        })
      }

      if ( this.orders.find(x => x.description.toLowerCase() == this.orderform.get('description')?.value.toLowerCase()) == undefined )
      {
        this.placeOrder = 
        {
          description: this.orderform.get('description')?.value,
          date: new Date(),
          orderID: 0,
          orderLineID:0,
          productID:0,
          Quantity:0,
          userID:this.omsservicedbservice.getAccount().userID,
          products:this.cart,
          user:''
        }

        Swal.fire({
          icon: 'warning',
          title: 'Are you sure you want to place this order?',
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            this.omsservicedbservice.clearCart();
            this.omsservicedbservice.createOrderLines(this.placeOrder).subscribe();
            Swal.fire({
              icon: 'success',
              title: 'Order Placed',
              confirmButtonText: 'OK',
              confirmButtonColor: '#077bff',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((result) => {
                if (result.isConfirmed) {
                this.router.navigate(['/client-orders']).then(() => {
                });
              }
            })   
          }
        })   
    }
  }
  })  
  }

  changeQuantity(productItem: any, event: any) {
    const newQuantity = parseInt(event.target.value); // Get the new quantity value from the input
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      // Check if the new value is a valid number greater than or equal to 1
      productItem.quantity = newQuantity; // Update the productItem's quantity with the new value
  
      // Call the updateCart() method with the productItem
      this.omsservicedbservice.updateCart(productItem);
    } else {
      // If the input value is invalid, reset it back to the previous value
      event.target.value = productItem.quantity;
    }
  }

  removeFromCart(productItem: Cart) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to remove item from cart?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
      confirmButtonColor: '#077bff',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.omsservicedbservice.removeFromCart(productItem);
        this.cart =  this.omsservicedbservice.getCart();

        if (this.cart.length != 0)
        {
          this.enabled = false;
        }
        else
        {
          this.enabled = true;
        }
        Swal.fire({
          icon: 'success',
          title: 'Product Removed From Cart',
          confirmButtonText: 'OK',
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }
    })   
  }


    //Check no white spaces
    public noWhitespaceValidator(someFormControl: FormControl) 
    {
      var iCount = 0;
      for(var i = 0; i < someFormControl.value.length; i++)
      {
        if (someFormControl.value[i] == " ")
        {
          iCount += 1
        }
      }
      if (iCount != someFormControl.value.length)
      {
        return  null
      }
      return {'noWhitespaceValidator' : true}
    }
}
