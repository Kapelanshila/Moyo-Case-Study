import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientPortalComponent } from './client-portal/client-portal.component';
import { TokenInterceptor } from './_helpers/TokenInterceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { NavigationComponent } from './navigation/navigation.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ReadOrdersComponent } from './Order/read-orders/read-orders.component';
import { DatePipe } from './pipes/date.pipe';
import { TimePipe } from './pipes/time.pipe';
import { CreateOrdersComponent } from './Order/create-orders/create-orders.component';
import { UpdateOrderComponent } from './Order/update-order/update-order.component';
import { CreateProductComponent } from './Product/create-product/create-product.component';
import { UpdateProductComponent } from './Product/update-product/update-product.component';
import { ReadProductComponent } from './Product/read-product/read-product.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientPortalComponent,
    NavigationComponent,
    ReadOrdersComponent,
    DatePipe,
    CreateOrdersComponent,
    UpdateOrderComponent,
    TimePipe,
    CreateProductComponent,
    UpdateProductComponent,
    ReadProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [    
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
