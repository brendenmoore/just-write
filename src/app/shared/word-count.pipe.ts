import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordCount'
})
export class WordCountPipe implements PipeTransform {

  transform(string: string): number {
    if (!string) {
      return 0;
    }
    return string
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/(^\s*)|(\s*$)/gi,"")
      .replace(/[ ]{2,}/gi," ")
      .split(" ")
      .length;
  }

}
