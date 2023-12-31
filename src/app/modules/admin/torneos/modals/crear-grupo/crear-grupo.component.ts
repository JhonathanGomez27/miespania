import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { TorneosService } from '../../torneos.service';

@Component({
    selector: 'app-crear-grupo',
    templateUrl: './crear-grupo.component.html',
    styleUrls: ['./crear-grupo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CrearGrupoComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    protected _onDestroy = new Subject<void>();

    tipoAccion:any = 'Crear';

    inscritos: any = [];
    grupoSelected: any = {};

    public jugadoresFiltroCtrl: FormControl = new FormControl();
    public filteredJugadores: ReplaySubject<any[]> = new ReplaySubject<any[]>(null);

    GRUPOS: any = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    contGrupos: any = 0;

    tipojuego: any = '';

    constructor(
        public matDialogRef: MatDialogRef<CrearGrupoComponent>,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _torneoService: TorneosService
    ) {
        this.tipoAccion = data.accion;

        this.contGrupos = data.cantGrupos;

        this.tipojuego = data.tipojuego;

        if(data.accion === 'Editar'){
            this.grupoSelected = data.grupo;
        }
    }

    ngOnInit(): void {
        this._torneoService.inscritosTorneo$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.inscritos = response;
            this.filteredJugadores.next(response.slice());
            this.jugadoresFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                if(this.tipojuego === 'jugador'){
                    this.filtroBusquedaJugador(response);
                }else{
                    this.filtroBusquedaPareja(response);
                }
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    addJugadorToGrupo(jugador:any){
        if(this.data.accion === 'Editar'){
            this.editarGrupos(jugador);
        }else{
            this.crearGrupo(jugador);
        }
    }

    addParejaTogrupo(pareja:any){
        if(this.data.accion === 'Editar'){
            this.editarGrupos(pareja);
        }else{
            this.crearGrupoPareja(pareja);
        }
    }

    crearGrupo(jugador:any){
        let values = {
            nombre_grupo: this.GRUPOS[this.contGrupos],
            completado: false,
            participantes: [
                {...jugador}
            ]
        }

        this.matDialogRef.close(values);
    }

    crearGrupoPareja(pareja:any){
        let values = {
            nombre_grupo: this.GRUPOS[this.contGrupos],
            completado: false,
            participantes: [
                {...pareja}
            ]
        }

        this.matDialogRef.close(values);
    }

    editarGrupos(jugador:any){
        this.matDialogRef.close(jugador);
    }

    //---------------------
    //  Funciones filtros
    //---------------------

    /**
     * Filtro de busqueda del select de marcas
     * @param data
     * @returns
     */
    protected filtroBusquedaJugador(data:any): void {
        if (!data) {
            return;
        }
        // get the search keyword
        let search = this.jugadoresFiltroCtrl.value;
        if (!search) {
            this.filteredJugadores.next(data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the select
        this.filteredJugadores.next(
            data.filter(
                (element) => element.jugador.nombre.toLowerCase().indexOf(search) > -1
            )
        );
    }

    /**
     * Filtro de busqueda del select de marcas
     * @param data
     * @returns
     */
    protected filtroBusquedaPareja(data:any): void {
        if (!data) {
            return;
        }
        // get the search keyword
        let search = this.jugadoresFiltroCtrl.value;
        if (!search) {
            this.filteredJugadores.next(data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the select
        this.filteredJugadores.next(
            data.filter(
                (element) => element.pareja.jugador1.nombre.toLowerCase().indexOf(search) > -1 || element.pareja.jugador2.nombre.toLowerCase().indexOf(search) > -1
            )
        );
    }

    onNoClick(): void {
        this.matDialogRef.close();
    }
}
