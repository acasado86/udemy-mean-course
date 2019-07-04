import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ErrorComponent } from './error/error.component';

Injectable();
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public dialog: MatDialog) {}


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unkown error ocurred!';
                if (error.error.message) {
                    errorMessage = error.error.message;
                } else if (error.error.error.errmsg) {
                    errorMessage = error.error.error.errmsg;
                }
                this.dialog.open(ErrorComponent,
                    { data: { message: errorMessage } }
                );
                return throwError(error);
            })
        );
    }
}
