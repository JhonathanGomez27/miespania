import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TorneosService {

    private url: string = `${environment.apiUrlAdmin}`;

    // -----------------------------------------------------------------------------------------------------
    // @ Variables
    // -----------------------------------------------------------------------------------------------------

    private _torneos:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _torneo:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _tipos:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _modalidades:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _ramas:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _categorias:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _fases:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _estados:  BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ getters
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for _torneos
     */
    get torneos$(): Observable<any>
    {
        return this._torneos.asObservable();
    }

    /**
     * Getter for _torneos
     */
    get torneo$(): Observable<any>
    {
        return this._torneo.asObservable();
    }

    /**
     * Getter for ramas
     */
    get ramas$(): Observable<any>
    {
        return this._ramas.asObservable();
    }

    /**
     * Getter for tipos
     */
    get tipos$(): Observable<any>
    {
        return this._tipos.asObservable();
    }

    /**
     * Getter for modalidades
     */
    get modalidades$(): Observable<any>
    {
        return this._modalidades.asObservable();
    }

    /**
     * Getter for categorias
     */
    get categorias$(): Observable<any>
    {
        return this._categorias.asObservable();
    }

    /**
     * Getter for fases
     */
    get fases$(): Observable<any>
    {
        return this._fases.asObservable();
    }

    /**
     * Getter for estados
     */
    get estados$(): Observable<any>
    {
        return this._estados.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ setters
    // -----------------------------------------------------------------------------------------------------

    set torneos(data:any){
        this._torneos.next(data);
    }

    // ----------------------------------------------------------------
    // Metodos torneos
    // ----------------------------------------------------------------

    obtenerTorneos(): Observable<any> {
        return this._httpClient.get(`${this.url}torneos`).pipe(
            tap((response) => {
                this._torneos.next(response);
            })
        );
    }

    obtenerTorneosRefresh(): Observable<any> {
        return this._httpClient.get(`${this.url}torneos`);
    }

    obtenerTorneoById(id: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('id', id);
        return this._httpClient.get(`${this.url}torneos/byId`).pipe(
            tap((response) => {
                this._torneo.next(response);
            })
        );
    }

    crearTorneo(data:any): Observable<any> {
        return this._httpClient.post(`${this.url}torneos`, data);
    }

    obtenerRamas(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerRamas`).pipe(
            tap((response) => {
                this._ramas.next(response);
            })
        );
    }

    obtenerTipos(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerTipos`).pipe(
            tap((response) => {
                this._tipos.next(response);
            })
        );
    }

    obtenerModalidades(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerModalidades`).pipe(
            tap((response) => {
                this._modalidades.next(response);
            })
        );
    }

    obtenerCategorias(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerCategorias`).pipe(
            tap((response) => {
                this._categorias.next(response);
            })
        );
    }

    obtenerFases(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerFases`).pipe(
            tap((response) => {
                this._fases.next(response);
            })
        );
    }

    obtenerEstados(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerEstados`).pipe(
            tap((response) => {
                this._estados.next(response);
            })
        );
    }

    // ----------------------------------------------------------------
    // Metodos parejas
    // ----------------------------------------------------------------

    crearPareja(data:any): Observable<any> {
        return this._httpClient.post(`${this.url}parejas`, data);
    }
}
