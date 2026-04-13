import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventCardComponent } from '../../components/event-card/event-card';
import { FilterSidebarComponent } from '../../components/filter-sidebar/filter-sidebar';
import { LoaderComponent } from '../../components/loader/loader';
import { TechEventsService } from '../../services/tech-events.service';
import { EventFilters, EventViewMode, TechEventCardVm } from '../../models/tech-event.model';

@Component({
  selector: 'app-participation-home-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    MatDividerModule,
    EventCardComponent,
    FilterSidebarComponent,
    LoaderComponent,
  ],
  templateUrl: './participation-home.html',
  styleUrl: './participation-home.scss',
})
export class ParticipationHomePageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly service = inject(TechEventsService);
  private readonly router = inject(Router);

  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly events$ = this.service.filteredEvents$;
  readonly savedEvents$ = this.service.savedEvents$;
  readonly appliedEvents$ = this.service.appliedEvents$;
  readonly featuredEvents$ = this.service.featuredEvents$;
  readonly upcomingEvents$ = this.service.upcomingEvents$;
  readonly stats$ = this.service.stats$;
  readonly filters$ = this.service.filters$;
  readonly viewMode$ = this.service.viewMode$;
  readonly loading$ = this.service.loading$;
  readonly error$ = this.service.error$;
  readonly toast$ = this.service.toast$;

  ngOnInit(): void {
    this.service.loadEvents();

    this.searchControl.valueChanges
      .pipe(startWith(this.searchControl.value), debounceTime(180), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.service.patchFilters({ search: value });
      });
  }

  trackEventId(index: number, event: TechEventCardVm): string {
    return event.id;
  }

  updateFilters(patch: Partial<EventFilters>): void {
    this.service.patchFilters(patch);
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.service.resetFilters();
  }

  changeViewMode(viewMode: EventViewMode): void {
    this.service.setViewMode(viewMode);
  }

  toggleBookmark(event: TechEventCardVm): void {
    this.service.toggleBookmark(event.id);
  }

  applyNow(event: TechEventCardVm): void {
    this.service.markApplied(event);
    if (typeof window !== 'undefined') {
      window.open(event.applyUrl, '_blank', 'noopener,noreferrer');
    }
  }

  openDetails(event: TechEventCardVm): void {
    this.router.navigate(['/participation', event.id]);
  }

  dismissToast(): void {
    this.service.dismissToast();
  }
}
