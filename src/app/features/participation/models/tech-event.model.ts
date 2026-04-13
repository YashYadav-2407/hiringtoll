export type EventPlatform = 'Unstop' | 'Devfolio' | 'MLH' | 'HackerEarth';
export type EventCategory = 'Hackathon' | 'Contest' | 'Workshop' | 'Conference' | 'Meetup';
export type EventMode = 'Online' | 'Offline';
export type EventStatus = 'upcoming' | 'ongoing' | 'past';
export type EventSort = 'deadline' | 'popularity' | 'newest';
export type EventViewMode = 'grid' | 'list';

export interface EventTimelineItem {
  label: string;
  date: string;
  detail: string;
}

export interface TechEvent {
  id: string;
  title: string;
  platform: EventPlatform;
  category: EventCategory;
  tags: string[];
  mode: EventMode;
  status: EventStatus;
  deadlineDate: string;
  startDate: string;
  endDate: string;
  prize?: string;
  banner: string;
  description: string;
  eligibility: string[];
  timeline: EventTimelineItem[];
  applyUrl: string;
  popularity: number;
  createdAt: string;
  featured?: boolean;
}

export interface TechEventCardVm extends TechEvent {
  isSaved: boolean;
  isApplied: boolean;
  daysLeft: number;
}

export interface EventFilters {
  search: string;
  platforms: EventPlatform[];
  tags: string[];
  modes: EventMode[];
  status: EventStatus | 'all';
  sort: EventSort;
}

export interface AppliedEventRecord {
  eventId: string;
  title: string;
  platform: EventPlatform;
  appliedAt: string;
}

export interface TechEventStats {
  total: number;
  upcoming: number;
  saved: number;
  applied: number;
}
