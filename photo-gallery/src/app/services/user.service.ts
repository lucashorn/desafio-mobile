import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());

  constructor() {
    this.userSubject.next(this.getUserFromStorage());
  }

  getUser(): Observable<any> {
    return this.userSubject.asObservable();
  }

  private getUserFromStorage(): any {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  updateUser(user: any) {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    this.userSubject.next(user);
  }
}
