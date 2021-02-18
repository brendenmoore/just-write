import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.styles.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  authListener: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authListener = this.authService.getAuthStatusListener().subscribe(status => {
      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.authListener.unsubscribe();
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
  }
}
