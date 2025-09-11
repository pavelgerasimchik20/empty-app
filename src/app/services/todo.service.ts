import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ToDo {
  id: number;
  title: string;
  isCompleted: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7116/api/todo';

  getTodos(): Observable<ToDo[]> {
    return this.http.get<ToDo[]>(this.apiUrl);
  }

  addTodo(todo: Partial<ToDo>): Observable<ToDo> {
    return this.http.post<ToDo>(this.apiUrl, todo);
  }

  updateTodo(todo: ToDo): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${todo.id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
