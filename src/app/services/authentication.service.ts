import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { apiReference } from '../_shared/constant/apiReference';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient) { }

  getApiToken(orderId: string, userId: string, lang: string): Observable<string> {
    const body = { 'UserID': userId };
    return this._http.post<string>(apiReference.API_POST_TOKEN, body).pipe(
      map(res => {
        return res;
      })
      //catchError(this.handleError)
    );
  }

  getToken(): HttpHeaders {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    //let options = new RequestOptions({ headers: headers });

    return headers;
  }


  // private handleError(error: HttpErrorResponse): ErrorObservable {
  //   console.log(error);
  //   return new ErrorObservable(error);
  // }
}
