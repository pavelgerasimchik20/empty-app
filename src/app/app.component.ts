import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo, TodoService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  standalone: true,
  template: `
    <ul>
      @for (task of tasks() ; track task.id) {
      <li class="list">
        <input type="checkbox" [(ngModel)]="task.completed" />
        {{ task.title }}
        <button (click)="updateTodo(task.id)">update todo</button>
        <button (click)="deleteTodo(task.id)">delete todo</button>
      </li>
      }
    </ul>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  private todoService = inject(TodoService);

  tasks = signal<Todo[]>([]);

  constructor() {
    this.todoService.getTodos().subscribe((tasks) => this.tasks.set(tasks));
  }

  updateTodo(id: number) {
    this.tasks.update((arr) => {
      arr[id-1] = {
        id: id,
        title: 'Updated title',
        completed: true,
      };
      return [...arr];
    });
  }

  deleteTodo(id: number) {
    this.tasks.update((current) => current.filter((t) => t.id !== id));
  }
}
