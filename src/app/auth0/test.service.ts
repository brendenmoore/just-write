import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private http: HttpClient) { }

  getTest() {
    this.http.get("http://localhost:3000/api/user/testAuth0").subscribe(response => {
      console.log(response)
    })
  }
}
