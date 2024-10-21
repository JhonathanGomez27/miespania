import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexXAxis, ApexPlotOptions, ApexLegend, ApexNonAxisChartSeries, ApexResponsive, ApexTitleSubtitle } from "ng-apexcharts";
import { StatisticsService } from './statistics.service';
export type ChartBarOptions = {
    series: ApexAxisChartSeries,
    chart: ApexChart,
    dataLabels: ApexDataLabels,
    plotOptions: ApexPlotOptions,
    colors: string[],
    legend: ApexLegend,
    title: ApexTitleSubtitle;
    xaxis: ApexXAxis,
  };

  export type ChartDonutOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    dataLabels: ApexDataLabels,
    colors: string[],
    legend: ApexLegend,
    plotOptions: ApexPlotOptions,
    title: ApexTitleSubtitle
  };
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
    public chartBarOptions: Partial<ChartBarOptions>;
    public chartDonutOptions: Partial<ChartDonutOptions>;
    statistics: any = {};
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild("chartBar") chartBar: ChartComponent;
    @ViewChild("chartDonut") chartDonut: ChartComponent;

    constructor(
      private _statisticsService: StatisticsService,
      private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
      this._statisticsService.statistics$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
        this.statistics = response;
        this.setChartData();
        this._changeDetectorRef.markForCheck();
      });
    }

    setChartData(): void {
      const dataSingles  = this.statistics.partidosGanadosSingles || 0;
      const dataParejas = this.statistics.partidosPerdidosPareja || 0;

      // Chart Donut
      this.chartDonutOptions = {
        series: [dataSingles, dataParejas],
        chart: {
          type: "donut"
        },
        labels: ["Torneo Singles", "Torneo Pareja"],
        responsive: [
          {
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total',
                  fontSize: '16px',
                  fontWeight: 600,
                  formatter: () => {
                    return this.chartDonutOptions.series
                      .reduce((a, b) => a + b, 0)
                      .toString();
                  }
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: true
        },
        colors: ["#FFD484", "#C4592F"],
        legend: {
          position: "bottom"
        },
        title: {
          text: "Puntos por Modalidad",
          align: "center",
          margin: 5
        },
      };
    }

    ngOnDestroy(): void {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
    }
  }
