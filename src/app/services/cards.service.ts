// services/cards.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchHelperService } from '../helpers/search-helper.service';
import { CardsResponse, CreateCardRequest } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private baseUrl = '/api/v1';
  private http = inject(HttpClient);
  private searchHelper = inject(SearchHelperService);
  token = localStorage.getItem('token');

  getCards(
    searchParams: { field: string; value: string }[] = [],
    limit: number = 20,
    offset: number = 0
  ): Observable<CardsResponse> {

    if (!this.token) {
      throw new Error('token is not found');
    }

    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (searchParams.length > 0) {
      const searchString = this.searchHelper.buildSearchString(searchParams);
      params = params.set('search', searchString);
    }

    return this.http.get<CardsResponse>(`${this.baseUrl}/${this.token}/passes`, {
      params,
    });
  }

  searchByField(
    field: string,
    value: string,
    limit: number = 20,
    offset: number = 0
  ): Observable<CardsResponse> {
    if (!this.searchHelper.isValidField(field)) {
      throw new Error(`Invalid search field: ${field}`);
    }

    return this.getCards([{ field, value }], limit, offset);
  }

  sendPush(userId: string, message: string) {
    
    const url = `${this.baseUrl}/${this.token}/message/push`;

    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);

    const body = {
      user_id: userId.toString(),
      date_start: now.toISOString(),
      push_message: message,
    };
    console.log('BODY:', body);

    return this.http.post(url, body, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  createCard(cardData: CreateCardRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.token}/passes`, cardData);
  }
}
