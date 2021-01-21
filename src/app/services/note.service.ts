import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { MyDateService } from './myDate.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notes: Note[] = [];
  private notesUpdated = new Subject<Note[]>();

  constructor(private myDateService: MyDateService, private http: HttpClient) { }

  getNotes() {
    this.http.get<{message: string, notes: Note[]}>('http://localhost:3000/api/notes')
      .subscribe((noteData) => {
        this.notes = noteData.notes;
        this.notesUpdated.next([...this.notes])
      });
  }

  getNoteById(id: string): Note {
    return this.notes.find(note => note.id === id);
  }

  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }

  getNoteByDateOrCreateNew(date: Date): Note {
    this.getNotes();
    const note = this.notes.find(note => this.myDateService.isEqual(note.dateCreated, this.myDateService.createFromDate(date)));
    if (note) {
      console.log("note found");
      return note
      // check if the date being requested is today
    } else if (this.myDateService.isToday(this.myDateService.createFromDate(date))) {
      console.log("note created")
      // if so, create a new note for the day
      return this.addNote();
    } else {
      //otherwise note does not exist
      return null;
    }
  }

  addNote(): Note {
    const note: Note = {id: null, dateCreated: this.myDateService.getToday(), content: ""}
    this.http.post<{message: string}>('http://localhost:3000/api/notes', note)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.notes.push(note);
        this.notesUpdated.next([...this.notes]);
      });
      return note;
  }

  saveNote(updatedNote: Note) {
    const savedNote = this.notes.find(note => this.myDateService.isEqual(note.dateCreated, updatedNote.dateCreated));
    savedNote.content = updatedNote.content;
    this.notesUpdated.next([...this.notes]);
  }

  // findById(id: number){
  //   return this.notes.find(note => note.id === id);
  // }

  // createNote(): Note {
  //   let newNote = new Note();
  //   this.sampleNotes.push(newNote);
  //   return newNote;
  // }

  // updateNote(id: number, note: Note): Note {
  //   let updatedNote = this.findById(id)
  //   updatedNote.content = note.content;
  //   updatedNote.title = note.title;
  //   return updatedNote;
  // }

}
