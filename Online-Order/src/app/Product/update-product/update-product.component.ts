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
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent {
  productform : FormGroup;
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
  selectedProduct!:Product;

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService)
  {
      //Additional Validation can be added here
      this.productform = fbuilder.group({
        productID: 0,
        productName: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
        price: new FormControl ('',[Validators.required]),
        stock: new FormControl ('',[Validators.required]),
      });
  }

  
  ngOnInit(): void 
  {
    this.selectedProduct = this.omsservicedbservice.getProduct();
    this.productform.patchValue({
      productID: this.selectedProduct?.productID,  
      productName: this.selectedProduct?.productName,
      stock:this.selectedProduct?.stock,
      price:this.selectedProduct?.price
      })

  }

  editproduct()
  {
    this.omsservicedbservice.readProducts()
      .subscribe(response => {
        this.products = response;

      this.submitted = true;
      if (this.productform.valid == true)
      {
          if (this.productform.get('stock').value < 0 || this.productform.get('price').value < 0 )
          {
            Swal.fire({
              icon: 'warning',
              title: 'Values cannot be less than 0',
              confirmButtonText: 'OK',
              confirmButtonColor: '#077bff',
              allowOutsideClick: false,
              allowEscapeKey: false
            })
          }
          else
          {    
            Swal.fire({
              icon: 'warning',
              title: 'Are you sure you want to edit this product?',
              showDenyButton: true,
              confirmButtonText: 'Yes',
              denyButtonText: `No`,
              confirmButtonColor: '#077bff',
              allowOutsideClick: false,
              allowEscapeKey: false
            }).then((result) => {
              if (result.isConfirmed) {
                this.omsservicedbservice.updateProducts(this.productform.value).subscribe();
                Swal.fire({
                  icon: 'success',
                  title: 'Product Updated',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#077bff',
                  allowOutsideClick: false,
                  allowEscapeKey: false
                }).then((result) => {
                    if (result.isConfirmed) {
                    this.router.navigate(['/read-products']).then(() => {
                    });
                  }
                })   
              }
            })   
          }
      }
    });
  }

  get f() { return this.productform.controls!; }


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
