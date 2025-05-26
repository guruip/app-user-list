import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { debounceTime, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  public users: User[] = [];
  public filteredUsers: User[] = [];

  public searchTerm = '';
  public searchSubject = new Subject<string>();

  public sortField: 'name' | 'email' | '' = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  public loading = false;
  public error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();

    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.filterAndSortUsers();
    });
  }

  public fetchUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterAndSortUsers();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ошибка загрузки пользователей.';
        this.loading = false;
      }
    });
  }

  public onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  public toggleSort(field: 'name' | 'email') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.filterAndSortUsers();
  }

  public getSortDirection(field: 'name' | 'email'): string {
    return this.sortField === field ? (this.sortDirection === 'asc' ? '▲' : '▼') : '';
  }

  public filterAndSortUsers() {
    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.users
      .filter(user =>
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (!this.sortField) return 0;
        const aVal = a[this.sortField].toLowerCase();
        const bVal = b[this.sortField].toLowerCase();
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
  }
}
