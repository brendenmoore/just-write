import { MyDate } from "./myDate.model";

export interface Note {
  id: string;
  content: string;
  dateCreated: MyDate;
}
