import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assess',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './assess.html',
  styleUrl: './assess.scss'
})
export class AssessComponent {}