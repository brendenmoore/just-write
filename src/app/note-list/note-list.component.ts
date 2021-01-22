import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Note } from '../models/note.model';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit {

  notes: Note[];
  isLoading: boolean = false;
  private notesSub: Subscription;

  constructor(public noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.noteService.getNotes();
    this.notesSub = this.noteService.getNoteUpdateListener()
      .subscribe((notes: Note[]) => {
        this.notes = notes;
        this.isLoading = false;
      })
  }

  addNote() {
    this.noteService.addNote(true);
  }

  onDelete(id: string) {
    this.noteService.deleteNote(id);
  }

}
