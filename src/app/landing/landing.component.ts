import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  loggedIn = false;
  private authListenerSubs: Subscription;
  backgrounds: string[] = [
    "bg-orange",
    "bg-blue",
    "bg-green",
    "bg-purple"
  ];
  backgroundColor: string = "bg-orange";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.randomizeBackground();
    this.loggedIn = this.authService.getIsLoggedIn();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  randomizeBackground() {
    const index = Math.floor(Math.random() * this.backgrounds.length);
    this.backgroundColor = this.backgrounds[index];
    console.log(this.backgroundColor);
  }

}
