import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class JugadoresService {

    private url: string = `${environment.apiUrlAdmin}`;

    // -----------------------------------------------------------------------------------------------------
    // @ Variables
    // -----------------------------------------------------------------------------------------------------

    private _jugadores:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _jugadoresList:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _parejas:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _ramas:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _categorias:  BehaviorSubject<any | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ getters
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for jugadores
     */
    get jugadores$(): Observable<any>
    {
        return this._jugadores.asObservable();
    }

    /**
     * Getter for jugadoresList
     */
    get jugadoresList$(): Observable<any>
    {
        return this._jugadoresList.asObservable();
    }

    /**
     * Getter for parejas
     */
    get parejas$(): Observable<any>
    {
        return this._parejas.asObservable();
    }


    /**
     * Getter for categorias
     */
    get categorias$(): Observable<any>
    {
        return this._categorias.asObservable();
    }

    /**
     * Getter for ramas
     */
    get ramas$(): Observable<any>
    {
        return this._ramas.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ setters
    // -----------------------------------------------------------------------------------------------------

    set jugadores(data:any){
        this._jugadores.next(data);
    }

    set parejas(data:any){
        this._parejas.next(data);
    }

    set jugadoresList(data:any){
        this._jugadoresList.next(data);
    }

    // ----------------------------------------------------------------
    // Metodos jugadores
    // ----------------------------------------------------------------

    obtenerJugadores(): Observable<any> {
        return this._httpClient.get(`${this.url}jugadores`).pipe(
            tap((response) => {
                this._jugadores.next(response);
            })
        );
    }

    obtenerJugadoresRefresh(): Observable<any> {
        return this._httpClient.get(`${this.url}jugadores`);
    }

    obtenerJugadoresFiltro(data:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('page', data.page);
        params = params.set('limit', data.limit);
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);

        return this._httpClient.get(`${this.url}jugadores/filtersPaginated`,{params});
    }

    obtenerJugadoresFiltroPaginadoI(data:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('page', data.page);
        params = params.set('limit', data.limit);
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);

        return this._httpClient.get(`${this.url}jugadores/filtersPaginated`,{params}).pipe(
            tap((response) => {
                this._jugadoresList.next(response);
            })
        );
    }

    obtenerJugadoresFiltroPaginado(data:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('page', data.page);
        params = params.set('limit', data.limit);
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);

        return this._httpClient.get(`${this.url}jugadores/filtersPaginated`,{params});
    }

    obtenerJugadorUserId(userId:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('userId', userId);

        return this._httpClient.get(`${this.url}jugadores/byUserId`,{params});
    }

    obtenerJugadorPorId(id:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('id', id);

        return this._httpClient.get(`${this.url}jugadores/byId`,{params});
    }

    editarJugadorPorId(id:any, data: any){
        return this._httpClient.patch(`${this.url}usuarios/editar/${id}`, data);
    }

    obtenerRamas(): Observable<any> {
        return this._httpClient.get(`${this.url}Torneos/ObtenerRamas`).pipe(
            tap((response) => {
                this._ramas.next(response);
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

    // ----------------------------------------------------------------
    // Metodos parejas
    // ----------------------------------------------------------------

    obtenerParejas(): Observable<any> {
        return this._httpClient.get(`${this.url}parejas`).pipe(
            tap((response) => {
                this._parejas.next(response);
            })
        );
    }

    obtenerParejasFiltroPaginadoI(data:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('page', data.page);
        params = params.set('limit', data.limit);
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);

        return this._httpClient.get(`${this.url}parejas/filtersPaginated`,{params}).pipe(
            tap((response) => {
                this._parejas.next(response);
            })
        );
    }

    obtenerParejasFiltroPaginado(data:any): Observable<any>{
        let params = new HttpParams();
        params = params.set('page', data.page);
        params = params.set('limit', data.limit);
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);

        return this._httpClient.get(`${this.url}parejas/filtersPaginated`,{params});
    }

    obtenerParejasRefresh(): Observable<any> {
        return this._httpClient.get(`${this.url}parejas`);
    }

    crearPareja(data: any){
        return this._httpClient.post(`${this.url}parejas`, data);
    }

    editarPareja(id:any, data: any){
        return this._httpClient.patch(`${this.url}parejas/editar/${id}`, data);
    }
}
