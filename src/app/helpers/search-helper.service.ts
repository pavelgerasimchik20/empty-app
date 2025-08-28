import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchHelperService {
  private searchableFields = [
    'phone',
    'user_id',
    'gender',
    'city',
  ];

  buildSearchString(searchParams: { field: string; value: string }[]): string {
    return searchParams
      .map((param) => {
        return `${param.field}=${param.value}`;
      })
      .join(',');
  }

  isValidField(field: string): boolean {
    return this.searchableFields.includes(field);
  }

  getSearchableFields(): string[] {
    return this.searchableFields;
  }
}
