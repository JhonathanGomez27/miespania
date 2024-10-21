import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StatisticsService } from './statistics.service';

@Injectable({
    providedIn: 'root',
})
export class StatisticsResolver implements Resolve<any> {
    constructor(private _statisticsService: StatisticsService) {}

    resolve(): Observable<any> {
        return this._statisticsService.getUserStatistics();
    }
}
