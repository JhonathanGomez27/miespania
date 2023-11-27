import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { JugadoresService } from '../../jugadores.service';

@Component({
    selector: 'app-editar-jugador-pareja',
    templateUrl: './editar-jugador-pareja.component.html',
    styleUrls: ['./editar-jugador-pareja.component.scss'],
})
export class EditarJugadorParejaComponent implements OnInit, OnDestroy {

    parejaForm: FormGroup;

    tipoAccion: any = 'Crear';

    Toast:any;

    jugadores: any = [];

    ramas: any = [];
    categorias: any = [];

    pareja: any = [];

    //filtros variables
    protected _onDestroy = new Subject<void>();
    public jugadoresFiltroCtrl: FormControl = new FormControl();
    public filteredJugadores: ReplaySubject<any[]> = new ReplaySubject<any[]>(null);

    public jugadoresFiltroDCtrl: FormControl = new FormControl();
    public filteredJugadoresD: ReplaySubject<any[]> = new ReplaySubject<any[]>(null);

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public matDialogRef: MatDialogRef<EditarJugadorParejaComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _changeDetectorRef: ChangeDetectorRef,
        private _jugadoresService: JugadoresService
    ) {
        this.parejaForm = this._formBuilder.group({
            jugador1: new FormControl({ value: '', disabled: false },Validators.required),
            jugador2: new FormControl({ value: '', disabled: false },Validators.required),
            ranking: new FormControl({ value: 0, disabled: false },[Validators.required, Validators.pattern("[0-9]*")]),
            rama: new FormControl({ value: '', disabled: false },Validators.required),
            categoria: new FormControl({ value: '', disabled: false },Validators.required),
        });

        this.Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
        });

        this.tipoAccion = data.accion;

        if(data.accion === 'Editar'){
            this.pareja = data.pareja;

            this.pareja.jugador1 = data.pareja.juagador1.id;
            this.pareja.jugador2 = data.pareja.juagador2.id;

            this.parejaForm.patchValue(this.pareja);
        }
    }

    ngOnInit() {
        // ramas
        this._jugadoresService.ramas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.ramas = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // categorias
        this._jugadoresService.categorias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.categorias = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._jugadoresService.jugadores$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.jugadores = response;
            this.filteredJugadores.next(response.slice());
            this.jugadoresFiltroCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                this.filtroBusquedaJugador(response);
            });

            this.filteredJugadoresD.next(response.slice());
            this.jugadoresFiltroDCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
                this.filtroBusquedaJugadorD(response);
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

    confirmar(){
        if(this.parejaForm.invalid){
            this.Toast.fire({
                icon: 'error',
                title: "Debe completar todos los campos antes de continuar."
            });

            this.parejaForm.markAllAsTouched();

            this._changeDetectorRef.markForCheck();

            return;
        }

        this.parejaForm.disable();

        let values = this.parejaForm.getRawValue();

        this.matDialogRef.close({id: this.pareja.id, data: values});
    }

    jugadorChange(event:any){
        let jugador2 = this.parejaForm.get('jugador2').value;

        if(jugador2 === event){
            this.parejaForm.get('jugador1').reset();
        }
    }

    jugadorDChange(event:any){
        let jugador1 = this.parejaForm.get('jugador1').value;

        if(jugador1 === event){
            this.parejaForm.get('jugador2').reset();
        }
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
                (element) => element.nombre.toLowerCase().indexOf(search) > -1
            )
        );
    }

    /**
     * Filtro de busqueda del select de marcas
     * @param data
     * @returns
     */
    protected filtroBusquedaJugadorD(data:any): void {
        if (!data) {
            return;
        }
        // get the search keyword
        let search = this.jugadoresFiltroDCtrl.value;
        if (!search) {
            this.filteredJugadoresD.next(data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the select
        this.filteredJugadoresD.next(
            data.filter(
                (element) => element.nombre.toLowerCase().indexOf(search) > -1
            )
        );
    }


    onNoClick(): void {
        this.matDialogRef.close();
    }
}
