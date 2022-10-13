import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../config';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  courses: any[] = [];
  links: any[] = [];
  private db;
  active_course: any = null;
  course_type = "";
  loading = false;
  chat_input = "";
  messages :any = [];

  constructor(private config: Config, private router: Router, private http: HttpClient) {
    if (!config.user_id) {
      router.navigate(['/login']);
    }
    const app = initializeApp(config.firebaseConfig);
    this.db = getFirestore(app);
  }

  async ngOnInit() {
    this.loading = true;
    this.active_course = null;
    this.courses = [];
    this.chat_input = "";
    this.messages = [];
    const querySnapshot = await getDocs(collection(this.db, "courses"));
    querySnapshot.forEach((doc) => {
      this.courses.push({
        id: doc.id,
        name: doc.data()['name'],
        short_name: doc.data()['short_name']
      });
    });

    this.messages.push({
      text: "Hi, how may I help you today?",
      sender: "Bot"
    });

    this.loading = false;
  }

  async load_b() {
    this.loading = true;
    this.course_type = "Beginner";

    const querySnapshot = await getDocs(collection(this.db, "courses", this.active_course.id, "beginner"));
    this.links = [];
    querySnapshot.forEach((doc) => {
      this.links.push({
        id: doc.id,
        c_id: this.active_course.id,
        c_type: "beginner",
        index: doc.data()['index'],
        url: doc.data()['url'],
        title: doc.data()['title'],
      });
    });

    this.links.sort((a, b) => (a.index < b.index ? -1 : 1));
    this.loading = false;
  }

  async load_i() {
    this.loading = true;
    this.course_type = "Intermediate";

    const querySnapshot = await getDocs(collection(this.db, "courses", this.active_course.id, "intermediate"));
    this.links = [];
    querySnapshot.forEach((doc) => {
      this.links.push({
        id: doc.id,
        c_id: this.active_course.id,
        c_type: "intermediate",
        index: doc.data()['index'],
        url: doc.data()['url'],
        title: doc.data()['title'],
      });
    });
    
    this.links.sort((a, b) => (a.index < b.index ? -1 : 1));
    this.loading = false;
  }

  logout() {
    this.active_course = null;
    this.config.user_id = "";
    this.router.navigate(['/login']);
  }

  async get_response_from_chatbot(message: string) {
    let default_response = "Sorry. I couldn't understand you.";
    try {
        this.http.get(this.config.chatbot_url + "/" + message).subscribe(
          (response: any) => {
            this.messages.push({
              text: response.response,
              sender: "Bot"
            });
          },
          (error) => {
            console.error(error)
            this.messages.push({
              text: default_response,
              sender: "Bot"
            });
          });
    } catch (exception) {
        console.log(exception);
        this.messages.push({
          text: default_response,
          sender: "Bot"
        });
    }
  }

  chat() {
    if (this.chat_input.trim() == "") {
      return;
    }
    
    this.messages.push({
      text: this.chat_input,
      sender: "You"
    });

    this.get_response_from_chatbot(this.chat_input);
    this.chat_input = "";
  }
}
