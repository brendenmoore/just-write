import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../auth.styles.css']
})
export class SignupComponent implements OnInit, OnDestroy {

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

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password)
  }
}
