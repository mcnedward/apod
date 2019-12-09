import { Component, AfterViewInit, Input, OnDestroy, EventEmitter, Output, ViewChild, ElementRef, OnInit } from '@angular/core';

import { Apod } from './apod';

import * as M from 'materialize-css';

@Component({
  selector: 'apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.scss']
})
export class ApodComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() apod: Apod;
  @Output() apodSelected = new EventEmitter<Apod>();
  @ViewChild('apodImgElement') apodImgElement: ElementRef;
  id: string;
  private materialBoxInstance: any;

  constructor() {
    this.id = this.guidGenerator();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    if (this.apodImgElement != null) {
      this.apodImgElement.nativeElement.src = this.apod.url;
      this.apodImgElement.nativeElement.classList.add('fadeIn');
    }
    var element = document.querySelector(`#${this.id} .materialboxed`);
    this.materialBoxInstance = M.Materialbox.init(element, {});
  }

  ngOnDestroy(): void {
    if (this.materialBoxInstance != null)
      this.materialBoxInstance.destroy();
  }

  openModal(apod: Apod) {
    this.apodSelected.emit(apod);
  }

  guidGenerator(): string {
    const S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return 'apod' + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
}
