import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, CountUpModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('numbersSection') numbersSection?: ElementRef<HTMLElement>;
  
  stats = {
    years: 3,
    clients: 500,
    engagements: 100,
    satisfaction: 100
  };

  animatedStats = {
    years: 0,
    clients: 0,
    engagements: 0,
    satisfaction: 0
  };

  readonly clientsCountOptions = { suffix: '+' };
  readonly percentageCountOptions = { suffix: '%' };

  private numbersObserver?: IntersectionObserver;
  private hasAnimatedNumbers = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.numbersSection) return;

    this.numbersObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || this.hasAnimatedNumbers) return;

        this.hasAnimatedNumbers = true;
        this.animatedStats = { ...this.stats };
        this.numbersObserver?.disconnect();
      },
      {
        threshold: 0.35
      }
    );

    this.numbersObserver.observe(this.numbersSection.nativeElement);
  }

  ngOnDestroy(): void {
    this.numbersObserver?.disconnect();
  }
}
