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

@Component({
  selector: 'app-read-orders',
  templateUrl: './read-orders.component.html',
  styleUrls: ['./read-orders.component.css'],
})
export class ReadOrdersComponent {
  orders: any[] = [];
  orderlines: any[] = [];
  orderItems: any[] = [];
  orderItem!: OrderVM;
  config: any;
  noOfRows = 10;
  p: number = 1;
  cartItems: Cart[] = [];
  countproducts = 0;
  account!: Account;
  queryVM!: SearchOrderVM;
  products: Product[] = [];
  orderproducts: Set<ProductVM> = new Set();
  orderproduct!: ProductVM;
  product!: Product;
  isPopupOpening = false;
  displayStyle = "none";
  
  constructor(
    public tokenStorageService: TokenStorageService,
    fbuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private omsservicedbservice: OMSServicedbService,
    private pathService: PathService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.account = this.omsservicedbservice.getAccount();
    this.orderItems = [];

    // Get orderlines from API
    this.omsservicedbservice
      .readClientOrderLines(this.account.userID.toString())
      .subscribe((response) => {
        this.orderlines = response;

        this.omsservicedbservice.readOrders().subscribe((response) => {
          this.orders = response;

          this.orderlines.forEach((element) => {
            this.orderItem = {
              orderID: this.orders.find((x) => x.orderID == element.orderID)!.orderID,
              description: this.orders.find((x) => x.orderID == element.orderID)!.description,
              date: this.orders.find((x) => x.orderID == element.orderID)!.date,
              orderLineID: element.orderLineID,
              productID: 0,
              products: [],
              Quantity: 0,
              userID: 0,
            };
            this.orderItems.push(this.orderItem);
          });
        });
      });
  }

  // Modal Open and Close Functions
  openPopup(selectedOrder: OrderVM) {
    if (!this.isPopupOpening) {
      this.isPopupOpening = true;
      this.orderproducts.clear();
      this.omsservicedbservice.readProducts().subscribe((response) => {
        this.products = response;

        this.omsservicedbservice.readClientOrderLines(this.account.userID.toString()).subscribe((response) => {
          this.orderlines = response;

          this.omsservicedbservice.readOrders().subscribe((response) => {
            this.orders = response;

            this.orderlines.forEach((element) => {
              if (element.orderID == selectedOrder.orderID) {
                this.product = this.products.find((x) => x.productID == element.productID);
                this.orderproduct = {
                  productID: this.product.productID,
                  orderID: element.orderID,
                  quantity: element.quantity,
                  productName: this.product.productName,
                };

                this.orderproducts.add(this.orderproduct);
              }
            });
            this.displayStyle = 'block';
            this.isPopupOpening = false; // Reset the flag once the operation is completed
          });
        });
      });
    }
  }

  closePopup() {
    this.displayStyle = 'none';
    this.orderproducts.clear();
  }

  // Search query
  query: string = '';
  searchProducts() {
    this.queryVM = {
      search: this.query,
      userID: this.account.userID,
    };

    this.orderItems = [];
    if (this.query == '') {
      this.omsservicedbservice.readClientOrderLines(this.account.userID.toString()).subscribe((response) => {
        this.orderlines = response;

        this.omsservicedbservice.readOrders().subscribe((response) => {
          this.orders = response;

          this.orderlines.forEach((element) => {
            this.orderItem = {
              orderID: this.orders.find((x) => x.orderID == element.orderID)!.orderID,
              description: this.orders.find((x) => x.orderID == element.orderID)!.description,
              date: this.orders.find((x) => x.orderID == element.orderID)!.date,
              orderLineID: element.orderLineID,
              productID: 0,
              products: [],
              Quantity: 0,
              userID: 0,
            };
            this.orderItems.push(this.orderItem);
          });
        });
      });
    } else {
      if (this.query.replace(/\s/g, '').length == 0 || this.noWhitespaceValidator(this.query)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Search',
          confirmButtonText: 'OK',
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then((result) => {
          if (result.isConfirmed) {
            this.omsservicedbservice.readClientOrderLines(this.account.userID.toString()).subscribe((response) => {
              this.orderlines = response;

              this.omsservicedbservice.readOrders().subscribe((response) => {
                this.orders = response;

                this.orderlines.forEach((element) => {
                  this.orderItem = {
                    orderID: this.orders.find((x) => x.orderID == element.orderID)!.orderID,
                    description: this.orders.find((x) => x.orderID == element.orderID)!.description,
                    date: this.orders.find((x) => x.orderID == element.orderID)!.date,
                    orderLineID: element.orderLineID,
                    productID: 0,
                    products: [],
                    Quantity: 0,
                    userID: 0,
                  };
                  this.orderItems.push(this.orderItem);
                });
              });
            });
          }
        });
      } else {
        this.omsservicedbservice.searchorderLines(this.queryVM).subscribe((response) => {
          this.orderlines = response;

          this.omsservicedbservice.readOrders().subscribe((response) => {
            this.orders = response;

            this.orderlines.forEach((element) => {
              this.orderItem = {
                orderID: this.orders.find((x) => x.orderID == element.orderID)!.orderID,
                description: this.orders.find((x) => x.orderID == element.orderID)!.description,
                date: this.orders.find((x) => x.orderID == element.orderID)!.date,
                orderLineID: element.orderLineID,
                productID: 0,
                products: [],
                Quantity: 0,
                userID: 0,
              };
              this.orderItems.push(this.orderItem);
            });

            if (this.orderlines.length == 0) {
              Swal.fire({
                icon: 'error',
                title: 'No Results Found',
                confirmButtonText: 'OK',
                confirmButtonColor: '#077bff',
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  // Get orderlines from API
                  this.omsservicedbservice
                    .readClientOrderLines(this.account.userID.toString())
                    .subscribe((response) => {
                      this.orderlines = response;

                      this.omsservicedbservice.readOrders().subscribe((response) => {
                        this.orders = response;

                        this.orderlines.forEach((element) => {
                          this.orderItem = {
                            orderID: this.orders.find((x) => x.orderID == element.orderID)!.orderID,
                            description: this.orders.find((x) => x.orderID == element.orderID)!.description,
                            date: this.orders.find((x) => x.orderID == element.orderID)!.date,
                            orderLineID: element.orderLineID,
                            productID: 0,
                            products: [],
                            Quantity: 0,
                            userID: 0,
                          };
                          this.orderItems.push(this.orderItem);
                        });
                      });
                    });
                }
              });
            }
          });
        });
      }
    }
  }

  // Check no white spaces
  public noWhitespaceValidator(query: string) {
    var iCount = 0;
    for (var i = 0; i < query.length; i++) {
      if (query[i] == ' ') {
        iCount += 1;
      }
    }
    if (iCount != query.length) {
      return null;
    }
    return { noWhitespaceValidator: true };
  }

  addToCart(selectedProduct: Product) {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want add this item to cart?',
      showDenyButton: true,
      confirmButtonText: 'Yes',
      denyButtonText: `No`,
      confirmButtonColor: '#077bff',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.countproducts = 0;

        this.omsservicedbservice.setCart(selectedProduct);
        this.cartItems = this.omsservicedbservice.getCart();

        this.cartItems.forEach((element) => {
          this.countproducts = this.countproducts + element.quantity;
        });

        Swal.fire({
          icon: 'success',
          title: 'Product Added To Cart',
          html: '<p>Item(s) in Cart: ' + this.countproducts + '</p>',
          confirmButtonText: 'OK',
          confirmButtonColor: '#077bff',
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
      }
    });
  }
}
