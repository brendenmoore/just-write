import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.css']
})
export class WriteComponent implements OnInit, AfterViewInit {

  content = "";
  words: number = 0;
  fullscreen: boolean = false;
  elem;

  @ViewChild('textarea')
  private textareaElement: ElementRef;

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngOnInit(): void {
    this.elem = document.documentElement;
  }

  ngAfterViewInit(): void {
    this.textareaElement.nativeElement.focus();
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

  updateWordCount() {
    this.words = this.content ? this.content.replace(/(^\s*)|(\s*$)/gi,"").replace(/[ ]{2,}/gi," ").replace(/\n /,"\n").split(" ").length : 0;
  }

}
