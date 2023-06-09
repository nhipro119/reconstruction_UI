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
  "fileId": "baa96dec-0548-11ee-b473-0242ac180002",
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
  reconstruction(formData: FormData ): Observable<any>
  {
    return this.http.post<any>("http://34.101.50.122:5000/predict",formData)
  }
  downloadFile(link:any): any {
		return this.http.get(link, {responseType: 'blob'});
  }
  slice_service(formData:FormData): Observable<any>
  {
    return this.http.post<any>("http://34.101.50.122:8011/slice-gcode",formData)
  }
  upload(formData:any):Observable<any>
  {
    return this.http.post<any>("http://34.101.50.122:3002/api/files/upload",formData);
  }
}
