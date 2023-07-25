import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../shared/User';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Account } from '../shared/Account';
import { UserRole } from '../shared/UserRole';
import { Product } from '../shared/Product';
import { Cart } from '../shared/Cart';
import { Order } from '../shared/Order';
import { ProductVM } from '../shared/ProductVM';
import { OrderVM } from '../shared/OrderVM';

@Injectable({
  providedIn: 'root'
})
export class OMSServicedbService {

  constructor(private http: HttpClient) { }
  cartItems:Cart[] = [];
  cartItem!:Cart;
  newcartItem!:Cart;

  //returns employees from API
  readUsers(): Observable<User[]>{
    return this.http.get<User[]>(environment.apiUrl+'/OMS/getUsers')
  }

  //returns user roles form API
  readUserRoles(): Observable<UserRole[]>{
    return this.http.get<UserRole[]>(environment.apiUrl+'/OMS/getUserRoles')
  }

  //returns products from API
  readProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(environment.apiUrl+'/OMS/getProducts')
  }

  //Searches Product through use of the API
    searchProducts(value:string){
    return this.http.get<any>(environment.apiUrl+'/OMS/SearchProducts?search='+value)
  }

  //Get Orders
  readOrders(): Observable<Order[]>{
    return this.http.get<Order[]>(environment.apiUrl+'/OMS/getOrders')
  }

  //Get Lines
  readClientOrderLines(value: string): Observable<Order[]>{
    return this.http.get<Order[]>(environment.apiUrl+'/OMS/getClientOrderLines?userID='+value)
  }

    //Search Orderlines
    searchorderLines(obj:any): Observable<any[]>{
      return this.http.post<any>(environment.apiUrl+'/OMS/searchOrderLines',obj)
    }

  //Create Order Lines
  createOrderLines(obj:any): Observable<any[]>{
    return this.http.post<any>(environment.apiUrl+'/OMS/createOrderLine',obj)
  }

  //Update Order Lines
  updateOrderLines(obj:any): Observable<any[]>{
    return this.http.put<any>(environment.apiUrl+'/OMS/UpdateOrderLine',obj)
  }

  //Delete Product Order Lines
  deleteProductOrderLines(obj:any): Observable<any[]>{
    return this.http.post<any>(environment.apiUrl+'/OMS/deleteOrderProduct',obj)
  }


  //Get Selected Account
  setAccount(value : Account)
  {
    localStorage.setItem('Account',JSON.stringify(value));
  }

  //Returns selected Account
  getAccount()
  {
    return JSON.parse(localStorage.getItem('Account')!);
  }

  //Clears Account
  clearAccount()
  {
    localStorage.removeItem('Account');
  } 

  
  setCart(value: Cart) {
    this.cartItems = JSON.parse(localStorage.getItem('Cart')!) || [];
  
    this.cartItem = this.cartItems.find(x => x.productID == value.productID);
  
    if (this.cartItem !== undefined) {
      this.cartItem.quantity++; // Increment the quantity if the product is found
    } else {
      this.newcartItem = {
        productID: value.productID,
        price: value.price,
        stock: value.stock,
        quantity: 1,
        productName: value.productName,
        orderID: 0,
      };
      this.cartItems.push(this.newcartItem);
    }
  
    localStorage.setItem('Cart', JSON.stringify(this.cartItems));
  }

  updateCart(value: Cart) {
    this.cartItems = JSON.parse(localStorage.getItem('Cart')!) || [];
    this.cartItem = this.cartItems.find(x => x.productID === value.productID);
  
    if (this.cartItem !== undefined) {

      this.cartItem.quantity = value.quantity; 

    } else {
      this.newcartItem = {
        productID: value.productID,
        price: value.price,
        stock: value.stock,
        quantity: 1,
        productName: value.productName,
        orderID: 0,
      };
      this.cartItems.push(this.newcartItem);
    }
  
    localStorage.setItem('Cart', JSON.stringify(this.cartItems));
  }

  removeFromCart(productItem: Cart) {
    const cartItems: Cart[] = JSON.parse(localStorage.getItem('Cart')!) || [];
    const index = cartItems.findIndex(item => item.productID === productItem.productID);

    if (index !== -1) {
      cartItems.splice(index, 1);
      localStorage.setItem('Cart', JSON.stringify(cartItems));
    }
  }

  //Returns selected Cart
  getCart()
  {
    return JSON.parse(localStorage.getItem('Cart')!);
  }

  //Clears Cart
  clearCart()
  {
    localStorage.removeItem('Cart');
  } 

    //Get Selected Order so it can be either updated or deleted
    setOrder(value : OrderVM)
    {
     localStorage.setItem('Order',JSON.stringify(value));
   }
 
    //Returns selected Order so it can be used on potentially other pages
    getOrder()
    {
     return JSON.parse(localStorage.getItem('Order')!);
   }
 
    //Clears Order value so it ready to read again
    clearOrder()
    {
     localStorage.removeItem('Order');
   } 
 


}
