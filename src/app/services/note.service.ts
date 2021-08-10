import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { map } from 'rxjs/operators';
import { MyDate } from '../models/myDate.model';
import { environment } from '../../environments/environment';
import { NoteDTO } from '../models/noteDTO.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import firebase from 'firebase'

const BACKEND_URL = environment.apiURL + 'notes';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private notes: Note[] = [];
  private notesUpdated = new Subject<{ notes: Note[]; noteCount: number }>();

  constructor(
    private http: HttpClient,
    private store: AngularFirestore,
    private authService: AuthService
  ) {}

  // private reformatNote(note: NoteDTO): Note {
  //   return {
  //     content: note.content,
  //     date: new Date(note.date),
  //     title: note.title,
  //     id: note._id,
  //     creator: note.creator
  //   }
  // }

  getNotes(notesPerPage: number, currentPage: number) {
    this.store
      .collection<Note>("users/" + this.authService.getUserId + '/notes', (ref) =>
        ref
          .orderBy('date', "desc")
          .startAt(currentPage * notesPerPage)
          .limit(notesPerPage)
      )
      .valueChanges({ idField: 'id' })
      .subscribe(notes => {
        this.notes = notes;
        this.notesUpdated.next({
          notes: [...this.notes],
          noteCount: 1
        })
      });
    // const queryParams = `?pagesize=${notesPerPage}&page=${currentPage}`;
    // this.http.get<{message: string, notes: any, maxNotes: number}>(BACKEND_URL + queryParams)
    // .pipe(map((noteData) => {
    //   return { notes: noteData.notes.map(note => {
    //     return {
    //       content: note.content,
    //       dateCreated: note.dateCreated,
    //       date: new Date(note.date),
    //       title: note.title,
    //       id: note._id,
    //       creator: note.creator
    //     }
    //   }), maxNotes: noteData.maxNotes}
    // }))
    // .subscribe((transformedNotesData) => {
    //     this.notes = transformedNotesData.notes;
    //     this.notesUpdated.next({
    //       notes: [...this.notes],
    //       noteCount: transformedNotesData.maxNotes
    //     });
    //   });
  }

  getMostRecentNote() {
    return this.store.collection<Note>("users/" + this.authService.getUserId + '/notes', (ref) =>
      ref
        .orderBy('date')
        .limit(1)
    );
    // const queryParams = '?pagesize=1&page=1';
    // return this.http.get<{ message: string; notes: NoteDTO; maxNotes: number }>(
    //   BACKEND_URL + queryParams
    // );
  }

  getNoteById(noteId: string) {
    // return this.http.get<NoteDTO>(BACKEND_URL + "/" + noteId);
    return this.store
      .doc<Note>("users/" + this.authService.getUserId + '/notes/' + noteId)
      .get();
  }

  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  addNote(): Observable<Note> {
    const date = firebase.firestore.Timestamp.now();
    const noteDTO: Note = { id: '', date: date, content: '' };
    const newNoteSubject = new Subject<Note>();
    // this.http.post<{message: string, noteId: string, note: NoteDTO}>(BACKEND_URL, noteDTO)
    //   .subscribe(responseData => {
    //     const id = responseData.noteId;
    //     const newNote = this.reformatNote(responseData.note);
    //     newNoteSubject.next({...newNote})
    //   });
    this.store
      .collection<Note>("users/" + this.authService.getUserId + '/notes')
      .add(noteDTO)
      .then((response) => {
        const id = response.id;
        response.get().then((note) => {
          const newNote: Note = {
            id: id,
            date: note.data().date,
            content: note.data().content,
          };
          newNoteSubject.next({ ...newNote });
        });
      });
      return newNoteSubject.asObservable();
  }

  deleteNote(noteId: string) {
    return this.store.doc("users/" + this.authService.getUserId + '/notes/' + noteId).delete();
    // return this.http.delete(BACKEND_URL + '/' + noteId);
  }

  updateNote(
    noteId: string,
    date: firebase.firestore.Timestamp,
    content: string,
    title?: string
  ) {
    const note: Note = {
      id: noteId,
      date: date,
      title: title,
      content: content,
    };
    // return this.http.put(BACKEND_URL + '/' + noteId, note);
    return this.store.doc("users/" + this.authService.getUserId + '/notes/' + noteId).update(note);
  }
}
