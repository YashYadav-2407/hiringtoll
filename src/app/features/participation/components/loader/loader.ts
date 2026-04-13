import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventViewMode } from '../../models/tech-event.model';

@Component({
  selector: 'app-event-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class LoaderComponent {
  @Input() viewMode: EventViewMode = 'grid';

  readonly items = Array.from({ length: 6 }, (_, index) => index);

  trackByIndex(index: number): number {
    return index;
  }
}
