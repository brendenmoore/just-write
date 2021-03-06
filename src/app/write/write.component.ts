import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit, AfterViewInit, CanComponentDeactivate {

  note: Note;
  noteId: string;
  fullscreen: boolean = false;
  saved: boolean = true;
  isLoading: boolean = false;
  timeout: NodeJS.Timer;
  saveCounter: number = 0;

  @ViewChild('textarea')
  private textareaElement: ElementRef;

  constructor(private noteService: NoteService,
              private route: ActivatedRoute,
              private nav: NavigationService){ }

  ngOnInit(): void {
    this.nav.setShowNav(false);
    this.autoLoadNote();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.note) {
        this.textareaElement.nativeElement.focus();
      }
    }, 1000);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.saved) {
      return confirm("Changes have not been saved. Are you sure you want to leave?");
    } else {
      return true;
    }
  }

  private autoLoadNote(): void {
    this.route.queryParamMap.subscribe(params => {
      this.noteId = params.get('id');
      this.isLoading = true;
      if (this.noteId) {
        this.loadNoteByParam(this.noteId);
      } else {
        this.loadTodaysNote();
      }
    }, error => {
      this.isLoading = false;
    })
  }

  private loadTodaysNote(): void {
    this.noteService.getMostRecentNote().subscribe(response => {
      console.log(response)
      const recentNote = response.notes[0];
      if (!recentNote) {
        this.createNewNote();
        return;
      }
      if(this.isToday(new Date(recentNote.date))){
        this.note = {
          id: recentNote._id,
          title: recentNote.title,
          dateCreated: recentNote.dateCreated,
          date: new Date(recentNote.date),
          content: recentNote.content,
          creator: recentNote.creator
        }
        this.saved = true;
        this.isLoading = false;
      } else {
        this.createNewNote();
      }

    }, error => {
      this.createNewNote();
    })

  }

  private createNewNote(): void {
    this.noteService.addNote().subscribe(note => {
      this.note = note;
      this.isLoading = false;
    });
  }

  private isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  private loadNoteByParam(id): void {
    this.noteService.getNoteById(id).subscribe(noteData => {
      this.note = {
        id: noteData._id,
        title: noteData.title,
        dateCreated: noteData.dateCreated,
        date: new Date(noteData.date),
        content: noteData.content,
        creator: noteData.creator
      }
      this.saved = true;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    })
  }

  toggleNav(): void {
    this.nav.toggleNavState();
  }

  onUpdate() {
    this.saved = false;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.noteService.updateNote(
        this.note.id,
        this.note.dateCreated,
        this.note.date,
        this.note.content,
        this.note.creator,
        this.note.title
      ).subscribe(result => this.saved = true);
    }, 1000);
  }

}
