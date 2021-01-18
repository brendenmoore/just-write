import { Injectable } from "@angular/core";
import { MyDate } from "../models/myDate.model";

@Injectable({
  providedIn: 'root'
})
export class MyDateService {
  getToday(): MyDate {
    const date = new Date();
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate()
    }
  }

  createFromDate(date: Date): MyDate {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate()
    }
  }

  isToday(myDate: MyDate): boolean {
    const today = this.getToday();
    return today.year === myDate.year && today.month === myDate.month && today.date === myDate.date;
  }

  isEqual(dateOne: MyDate, dateTwo: MyDate): boolean {
    return dateOne.year === dateTwo.year && dateOne.month === dateTwo.month && dateOne.date === dateTwo.date;
  }

}
