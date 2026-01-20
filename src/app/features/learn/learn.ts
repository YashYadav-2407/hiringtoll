import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './learn.html',
  styleUrl: './learn.scss'
})
export class LearnComponent {}