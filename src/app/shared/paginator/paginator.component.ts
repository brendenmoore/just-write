import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { PageEvent } from './PageEvent.model';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input() length: number;
  @Input() pageSize: number;
  pageIndex: number = 0;
  previousPageIndex: number;

  @Output() page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  private emitPageEvent() {
    this.page.emit({
      length: this.length,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      previousPageIndex: this.previousPageIndex
    })
  }

  nextPage(): void {
    if (!this.hasNextPage()) { return; }

    this.previousPageIndex = this.pageIndex;
    this.pageIndex++
    this.emitPageEvent();
  }

  previousPage(): void {
    if (!this.hasPreviousPage()) { return; }

    this.previousPageIndex = this.pageIndex;
    this.pageIndex--
    this.emitPageEvent();
  }

  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }

  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }

  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }

    return Math.ceil(this.length / this.pageSize);
  }

}
