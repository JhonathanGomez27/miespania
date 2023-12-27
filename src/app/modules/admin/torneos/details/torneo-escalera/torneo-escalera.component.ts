import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TorneosService } from '../../torneos.service';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { CrearTorneoComponent } from '../../modals/crear-torneo/crear-torneo.component';
import { InscribirJugadorComponent } from '../../modals/inscribir-jugador/inscribir-jugador.component';
import { VerInscritosComponent } from '../../modals/ver-inscritos/ver-inscritos.component';
import { EditarPartidoComponent } from '../../modals/editar-partido/editar-partido.component';
import { ConfirmarAccionComponent } from '../../modals/confirmar-accion/confirmar-accion.component';

@Component({
    selector: 'app-torneo-escalera',
    templateUrl: './torneo-escalera.component.html',
    styleUrls: ['./torneo-escalera.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TorneoEscaleraComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    //variables torneos
    torneo: any = {};

    //variables grupos
    cantGrupos: number = 0;
    grupos: any = [];
    grupoSeleccionado: any = '';

    // variables tabla
    tablaJugadoresData: MatTableDataSource<any> = new MatTableDataSource([]);
    tablaJugadoresColumns: string[] = ['JugadorU', 'jugadorD', 'etapa', 'acciones'];
    Toast: any;

    inscritos: any = [];
    partidos: any = [];
    modalidadTorneo: string = '';

    // Partidos fases
    faseGrupos: any = [];
    faseOctavos: any = [];
    faseCuartos: any = [];
    faseSemifinal: any = [];
    faseFinal: any = [];

    etapa: string = 'grupos';
    etapaControl:any = new FormControl({value: '', disabled: false});

    tipoJugador: string = '';
    tipoJugador2: string = '';
    buscarJugador:any = new FormControl({value: '', disabled: false});

    mensajePartidos:string = '¡No hay partidos para mostrar!';

    disableButtons: boolean = false;

    //jornadas variables
    jornadas: any = [];
    jornadaControl:any = new FormControl({value: '', disabled: true});
    tipoJornada: any = '';

    // Validadores
    showTabla: boolean = false;
    showInicial: boolean = false;
    showSorteo: boolean = false;
    showProgramacion: boolean = false;
    showEnProceso: boolean = false;
    showFinalizado: boolean = false;

    partidosJornadas:any = {};

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _matDialog: MatDialog,
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

    ngOnInit() {
        this._torneoService.torneo$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.torneo = response;
            this.cantGrupos = response.cantidad_grupos;

            this.determinarTorneo();

            this.verificarDataPartidos();

            this.mostrarBotones();

            // this.obtenerJornadasPorTorneo();

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._torneoService.grupos$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.grupos = response;
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this._torneoService.inscritosTorneo$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
            this.inscritos = response;
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

    determinarTorneo(){
        if(this.torneo.modalidad === 'singles'){
            this.tipoJugador = 'jugador1';
            this.tipoJugador2 = 'jugador2';
            this.modalidadTorneo = 'jugador';
        }else{
            this.tipoJugador = 'pareja1';
            this.tipoJugador2 = 'pareja2';
            this.modalidadTorneo = 'pareja';
        }
    }

    verificarDataPartidos(){
        if(this.torneo.estado === 'En Proceso' || this.torneo.estado === 'Finalizado'){

            this.obtenerJornadasPorTorneo();
        }
    }

    mostrarBotones(){
        switch (this.torneo.estado) {
            case 'Inicial':
                this.showInicial = true;
                break;
            case 'Sorteo':
                this.showSorteo = true;
                this.showProgramacion = true;
                break;
            case 'Programacion':
                this.showProgramacion = true;
                break;
            case 'En Proceso':
                this.showEnProceso = true;
                break;
            case 'Finalizado':
                this.showFinalizado = true;
                break;
            default:
                break;
        }
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods torneo
    // -----------------------------------------------------------------------------------------------------

    editarTorneoDialogo(){
        // Open the dialog
        const dialogRef = this._matDialog.open(CrearTorneoComponent,{
            // width: '80%'
            data: {accion: 'Editar', torneo: this.torneo}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.editarTorneo(result);
            }
        });
    }

    editarTorneo(data:any){
        this._torneoService.editarTorneo(this.torneo.id, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Torneo editado con exito.'
                });

                this.actualizarDataTorneo();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    actualizarDataTorneo(){
        this._torneoService.obtenerTorneoByIdRefresh(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.torneo = response;
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    obtenerGruposRefresh(){
        this._torneoService.obtenerGruposRefresh(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.grupos = response;

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods inscritos jugadores
    // -----------------------------------------------------------------------------------------------------

    verInscritosModal(){
        // Open the dialog
        const dialogRef = this._matDialog.open(VerInscritosComponent,{
            // width: '80%'
            data: {accion: 'Crear', inscritos: this.inscritos, tipojuego: this.modalidadTorneo, torneo: this.torneo}
        });

        dialogRef.afterClosed().subscribe((result) => {

        });
    }

    inscribirJugadorModal(){
        // Open the dialog
        const dialogRef = this._matDialog.open(InscribirJugadorComponent,{
            // width: '80%'
            data: {accion: 'Crear', tipojuego: this.modalidadTorneo, torneo: this.torneo, inscritos: this.inscritos}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.disableButtons = true;
                if(this.torneo.modalidad === 'singles'){
                    this.inscribirJugador(result, this.torneo.id);
                }else{
                    this.inscribirPareja(result, this.torneo.id);
                }
            }
        });
    }

    inscribirJugador(jugador: any, torneo:any){
        this._torneoService.inscribirJugador({jugador, torneo}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'El jugador ha sido inscrito al torneo con exito.'
                });

                this.disableButtons = false;

                this.obtenerInscritosTorneo();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.disableButtons = false;
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    inscribirPareja(pareja: any, torneo:any){
        this._torneoService.inscribirPareja({pareja, torneo}).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'La pareja ha sido inscrita al torneo con exito.'
                });

                this.disableButtons = false;

                this.obtenerInscritosTorneo();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.disableButtons = false;
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    obtenerInscritosTorneo(){
        this._torneoService.obtenerInscritosTorneo(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this._torneoService.inscritos = response;
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods partidos
    // -----------------------------------------------------------------------------------------------------

    etapaChange(event:any){
        this.showTabla = false;

        switch (event) {
            case 'grupos':
                this.tablaJugadoresData = new MatTableDataSource([]);
                this.mensajePartidos = 'Selecciona un grupo para ver los partidos.';
                break;
            case 'octavos':
                if(this.faseOctavos.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseOctavos);
                    this.showTabla = true;
                }
                break;
            case 'cuartos':
                if(this.faseCuartos.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseCuartos);
                    this.showTabla = true;
                }
                break;
            case 'semifinales':
                if(this.faseSemifinal.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseSemifinal);
                    this.showTabla = true;
                }
                break;
            case 'final':
                if(this.faseFinal.length === 0){
                    this.mensajePartidos = 'No hay partidos para esta fase.';
                }else{
                    this.tablaJugadoresData = new MatTableDataSource(this.faseFinal);
                    this.showTabla = true;
                }
                break;
            default:
                break;
        }

        this.etapa = event;
    }

    obtenerPartidosTorneo(id:any, actualizar?:any){
        this._torneoService.obtenerPartidosTorneo(id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.partidos = response;

                this.tablaJugadoresData = new MatTableDataSource([]);
                this.faseGrupos = [];
                this.partidosJornadas = {};
                this.faseOctavos = [];
                this.faseCuartos = [];
                this.faseSemifinal = [];
                this.faseFinal = [];

                if(actualizar){
                    this.ordenarPartidosActualizarPartido();
                }else{
                    this.ordenarPartidosEscalera();
                }

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    ordenarPartidosActualizarPartido(){
        let grupos: any = {};
        this.grupos.forEach(grupo => {
            grupos[grupo.nombre_grupo] = [];
        });

        this.partidos.forEach(partido => {
            if(partido.fase === 'grupos'){
                if(partido?.grupo?.id){
                    grupos[partido.grupo.nombre_grupo].push(partido);
                }
            }

            if(partido.fase === 'octavos'){
                this.faseOctavos.push(partido);
            }

            if(partido.fase === 'cuartos'){
                this.faseCuartos.push(partido);
            }

            if(partido.fase === 'semifinales'){
                this.faseSemifinal.push(partido);
            }

            if(partido.fase === 'final'){
                this.faseFinal.push(partido);
            }
        });

        this.faseGrupos = grupos;

        this.ordenarJornadas();

        if(this.etapaControl === 'grupos'){
            if(this.tipoJornada === 'Cruzada'){
                this.showTabla = true;
                this.tablaJugadoresData = new MatTableDataSource(this.partidosJornadas[this.jornadaControl.value]);
            }else{
                this.seleccionarGrupoPartidos(this.grupoSeleccionado);
            }
        }
    }

    editarPartido(partido:any){
        // Open the dialog
        const dialogRef = this._matDialog.open(EditarPartidoComponent,{
            // width: '80%',
            data: {sets: this.torneo.configuracion_sets[this.etapa], partido, etapa: this.etapa, modalidad: this.torneo.modalidad, tipoJugador1: this.tipoJugador, tipoJugador2: this.tipoJugador2, faseActual: this.torneo.fase_actual, estado: this.torneo.estado}
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result !== undefined){
                this.actualizarResultado(partido.id, result, partido.fase);
            }
        });
    }

    actualizarResultado(idPartido: any, data: any, fase?:any){
        this._torneoService.actualizarPartido(idPartido, data).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Partido actualizado con exito',
                });

                this.obtenerPartidosTorneo(this.torneo.id, true);

                this.obtenerGruposRefresh();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    seleccionarGrupoPartidos(grupo:any){
        if(this.tipoJornada === 'Cruzada'){
            return;
        }

        if(this.etapaControl.value === 'grupos' && this.jornadaControl.value === ''){
            this.showTabla = false;

            this.tablaJugadoresData = new MatTableDataSource([]);

            this.mensajePartidos = 'Selecciona una jornada.'
        }

        if(this.etapaControl.value === 'grupos' && this.jornadaControl.value !== ''){
            this.tablaJugadoresData = new MatTableDataSource([]);

            this.grupoSeleccionado = grupo;
            let jornada = this.jornadaControl.value;
            let partidos: any = [];
            this.faseGrupos[this.grupoSeleccionado].forEach(element => {
                if(element.jornada.id === jornada){
                    partidos.push(element);
                }
            });
            this.tablaJugadoresData = new MatTableDataSource(partidos);

            this.showTabla = true;


            this.mensajePartidos = 'Selecciona una jornada.'
        }

        this._changeDetectorRef.markForCheck();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods cambiar programacion torneo
    // -----------------------------------------------------------------------------------------------------

    cambiarTorneoAprogramacionDialog(){
        if(!this.grupos.length){
            this.Toast.fire({
                icon: 'error',
                title: 'No se puede programar partidos de la fase de grupos si no hay grupos.'
            });

            return;
        }

        // this.grupos.splice(index, 1);
        // Open the dialog
        const dialogRef = this._matDialog.open(ConfirmarAccionComponent,{
            // width: '80%'
            data: {mensaje: '¿Estás seguro que deseas programar la fase de grupos del torneo? Luego de esta accion no puedes volver a editar los grupos.'},
        });

        dialogRef.afterClosed().subscribe((result) => {
            if(result === true){
                if(this.torneo.estado === 'Programacion'){
                    this.programarPartidos();
                }else{
                    this.cambiarTorneoAProgramacion();
                }
            }
        });
    }

    cambiarTorneoAProgramacion(){
        this._torneoService.cambiarTorneoAProgramacion(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.programarPartidos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    programarPartidos(){
        this._torneoService.programarPartidosFase(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Se ha sorteado con exito la fase de grupos.'
                });

                this.actualizarDataTorneo();

                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    sortearSiguienteFaseTorneo(){
        this._torneoService.sortearSiguienteFase(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Siguiente fase sorteada con exito'
                });

                this.actualizarDataTorneo();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }


    finalizarTorneo(){
        this._torneoService.sortearSiguienteFase(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: `Torneo Finalizado, Felicitaciones ${response.ganador} `
                });

                this.actualizarDataTorneo();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods jornadas
    // -----------------------------------------------------------------------------------------------------

    obtenerJornadasPorTorneo(){
        this._torneoService.obtenerJornadasPorTorneo(this.torneo.id).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.jornadas = response.jornadas;
                this.jornadaControl.enable();

                this.obtenerPartidosTorneo(this.torneo.id, false);
                this._changeDetectorRef.markForCheck();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    ordenarJornadas(){
        let partidosJornadas: any = {};
        this.jornadas.forEach(jornada => {
            partidosJornadas[jornada.id] = [];
            this.partidos.forEach(partido => {
                if(partido.jornada.id === jornada.id){
                    partidosJornadas[jornada.id].push(partido);
                }
            });
        });

        this.partidosJornadas = partidosJornadas;
    }

    ordenarPartidosEscalera(){
        let grupos: any = {};
        this.grupos.forEach(grupo => {
            grupos[grupo.nombre_grupo] = [];
        });

        this.partidos.forEach(partido => {
            if(partido.fase === 'grupos'){
                if(partido?.grupo?.id){
                    grupos[partido.grupo.nombre_grupo].push(partido);
                }
            }

            if(partido.fase === 'octavos'){
                this.faseOctavos.push(partido);
            }

            if(partido.fase === 'cuartos'){
                this.faseCuartos.push(partido);
            }

            if(partido.fase === 'semifinales'){
                this.faseSemifinal.push(partido);
            }

            if(partido.fase === 'final'){
                this.faseFinal.push(partido);
            }
        });

        this.faseGrupos = grupos;

        this.etapaControl.enable();
        this.etapaControl.setValue(this.torneo.fase_actual);

        this.ordenarJornadas();

        if(this.torneo.fase_actual === 'grupos'){
            this.mensajePartidos = 'Selecciona un grupo y una jornada para ver los partidos.';
        }

    }

    jornadaChange(event:any, value:any){
        this.tipoJornada = value.split(' ')[1];
        if(this.tipoJornada === 'Regular'){
            if(this.grupoSeleccionado === ''){
                this.mensajePartidos = 'Selecciona un grupo para ver los partidos de la jornada.'
            }else{
                let partidos: any = [];
                this.faseGrupos[this.grupoSeleccionado].forEach(element => {
                    if(element.jornada.id === event){
                        partidos.push(element);
                    }
                });
                this.tablaJugadoresData = new MatTableDataSource(partidos);
            }
        }else{
            this.showTabla = true;
            this.tablaJugadoresData = new MatTableDataSource(this.partidosJornadas[event]);
        }
        this._changeDetectorRef.markForCheck();
    }

    programarPartidosJornada(){
        if(this.jornadaControl.value === ''){
            return;
        }

        this._torneoService.programarPartidosjornada(this.torneo.id, this.jornadaControl.value).pipe(takeUntil(this._unsubscribeAll)).subscribe(
            (response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Jornada programada con exito.'
                });

                this.verificarDataPartidos();
            },(error) => {
                this.Toast.fire({
                    icon: 'error',
                    title: error.error.mensaje
                });
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods adicionales
    // -----------------------------------------------------------------------------------------------------

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
