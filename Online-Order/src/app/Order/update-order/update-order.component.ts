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
import { Order } from 'src/app/shared/Order';
import { ProductRemoval } from 'src/app/shared/RemovalProduct';

@Component({
  selector: 'app-updae-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent {
  orderform : FormGroup;
  submitted = false;
  clicked = false;
  selected!: FileList;
  disabled = false;
  placeOrder:OrderVM;
  cart:Cart[] = [];
  enabled!:boolean;
  orders:any[] = [];
  selectedOrder:OrderVM;
  orderproducts: Set<ProductVM> = new Set();
  products: Product[] = [];
  orderlines: any[] = [];
  account!: Account;
  product!: Product;
  orderproduct!: ProductVM;
  remove!:ProductRemoval;

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
    this.pathService.setPath("/update-orders");
    this.account = this.omsservicedbservice.getAccount();
    this.selectedOrder = this.omsservicedbservice.getOrder();
      this.orderproducts.clear();
      this.omsservicedbservice.readProducts().subscribe((response) => {
        this.products = response;

        this.orderform.patchValue({
          description: this.selectedOrder?.description,  
          })
    
        this.omsservicedbservice.readClientOrderLines(this.account.userID.toString()).subscribe((response) => {
          this.orderlines = response;
    
          this.omsservicedbservice.readOrders().subscribe((response) => {
            this.orders = response;
    
            this.orderlines.forEach((element) => {
              if (element.orderID == this.selectedOrder.orderID) {
                this.product = this.products.find((x) => x.productID == element.productID);
                this.orderproduct = {
                  productID: this.product.productID,
                  orderID: element.orderID,
                  quantity: element.quantity,
                  productName: this.product.productName,
                  price:this.product.price
                };
    
                // Add the orderproduct to the Set
                this.orderproducts.add(this.orderproduct);
              }
            });
          });
        });
      });    
  }

  get f() { return this.orderform.controls!; }



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

  removeFromOrder(productItem: ProductVM) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to remove item from order?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
      confirmButtonColor: '#077bff',
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.remove =
        {
          orderID: productItem.orderID,
          productID:productItem.productID,
          quantity:productItem.quantity
        }
        this.omsservicedbservice.deleteProductOrderLines(this.remove).subscribe();
        Swal.fire({
          icon: 'success',
          title: 'Product Removed From Order',
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
