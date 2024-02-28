import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { CrearTorneoComponent } from '../modals/crear-torneo/crear-torneo.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TorneosService } from '../torneos.service';
import Swal from 'sweetalert2';
import { ConfirmarIniciarTorneoComponent } from '../modals/confirmar-iniciar-torneo/confirmar-iniciar-torneo.component';
import { ConfirmarAccionComponent } from '../modals/confirmar-accion/confirmar-accion.component';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // variables tabla
    tablaTorneosData: MatTableDataSource<any> = new MatTableDataSource([]);
    tablaTorneosColumns: string[] = ['torneo', 'rama', 'categoria', 'estado', 'fase', 'acciones'];

    // variables torneos
    torneos: any = [];
    torneosCount:any = 0;

    pagina: any = 0;
    Toast: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _torneoService: TorneosService
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
        this._torneoService.torneos$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.torneos = response;
            this.tablaTorneosData = new MatTableDataSource(response);

            this.torneosCount = response.length;
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    crearTorneoDialogo(): void{
        // Open the dialog
        const dialogRef = this._matDialog.open(CrearTorneoComponent,{
            // width: '80%'
            data: {accion: 'Crear'}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                result.fecha_inicio = "2023-12-01T05:00:00.000Z",
                result.fecha_fin = "2023-12-10T05:00:00.000Z",
                this.crearTorneo(result);
            }
        });
    }

    crearTorneo(data: any){
        this._torneoService.crearTorneo(data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'El torneo ha sido creado con exito.'
                });

                this.obtenerTorneos();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
            }
        );
    }

    obtenerTorneos(){
        this._torneoService.obtenerTorneosRefresh().pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.torneos = response;

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.message
                });
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

    onPageChange(event: any): void {

    }

    editarTorneo(torneo:any){
        this._router.navigate(['./', torneo.id], {
            relativeTo: this._activatedRoute,
        });
    }

    iniciarTorneo(torneo: any){
        this._torneoService.obtenerInscritosTorneo(torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {

                // Open the dialog
                const dialogRef = this._matDialog.open(ConfirmarIniciarTorneoComponent,{
                    // width: '80%'
                    data: {accion: 'Confirmar', inscritos: response.length, torneo, tipoTorneo: torneo.tipo_torneo}
                });

                dialogRef.afterClosed().subscribe((result) => {
                    if(result !== undefined){
                        this.finalizarInscripciones(torneo, result.formar)
                    }
                });
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje

                });
            }
        );

        return;

    }

    finalizarInscripciones(torneo: any, formarGrupos:any){
        this._torneoService.finalizarInscripciones(torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Se han cerrado las inscripciones del torneo, ahora se realizara el sorteo de la fase de grupos.'
                });

                if(formarGrupos){
                    this.sortearGrupos(torneo);
                }
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje

                });
            }
        );
    }

    sortearGrupos(torneo:any){
        this._torneoService.sortearGrupos(torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Se ha sorteado con exito la fase de grupos.'
                });

                this.obtenerTorneos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    dialogFinalizarTorneo(torneo: any){
        // Open the dialog
        const dialogRef = this._matDialog.open(ConfirmarAccionComponent,{
            // width: '80%'
            data: {mensaje: '¿Estás seguro que quieres finalizar este torneo?'}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.finalizarTorneo(torneo)
            }
        });

    }

    finalizarTorneo(torneo:any){
        this._torneoService.sortearSiguienteFase(torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: `Torneo Finalizado, Felicitaciones ${response.ganador} `
                });

                this.obtenerTorneos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }
}
