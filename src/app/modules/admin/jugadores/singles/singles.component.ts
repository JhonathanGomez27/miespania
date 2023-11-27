import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EditarJugadorSingleComponent } from '../modales/editar-jugador-single/editar-jugador-single.component';
import { JugadoresService } from '../jugadores.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-singles',
    templateUrl: './singles.component.html',
    styleUrls: ['./singles.component.scss'],
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

    Toast: any;

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
        this._jugadoreService.jugadores$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            // this.jugadores = response;
            // this.jugadoresCount = response.length;
            // this.tablaTorneosData = new MatTableDataSource(response);

            this.jugadores = response.jugadores;
            this.jugadoresCount = response.total;
            this.tablaTorneosData = new MatTableDataSource(response.jugadores);
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
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
        this.pagina = event.pageIndex;
        this.obtenerJugadorePaginado({page: (event.pageIndex + 1), limit: this.limit});
    }

    obtenerJugadorePaginado(data: any){
        this._jugadoreService.obtenerJugadoresFiltroPaginado(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._jugadoreService.jugadores = response.jugadores;
                this.jugadoresCount = response.total;
                this.tablaTorneosData = new MatTableDataSource(response.jugadores);

                this.tablaTorneosData.sort = this.tablaJugadores;
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }

    editarJugador(jugador: any) {
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarJugadorSingleComponent, {
            // width: '80%'
            data: { jugador },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.editarJugadorPorId(result);
            }
        });
    }

    editarJugadorPorId(data: any) {
        this._jugadoreService.editarJugadorPorId(data.id, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response: any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'El jugador ha sido editado con exito',
                });

                this.obtenerJugadoresRefresh();
            },
            (error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message,
                });
            }
        );
    }

    obtenerJugadoresRefresh() {
        this._jugadoreService.obtenerJugadoresRefresh().pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response: any) => {
                this._jugadoreService.jugadores = response;
                this.jugadoresCount = response.length;
                this.tablaTorneosData = new MatTableDataSource(response);

                this.tablaTorneosData.sort = this.tablaJugadores;

                this._changeDetectorRef.markForCheck();
            },
            (error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message,
                });
            }
        );
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.tablaTorneosData.filter = filterValue.trim().toLowerCase();

        this.jugadoresCount = this.tablaTorneosData.filteredData.length;

        this._changeDetectorRef.markForCheck();
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
