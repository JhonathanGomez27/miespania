import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {

    private url: string = `${environment.apiUrlAdmin}`;
    private _statistics: BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private http: HttpClient) { }

    //-----------------------------------
    // @ getters and setters
    //-----------------------------------

    set statistics(value: any | null) {
        this._statistics.next(value);
    }

    get statistics$(): Observable<any | null> {
        return this._statistics.asObservable();
    }

    // Método para obtener las estadísticas del usuario
    getUserStatistics(): Observable<any> {
        return this.http.get<any>(`${this.url}torneos/infoTorneos`).pipe(
            tap((response) => {
                this._statistics.next(response);
                console.log(response);
            })
        );
    }

    getAdminStatistics(): Observable<any> {
        return this.http.get<any>(`${this.url}torneos/adminEstadisticasTorneos`).pipe(
            tap((response) => {
                this._statistics.next(response);
            })
        );
    }
}
