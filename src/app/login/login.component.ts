import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { Router } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Config } from '../config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loading = false;

  constructor(private config: Config, private router: Router) {
    this.config.user_id = "";
    this.username = "";
    this.password = "";
    initializeApp(config.firebaseConfig);
  }

  ngOnInit(): void {
    this.loading = false;
  }

  login(): void {
    this.loading = true;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.username, this.password)
      .then((userCredential) => {
        this.loading = false;
        this.config.user_id = userCredential.user.uid;
        this.router.navigate(['/dash']);
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
        alert("Could not login. Try again!");
      });
  }
}
