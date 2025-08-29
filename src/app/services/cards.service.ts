// services/cards.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchHelperService } from '../helpers/search-helper.service';
import { CardsResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private baseUrl = '/api/v1';
  private http = inject(HttpClient);
  private searchHelper = inject(SearchHelperService);

  getCards(
    searchParams: { field: string; value: string }[] = [],
    limit: number = 20,
    offset: number = 0
  ): Observable<CardsResponse> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('token is not found');
    }

    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (searchParams.length > 0) {
      const searchString = this.searchHelper.buildSearchString(searchParams);
      params = params.set('search', searchString);
    }

    return this.http.get<CardsResponse>(`${this.baseUrl}/${token}/passes`, {
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

  sendPush(userIds: number[], title: string, message: string) {
    return this.http.post('/api/v1/push/send', {
      user_ids: userIds,
      title,
      message,
    });
  }
}
