import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MyDatePipe } from "./my-date.pipe";
import { PaginatorComponent } from "./paginator/paginator.component";
import { SideNavComponent } from "./side-nav/side-nav.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { WordCountPipe } from "./word-count.pipe";

@NgModule({
  declarations: [
    SpinnerComponent,
    PaginatorComponent,
    SideNavComponent,
    MyDatePipe,
    WordCountPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    SpinnerComponent,
    PaginatorComponent,
    SideNavComponent,
    MyDatePipe,
    WordCountPipe
  ]
})
export class SharedModule {}
