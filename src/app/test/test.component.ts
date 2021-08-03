import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  items: Observable<any[]>;
  uid: string;

  constructor(private store: AngularFirestore, public auth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.uid = user.uid;
      this.items = this.store
        .collection('items', (ref) => ref.where('creator', '==', this.uid))
        .valueChanges({ idField: 'itemId' });
    })
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
  }

  addItem() {
    this.store.collection('items').add({name: "Test", creator: this.uid})
  }

  onUpdate(item){
    console.log(item)
    this.store.doc('items/' + item.itemId).update({name: item.name})
  }
}
