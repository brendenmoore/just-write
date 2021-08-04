import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NoteService } from '../services/note.service';
import { Note } from '../models/note.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../services/navigation.service';
import { CanComponentDeactivate } from './can-deactivate-guard.service';
import { Observable } from 'rxjs';
import ConfettiGenerator from 'confetti-js';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css'],
})
export class WriteComponent
  implements OnInit, AfterViewInit, CanComponentDeactivate
{
  note: Note;
  noteId: string;
  fullscreen: boolean = false;
  saved: boolean = true;
  isLoading: boolean = false;
  timeout: NodeJS.Timer;
  saveCounter: number = 0;
  textAreaHeight: number = null;
  goal: number;
  goalComplete: boolean = false;

  @ViewChild('textarea')
  private textareaElement: ElementRef;

  @ViewChild('canvas')
  private canvas: ElementRef;

  @ViewChild('scrollDiv')
  private scrollDiv: ElementRef;

  constructor(
    private noteService: NoteService,
    private route: ActivatedRoute,
    private nav: NavigationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.nav.setShowNav(false);
    this.autoLoadNote();
    this.getGoal();
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
      return confirm(
        'Changes have not been saved. Are you sure you want to leave?'
      );
    } else {
      return true;
    }
  }

  getGoal() {
    this.authService.getGoal().subscribe((result) => {
      this.goal = result.data().goal
      this.checkGoal();
    });
  }

  setGoal(newGoal: number) {
    this.authService.setGoal(newGoal).then((result) => {
      console.log('goal updated');
      this.getGoal();
    });
  }

  goalPrompt() {
    let goal = Number(prompt('Set new words-per-day goal:'));
    if (goal > 0) {
      this.setGoal(goal);
    }
  }

  private autoLoadNote(): void {
    this.route.queryParamMap.subscribe(
      (params) => {
        this.noteId = params.get('id');
        this.isLoading = true;
        if (this.noteId) {
          this.loadNoteByParam(this.noteId);
        } else {
          this.loadTodaysNote();
        }
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  private loadTodaysNote(): void {
    this.noteService
      .getMostRecentNote()
      .valueChanges({ idField: 'id' })
      .subscribe(
        (notes) => {
          console.log(notes);
          const recentNote = notes[0];
          if (!recentNote) {
            this.createNewNote();
            return;
          }
          if (this.isToday(recentNote.date.toDate())) {
            this.note = {
              id: recentNote.id,
              title: recentNote.title,
              date: recentNote.date,
              content: recentNote.content,
            };
            this.saved = true;
            this.isLoading = false;
          } else {
            this.createNewNote();
          }
        },
        (error) => {
          this.createNewNote();
        }
      );
  }

  private createNewNote(): void {
    this.noteService.addNote().subscribe((note) => {
      this.note = note;
      this.isLoading = false;
    });
  }

  private isToday = (someDate) => {
    const today = new Date();
    return (
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    );
  };

  private loadNoteByParam(id): void {
    this.noteService.getNoteById(id).subscribe(
      (noteData) => {
        this.note = {
          id: noteData.id,
          title: noteData.title,
          date: noteData.date,
          content: noteData.content,
        };
        this.saved = true;
        this.isLoading = false;
        this.checkGoal(false);
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  toggleNav(): void {
    this.nav.toggleNavState();
  }

  onUpdate() {
    this.saved = false;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.noteService
        .updateNote(
          this.note.id,
          this.note.date,
          this.note.content,
          this.note.title
        )
        .then((result) => {
          this.saved = true;
          this.checkGoal();
        });
    }, 1000);
  }

  checkGoal(showAlert: boolean = true) {
    let words: number = this.count(this.note.content);
    if (!this.goalComplete && words >= this.goal) {
      if (showAlert) {
        this.victory();
      }
      this.goalComplete = true;
    }
    if (this.goalComplete && words < this.goal) {
      this.goalComplete = false;
    }
  }

  victory() {
    var confettiSettings = {
      target: this.canvas.nativeElement,
      max: 50,
      animate: true,
      respawn: false,
      clock: 30,
      props: [{ type: 'svg', src: '../../assets/images/cat.svg', size: 50 }],
      start_from_edge: true,
      rotate: true,
    };
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
  }

  count(string: string): number {
    if (!string) {
      return 0;
    }
    return string
      .replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/(^\s*)|(\s*$)/gi, '')
      .replace(/[ ]{2,}/gi, ' ')
      .split(' ').length;
  }

  onResized(event) {
    let position = this.scrollDiv.nativeElement.scrollHeight;
    let cursor = this.textareaElement.nativeElement.selectionStart;
    let chars = this.note.content.length;
    if (
      event > this.textAreaHeight &&
      this.textAreaHeight &&
      cursor === chars
    ) {
      console.log('time to scroll!');
      this.scrollDiv.nativeElement.scrollBy(0, 100);
    }
    this.textAreaHeight = event;
  }
}
