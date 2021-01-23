import { Pipe, PipeTransform } from '@angular/core';
import { MyDate } from '../models/myDate.model';

@Pipe({
  name: 'myDate'
})
export class MyDatePipe implements PipeTransform {

  transform(value: MyDate, ...args: unknown[]): string {
    let month = ""
    switch(value.month) {
      case 0: month = "January"
      case 1: month = "February"
      case 2: month = "March"
      case 3: month = "April"
      case 4: month = "May"
      case 5: month = "June"
      case 6: month = "July"
      case 7: month = "August"
      case 8: month = "September"
      case 9: month = "October"
      case 10: month = "November"
      case 11: month = "December"
    }
    return `${month} ${value.date}, ${value.year}`;
  }

}
