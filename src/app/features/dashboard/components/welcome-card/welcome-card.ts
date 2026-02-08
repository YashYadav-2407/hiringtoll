import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './welcome-card.html',
  styleUrl: './welcome-card.scss',
})
export class WelcomeCardComponent implements OnInit {
  greeting: string = 'Good Afternoon';
  userName: string = 'Yash';

  ngOnInit(): void {
    this.setGreeting();
  }

  /**
   * Set greeting based on current time of day
   */
  private setGreeting(): void {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.greeting = 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.greeting = 'Good Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      this.greeting = 'Good Evening';
    } else {
      this.greeting = 'Good Night';
    }
  }
}
