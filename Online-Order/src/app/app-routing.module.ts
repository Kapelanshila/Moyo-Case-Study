import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent} from './login/login.component';
import { ClientPortalComponent } from './client-portal/client-portal.component';

const routes: Routes = [{ path: 'login', component: LoginComponent},
{ path: 'client-portal', component: ClientPortalComponent},
{path: '', redirectTo: 'login', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
