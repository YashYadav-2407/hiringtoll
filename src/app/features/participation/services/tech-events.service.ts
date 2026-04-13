import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import {
  AppliedEventRecord,
  EventFilters,
  EventSort,
  EventStatus,
  EventViewMode,
  EventPlatform,
  EventMode,
  TechEvent,
  TechEventCardVm,
  TechEventStats,
} from '../models/tech-event.model';

const DEFAULT_FILTERS: EventFilters = {
  search: '',
  platforms: [],
  tags: [],
  modes: [],
  status: 'all',
  sort: 'deadline',
};

const STORAGE_KEYS = {
  filters: 'participation_filters',
  savedIds: 'participation_saved_ids',
  appliedHistory: 'participation_applied_history',
  eventsCache: 'participation_events_cache',
  upcomingCache: 'participation_upcoming_cache',
};

const MOCK_EVENTS: TechEvent[] = [
  {
    id: 'unstop-ai-builders-challenge',
    title: 'AI Builders Challenge',
    platform: 'Unstop',
    category: 'Hackathon',
    tags: ['AI', 'Web', 'Product'],
    mode: 'Online',
    status: 'upcoming',
    deadlineDate: '2026-04-20',
    startDate: '2026-04-25',
    endDate: '2026-04-27',
    prize: '₹2,00,000 in prizes',
    banner: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    description: 'Build production-ready AI experiences for hiring, collaboration, and workflow automation.',
    eligibility: ['Students', 'Early-career developers', 'Open to teams of 1-4'],
    timeline: [
      { label: 'Registration closes', date: '2026-04-20', detail: 'Complete the sign-up and team formation.' },
      { label: 'Problem statement release', date: '2026-04-25', detail: 'Project brief and judging rubric go live.' },
      { label: 'Final demo', date: '2026-04-27', detail: 'Submit a video demo and deployment link.' },
    ],
    applyUrl: 'https://unstop.com/hackathons/ai-builders-challenge',
    popularity: 96,
    createdAt: '2026-04-03T09:00:00Z',
    featured: true,
  },
  {
    id: 'devfolio-open-source-sprint',
    title: 'Open Source Sprint',
    platform: 'Devfolio',
    category: 'Hackathon',
    tags: ['Open Source', 'Web Dev', 'DevTools'],
    mode: 'Online',
    status: 'upcoming',
    deadlineDate: '2026-04-22',
    startDate: '2026-04-28',
    endDate: '2026-04-30',
    prize: 'GitHub swag + mentorship',
    banner: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
    description: 'Ship an open-source tool, improve a library, or build a developer productivity workflow.',
    eligibility: ['Any developer', 'Open-source contributions welcome', 'Team or solo submissions'],
    timeline: [
      { label: 'Applications close', date: '2026-04-22', detail: 'Submit your concept and team details.' },
      { label: 'Build week', date: '2026-04-28', detail: 'Work on your implementation and iterate with mentors.' },
      { label: 'Demo day', date: '2026-04-30', detail: 'Present your project to judges and community.' },
    ],
    applyUrl: 'https://devfolio.co/hackathons/open-source-sprint',
    popularity: 92,
    createdAt: '2026-04-05T12:30:00Z',
  },
  {
    id: 'mlh-global-student-tech-day',
    title: 'Global Student Tech Day',
    platform: 'MLH',
    category: 'Conference',
    tags: ['DSA', 'AI', 'Career'],
    mode: 'Offline',
    status: 'ongoing',
    deadlineDate: '2026-04-18',
    startDate: '2026-04-13',
    endDate: '2026-04-15',
    prize: 'Certificates + speaker sessions',
    banner: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
    description: 'A three-day conference with recruiters, engineers, and student builders sharing practical interview tips.',
    eligibility: ['Students and graduates', 'Priority for shortlisted applicants', 'In-person attendance required'],
    timeline: [
      { label: 'Conference live', date: '2026-04-13', detail: 'Attend keynotes, workshops, and networking sessions.' },
      { label: 'Mentor office hours', date: '2026-04-14', detail: '1:1 guidance from speakers and hiring managers.' },
      { label: 'Wrap-up', date: '2026-04-15', detail: 'Collect certificates and follow-up resources.' },
    ],
    applyUrl: 'https://mlh.io/events/global-student-tech-day',
    popularity: 84,
    createdAt: '2026-03-29T18:00:00Z',
    featured: true,
  },
  {
    id: 'hackerearth-frontend-coding-contest',
    title: 'Frontend Coding Contest',
    platform: 'HackerEarth',
    category: 'Contest',
    tags: ['Web', 'Frontend', 'CSS'],
    mode: 'Online',
    status: 'upcoming',
    deadlineDate: '2026-04-24',
    startDate: '2026-04-26',
    endDate: '2026-04-26',
    prize: '₹75,000 + internships',
    banner: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
    description: 'Build polished UI solutions under time pressure with accessibility and responsiveness in focus.',
    eligibility: ['Students', 'Working professionals', 'Solo participation'],
    timeline: [
      { label: 'Contest opens', date: '2026-04-26', detail: 'Round opens with UI and logic challenges.' },
      { label: 'Leaderboard update', date: '2026-04-26', detail: 'Live ranking throughout the contest window.' },
      { label: 'Winners announced', date: '2026-04-27', detail: 'Prize winners and shortlisted candidates published.' },
    ],
    applyUrl: 'https://www.hackerearth.com/challenges/contests/frontend-coding-contest',
    popularity: 90,
    createdAt: '2026-04-08T14:00:00Z',
  },
  {
    id: 'unstop-dsa-marathon',
    title: 'DSA Marathon',
    platform: 'Unstop',
    category: 'Contest',
    tags: ['DSA', 'CP', 'Algorithms'],
    mode: 'Online',
    status: 'past',
    deadlineDate: '2026-04-01',
    startDate: '2026-04-05',
    endDate: '2026-04-06',
    prize: 'Top 50 winners get interview shortlists',
    banner: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    description: 'A timed algorithmic contest designed to benchmark problem-solving speed and accuracy.',
    eligibility: ['Students', 'Coding enthusiasts', 'Solo participation'],
    timeline: [
      { label: 'Contest live', date: '2026-04-05', detail: 'Solve progressively harder algorithmic problems.' },
      { label: 'Final rank list', date: '2026-04-06', detail: 'Ranked by accuracy, time, and penalties.' },
    ],
    applyUrl: 'https://unstop.com/contests/dsa-marathon',
    popularity: 78,
    createdAt: '2026-03-18T10:15:00Z',
  },
  {
    id: 'devfolio-product-build-night',
    title: 'Product Build Night',
    platform: 'Devfolio',
    category: 'Workshop',
    tags: ['Product', 'AI', 'Startup'],
    mode: 'Offline',
    status: 'upcoming',
    deadlineDate: '2026-04-26',
    startDate: '2026-05-02',
    endDate: '2026-05-02',
    prize: 'Mentorship and accelerator interviews',
    banner: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)',
    description: 'Design, build, and pitch a small product with feedback from founders and PMs.',
    eligibility: ['Founders', 'Developers', 'Designers'],
    timeline: [
      { label: 'Pitch submissions', date: '2026-04-26', detail: 'Share your concept, team, and expected outcome.' },
      { label: 'Workshop night', date: '2026-05-02', detail: 'Build with support from mentors and coaches.' },
      { label: 'Demo reviews', date: '2026-05-02', detail: 'Showcase to invited startup operators.' },
    ],
    applyUrl: 'https://devfolio.co/events/product-build-night',
    popularity: 73,
    createdAt: '2026-04-09T08:45:00Z',
  },
  {
    id: 'mlh-cloud-native-meetup',
    title: 'Cloud Native Meetup',
    platform: 'MLH',
    category: 'Meetup',
    tags: ['Cloud', 'Backend', 'DevOps'],
    mode: 'Offline',
    status: 'upcoming',
    deadlineDate: '2026-05-01',
    startDate: '2026-05-06',
    endDate: '2026-05-06',
    prize: 'Talk slots and swag',
    banner: 'linear-gradient(135deg, #1e3a8a 0%, #0ea5e9 100%)',
    description: 'Community meetup for engineers exploring cloud platforms, observability, and deployment pipelines.',
    eligibility: ['Open to all', 'Ideal for backend engineers', 'Community builders welcome'],
    timeline: [
      { label: 'Applications close', date: '2026-05-01', detail: 'Reserve a slot and submit a short intro.' },
      { label: 'Meetup day', date: '2026-05-06', detail: 'Talks, networking, and lightning demos.' },
    ],
    applyUrl: 'https://mlh.io/events/cloud-native-meetup',
    popularity: 69,
    createdAt: '2026-04-10T15:20:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class TechEventsService {
  private readonly apiBaseUrl = '/api';
  private readonly eventsSubject = new BehaviorSubject<TechEvent[]>(this.readEventsCache() ?? MOCK_EVENTS);
  private readonly upcomingSubject = new BehaviorSubject<TechEvent[]>(this.getUpcomingFromEvents(this.eventsSubject.value));
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private readonly filtersSubject = new BehaviorSubject<EventFilters>(this.readFilters());
  private readonly viewModeSubject = new BehaviorSubject<EventViewMode>('grid');
  private readonly savedIdsSubject = new BehaviorSubject<string[]>(this.readStringArray(STORAGE_KEYS.savedIds));
  private readonly appliedHistorySubject = new BehaviorSubject<AppliedEventRecord[]>(this.readAppliedHistory());
  private readonly toastSubject = new BehaviorSubject<string | null>(null);
  private lastLoadedAt = 0;

  readonly events$ = this.eventsSubject.asObservable();
  readonly upcomingEvents$ = this.upcomingSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly filters$ = this.filtersSubject.asObservable();
  readonly viewMode$ = this.viewModeSubject.asObservable();
  readonly savedIds$ = this.savedIdsSubject.asObservable();
  readonly appliedHistory$ = this.appliedHistorySubject.asObservable();
  readonly toast$ = this.toastSubject.asObservable();

  readonly filteredEvents$: Observable<TechEventCardVm[]> = combineLatest([
    this.events$,
    this.filters$,
    this.savedIds$,
    this.appliedHistory$,
  ]).pipe(
    map(([events, filters, savedIds, appliedHistory]) => {
      const filtered = this.applyFilters(events, filters);
      const sorted = this.sortEvents(filtered, filters.sort);
      const appliedIds = new Set(appliedHistory.map((item) => item.eventId));

      return sorted.map((event) => ({
        ...event,
        isSaved: savedIds.includes(event.id),
        isApplied: appliedIds.has(event.id),
        daysLeft: this.calculateDaysLeft(event.deadlineDate),
      }));
    }),
  );

  readonly savedEvents$ = combineLatest([this.filteredEvents$, this.savedIds$]).pipe(
    map(([events]) => events.filter((event) => event.isSaved)),
  );

  readonly appliedEvents$ = combineLatest([this.filteredEvents$, this.appliedHistory$]).pipe(
    map(([events, appliedHistory]) => {
      const appliedIds = new Set(appliedHistory.map((item) => item.eventId));
      return events.filter((event) => appliedIds.has(event.id));
    }),
  );

  readonly stats$ = combineLatest([this.events$, this.savedIds$, this.appliedHistory$]).pipe(
    map(([events, savedIds, appliedHistory]) => ({
      total: events.length,
      upcoming: events.filter((event) => event.status === 'upcoming').length,
      saved: savedIds.length,
      applied: appliedHistory.length,
    }) as TechEventStats),
  );

  readonly featuredEvents$ = this.events$.pipe(
    map((events) => this.decorateEvents(events.filter((event) => event.featured).slice(0, 3))),
  );

  constructor(private http: HttpClient) {}

  loadEvents(force = false): void {
    if (!force && this.isCacheFresh()) {
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get<TechEvent[]>(`${this.apiBaseUrl}/events`)
      .pipe(
        catchError(() => of(MOCK_EVENTS)),
        map((events) => this.normalizeEvents(events)),
        tap((events) => {
          this.setEvents(events);
        }),
      )
      .subscribe({
        next: () => {
          this.loadingSubject.next(false);
        },
        error: () => {
          this.loadingSubject.next(false);
          this.errorSubject.next('Unable to load events right now. Showing featured opportunities.');
          this.setEvents(MOCK_EVENTS);
        },
      });

    this.http
      .get<TechEvent[]>(`${this.apiBaseUrl}/events/upcoming`)
      .pipe(catchError(() => of(this.getUpcomingFromEvents(this.eventsSubject.value))))
      .subscribe((events) => this.upcomingSubject.next(this.normalizeEvents(events)));
  }

  getEventById(eventId: string): Observable<TechEventCardVm | undefined> {
    return this.http.get<TechEvent>(`${this.apiBaseUrl}/events/${eventId}`).pipe(
      catchError(() => of(this.eventsSubject.value.find((event) => event.id === eventId))),
      map((event) => {
        if (!event) {
          return undefined;
        }

        return this.decorateEvents([this.normalizeEvent(event)])[0];
      }),
    );
  }

  patchFilters(patch: Partial<EventFilters>): void {
    const nextFilters = { ...this.filtersSubject.value, ...patch };
    this.filtersSubject.next(nextFilters);
    this.writeJson(STORAGE_KEYS.filters, nextFilters);
  }

  resetFilters(): void {
    this.filtersSubject.next(DEFAULT_FILTERS);
    this.writeJson(STORAGE_KEYS.filters, DEFAULT_FILTERS);
  }

  setViewMode(viewMode: EventViewMode): void {
    this.viewModeSubject.next(viewMode);
  }

  toggleBookmark(eventId: string): void {
    const current = this.savedIdsSubject.value;
    const next = current.includes(eventId) ? current.filter((id) => id !== eventId) : [...current, eventId];
    this.savedIdsSubject.next(next);
    this.writeJson(STORAGE_KEYS.savedIds, next);
    this.toastSubject.next(current.includes(eventId) ? 'Removed from saved events' : 'Saved to your dashboard');
    this.autoClearToast();
  }

  markApplied(event: TechEvent): void {
    const existing = this.appliedHistorySubject.value.some((item) => item.eventId === event.id);
    if (existing) {
      this.toastSubject.next('You already applied to this event');
      this.autoClearToast();
      return;
    }

    const nextHistory: AppliedEventRecord[] = [
      {
        eventId: event.id,
        title: event.title,
        platform: event.platform,
        appliedAt: new Date().toISOString(),
      },
      ...this.appliedHistorySubject.value,
    ];

    this.appliedHistorySubject.next(nextHistory);
    this.writeJson(STORAGE_KEYS.appliedHistory, nextHistory);
    this.toastSubject.next('Application saved in your history');
    this.autoClearToast();
  }

  dismissToast(): void {
    this.toastSubject.next(null);
  }

  getRelatedEvents(currentEvent: TechEvent, limit = 3): TechEventCardVm[] {
    return this.eventsSubject.value
      .filter((event) => event.id !== currentEvent.id)
      .map((event) => ({
        event,
        score: this.calculateSimilarity(currentEvent, event),
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, limit)
      .map((item) => this.decorateEvents([item.event])[0]);
  }

  getSavedEventsSnapshot(): TechEventCardVm[] {
    const savedIds = new Set(this.savedIdsSubject.value);
    const appliedIds = new Set(this.appliedHistorySubject.value.map((item) => item.eventId));
    return this.decorateEvents(this.eventsSubject.value).filter((event) => savedIds.has(event.id) || appliedIds.has(event.id));
  }

  private setEvents(events: TechEvent[]): void {
    const normalized = this.normalizeEvents(events);
    this.eventsSubject.next(normalized);
    this.upcomingSubject.next(this.getUpcomingFromEvents(normalized));
    this.writeJson(STORAGE_KEYS.eventsCache, normalized);
    this.writeJson(STORAGE_KEYS.upcomingCache, this.getUpcomingFromEvents(normalized));
    this.lastLoadedAt = Date.now();
  }

  private normalizeEvents(events: TechEvent[]): TechEvent[] {
    return (events || []).map((event) => this.normalizeEvent(event));
  }

  private normalizeEvent(event: TechEvent): TechEvent {
    return {
      ...event,
      tags: Array.from(new Set(event.tags.map((tag) => tag.trim()).filter(Boolean))),
      eligibility: event.eligibility ?? [],
      timeline: event.timeline ?? [],
      featured: event.featured ?? false,
    };
  }

  private applyFilters(events: TechEvent[], filters: EventFilters): TechEvent[] {
    const search = filters.search.trim().toLowerCase();

    return events.filter((event) => {
      if (search) {
        const haystack = [event.title, event.platform, event.category, event.description, ...event.tags].join(' ').toLowerCase();
        if (!haystack.includes(search)) {
          return false;
        }
      }

      if (filters.platforms.length > 0 && !filters.platforms.includes(event.platform)) {
        return false;
      }

      if (filters.tags.length > 0 && !filters.tags.some((tag) => event.tags.includes(tag))) {
        return false;
      }

      if (filters.modes.length > 0 && !filters.modes.includes(event.mode)) {
        return false;
      }

      if (filters.status !== 'all' && event.status !== filters.status) {
        return false;
      }

      return true;
    });
  }

  private sortEvents(events: TechEvent[], sortBy: EventSort): TechEvent[] {
    const sorted = [...events];

    sorted.sort((left, right) => {
      if (sortBy === 'popularity') {
        return right.popularity - left.popularity;
      }

      if (sortBy === 'newest') {
        return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }

      return new Date(left.deadlineDate).getTime() - new Date(right.deadlineDate).getTime();
    });

    return sorted;
  }

  private decorateEvents(events: TechEvent[]): TechEventCardVm[] {
    const savedIds = new Set(this.savedIdsSubject.value);
    const appliedIds = new Set(this.appliedHistorySubject.value.map((item) => item.eventId));

    return events.map((event) => ({
      ...event,
      isSaved: savedIds.has(event.id),
      isApplied: appliedIds.has(event.id),
      daysLeft: this.calculateDaysLeft(event.deadlineDate),
    }));
  }

  private getUpcomingFromEvents(events: TechEvent[]): TechEvent[] {
    return events.filter((event) => event.status === 'upcoming').slice(0, 8);
  }

  private calculateDaysLeft(dateText: string): number {
    const deadline = new Date(dateText).getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = deadline - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private calculateSimilarity(left: TechEvent, right: TechEvent): number {
    const sharedTags = left.tags.filter((tag) => right.tags.includes(tag)).length;
    const samePlatform = left.platform === right.platform ? 2 : 0;
    const sameMode = left.mode === right.mode ? 1 : 0;
    return sharedTags * 3 + samePlatform + sameMode + Math.max(0, 4 - Math.abs(this.calculateDaysLeft(left.deadlineDate) - this.calculateDaysLeft(right.deadlineDate)));
  }

  private isCacheFresh(): boolean {
    return this.lastLoadedAt > 0 && Date.now() - this.lastLoadedAt < 5 * 60 * 1000;
  }

  private readFilters(): EventFilters {
    return this.readJson<EventFilters>(STORAGE_KEYS.filters) ?? DEFAULT_FILTERS;
  }

  private readStringArray(key: string): string[] {
    const value = this.readJson<string[]>(key);
    return Array.isArray(value) ? value : [];
  }

  private readAppliedHistory(): AppliedEventRecord[] {
    const value = this.readJson<AppliedEventRecord[]>(STORAGE_KEYS.appliedHistory);
    return Array.isArray(value) ? value : [];
  }

  private readEventsCache(): TechEvent[] | null {
    const cached = this.readJson<TechEvent[]>(STORAGE_KEYS.eventsCache);
    return Array.isArray(cached) && cached.length > 0 ? cached.map((event) => this.normalizeEvent(event)) : null;
  }

  private readJson<T>(key: string): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  private writeJson(key: string, value: unknown): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  }

  private autoClearToast(): void {
    setTimeout(() => {
      if (this.toastSubject.value) {
        this.toastSubject.next(null);
      }
    }, 2500);
  }
}
