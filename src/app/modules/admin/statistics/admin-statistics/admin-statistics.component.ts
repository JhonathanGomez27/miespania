import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { StatisticsService } from '../statistics.service';
import { Subject, takeUntil } from 'rxjs';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip
} from "ng-apexcharts";

type ApexXAxis = {
  type?: "category" | "datetime" | "numeric";
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle
};

@Component({
  selector: 'app-admin-statistics',
  templateUrl: './admin-statistics.component.html'
})
export class AdminStatisticsComponent implements OnInit {
  @ViewChild("chartTypes") chartTypes: ChartComponent;
  @ViewChild("chartStatus") chartStatus: ChartComponent;
  @ViewChild("chartPhases") chartPhases: ChartComponent;
  @ViewChild("chartHighestPlayerPoints") chartHighestPlayerPoints: ChartComponent;
  @ViewChild("chartPlayersMoreTournaments") chartPlayersMoreTournaments: ChartComponent;


  public chartOptionsType: Partial<ChartOptions>;
  public chartOptionsStatus: Partial<ChartOptions>;
  public chartOptionsPhases: Partial<ChartOptions>;
  public chartOptionsHighestPlayerPoints: Partial<ChartOptions>;
  public chartOptionsPlayersMoreTournaments: Partial<ChartOptions>;


  statistics:any = [];
  typeTournaments: any[] = [];
  statusTournaments: any[] = [];
  phasesTournaments: any[] = [];
  playersMostPoints:any[] = [];
  playersMostWinners:any[] = [];
  points: any[] = [];
  tournaments:any[] = [];
  predefinedColors = [
    "#008FFB", "#00E396", "#FEB019", "#FF4560", 
    "#775DD0", "#546E7A", "#26a69a", "#D10CE8"
  ];

  constructor(private _statisticsService:StatisticsService,
    private _changeDetectorRef: ChangeDetectorRef
  ) { }
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this._statisticsService.statistics$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
      this.statistics = response;
      console.log(this.statistics);
      this.organizeTournaments();
      this.setChartDataForAll();
      this._changeDetectorRef.markForCheck();
    });
  }

  setChartDataForAll() {
    const categoriesType = [
      ["Torneos", "Regular"],
      ["Torneos", "Escalera"],
      ["Torneos", "Singles"],
      ["Torneos", "Dobles"],
    ];
    const categoriesPhases = [
      ["Fase", "Grupos"],
      ["Fase", "Octavos"],
      ["Fase", "Cuartos"],
      ["Fase", "Semifinal"],
      ["Fase", "Final"],
    ];
    const categoriesStatus = ["Inicial","Sorteo","En Programcion","En Proceso", "Finalizado"];
    

    // Load Charts //
    this.chartOptionsType = this.getChartOptions(
      "Distribución por Tipo de Torneos", 
      this.typeTournaments.map(entry => entry[1]),
      categoriesType

    );
    this.chartOptionsStatus = this.getChartOptions(
      "Distribución por Estado de Torneos", 
      this.statusTournaments.map(entry => entry[1]),
      categoriesStatus
    );
    this.chartOptionsPhases = this.getChartOptions(
      "Distribución por Fases de Torneos", 
      this.phasesTournaments.map(entry => entry[1]),
      categoriesPhases
    );
    this.chartOptionsHighestPlayerPoints = this.getChartOptions(
      "Distribucion por Jugadores Mayor Puntaje",
      this.points,
      this.playersMostPoints
    )
    this.chartOptionsPlayersMoreTournaments = this.getChartOptions(
      "Top 5 Jugadores con mas Torneos Ganados",
      this.tournaments,
      this.playersMostWinners
    )
  }

  getChartOptions(title: string, dataArray: any[], categories:any[]):Partial<ChartOptions> {
    const colors = this.getColors(this.predefinedColors, categories.length);
  
    return {
      series: [
        {
          data: dataArray
        }
      ],
      chart: {
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {
            console.log(chart, w, e);
          }
        }
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      title: {
        text: title,
        align: "center",
        margin: 5
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: colors,
            fontSize: "12px"
          }
        }
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: function (value) {
            return Math.round(value).toString();
          }
        }
      },
      tooltip: {
        shared: false,
        intersect: true,
        y: {
          formatter: function (val, { dataPointIndex }) {
            return `${categories[dataPointIndex]}: ${val}`; // Muestra solo la categoría y el valor
          }
        }
      }
    };
  }


  organizeTournaments() {
    const stats = Object.entries(this.statistics.stats);
    // Ordenar las entradas según tu criterio (clave en orden descendente)
    const sortedStats = stats.sort((a: any, b: any) => b[0] - a[0]);
  
    // Dividir el array en las tres categorías
    this.typeTournaments = sortedStats.slice(0, 4);    // Posición 0 a 3
    this.statusTournaments = sortedStats.slice(4, 9);  // Posición 4 a 8
    this.phasesTournaments = sortedStats.slice(9, 14); // Posición 9 a 13

    // Highest Player Points //
    this.playersMostPoints = this.statistics.jugadoresMayorPuntaje.map(jugador => jugador.nombre_a_mostrar);
    this.points = this.statistics.jugadoresMayorPuntaje.map(jugador => jugador.puntos);

    // Highest Player Points //
    this.playersMostWinners = this.statistics.top5JugadoresConMasTorneosGanados.map(jugador => jugador.jugador_nombre_a_mostrar);
    this.tournaments = this.statistics.top5JugadoresConMasTorneosGanados.map(torneos => torneos.torneosGanados);
  }

  // Generar una lista de colores únicos
  getColors(predefinedColors: string[], totalCategories: number): string[] {
    const colors = [...predefinedColors];
  
    while (colors.length < totalCategories) {
      const newColor = this.generateRandomColor();
      if (!colors.includes(newColor)) {
        colors.push(newColor);
      }
    }
    return colors;
  }
  
  // Genera un color aleatorio en formato hexadecimal
  generateRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }


  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
