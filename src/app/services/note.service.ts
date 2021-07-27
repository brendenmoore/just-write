import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { map } from 'rxjs/operators';
import { MyDate } from '../models/myDate.model';
import {environment} from "../../environments/environment"
import { NoteDTO } from '../models/noteDTO.model';

const BACKEND_URL = "api/notes"

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notes: Note[] = [];
  private notesUpdated = new Subject<{notes: Note[], noteCount: number}>();

  constructor(private http: HttpClient) { }

  private reformatNote(note: NoteDTO): Note {
    return {
      content: note.content,
      dateCreated: note.dateCreated,
      date: new Date(note.date),
      title: note.title,
      id: note._id,
      creator: note.creator
    }
  }

  getNotes(notesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${notesPerPage}&page=${currentPage}`;
    this.http.get<{message: string, notes: any, maxNotes: number}>(BACKEND_URL + queryParams)
    .pipe(map((noteData) => {
      return { notes: noteData.notes.map(note => {
        return {
          content: note.content,
          dateCreated: note.dateCreated,
          date: new Date(note.date),
          title: note.title,
          id: note._id,
          creator: note.creator
        }
      }), maxNotes: noteData.maxNotes}
    }))
    .subscribe((transformedNotesData) => {
        this.notes = transformedNotesData.notes;
        this.notesUpdated.next({
          notes: [...this.notes],
          noteCount: transformedNotesData.maxNotes
        });
      });
  }

  getMostRecentNote() {
    const queryParams = "?pagesize=1&page=1";
    return this.http.get<{message: string, notes: NoteDTO, maxNotes: number}>(BACKEND_URL + queryParams);
  }

  getNoteById(noteId: string) {
    return this.http.get<NoteDTO>(BACKEND_URL + "/" + noteId);
  }

  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  addNote() {
    const date = new Date();
    const noteDTO: NoteDTO = {_id: null, dateCreated: null, date: date.getTime(), content: "", creator: null}
    const newNoteSubject = new Subject<Note>();
    this.http.post<{message: string, noteId: string, note: NoteDTO}>(BACKEND_URL, noteDTO)
      .subscribe(responseData => {
        const id = responseData.noteId;
        const newNote = this.reformatNote(responseData.note);
        newNoteSubject.next({...newNote})
      });
    return newNoteSubject.asObservable();
  }

  deleteNote(noteId: string) {
    return this.http.delete(BACKEND_URL + "/" + noteId);
  }

  updateNote(noteId: string, dateCreated: MyDate, date: Date, content: string, creator: string, title?: string) {
    const note: Note = { id: noteId, dateCreated: dateCreated, date: date, title: title, content: content, creator: creator};
    return this.http.put(BACKEND_URL + "/" + noteId, note);
  }

}
