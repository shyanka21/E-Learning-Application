import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Config } from '../config';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, addDoc, doc } from "firebase/firestore";
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-videopage',
  templateUrl: './videopage.component.html',
  styleUrls: ['./videopage.component.css']
})
export class VideopageComponent implements OnInit {

  video_title = "";
  video_url = "";
  video_id = "";
  course_id = "";
  course_type = "";
  sanitized_video_url: any = "";
  feedbacks: any[] = [];
  feedback_text = "";
  loading = false;

  private db;

  constructor(private config: Config, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    if (!config.user_id) {
      router.navigate(['/login']);
    }

    const app = initializeApp(config.firebaseConfig);
    this.db = getFirestore(app);
  }

  async ngOnInit() {
    this.loading = false;
    this.feedback_text = "";
    this.feedbacks = [];
    this.route.queryParams.subscribe(params => {
      this.course_id = params['c_id'];
      this.course_type = params['c_type'];
      this.video_id = params['id'];
      this.video_url = params['url'];
      this.video_title = params['title'];
      this.sanitized_video_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.video_url);

      this.load_feedbacks();
    });
  }

  async load_feedbacks() {
    this.loading = true;
    this.feedbacks = [];
    const querySnapshot = await getDocs(collection(this.db, "courses", this.course_id, this.course_type, this.video_id, "feedback"));
    querySnapshot.forEach((doc) => {
      this.feedbacks.push({
        id: doc.id,
        name: doc.data()['name'],
        text: doc.data()['text'],
      });
    });
    this.loading = false;
  }

  async submitFeedback() {
    this.loading = true;
    const docRef = doc(this.db, "students", this.config.user_id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const name = docSnap.data()['name'];

      await addDoc(collection(this.db, "courses", this.course_id, this.course_type, this.video_id, "feedback"), {
        name: name,
        text: this.feedback_text
      });
      this.feedback_text = "";
      this.load_feedbacks();
    } else {
      this.loading = false;
    }
  }

  goToSurvey() {
    let url = "https://milwaukee.qualtrics.com/jfe/form/SV_9LV4kLyV8fgBd1Y";
    window.open(url, "_blank");
  }

  logout() {
    this.config.user_id = "";
    this.router.navigate(['/login']);
  }
}
