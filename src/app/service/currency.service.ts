import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

    // Default currency
  private currencySubject = new BehaviorSubject<string>('GBP');

  currency$ = this.currencySubject.asObservable();

  setCurrency(currency: 'GHS' | 'GBP') {
    this.currencySubject.next(currency);
  }

  getCurrency(): string {
    return this.currencySubject.value;
  }

  
}
