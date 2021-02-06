import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WriteComponent } from './write/write.component';
import { NoteListComponent } from './note-list/note-list.component';
import { SettingsComponent } from './settings/settings.component';
import { FormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { MyDatePipe } from './shared/my-date.pipe';
import { WordCountPipe } from './shared/word-count.pipe';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PasswordResetComponent,
    PageNotFoundComponent,
    WriteComponent,
    NoteListComponent,
    SettingsComponent,
    SpinnerComponent,
    MyDatePipe,
    WordCountPipe,
    SideNavComponent,
    PaginatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutosizeModule,
    FormsModule,
    HttpClientModule,
    AuthModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS , useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS , useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
