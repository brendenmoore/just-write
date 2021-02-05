import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { MyDateService } from './myDate.service';
import { map } from 'rxjs/operators';
import { MyDate } from '../models/myDate.model';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notes: Note[] = [];
  private notesUpdated = new Subject<{notes: Note[], noteCount: number}>();

  constructor(private myDateService: MyDateService, private http: HttpClient) { }

  getNotes(notesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${notesPerPage}&page=${currentPage}`;
    this.http.get<{message: string, notes: any, maxNotes: number}>('http://localhost:3000/api/notes' + queryParams)
    .pipe(map((noteData) => {
      return { notes: noteData.notes.map(note => {
        return {
          content: note.content,
          dateCreated: note.dateCreated,
          title: note.title,
          id: note._id,
          creator: note.creator
        }
      }), maxNotes: noteData.maxNotes}
    }))
    .subscribe((transformedNotesData) => {
        console.log(transformedNotesData)
        this.notes = transformedNotesData.notes;
        this.notesUpdated.next({
          notes: [...this.notes],
          noteCount: transformedNotesData.maxNotes
        });
      });
  }

  getMostRecentId() {
    return this.http.get<{message: string, noteId: string}>('http://localhost:3000/api/notes/last');
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
        newNoteSubject.next({...note})
      });
    return newNoteSubject.asObservable();
  }

  deleteNote(noteId: string) {
    return this.http.delete('http://localhost:3000/api/notes/' + noteId);
  }

  updateNote(noteId: string, dateCreated: MyDate, content: string, title?: string) {
    const note: Note = { id: noteId, dateCreated: dateCreated, title: title, content: content};
    return this.http.put('http://localhost:3000/api/notes/' + noteId, note);
  }

}
