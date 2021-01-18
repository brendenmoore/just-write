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

  getNoteByDate(date: MyDate) {
    return this.notes.find(note => this.myDateService.isEqual(note.dateCreated, date));
  }

  addNote() {
    const note: Note = {dateCreated: this.myDateService.getToday(), content: ""}
    this.notes.push(note);
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
