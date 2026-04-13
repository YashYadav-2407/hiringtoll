import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { EventFilters, EventMode, EventPlatform, EventSort, EventStatus } from '../../models/tech-event.model';

const ALL_TAGS = ['AI', 'Web', 'Web Dev', 'DSA', 'CP', 'Cloud', 'Product', 'DevTools', 'Startup', 'Frontend'];

@Component({
  selector: 'app-filter-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatSelectModule, MatFormFieldModule, MatChipsModule, MatIconModule],
  templateUrl: './filter-sidebar.html',
  styleUrl: './filter-sidebar.scss',
})
export class FilterSidebarComponent implements OnChanges {
  @Input({ required: true }) filters: EventFilters | null = null;
  @Output() filtersChange = new EventEmitter<Partial<EventFilters>>();
  @Output() resetFilters = new EventEmitter<void>();

  readonly platforms: EventPlatform[] = ['Unstop', 'Devfolio', 'MLH', 'HackerEarth'];
  readonly modes: EventMode[] = ['Online', 'Offline'];
  readonly statuses: Array<EventStatus | 'all'> = ['all', 'upcoming', 'ongoing', 'past'];
  readonly sortOptions: EventSort[] = ['deadline', 'popularity', 'newest'];
  readonly tags = ALL_TAGS;

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    platforms: this.fb.control<EventPlatform[]>([]),
    tags: this.fb.control<string[]>([]),
    modes: this.fb.control<EventMode[]>([]),
    status: this.fb.control<EventStatus | 'all'>('all'),
    sort: this.fb.control<EventSort>('deadline'),
  });

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      this.filtersChange.emit({
        platforms: value.platforms ?? [],
        tags: value.tags ?? [],
        modes: value.modes ?? [],
        status: (value.status ?? 'all') as EventStatus | 'all',
        sort: (value.sort ?? 'deadline') as EventSort,
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']?.currentValue) {
      this.form.patchValue(this.filters ?? {}, { emitEvent: false });
    }
  }

  toggleTag(tag: string): void {
    const current = this.form.value.tags ?? [];
    const next = current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag];
    this.form.patchValue({ tags: next });
  }

  clear(): void {
    this.resetFilters.emit();
  }

  isTagActive(tag: string): boolean {
    return (this.form.value.tags ?? []).includes(tag);
  }
}
