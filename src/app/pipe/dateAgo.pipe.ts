import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'Just now';
            const intervals = {
                'year': 31536000,
                'month': 2592000,
                'week': 604800,
                'day': 86400,
                'hour': 3600,
                'minute': 60,
                'second': 1
            };
            let counter;
            for (const i in intervals) {

                if(i === 'year') {
                  counter = Math.floor(seconds / intervals.year);
                } else if(i === 'month') {
                  counter = Math.floor(seconds / intervals.month);
                } else if(i === 'week') {
                  counter = Math.floor(seconds / intervals.week);
                } else if(i === 'day') {
                  counter = Math.floor(seconds / intervals.day);
                } else if(i === 'hour') {
                  counter = Math.floor(seconds / intervals.hour);
                } else if(i === 'minute') {
                  counter = Math.floor(seconds / intervals.minute);
                } else if(i === 'second') {
                  counter = Math.floor(seconds / intervals.second);
                }

                if (counter > 0)
                    if (counter === 1) {
                        return counter + ' ' + i + ' ago'; // singular (1 day ago)
                    } else {
                        return counter + ' ' + i + 's ago'; // plural (2 days ago)
                    }
            }
        }
        return value;
    }

}
