import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, map, combineLatest, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from '../../components/event-card/event-card';
import { LoaderComponent } from '../../components/loader/loader';
import { TechEventsService } from '../../services/tech-events.service';
import { TechEvent, TechEventCardVm } from '../../models/tech-event.model';

@Component({
  selector: 'app-event-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatChipsModule, MatIconModule, EventCardComponent, LoaderComponent],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss',
})
export class EventDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(TechEventsService);

  readonly event$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const eventId = params.get('id') || '';
      return eventId ? this.service.getEventById(eventId) : of(undefined);
    }),
  );

  readonly relatedEvents$ = combineLatest([this.event$, this.service.featuredEvents$]).pipe(
    map(([event, featured]) => (event ? this.service.getRelatedEvents(event, 4) : featured)),
  );

  constructor() {}

  trackRelated(index: number, event: TechEventCardVm): string {
    return event.id;
  }

  ngOnInit(): void {
    this.service.loadEvents();
  }

  goBack(): void {
    this.router.navigate(['/participation']);
  }

  toggleBookmark(event: TechEventCardVm): void {
    this.service.toggleBookmark(event.id);
  }

  applyNow(event: TechEventCardVm | TechEvent): void {
    this.service.markApplied(event);
    if (typeof window !== 'undefined') {
      window.open(event.applyUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
