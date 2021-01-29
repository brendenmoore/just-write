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
    this.route.queryParamMap.subscribe(params => {
      this.noteId = params.get('id');
      this.isLoading = true;
      // load note from params
      if(this.noteId){
        this.noteService.getNoteById(this.noteId).subscribe(noteData => {
          this.note = {
            id: noteData._id,
            title: noteData.title,
            dateCreated: noteData.dateCreated,
            content: noteData.content
          }
          this.saved = true;
          this.isLoading = false;
        });
      }
      // otherwise load another note by default
      else{
        // load most recent note
        this.noteService.getMostRecentId().subscribe(id => {
          console.log(id.toString())
          this.noteService.getNoteById(id.toString()).subscribe((noteData) => {
            // check if it is today's and if so load it
            if(this.dateService.isToday(noteData.dateCreated)) {
              this.note = {
                id: noteData._id,
                title: noteData.title,
                dateCreated: noteData.dateCreated,
                content: noteData.content
              }
              this.saved = true;
              this.isLoading = false;
            }
            // otherwise create and load a new note
            else {
              this.noteService.addNote().subscribe(note => {
                this.note = note;
                this.isLoading = false;
              });
            }
          }, error => {
            // if not found, create a new note
            console.log(error)
            this.noteService.addNote().subscribe(note => {
              this.note = note;
              this.isLoading = false;
            });
          }
          )
        })
      }
    })
    this.elem = document.documentElement;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.note) {
        this.textareaElement.nativeElement.focus();
      }
    }, 1000);
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
