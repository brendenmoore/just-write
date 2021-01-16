import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { NoteListComponent } from './note-list/note-list.component';
import { WriteComponent } from './write/write.component';

const routes: Routes = [
  {path: "", component: LandingComponent},
  {path: "write", component: WriteComponent},
  {path: "notes", component: NoteListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
