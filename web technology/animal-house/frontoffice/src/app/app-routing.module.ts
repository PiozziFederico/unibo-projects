import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { GeneralBoardComponent } from './general-board/general-board.component';
import { GeneralServiceComponent } from './general-service/general-service.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'ecommerce', component: EcommerceComponent },
  { path: 'cart', component: ShoppingCartComponent },
  { path: 'general-board', component: GeneralBoardComponent },
  { path: 'general-service', component: GeneralServiceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
