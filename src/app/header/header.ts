import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  mobileMenuOpen = false;

  @ViewChild('primaryNav') private primaryNav?: ElementRef<HTMLElement>;
  @ViewChild('navIndicator') private navIndicator?: ElementRef<HTMLElement>;
  @ViewChild('interviewCta') private interviewCta?: ElementRef<HTMLElement>;

  private readonly cleanupCallbacks: Array<() => void> = [];
  private routerSubscription?: Subscription;
  private resizeObserver?: ResizeObserver;
  private animationFrameId = 0;
  private pendingIndicatorTarget: HTMLElement | null = null;
  private highlightedItem: HTMLElement | null = null;

  constructor(
    private readonly router: Router,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.bindPrimaryNavigationEvents();
      this.bindInterviewCtaMotion();
      this.bindResizeObserver();
      this.routerSubscription = this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(() => this.scheduleActiveIndicator());
    });

    this.scheduleActiveIndicator(true);
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.resizeObserver?.disconnect();

    if (this.animationFrameId !== 0) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.cleanupCallbacks.forEach((cleanup) => cleanup());
    this.cleanupCallbacks.length = 0;
    this.highlightedItem?.classList.remove('is-highlighted');
    this.highlightedItem = null;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  private bindPrimaryNavigationEvents(): void {
    const navElement = this.primaryNav?.nativeElement;

    if (!navElement) {
      return;
    }

    const handlePointerMove = (event: PointerEvent): void => {
      const navItem = this.resolveNavItem(event.target);

      if (navItem) {
        this.scheduleIndicatorMove(navItem);
      }
    };

    const handlePointerLeave = (): void => {
      this.scheduleActiveIndicator();
    };

    const handleFocusIn = (event: FocusEvent): void => {
      const navItem = this.resolveNavItem(event.target);

      if (navItem) {
        this.scheduleIndicatorMove(navItem, true);
      }
    };

    const handleFocusOut = (event: FocusEvent): void => {
      const nextTarget = event.relatedTarget;

      if (!(nextTarget instanceof Node) || !navElement.contains(nextTarget)) {
        this.scheduleActiveIndicator();
      }
    };

    navElement.addEventListener('pointermove', handlePointerMove);
    navElement.addEventListener('pointerleave', handlePointerLeave);
    navElement.addEventListener('focusin', handleFocusIn);
    navElement.addEventListener('focusout', handleFocusOut);

    this.cleanupCallbacks.push(() => {
      navElement.removeEventListener('pointermove', handlePointerMove);
      navElement.removeEventListener('pointerleave', handlePointerLeave);
      navElement.removeEventListener('focusin', handleFocusIn);
      navElement.removeEventListener('focusout', handleFocusOut);
    });
  }

  private bindResizeObserver(): void {
    const navElement = this.primaryNav?.nativeElement;

    if (!navElement || typeof ResizeObserver === 'undefined') {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.scheduleActiveIndicator(true));
    this.resizeObserver.observe(navElement);
  }

  private bindInterviewCtaMotion(): void {
    const ctaElement = this.interviewCta?.nativeElement;

    if (!ctaElement) {
      return;
    }

    const setSpotlight = (event: PointerEvent | FocusEvent): void => {
      const rect = ctaElement.getBoundingClientRect();
      const clientX = 'clientX' in event ? event.clientX : rect.left + rect.width * 0.68;
      const clientY = 'clientY' in event ? event.clientY : rect.top + rect.height * 0.42;

      ctaElement.style.setProperty('--spot-x', `${clientX - rect.left}px`);
      ctaElement.style.setProperty('--spot-y', `${clientY - rect.top}px`);
      ctaElement.style.setProperty('--spot-opacity', '1');
    };

    const clearSpotlight = (): void => {
      ctaElement.style.setProperty('--spot-opacity', '0');
    };

    const handlePointerMove = (event: PointerEvent): void => setSpotlight(event);
    const handlePointerEnter = (event: PointerEvent): void => setSpotlight(event);
    const handleFocusIn = (event: FocusEvent): void => setSpotlight(event);

    ctaElement.addEventListener('pointermove', handlePointerMove);
    ctaElement.addEventListener('pointerenter', handlePointerEnter);
    ctaElement.addEventListener('focusin', handleFocusIn);
    ctaElement.addEventListener('pointerleave', clearSpotlight);
    ctaElement.addEventListener('focusout', clearSpotlight);

    this.cleanupCallbacks.push(() => {
      ctaElement.removeEventListener('pointermove', handlePointerMove);
      ctaElement.removeEventListener('pointerenter', handlePointerEnter);
      ctaElement.removeEventListener('focusin', handleFocusIn);
      ctaElement.removeEventListener('pointerleave', clearSpotlight);
      ctaElement.removeEventListener('focusout', clearSpotlight);
    });
  }

  private resolveNavItem(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    return target.closest('.nav-item') as HTMLElement | null;
  }

  private scheduleIndicatorMove(navItem: HTMLElement, immediate = false): void {
    this.pendingIndicatorTarget = navItem;

    if (immediate) {
      this.flushIndicatorMove(true);
      return;
    }

    if (this.animationFrameId !== 0) {
      return;
    }

    if (typeof requestAnimationFrame !== 'function') {
      this.flushIndicatorMove();
      return;
    }

    this.animationFrameId = requestAnimationFrame(() => {
      this.animationFrameId = 0;
      this.flushIndicatorMove();
    });
  }

  private scheduleActiveIndicator(immediate = false): void {
    const activeItem = this.getActiveNavItem();

    if (!activeItem) {
      return;
    }

    this.scheduleIndicatorMove(activeItem, immediate);
  }

  private flushIndicatorMove(forceImmediate = false): void {
    const target = this.pendingIndicatorTarget ?? this.getActiveNavItem();

    if (!target) {
      return;
    }

    this.applyIndicatorToTarget(target, forceImmediate);
  }

  private applyIndicatorToTarget(target: HTMLElement, forceImmediate = false): void {
    const navElement = this.primaryNav?.nativeElement;
    const indicatorElement = this.navIndicator?.nativeElement;

    if (!navElement || !indicatorElement) {
      return;
    }

    const navRect = navElement.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const navStyles = getComputedStyle(navElement);
    const leftInset = navElement.clientLeft + Number.parseFloat(navStyles.paddingLeft || '0');
    const translateX = targetRect.left - navRect.left - leftInset;

    if (forceImmediate) {
      indicatorElement.classList.add('indicator-instant');
    } else {
      indicatorElement.classList.remove('indicator-instant');
    }

    indicatorElement.style.width = `${targetRect.width}px`;
    indicatorElement.style.transform = `translate3d(${translateX}px, 0, 0)`;
    indicatorElement.style.opacity = '1';

    this.setHighlightedItem(target);
  }

  private setHighlightedItem(target: HTMLElement): void {
    if (this.highlightedItem === target) {
      return;
    }

    this.highlightedItem?.classList.remove('is-highlighted');
    target.classList.add('is-highlighted');
    this.highlightedItem = target;
  }

  private getActiveNavItem(): HTMLElement | null {
    return this.primaryNav?.nativeElement.querySelector('.nav-item.active') as HTMLElement | null;
  }
}
