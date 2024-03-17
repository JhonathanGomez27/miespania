import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { EditarJugadorSingleComponent } from '../modales/editar-jugador-single/editar-jugador-single.component';
import { JugadoresService } from '../jugadores.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-singles',
    templateUrl: './singles.component.html',
    styleUrls: ['./singles.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SinglesComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('tablaJugadores', { read: MatSort }) tablaJugadores: MatSort;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // variables tabla
    tablaTorneosData: MatTableDataSource<any> = new MatTableDataSource([]);
    tablaTorneosColumns: string[] = [
        'ranking',
        'nombre',
        'rama',
        'categoria',
        'acciones',
    ];

    jugadores: any = [];
    jugadoresCount: any = 0;

    pagina: number = 0;
    limit: number = environment.limit;

    buscarJugador: any = new FormControl({ value: '', disabled: false });
    filtroCategoria: any = new FormControl({ value: '', disabled: false });
    filtroRama: any = new FormControl({ value: '', disabled: false });
    Toast: any;

    categorias: any = [];
    ramas: any = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _jugadoreService: JugadoresService
    ) {
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
    }

    ngOnInit(): void {
        this._jugadoreService.jugadoresList$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            // this.jugadores = response;
            // this.jugadoresCount = response.length;
            // this.tablaTorneosData = new MatTableDataSource(response);

            this.jugadores = response.jugadores;
            this.jugadoresCount = response.total;
            this.tablaTorneosData = new MatTableDataSource(response.jugadores);
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._jugadoreService.categorias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.categorias = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._jugadoreService.ramas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.ramas = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this.buscarJugador.valueChanges.pipe( debounceTime(1000) ).subscribe(
            value => {
                this.onBuscarChange(value)
            }
        )
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.tablaTorneosData.sort = this.tablaJugadores;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onPageChange(event: any): void {
        // console.log({page: (event.pageIndex + 1)});
        let categoria = this.filtroCategoria.value;
        let rama = this.filtroRama.value;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = event.pageIndex;
        this.obtenerJugadorePaginado({page: (event.pageIndex + 1), limit: this.limit, categoria, rama});
    }

    obtenerJugadorePaginado(data: any){
        this._jugadoreService.obtenerJugadoresFiltroPaginado(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._jugadoreService.jugadoresList = response.jugadores;
                this.jugadoresCount = response.total;
                this.tablaTorneosData = new MatTableDataSource(response.jugadores);

                this.tablaTorneosData.sort = this.tablaJugadores;

                this.filtroCategoria.enable();
                this.filtroRama.enable();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });

                this.filtroCategoria.enable();
                this.filtroRama.enable();
            }
        );
    }

    crearJugadorDialogo(){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarJugadorSingleComponent, {
            // width: '80%'
            data: { editar: false, title: 'Crear' },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                // console.log(result);
                let data = {
                    ...result,
                    correo: null,
                    contrasena: null
                }
                this.crearJugador(result);
            }
        });
    }

    crearJugador(data:any){
        this._jugadoreService.crearjugador(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Jugador creado con exito'
                });
                let categoria = this.filtroCategoria.value;
                let rama = this.filtroRama.value;
                this.filtroCategoria.disable();
                this.filtroRama.disable();
                this.obtenerJugadoresRefresh({page: (this.pagina + 1), limit: this.limit, categoria, rama});
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }

    editarJugador(jugador: any) {
        this.obtenerJugadorPorId(jugador.id);
    }

    editarJugadorPorId(data: any) {
        this._jugadoreService.editarJugadorPorId(data.id, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response: any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'El jugador ha sido editado con exito',
                });
                let categoria = this.filtroCategoria.value;
                let rama = this.filtroRama.value;
                this.filtroCategoria.disable();
                this.filtroRama.disable();
                this.obtenerJugadoresRefresh({page: (this.pagina + 1), limit: this.limit, categoria, rama});
            },
            (error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message,
                });
            }
        );
    }

    obtenerJugadoresRefresh(data:any) {
        this._jugadoreService.obtenerJugadoresFiltroPaginado(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response: any) => {
                this._jugadoreService.jugadores = response.jugadores;
                this.jugadoresCount = response.total;
                this.tablaTorneosData = new MatTableDataSource(response.jugadores);

                this.tablaTorneosData.sort = this.tablaJugadores;

                this.filtroCategoria.enable();
                this.filtroRama.enable();

                this._changeDetectorRef.markForCheck();
            },
            (error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message,
                });

                this.filtroCategoria.enable();
                this.filtroRama.enable();
            }
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.tablaTorneosData.filter = filterValue.trim().toLowerCase();

        this.jugadoresCount = this.tablaTorneosData.filteredData.length;

        this._changeDetectorRef.markForCheck();
    }

    onCategoriaChange(event:any){
        let categoria = event.value;
        let rama = this.filtroRama.value;
        let nombre = this.buscarJugador.value;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = 0;
        this.obtenerJugadorePaginado({page: 1, limit: this.limit, categoria, rama, nombre});
    }

    onRamaChange(event:any){
        let categoria = this.filtroCategoria.value;
        let rama = event.value;
        let nombre = this.buscarJugador.value;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = 0;
        this.obtenerJugadorePaginado({page: 1, limit: this.limit, categoria, rama, nombre});
    }

    onBuscarChange(event:any){
        // console.log("object");
        let categoria = this.filtroCategoria.value;
        let rama = this.filtroRama.value;
        let nombre = event;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = 0;
        this.obtenerJugadorePaginado({page: 1, limit: this.limit, categoria, rama, nombre});
    }

    obtenerJugadorPorId(id:any){
        this._jugadoreService.obtenerJugadorPorId(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                delete response.nombre;
                const jugador = {...response, ...response.userid}
                // Open the dialog
                const dialogRef = this._matDialog.open(EditarJugadorSingleComponent, {
                    // width: '80%'
                    data: { jugador, editar: true, title: 'Editar' },
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if (result !== undefined) {

                        this.editarJugadorPorId(result);
                    }
                });
            },(error) => {
                console.log(error);
            }
        );
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
