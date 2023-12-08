import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsListGuard {
  constructor() {}

  canActivate(): boolean {
    const isLinkActive  = localStorage.length !== 0;
    return isLinkActive;
  }
}
