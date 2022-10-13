import { NgModule } from '@angular/core';

@NgModule({
  imports: [],
  exports: []
})

export class Config {
    public user_id = "";
    public chatbot_url = "http://0.0.0.0:4201";

    public firebaseConfig = {
      apiKey: "AIzaSyB0HDIUJ0BloqEHNKkhvTIPR9W5lZRw6fY",
      authDomain: "learning-portal-iui.firebaseapp.com",
      projectId: "learning-portal-iui",
      storageBucket: "learning-portal-iui.appspot.com",
      messagingSenderId: "1096372541588",
      appId: "1:1096372541588:web:72b4de9798026bb74c3c81",
      measurementId: "G-MJ77V1DK6N"
    };
}
