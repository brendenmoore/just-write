import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAuth: boolean = false;
  isMobile: boolean = false;
  authStatusSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(result => {
      this.isAuth = result;
    });
    this.isMobile = (window.innerWidth < 768);
  }

}
