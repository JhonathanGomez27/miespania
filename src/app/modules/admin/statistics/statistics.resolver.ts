import { Inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StatisticsService } from './statistics.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable({
    providedIn: 'root',
})
export class StatisticsResolver implements Resolve<any> {
    constructor(private _statisticsService: StatisticsService,
    ) {}
    resolve(): Observable<any> {
        const token = AuthUtils._decodeToken(localStorage.getItem('accessToken'));
        if(token.rol == 'user') {
            return this._statisticsService.getUserStatistics();
        } else {
            return this._statisticsService.getAdminStatistics();
        }
    }
}

