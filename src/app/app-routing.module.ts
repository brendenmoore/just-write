import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { TestComponent } from './auth0/test/test.component';
import { CallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';
import { LandingComponent } from './landing/landing.component';
import { NoteListComponent } from './note-list/note-list.component';
import { TestComponent } from './test/test.component';
import { CanDeactivateGuard } from './write/can-deactivate-guard.service';
import { WriteComponent } from './write/write.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "test", component: TestComponent},
  {path: "dashboard", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "write", component: WriteComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
  {path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: "test", component: TestComponent},
  {path: "callback", component: CallbackComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
