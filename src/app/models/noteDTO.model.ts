import firebase from 'firebase';

export interface NoteDTO {
  id: string;
  content: string;
  title?: string;
  date: firebase.firestore.Timestamp;
}
