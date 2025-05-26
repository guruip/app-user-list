import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = 'https://jsonplaceholder.typicode.com/users';

  constructor(public http: HttpClient) {}

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }
}
