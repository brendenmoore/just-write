import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit, AfterViewInit {

  note: Note;
  id: string;
  words: number = 0;
  fullscreen: boolean = false;
  elem;

  @ViewChild('textarea')
  private textareaElement: ElementRef;

  constructor(@Inject(DOCUMENT) private document: any,
              private noteService: NoteService,
              private route: ActivatedRoute){ }

  ngOnInit(): void {
    this.noteService.getNotes();
    this.route.queryParamMap.subscribe(params => {
      this.id = params.get('id');
      if(this.id){
        this.note = this.noteService.getNoteById(this.id);
      }
      else{
        this.note = this.noteService.getNoteByDateOrCreateNew(new Date());
      }
    })
    this.elem = document.documentElement;
  }

  ngAfterViewInit(): void {
    if (this.note) {
      this.textareaElement.nativeElement.focus();
    }
  }

  onUpdate() {
    this.updateWordCount();
    this.noteService.saveNote(this.note);
  }

  updateWordCount() {
    this.words = this.note.content ? this.note.content.replace(/(^\s*)|(\s*$)/gi,"").replace(/[ ]{2,}/gi," ").replace(/\n /,"\n").split(" ").length : 0;
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
