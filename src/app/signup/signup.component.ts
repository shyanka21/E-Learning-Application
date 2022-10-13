import { Component, OnInit } from '@angular/core';
import { Config } from '../config';
import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  name: string;
  username: string;
  password: string;
  loading = false;

  private db;

  constructor(private config: Config) {
    this.name = "";
    this.username = "";
    this.password = "";
    const app = initializeApp(config.firebaseConfig);
    this.db = getFirestore(app);
  }

  ngOnInit(): void {
    this.loading = false;
  }

  async create_user(new_id: string) {
    await setDoc(doc(this.db, "students", new_id), {
      name: this.name,
      age: 25
    });
  }

  signup(): void {
    this.loading = true;
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, this.username, this.password)
      .then((userCredential) => {
        this.create_user(userCredential.user.uid);
        this.loading = false;
        alert("User created successfully!");
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
        alert("Could not create user!");
      });
  }
}
