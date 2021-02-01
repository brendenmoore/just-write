import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    console.log(form.value);
  }
}
