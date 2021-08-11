import { MyDate } from "./myDate.model";
import firebase from 'firebase'

export interface Note {
  id: string;
  content: string;
  title?: string;
  date: firebase.firestore.Timestamp;
  timestamp?: number;
}
