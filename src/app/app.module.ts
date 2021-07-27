import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { environment } from 'src/environments/environment';
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
// Auth0
import { AuthModule } from '@auth0/auth0-angular';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { LoginButtonComponent } from './auth0/login-button/login-button.component';
import { TestComponent } from './auth0/test/test.component';
import { CallbackComponent } from './callback/callback.component';

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
    LoginButtonComponent,
    TestComponent,
    CallbackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AutosizeModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    FloFullscreenModule,
    AuthModule.forRoot({
      domain: 'justwrite.us.auth0.com',
      clientId: 'C2sKcYrHtWvyb6XckjOIXk31fo6XDTlM',
      audience: 'http://localhost:3000/api/',
      httpInterceptor: {
        allowedList: [
          "/api/*",
          {
            uri: environment.apiURL + "*",
            tokenOptions: {
              audience: 'http://localhost:3000/api/',

            },
          },
        ],
      },
    }),
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    CanDeactivateGuard,
    { provide: Window, useValue: window },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
