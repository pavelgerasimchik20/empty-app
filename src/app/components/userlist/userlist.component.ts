import { Component, inject, signal } from '@angular/core';
import { User, UserService } from '../../services/urer.service';

@Component({
  selector: 'app-userlist',
  imports: [],
  templateUrl: './userlist.component.html',
  styleUrl: './userlist.component.css',
})
export class UserlistComponent {
  users = signal<User[]>([]);
  selectedUser = signal<User>({} as User);

  private userService = inject(UserService);

  ngOnInit() {
    this.load();
  }

  load() {
    this.userService.getUsers().subscribe((data) => this.users.set(data));
  }

  selectUser(user: User) {
    this.selectedUser.set(user);
  }
}
