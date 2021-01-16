import { Injectable } from '@angular/core';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  testNote: Note = new Note();
  sampleNotes: Note[] = [
    new Note(),
    this.testNote
  ]

  constructor() { }

  findAll(): Note[] {
    return this.sampleNotes;
  }

  findById(id: number){
    return this.sampleNotes.find(note => note.id === id);
  }

  createNote(): Note {
    let newNote = new Note();
    this.sampleNotes.push(newNote);
    return newNote;
  }

  updateNote(id: number, note: Note): Note {
    let updatedNote = this.findById(id)
    updatedNote.content = note.content;
    updatedNote.title = note.title;
    return updatedNote;
  }

}
