import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Apod } from './apod/apod';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApodService {
  private apodKey: string = 'apods';
  private apodApiUrl: string = `${environment.apiUrl}/apod`;

  constructor(private http: Http) {
  }

  /**
   * Gets the APOD for a specified date.
   * @param apodDate The date for the APOD
   */
  public getApod(apodDate: string): Observable<Apod> {
    // Try to get the apod from local storage first
    let apod = this.getCachedApod(apodDate);
    if (apod !== null) {
      return of(apod);
    }

    // Get from the server
    return this.http.get(`${this.apodApiUrl}?date=${apodDate}`)
      .pipe(map(response => {
        let data = response.json();
        let a = new Apod(data);
        this.save(data);
        return a;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Gets an APOD from localStorage, or returns null if one for this date does not exist.
   * @param apodDate
   */
  private getCachedApod(apodDate: string): Apod {
    let apodsString = localStorage.getItem(this.apodKey);
    if (!apodsString || !apodDate) {
      return null;
    }

    let apods = JSON.parse(apodsString);
    return apods[apodDate.toString()] ? new Apod(apods[apodDate.toString()]) : null;
  }

  private save(apodData: any) {
    let apods: Object;
    let apodsString = localStorage.getItem(this.apodKey);

    if (apodsString) {
      apods = JSON.parse(apodsString);
    }
    if (!apods) {
      apods = {};
    }

    apods[apodData.date.toString()] = apodData;
    localStorage.setItem(this.apodKey, JSON.stringify(apods));
  }

  private handleError(error: Response | any) {
    let message: string;
    if (error == null) {
      message = 'There was a problem with your request, please try again.';
    } else if (error instanceof Response) {
      // The error came from the server. All server errors should typically come as a JSON object with an error property
      try {
        // Try to get the json error data
        const data = <any>error.json() || {};
        // If the data contains an error message, log that. Otherwise, show the error text
        message = data.message || error.text();
      } catch (e) {
        if (error.status === 401) {
          message = 'Sorry, you\'re not allowed to do that.';
        } else if (error.status === 404) {
          message = 'Could not find anything at your requested route, please try again.';
        } else if (error.status === 0) {
          message = 'Something went wrong with your request, please try again.';
        } else {
          error.text();
        }
        if (!message) {
          // Something went wrong, maybe the error body could not be converted correctly
          console.error(`Error in ApodService: ${error.status} ${error.statusText}`);
          message = 'Something went wrong with your request, please try again.';
        }
      }
    } else {
      // There was some other type of error
      message = 'There was a problem with your request, please try again.';
      console.error(`Error in ColorZonesService: ${error.message || error.toString()}`);
    }
    return throwError({
      message: message,
      statusCode: error.status
    });
  }
}
