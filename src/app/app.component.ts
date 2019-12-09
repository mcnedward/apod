import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

import { Observable, forkJoin } from 'rxjs';

import { AngualertService } from 'angualert';
import * as moment from 'moment-timezone';
import * as M from 'materialize-css';

import { ApodService } from './apod.service';
import { Apod } from './apod/apod';
import { DatepickerComponent } from './datepicker';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  public copyrightDate: number = new Date().getFullYear();
  allApods: Apod[] = new Array<Apod>();
  selectedApod: Apod;
  loading: boolean = true;
  loadingHdImage: boolean = true;
  private fromDate: any;
  private toDate: any;
  private loadCount: number;
  private dateFormat: string = 'YYYY-MM-DD';
  private modalInstance: any
  startDatepickerOptions: any;
  endDatepickerOptions: any;
  @ViewChild('startDatepicker') startDatepicker: DatepickerComponent
  @ViewChild('endDatepicker') endDatepicker: DatepickerComponent

  constructor(private apodService: ApodService,
    private angualertService: AngualertService) { }

  ngOnInit() {
    let fromDate = moment().subtract(1, 'M');
    this.fromDate = fromDate;
    let toDate = moment();
    this.toDate = toDate;
    const toMinDate = moment().subtract(1, 'months').subtract(1, 'days');

    this.startDatepickerOptions = {
      autoClose: true,
      defaultDate: this.fromDate.toDate(),
      setDefaultDate: true,
      onSelect: (d) => this.onStartDateSelected(d),
      maxDate: this.toDate.toDate()
    }
    this.endDatepickerOptions = {
      autoClose: true,
      defaultDate: this.toDate.toDate(),
      setDefaultDate: true,
      onSelect: (d) => this.onEndDateSelected(d),
      minDate: toMinDate.toDate(),
      maxDate: this.toDate.toDate()
    }

    this.updateApod();
  }

  ngAfterViewInit() {
    var element = document.querySelector('#apodModal');
    this.modalInstance = M.Modal.init(element, {});
  }

  ngOnDestroy() {
    this.modalInstance.destroy();
  }

  private onStartDateSelected(newStartDate: Date) {
    this.fromDate = moment(newStartDate);
    this.endDatepickerOptions.minDate = newStartDate;

    const monthAhead = moment(this.fromDate).add(1, 'months');
    if (this.toDate.isAfter(monthAhead)) {
      this.toDate = monthAhead;
      this.endDatepickerOptions.defaultDate = this.toDate.toDate();
    }

    this.endDatepicker.updateOptions(this.endDatepickerOptions);
    this.updateApod();
  }

  private onEndDateSelected(newEndDate: Date) {
    this.toDate = moment(newEndDate);
    this.startDatepickerOptions.maxDate = newEndDate;
    this.startDatepicker.updateOptions(this.startDatepickerOptions);
    this.updateApod();
  }

  private updateApod() {
    this.loading = true;
    // Remove all old apods
    this.allApods = new Array<Apod>();
    let fromDate = moment(this.fromDate);
    this.loadCount = moment(this.toDate).diff(fromDate, 'd');

    let observables = new Array<Observable<Apod>>();
    for (let i = 0; i <= this.loadCount; i++) {
      let requestDate = fromDate.format(this.dateFormat);
      observables.push(this.apodService.getApod(requestDate));
      fromDate.add(1, 'd');
    }
    forkJoin(observables).subscribe(result => {
      this.allApods = result;
      this.loading = false;
    }, error => {
      this.showError(error.message);
      this.loading = false;
    });
  }

  showError(message: string) {
    this.angualertService.error(message);
  }

  onApodSelected(apod: Apod) {
    this.selectedApod = apod;
    this.modalInstance.open();
  }

  imageLoaded() {
    this.loadingHdImage = false;
  }
}
