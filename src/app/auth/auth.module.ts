import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SpinnerComponent } from "../shared/spinner/spinner.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AuthModule {

}
