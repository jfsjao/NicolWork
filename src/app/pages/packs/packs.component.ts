import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { UserLibraryPack, UserLibraryService } from '@core/services/user-library.service';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {
  private authService = inject(AuthService);
  private userLibraryService = inject(UserLibraryService);

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

    const user = this.authService.currentUser();

    if (!user?.backendUserId) {
      this.isLoadingPacks = false;
      return;
    }

    this.userLibraryService.loadUserLibrary(user.backendUserId).subscribe({
      next: (library) => {
        this.myPacks = library.ownedPacks;
        this.featuredPacks = library.featuredPacks;
        this.noveltyPacks = library.noveltyPacks;
        this.allPacks = library.allPacks;
        this.upgradePacks = library.plan.slug === 'premium' ? [] : library.upgradePacks;
        this.packsError = false;
        this.isLoadingPacks = false;
      },
      error: (error) => {
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

  filterPacks(packs: UserLibraryPack[]): UserLibraryPack[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) return packs;

    return packs.filter((pack) =>
      pack.title.toLowerCase().includes(term) ||
      pack.description.toLowerCase().includes(term) ||
      pack.badge.toLowerCase().includes(term)
    );
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
}
