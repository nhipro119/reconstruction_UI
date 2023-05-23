import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(private loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.isLoading.next(true);

        return next.handle(req).pipe(
            finalize(
                () => {
                    this.loaderService.isLoading.next(false)
                }
            )
        );
    }
}