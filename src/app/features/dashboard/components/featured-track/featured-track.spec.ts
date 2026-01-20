import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedTrackComponent } from './featured-track';

describe('FeaturedTrackComponent', () => {
  let component: FeaturedTrackComponent;
  let fixture: ComponentFixture<FeaturedTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedTrackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedTrackComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
