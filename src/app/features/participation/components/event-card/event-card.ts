import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TechEventCardVm, EventViewMode } from '../../models/tech-event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss',
})
export class EventCardComponent {
  @Input({ required: true }) event!: TechEventCardVm;
  @Input() viewMode: EventViewMode = 'grid';

  @Output() bookmarkToggle = new EventEmitter<TechEventCardVm>();
  @Output() applyNow = new EventEmitter<TechEventCardVm>();

  trackTag(index: number, tag: string): string {
    return `${tag}-${index}`;
  }
}
