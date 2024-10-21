import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EditarJugadorParejaComponent } from '../modales/editar-jugador-pareja/editar-jugador-pareja.component';
import { JugadoresService } from '../jugadores.service';
import Swal from 'sweetalert2';
import { MatSort } from '@angular/material/sort';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-parejas',
    templateUrl: './parejas.component.html',
    styleUrls: ['./parejas.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ParejasComponent implements OnInit, OnDestroy, AfterViewInit{

    @ViewChild('tablaParejas', { read: MatSort }) tablaParejas: MatSort;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // variables tabla
    tablaParejasData: MatTableDataSource<any> = new MatTableDataSource([]);
    tablaParejasColumns: string[] = ['ranking', 'jugador1', 'jugador2', 'rama', 'categoria', 'acciones'];

    parejas: any = [];
    parejasCount:any = 0;

    pagina: number = 0;
    limit: number = environment.limit;

    buscarJugador:any = new FormControl({value: '', disabled: false});

    Toast: typeof Swal;

    filtroCategoria: any = new FormControl({ value: 'A', disabled: false });
    filtroRama: any = new FormControl({ value: 'masculina', disabled: false });

    categorias: any = [];
    ramas: any = [];
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _jugadoresService: JugadoresService
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
        this._jugadoresService.parejas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            // this.parejas = response;
            // this.parejasCount = response.length;
            // this.tablaParejasData = new MatTableDataSource(response);

            this.parejas = response.parejas;
            this.parejasCount = response.total;
            this.tablaParejasData = new MatTableDataSource(response.parejas);
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._jugadoresService.categorias$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.categorias = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._jugadoresService.ramas$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.ramas = response;
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

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.tablaParejasData.sort = this.tablaParejas;
    }

    onPageChange(event: any): void {
        let categoria = this.filtroCategoria.value;
        let rama = this.filtroRama.value;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = event.pageIndex;
        this.obtenerParejasPaginadas({page: (event.pageIndex + 1), limit: this.limit, categoria, rama});
    }

    obtenerParejasPaginadas(data:any){
        this._jugadoresService.obtenerParejasFiltroPaginado(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._jugadoresService.parejas = response.parejas;
                this.parejasCount = response.total;
                this.tablaParejasData = new MatTableDataSource(response.parejas);

                this.tablaParejasData.sort = this.tablaParejas;

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

    crearParejaDialogo(){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarJugadorParejaComponent,{
            // width: '80%'
            data: {accion: 'Crear'}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                // console.log(result);
                this.crearPareja(result.data);
            }
        });
    }

    crearPareja(data: any){
        this._jugadoresService.crearPareja(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Pareja creada con exito.'
                });

                let categoria = this.filtroCategoria.value;
                let rama = this.filtroRama.value;
                this.filtroCategoria.disable();
                this.filtroRama.disable();

                this.obtenerParejasRefresh({page: (this.pagina + 1), limit: this.limit, categoria, rama});

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }


    editarParejaDialogo(pareja:any){
        // Open the dialog
        console.log(this.parejas);
        const dialogRef = this._matDialog.open(EditarJugadorParejaComponent,{
            // width: '80%'
            data: {accion: 'Editar', pareja}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.editarPareja(result.id, result.data);
            }
        });
    }

    editarPareja(id:any, data:any){
        this._jugadoresService.editarPareja(id, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Pareja editada con exito.'
                });
                let categoria = this.filtroCategoria.value;
                let rama = this.filtroRama.value;
                this.filtroCategoria.disable();
                this.filtroRama.disable();

                this.obtenerParejasRefresh({page: (this.pagina + 1), limit: this.limit, categoria, rama});
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }

    obtenerParejasRefresh(data:any){
        this._jugadoresService.obtenerParejasFiltroPaginado(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._jugadoresService.parejas = response.parejas;
                this.parejas = response.parejas;
                this.parejasCount = response.total;
                this.tablaParejasData = new MatTableDataSource(response.parejas);

                this.tablaParejasData.sort = this.tablaParejas;

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

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.tablaParejasData.filter = filterValue.trim().toLowerCase();

        this.parejasCount = this.tablaParejasData.filteredData.length;

        this._changeDetectorRef.markForCheck();
    }

    onCategoriaChange(event:any){
        let categoria = event.value;
        let rama = this.filtroRama.value;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = 0;
        this.obtenerParejasPaginadas({page: 1, limit: this.limit, categoria: categoria, rama});
    }

    onRamaChange(event:any){
        let categoria = this.filtroCategoria.value;
        let rama = event.value;
        this.filtroCategoria.disable();
        this.filtroRama.disable();

        this.pagina = 0;
        this.obtenerParejasPaginadas({page: 1, limit: this.limit, categoria, rama});
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
