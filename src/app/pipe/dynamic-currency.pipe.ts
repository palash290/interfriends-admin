import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../service/currency.service';

@Pipe({
    name: 'dynamicCurrency',
    pure: false // IMPORTANT: so pipe re-runs on currency change
})
export class DynamicCurrencyPipe implements PipeTransform {

    constructor(
        private currencyService: CurrencyService,
        private currencyPipe: CurrencyPipe
    ) { }

    transform(value: number | null | undefined): string | null {
        if (value == null) {
            return null;
        }

        const currencyCode = this.currencyService.getCurrency();

        return this.currencyPipe.transform(
            value,
            currencyCode,
            'symbol',
            '1.0-0'
        );
    }
}
