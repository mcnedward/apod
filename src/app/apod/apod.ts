export class Apod {
  id: string;
  date: Date;
  explanation: string;
  title: string;
  hdurl: string;
  url: string;
  mediaType: string;
  serviceVersion: string;

  constructor(data: any) {
    this.date = data.date;
    this.explanation = data.explanation;
    this.title = data.title;
    this.hdurl = data.hdurl;
    this.url = data.url;
    this.mediaType = data.media_type;
    this.serviceVersion = data.service_version;
  }

  titleAndDate(): string {
    return `${this.title} (${this.date})`;
  }
}
