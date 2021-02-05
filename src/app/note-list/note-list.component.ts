import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Note } from '../models/note.model';
import { NavigationService } from '../services/navigation.service';
import { NoteService } from '../services/note.service';
import { PageEvent } from '../shared/paginator/PageEvent.model';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent implements OnInit, OnDestroy {

  notes: Note[];
  isLoading: boolean = false;
  totalNotes: number = 0;
  notesPerPage: number = 10;
  currentPage: number = 1;
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  private notesSub: Subscription;

  constructor(public noteService: NoteService,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private navBar: NavigationService) { }

  ngOnInit(): void {
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.isLoading = true;
    this.noteService.getNotes(this.notesPerPage, this.currentPage);
    this.notesSub = this.noteService.getNoteUpdateListener()
      .subscribe((noteData: {notes: Note[], noteCount: number}) => {
        this.notes = noteData.notes;
        this.totalNotes = noteData.noteCount;
        this.isLoading = false;
      })
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.notesSub.unsubscribe();
  }

  navigate(note: Note) {
    this.router.navigate(["/write"], {queryParams: {id: note.id}} ).then(onfulfilled => {
      this.navBar.setShowNav(false);
    });
  }

  addNote() {
    this.noteService.addNote().subscribe(note=> {
      this.noteService.getNotes(this.notesPerPage, this.currentPage);
      this.navigate(note);
    });
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.noteService.deleteNote(id).subscribe(() => {
      this.noteService.getNotes(this.notesPerPage, this.currentPage);
      this.route.queryParamMap.subscribe(params => {
        let activeId = params.get('id');
        if (activeId === id) {
          this.router.navigate(["/write"]);
        }
      })
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.notesPerPage = pageData.pageSize;
    this.noteService.getNotes(this.notesPerPage, this.currentPage)
  }

  onLogout() {
    this.authService.logout();
  }

}
