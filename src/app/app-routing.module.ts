import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { TestComponent } from './auth0/test/test.component';
import { HomeComponent } from './home/home.component';
import { CanDeactivateGuard } from './write/can-deactivate-guard.service';
import { WriteComponent } from './write/write.component';

const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "dashboard", component: HomeComponent, canActivate: [AuthGuard]},
  {path: "write", component: WriteComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
  {path: "auth", loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: "test", component: TestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
