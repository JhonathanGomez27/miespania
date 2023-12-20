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
    private _grupos:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _inscritosTorneo:  BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _jugadores:  BehaviorSubject<any | null> = new BehaviorSubject(null);

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
     * Getter for jugadores
     */
    get jugadores$(): Observable<any>
    {
        return this._jugadores.asObservable();
    }

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

    /**
     * Getter for grupos
     */
    get grupos$(): Observable<any>
    {
        return this._grupos.asObservable();
    }

    /**
     * Getter for grupos
     */
    get inscritosTorneo$(): Observable<any>
    {
        return this._inscritosTorneo.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ setters
    // -----------------------------------------------------------------------------------------------------

    set torneos(data:any){
        this._torneos.next(data);
    }

    set torneo(data:any){
        this._torneo.next(data);
    }

    set grupos(data:any){
        this._grupos.next(data);
    }

    set inscritos(data:any){
        this._inscritosTorneo.next(data);
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
        return this._httpClient.get(`${this.url}torneos/byId`, {params}).pipe(
            tap((response) => {
                this._torneo.next(response);
            })
        );
    }

    obtenerTorneoByIdRefresh(id: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('id', id);
        return this._httpClient.get(`${this.url}torneos/byId`, {params});
    }

    crearTorneo(data:any): Observable<any> {
        return this._httpClient.post(`${this.url}torneos`, data);
    }

    editarTorneo(id:any, data:any): Observable<any> {
        return this._httpClient.patch(`${this.url}torneos/editarTorneo?id=${id}`, data);
    }

    finalizarInscripciones(idTorneo: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        return this._httpClient.patch(`${this.url}Torneos/FinalizarInscripciones`, {}, {params});
    }

    sortearGrupos(idTorneo: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        return this._httpClient.get(`${this.url}Torneos/FormarGrupos`, {params});
    }

    reSortearGrupos(idTorneo: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        return this._httpClient.get(`${this.url}Torneos/FormarGrupos`, {params});
    }

    programarPartidosFase(idTorneo: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        return this._httpClient.get(`${this.url}Torneos/programarPartidosFaseGrupos`, {params});
    }

    cambiarTorneoAProgramacion(idTorneo: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        return this._httpClient.patch(`${this.url}Torneos/CambiarTorneoAProgramacion`, {}, {params});
    }

    // ----------------------------------------------------------------
    // Metodos grupos
    // ----------------------------------------------------------------

    obtenerGruposTorneo(id: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}grupos/obtenerGruposPorTorneoId`, {params}).pipe(
            tap((response) => {
                this._grupos.next(response);
            })
        );
    }

    obtenerGruposRefresh(id: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}grupos/obtenerGruposPorTorneoId`, {params});
    }

    crearGrupo(data:any, idTorneo:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        return this._httpClient.post(`${this.url}grupos/crearGrupo`, data, {params});
    }

    obtenerJugadoresInscritosTorneo(id: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}inscripciones/obtenerInscripcionesPorTorneoId`, {params}).pipe(
            tap((response) => {
                this._inscritosTorneo.next(response);
            })
        );
    }

    obtenerInscritosTorneo(id: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}inscripciones/obtenerInscripcionesPorTorneoId`, {params});
    }

    eliminarGrupo(torneo:any, grupo:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', torneo);
        params = params.set('grupoId', grupo);
        return this._httpClient.delete(`${this.url}grupos/eliminarGrupo`, {params});
    }

    agregarParticipanteGrupo(torneo:any, grupo:any, participante: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', torneo);
        params = params.set('grupoId', grupo);
        return this._httpClient.patch(`${this.url}grupos/agregarParticipante`, participante, {params});
    }

    removerParticipanteGrupo(torneo:any, grupo:any, participante: any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', torneo);
        params = params.set('grupoId', grupo);
        params = params.set('inscripcionId', participante);
        return this._httpClient.delete(`${this.url}grupos/eliminarParticipanteGrupo`, {params});
    }

    // ----------------------------------------------------------------
    // Metodos valores
    // ----------------------------------------------------------------

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

    // ----------------------------------------------------------------
    // Metodos partidos
    // ----------------------------------------------------------------

    obtenerPartidosTorneo(id:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}partidos/ObtenerPartidosTorneo`, {params});
    }

    actualizarPartido(id:any, data:any): Observable<any> {
        return this._httpClient.patch(`${this.url}partidos/actualizarResultadoPartido/${id}`, data);
    }

    sortearSiguienteFase(id:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}partidos/SortearSiguienteLlaveFaseGrupos`, {params});
    }

    // ----------------------------------------------------------------
    // Metodos jugadores
    // ----------------------------------------------------------------

    obtenerJugadores(data:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);
        return this._httpClient.get(`${this.url}jugadores/filters`, {params});
    }

    obtenerParejas(data:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('rama', data.rama);
        params = params.set('categoria', data.categoria);
        return this._httpClient.get(`${this.url}parejas/filters`, {params});
    }

    inscribirJugador(data:any): Observable<any> {
        return this._httpClient.post(`${this.url}inscripciones/inscribirJugador`, data);
    }

    inscribirPareja(data:any): Observable<any> {
        return this._httpClient.post(`${this.url}inscripciones/inscribirPareja`, data);
    }

    // ----------------------------------------------------------------
    // Metodos escalera
    // ----------------------------------------------------------------

    obtenerJornadasPorTorneo(id:any): Observable<any> {
        let params = new HttpParams();
        params = params.set('torneoId', id);
        return this._httpClient.get(`${this.url}jornadas/ObtenerJornadasTorneo`, {params});
    }

    programarPartidosjornada(idTorneo: any, idJornada: any){
        let params = new HttpParams();
        params = params.set('torneoId', idTorneo);
        params = params.set('jornadaId', idJornada);
        return this._httpClient.get(`${this.url}Torneos/programarPartidosFaseGruposTorneoEscalera`, {params});
    }
}
