import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  imports: [MatDividerModule, CommonModule]
})
export class ProfileComponent {

  user = {
    name: 'Yash Yadav',
    username: 'yash2313146',
    country: 'India',
    role: 'Student',
    institution: 'Ajay Kumar Garg Engineering College, Ghaziabad, Uttar Pradesh, India',
    avatar: 'assets/profile.jpg' // optional
  };

}
