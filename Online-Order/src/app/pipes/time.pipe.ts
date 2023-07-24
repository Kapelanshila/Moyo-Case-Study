import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  //Removes Extensions
  transform(value: Date, ...args: unknown[]): unknown {
    return moment(new Date(value)).format('HH:mm');
  }
}
