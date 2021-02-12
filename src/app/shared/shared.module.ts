import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MyDatePipe } from "./my-date.pipe";
import { PaginatorComponent } from "./paginator/paginator.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { WordCountPipe } from "./word-count.pipe";
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    SpinnerComponent,
    PaginatorComponent,
    SideNavComponent,
    MyDatePipe,
    WordCountPipe,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    RouterModule,
    CommonModule,
    SpinnerComponent,
    PaginatorComponent,
    SideNavComponent,
    MyDatePipe,
    WordCountPipe,
    NavbarComponent
  ]
})
export class SharedModule {}
