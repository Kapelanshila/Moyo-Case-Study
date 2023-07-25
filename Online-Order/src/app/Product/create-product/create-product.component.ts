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
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent {
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

  constructor(public tokenStorageService: TokenStorageService,fbuilder: FormBuilder, private router: Router,private authenticationService:AuthenticationService, private omsservicedbservice:OMSServicedbService , private pathService:PathService)
  {
      //Additional Validation can be added here
      this.productform = fbuilder.group({
        productName: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
        price: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
        stock: new FormControl ('',[Validators.required,this.noWhitespaceValidator]),
      });
  }

  
  ngOnInit(): void 
  {
    
  }

  addproduct()
  {
    this.submitted = true;
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
