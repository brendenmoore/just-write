import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MyDateService } from '../services/myDate.service';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit, AfterViewInit {

  note: Note;
  noteId: string;
  fullscreen: boolean = false;
  saved: boolean = true;
  isLoading: boolean = false;
  elem; // for fullscreen toggle

  @ViewChild('textarea')
  private textareaElement: ElementRef;

  constructor(@Inject(DOCUMENT) private document: any,
              private noteService: NoteService,
              private route: ActivatedRoute,
              private dateService: MyDateService,
              private nav: NavigationService){ }

  ngOnInit(): void {
    this.nav.setShowNav(false);
    this.autoLoadNote();
    this.elem = document.documentElement;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.note) {
        this.textareaElement.nativeElement.focus();
      }
    }, 1000);
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
    this.noteService.getMostRecentId().subscribe(response => {
      if (!response.noteId) {
        this.createNewNote();
        return;
      }
      this.noteService.getNoteById(response.noteId.toString()).subscribe(noteData => {
        if(this.dateService.isToday(noteData.dateCreated)){
          this.note = {
            id: noteData._id,
            title: noteData.title,
            dateCreated: noteData.dateCreated,
            content: noteData.content
          }
          this.saved = true;
          this.isLoading = false;
        } else {
          this.createNewNote();
        }
      })
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



  private loadNoteByParam(id): void {
    this.noteService.getNoteById(id).subscribe(noteData => {
      this.note = {
        id: noteData._id,
        title: noteData.title,
        dateCreated: noteData.dateCreated,
        content: noteData.content
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
    this.noteService.updateNote(
      this.note.id,
      this.note.dateCreated,
      this.note.content,
      this.note.title
    ).subscribe(result => this.saved = true);
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.fullscreen = true;
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.fullscreen = false;
  }



}
