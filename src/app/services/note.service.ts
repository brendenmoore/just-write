import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { MyDateService } from './myDate.service';
import { map } from 'rxjs/operators';
import { MyDate } from '../models/myDate.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notes: Note[] = [];
  private notesUpdated = new Subject<Note[]>();

  constructor(private myDateService: MyDateService, private http: HttpClient) { }

  getNotes() {
    this.http.get<{message: string, notes: any}>('http://localhost:3000/api/notes')
    .pipe(map((noteData) => {
      return noteData.notes.map(note => {
        return {
          content: note.content,
          dateCreated: note.dateCreated,
          title: note.title,
          id: note._id
        }
      })
    }))
    .subscribe((transformedNotes) => {
        this.notes = transformedNotes;
        this.notesUpdated.next([...this.notes])
      });
  }

  getNoteById(noteId: string) {
    return this.http.get<{_id: string, title: string, content: string, dateCreated: MyDate}>('http://localhost:3000/api/notes/' + noteId);
  }

  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  addNote() {
    const note: Note = {id: null, dateCreated: this.myDateService.getToday(), content: ""}
    const newNoteSubject = new Subject<Note>();
    this.http.post<{message: string, noteId: string}>('http://localhost:3000/api/notes', note)
      .subscribe(responseData => {
        const id = responseData.noteId;
        note.id = id;
        this.notes.push(note);
        newNoteSubject.next({...note})
        this.notesUpdated.next([...this.notes]);
      });
    return newNoteSubject.asObservable();
  }

  deleteNote(noteId: string) {
    this.http.delete('http://localhost:3000/api/notes/' + noteId)
      .subscribe(() => {
        const updatedNotes = this.notes.filter(note => note.id !== noteId);
        this.notes = updatedNotes;
        this.notesUpdated.next([...this.notes]);
      })
  }

  updateNote(noteId: string, dateCreated: MyDate, content: string, title?: string) {
    const note: Note = { id: noteId, dateCreated: dateCreated, title: title, content: content};
    return this.http.put('http://localhost:3000/api/notes/' + noteId, note);
  }

}
