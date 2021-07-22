import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  loggedIn: boolean = false;
  isLanding: boolean = false;
  userEmail: string = '';
  @Input() homeTheme: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.getIsLoggedIn();
    this.authService.getAuthStatusListener().subscribe(result => {
      this.loggedIn = result;
    });
    this.userEmail = this.authService.getUserEmail();
  }

   

}
