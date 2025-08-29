import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { SearchHelperService } from '../../helpers/search-helper.service';
import { Card } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { CardsService } from '../../services/cards.service';
import { CreateClientModalComponent } from '../../components/create-client-modal/create-client-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateClientModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cardsService = inject(CardsService);
  private searchHelper = inject(SearchHelperService);

  token = signal<string | null>(localStorage.getItem('token'));
  cards = signal<Card[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  pushTitle = signal<string>('');
  pushBody = signal<string>('');

  searchTerm = signal<string>('');
  searchField = signal<string>('user_id');
  searchableFields = this.searchHelper.getSearchableFields();

  sortField = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  selectedClient = signal<any | null>(null);
  showPushModal = signal<boolean>(false);
  showCreateModal = signal<boolean>(false);

  ngOnInit() {
    this.loadAllCards();
  }

  async loadAllCards() {
    try {
      this.loading.set(true);
      this.error.set(null);

      const response = await lastValueFrom(
        this.cardsService.getCards([], 20, 0)
      );

      this.cards.set(response.passes || []);
    } catch (err) {
      this.error.set('Data loading error...');
      console.error('Error loading cards:', err);
    } finally {
      this.loading.set(false);
    }
  }

  openPushModal(client: Card) {
    this.selectedClient.set(client);
    console.log(client);
    this.showPushModal.set(true);
  }

  async sendPush() {
    const client = this.selectedClient();
    if (!client) return;
    this.cardsService.sendPush(client.user_id, this.pushBody()).subscribe({
      next: () => {
        alert('PUSH has been sent!');
        this.closePushModal();
      },
      error: (error) => {
        console.error('error:', error);
        alert('error utlil PUSH sending');
        this.closePushModal();
      },
    });
    
  }

  closePushModal() {
    this.showPushModal.set(false);
    this.pushTitle.set('');
    this.pushBody.set('');
  }

  async onSearch() {
    if (!this.searchTerm().trim()) {
      this.loadAllCards();
      return;
    }

    try {
      this.loading.set(true);
      this.error.set(null);

      const response = await lastValueFrom(
        this.cardsService.searchByField(
          this.searchField(),
          this.searchTerm().trim(),
          20,
          0
        )
      );

      this.cards.set(response.passes || []);
    } catch (err: any) {
      console.error('Error searching cards:', err);
      this.error.set('Error searching cards');
    } finally {
      this.loading.set(false);
    }
  }

  getFieldDisplayName(field: string): string {
    const fieldNames: { [key: string]: string } = {
      email: 'email',
      phone: 'phone',
      fio: 'name',
      user_id: 'id',
      gender: 'gender',
      city: 'city',
      bonus: 'bonus',
    };

    return fieldNames[field] || field;
  }

  clearSearch() {
    this.searchTerm.set('');
    this.searchField.set('user_id');
    this.loadAllCards();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  sortBy(field: string) {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }

    const sorted = [...this.cards()].sort((a: any, b: any) => {
      const valueA = a[field] ?? '';
      const valueB = b[field] ?? '';

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortDirection() === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      return this.sortDirection() === 'asc'
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    this.cards.set(sorted);
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  onClientCreated() {
    this.showCreateModal.set(false);
    this.loadAllCards();
  }

  onModalClosed() {
    this.showCreateModal.set(false);
  }
}
