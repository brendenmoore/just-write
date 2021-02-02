import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { NoteListComponent } from './note-list/note-list.component';
import { WriteComponent } from './write/write.component';

const routes: Routes = [
  {path: "", component: LandingComponent},
  {path: "write", component: WriteComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "signup", component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
