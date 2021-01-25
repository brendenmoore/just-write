import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Note } from '../models/note.model';
import { NavigationService } from '../services/navigation.service';
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

  constructor(public noteService: NoteService,
              private router: Router,
              private route: ActivatedRoute,
              private navBar: NavigationService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.noteService.getNotes();
    this.notesSub = this.noteService.getNoteUpdateListener()
      .subscribe((notes: Note[]) => {
        this.notes = notes;
        this.isLoading = false;
      })
  }

  navigate(note: Note) {
    this.router.navigate(["/write"], {queryParams: {id: note.id}} );
    this.navBar.setShowNav(false);
  }

  addNote() {
    this.noteService.addNote().subscribe(note=> {
      this.navigate(note);
    });
  }

  onDelete(id: string) {
    this.noteService.deleteNote(id);
    this.route.queryParamMap.subscribe(params => {
      let activeId = params.get('id');
      if (activeId === id) {
        this.router.navigate(["/write"]);
      }
    })
  }

}
