import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Note } from '../models/note.model';
import { MyDateService } from './myDate.service';
import { map } from 'rxjs/operators';

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

  deleteNote(noteId: string) {
    this.http.delete('http://localhost:3000/api/notes/' + noteId)
      .subscribe(() => {
        console.log("deleted")
      })
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
