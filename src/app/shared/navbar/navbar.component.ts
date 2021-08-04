import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  redirectURL = environment.baseURL + "/callback"
  loggedIn: boolean = false;
  isLanding: boolean = false;
  userEmail: string = '';
  @Input() homeTheme: boolean = false;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(result => {
      this.loggedIn = result;
    });
    this.authService.user$.subscribe(user => {
      this.userEmail = user.email
    });
  }

   logout(){
     this.authService.logout({returnTo: "https://write.bmoore.dev"})
   }

   login(){
     this.authService.loginWithRedirect({
       appState: { target: '/dashboard' },
       redirect_uri: this.redirectURL
     });
   }

   register(){
     this.authService.loginWithRedirect({
       screen_hint: 'signup',
       redirect_uri: this.redirectURL
     });
   }

}
