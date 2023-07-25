import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateconfig'
})
export class DatePipe implements PipeTransform {
  //Removes Extensions
  transform(value: Date, ...args: unknown[]): unknown {
    return moment(new Date(value)).format('ddd DD MMM YYYY');
  }
}
