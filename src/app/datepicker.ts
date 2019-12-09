import { Component, AfterViewInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import * as M from 'materialize-css';

@Component({
  selector: 'datepicker',
  template: `
    <div class="input-field">
      <input type="text" [id]="id" class="datepicker">
      <label [for]="id">{{label}}</label>
    </div>
  `
})
export class DatepickerComponent implements AfterViewInit, OnDestroy {
  @Input() options: any;
  @Input() label: string;
  @Output() dateSelected = new EventEmitter<Date>();
  id: string;
  private datepickerInstance: any;

  constructor() {
    this.id = this.guidGenerator();
  }

  ngAfterViewInit(): void {
    this.init(this.options);
  }

  ngOnDestroy(): void {
    this.datepickerInstance.destroy();
  }

  updateOptions(options: any) {
    this.init(options);
  }

  private init(options: any) {
    const datepickerElement = document.querySelector('#' + this.id);
    this.datepickerInstance = M.Datepicker.init(datepickerElement, options);
  }

  guidGenerator(): string {
    const S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return 'datepicker' + (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }
}
