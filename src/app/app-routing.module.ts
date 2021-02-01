import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { LandingComponent } from './landing/landing.component';
import { NoteListComponent } from './note-list/note-list.component';
import { WriteComponent } from './write/write.component';

const routes: Routes = [
  {path: "", component: LandingComponent},
  {path: "notes", component: NoteListComponent},
  {path: "write", component: WriteComponent},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
