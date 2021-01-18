import { Injectable } from '@angular/core';
import { MyDate } from '../models/myDate.model';
import { Note } from '../models/note.model';
import { MyDateService } from './myDate.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notes: Note[] = []

  constructor(private myDateService: MyDateService) { }

  getNotes(): Note[] {
    return [...this.notes];
  }

  getNoteByDateOrCreateNew(date: Date): Note {
    const note = this.notes.find(note => this.myDateService.isEqual(note.dateCreated, this.myDateService.createFromDate(date)));
    if (note) {
      return note
    // check if the date being requested is today
    } else if (this.myDateService.isToday(this.myDateService.createFromDate(date))) {
      // if so, create a new note for the day
      return this.addNote();
    } else {
      //otherwise note does not exist
      return null;
    }
  }

  addNote(): Note {
    const note: Note = {dateCreated: this.myDateService.getToday(), content: ""}
    this.notes.push(note);
    return note;
  }

  saveNote(updatedNote: Note) {
    const savedNote = this.notes.find(note => this.myDateService.isEqual(note.dateCreated, updatedNote.dateCreated));
    savedNote.content = updatedNote.content;
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
