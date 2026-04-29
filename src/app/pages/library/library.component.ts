import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserLibraryPack, UserLibraryService } from '@core/services/user-library.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  private authService = inject(AuthService);
  private userLibraryService = inject(UserLibraryService);
  private searchTimeout?: number;
  private requestSequence = 0;

  searchTerm = '';
  private readonly ROW_SCROLL_AMOUNT = 960;

  myPacks: UserLibraryPack[] = [];
  featuredPacks: UserLibraryPack[] = [];
  noveltyPacks: UserLibraryPack[] = [];
  allPacks: UserLibraryPack[] = [];
  upgradePacks: UserLibraryPack[] = [];
  selectedPack: UserLibraryPack | null = null;
  isLoadingPacks = true;
  packsError = false;

  async ngOnInit(): Promise<void> {
    await this.authService.waitForAuthInit();
    this.loadLibrary();
  }

  get hasActiveSearch(): boolean {
    return this.searchTerm.trim().length > 0;
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;

    if (this.searchTimeout) {
      window.clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = window.setTimeout(() => {
      this.loadLibrary();
    }, 300);
  }

  filterPacks(packs: UserLibraryPack[]): UserLibraryPack[] {
    return packs;
  }

  scrollRow(rowId: string, direction: number): void {
    const row = document.getElementById(rowId);

    if (!row) return;

    row.scrollBy({
      left: this.ROW_SCROLL_AMOUNT * direction,
      behavior: 'smooth'
    });
  }

  openPackDetails(pack: UserLibraryPack): void {
    this.selectedPack = pack;
  }

  closePackDetails(): void {
    this.selectedPack = null;
  }

  private loadLibrary(): void {
    const user = this.authService.currentUser();
    const requestId = ++this.requestSequence;

    if (!user?.backendUserId) {
      this.myPacks = [];
      this.featuredPacks = [];
      this.noveltyPacks = [];
      this.allPacks = [];
      this.upgradePacks = [];
      this.packsError = true;
      this.isLoadingPacks = false;
      return;
    }

    this.isLoadingPacks = true;

    this.userLibraryService.loadUserLibrary(user.backendUserId, this.searchTerm).subscribe({
      next: (library) => {
        if (requestId !== this.requestSequence) {
          return;
        }

        this.myPacks = library.ownedPacks;
        this.featuredPacks = library.featuredPacks;
        this.noveltyPacks = library.noveltyPacks;
        this.allPacks = library.allPacks;
        this.upgradePacks = library.plan.slug === 'premium' ? [] : library.upgradePacks;
        this.packsError = false;
        this.isLoadingPacks = false;
      },
      error: (error) => {
        if (requestId !== this.requestSequence) {
          return;
        }

        console.error('Erro ao carregar biblioteca do usuario:', error);
        this.myPacks = [];
        this.featuredPacks = [];
        this.noveltyPacks = [];
        this.allPacks = [];
        this.upgradePacks = [];
        this.packsError = true;
        this.isLoadingPacks = false;
      }
    });
  }
}
