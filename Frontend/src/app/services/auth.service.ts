import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'usuarioLogado';

  isLoggedIn(): boolean {
    return localStorage.getItem(this.storageKey) === 'true';
  }

  login() {
    localStorage.setItem(this.storageKey, 'true');
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }
}
