import { Component, inject, OnInit } from '@angular/core';
import { ToDo, TodoService } from '../../services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="newTodo" (keydown.enter)="pressEnter()" placeholder="New task" />
    <button (click)="add()">Add</button>
    <ul>
      @for (todo of todos; track todo.id) {
      <li>
        <input
          type="checkbox"
          [(ngModel)]="todo.isCompleted"
          (change)="update(todo)"
        />
        {{ todo.title }}
        <button (click)="delete(todo.id)">Delete</button>
      </li>
      }
    </ul>
  `,
})
export class TodoListComponent implements OnInit {
  todos: ToDo[] = [];
  newTodo = '';

  private service = inject(TodoService);

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getTodos().subscribe((data) => (this.todos = data));
  }

  add() {
    if (!this.newTodo.trim()) return;
    this.service
      .addTodo({ title: this.newTodo, isCompleted: false })
      .subscribe(() => this.load());
    this.newTodo = '';
  }

  update(todo: ToDo) {
    this.service.updateTodo(todo).subscribe();
  }

  delete(id: number) {
    this.service.deleteTodo(id).subscribe(() => this.load());
  }

  pressEnter() {
    this.add()
  }
}
