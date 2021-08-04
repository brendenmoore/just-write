import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { environment } from '../environments/environment';
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
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { SharedModule } from './shared/shared.module';
import { CanDeactivateGuard } from './write/can-deactivate-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { FloFullscreenModule } from '@flosportsinc/ng-fullscreen';
import { MobileLandingComponent } from './mobile-landing/mobile-landing.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TestComponent } from './test/test.component';
import {AngularFireAuthModule } from '@angular/fire/auth'

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PasswordResetComponent,
    PageNotFoundComponent,
    WriteComponent,
    NoteListComponent,
    SettingsComponent,
    DashboardComponent,
    HomeComponent,
    MobileLandingComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutosizeModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    FloFullscreenModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
    ],
  providers: [
    // {provide: HTTP_INTERCEPTORS , useClass: AuthInterceptor, multi: true},
    // {provide: HTTP_INTERCEPTORS , useClass: ErrorInterceptor, multi: true},

    CanDeactivateGuard,
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
