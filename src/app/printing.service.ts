import { Injectable } from '@angular/core';
import { HandleError, HttpErrorHandlerService } from './http-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface ResponseBody {
  code: number,
  data: any,
  message: string
}
const REQ_DATA = {
  "printerId": "00-1B-63-84-45-E6",
  "fileId": "a610f34a-ef0b-11ed-9e26-42010ab80002",
  "status": "PENDING"
}
@Injectable({
  providedIn: 'root'
})
export class PrintingService {
  url = 'http://34.101.50.122:8000/api/activities'
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandlerService) {
    this.handleError = httpErrorHandler.createHandleError('ProjectsService');
  }

  print(): Observable<any> {
    return this.http.post<any>(this.url, REQ_DATA)

  }
}
