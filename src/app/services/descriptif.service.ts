import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { EmployeeDto } from '../_shared/model/employeeDto';
import { apiReference } from '../_shared/constant/apiReference';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DescriptifService {

  constructor(private _http: HttpClient, private _authService: AuthenticationService) { }

  getData(): Observable<EmployeeDto> {

    return this._http.get<EmployeeDto>(apiReference.API_GET_EMPLOYEE + localStorage.getItem('OrderId'), { headers: this._authService.getToken() }).pipe(
      map((res: EmployeeDto) => {
        return { ReportID: res.ReportID, JsonString: res.JsonString };
      })
      //catchError(this.handleError)
    );
  }

  saveData(model: EmployeeDto): Observable<boolean> {
      return this._http.post(apiReference.Descriptif_API_POST, JSON.stringify(model), { headers: this._authService.getToken() }).pipe(
      map(res => {
        return true;
      })
      //catchError(this.handleError)
    );
  }

  // private handleError(error: HttpErrorResponse): ErrorObservable {
  //   console.log(error);
  //   return new ErrorObservable(error);
  // }
}
