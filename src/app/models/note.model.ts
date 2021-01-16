export class Note {
  id: number;
  title?: string;
  content: string;
  dateCreated: Date;

  constructor(){
    this.id = Date.now();
    this.content = "";
    this.dateCreated = new Date();
  }
}
