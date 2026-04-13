import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

type EventCategory = 'Hackathon' | 'Conference' | 'Workshop' | 'Meetup';

interface ParticipationEvent {
	id: number;
	title: string;
	category: EventCategory;
	date: string;
	location: string;
	description: string;
	deadline: string;
}

@Component({
	selector: 'app-participation-widget',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule],
	templateUrl: './participation-widget.html',
	styleUrl: './participation-widget.scss',
})
export class ParticipationWidgetComponent {
	appliedEventIds = new Set<number>();

	readonly events: ParticipationEvent[] = [
		{
			id: 1,
			title: 'Build for Good Hackathon',
			category: 'Hackathon',
			date: 'Apr 28 - Apr 30',
			location: 'Remote',
			description: '48-hour product hackathon focused on AI, accessibility, and civic tech.',
			deadline: 'Apr 24',
		},
		{
			id: 2,
			title: 'Frontend Systems Summit',
			category: 'Conference',
			date: 'May 12',
			location: 'Bengaluru',
			description: 'Talks on modern UI architecture, design systems, and product engineering.',
			deadline: 'May 05',
		},
		{
			id: 3,
			title: 'Interview Prep Workshop',
			category: 'Workshop',
			date: 'May 18',
			location: 'Virtual',
			description: 'Hands-on workshop covering resume review, coding rounds, and behavioral prep.',
			deadline: 'May 16',
		},
		{
			id: 4,
			title: 'AI Builders Meetup',
			category: 'Meetup',
			date: 'May 22',
			location: 'Delhi NCR',
			description: 'Community meetup for builders shipping agents, copilots, and automation tools.',
			deadline: 'May 20',
		},
	];

	applyForEvent(event: ParticipationEvent): void {
		this.appliedEventIds.add(event.id);
	}

	isApplied(eventId: number): boolean {
		return this.appliedEventIds.has(eventId);
	}
}
