import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { UserService } from 'app/core/user/user.service';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
//   styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any;
  @ViewChild('imageUrlInput') private _imageUrlInput: ElementRef;
  @ViewChild("chartBar") chartBar: ChartComponent;
  @ViewChild("chartDonut") chartDonut: ChartComponent;

  public chartBarOptions: Partial<ChartBarOptions>;
  public chartDonutOptions: Partial<ChartDonutOptions>;

  Toast:any;

  user: any = {};
  constructor(
    private _profileService: ProfileService,
    private _changeDetectorRef:ChangeDetectorRef,
    private _userService: UserService
  ) {

    // Alert //
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

    // Chart Donut
    this.chartDonutOptions = {
      series: [100, 430],
      chart: {
        type: "donut"
      },
      labels: ["Torneo Singles", "Torneo Duplex"],
      responsive: [
        {
        //   breakpoint: 480,
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
                color: '#000', // Personaliza el color del texto en el centro
                formatter: () => {
                  // Calcula y retorna la suma de los valores de la serie
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
        text: "Porcentajes y Total",
        align: "center",
        margin: 5,
        floating: false
      },
    };
  }
  urlImg: any = null;
  file: File = null;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this._profileService.getUserData().subscribe(
      (data) => {
        this.profileData = data;
        if (this.profileData.imagen_perfil) {
          this.urlImg = `${environment.imageUrl}${this.profileData.imagen_perfil.id}`;
        //   console.log(this.urlImg);
        }
        // console.log(this.profileData);  // Puedes eliminar esto después de verificar que la data llega bien
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
        this.user = response;
        this._changeDetectorRef.markForCheck();
    });
  }

  uploadImageToUser(id_user: string, file: File): void {
    if(!file){
        return;
    }
    // console.log(file[0]);

    this._profileService.uploadImageToUser(id_user, file[0]).pipe(takeUntil(this._unsubscribeAll)).subscribe({
        next: (response: any) => {
            // console.log(response);
            this.Toast.fire({
                icon: 'success',
                title: `Imagen subida correctamente`,
            });
            this.profileData.imagen_perfil = response ? response : null;
            this.urlImg = `${environment.imageUrl}${this.profileData.imagen_perfil.id}`;
            // this._userService.updateImageProfile(response.imagen_perfil);
            this.user.imagen_perfil = response;
            this._userService.user = this.user;

            this._changeDetectorRef.markForCheck();
        },
        error: (error) => {
          this.Toast.fire({
              icon: 'error',
              title: `Error: ${error.error.message}`,
          });
          this._changeDetectorRef.markForCheck();
        },
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  removeImage(): void {
    if(!this.file){

        this.file = null;
        this.urlImg = null;

        this._changeDetectorRef.markForCheck();

        return;
    }

    const image_id = this.profileData.imagen_perfil.id;

    this.deleteImageUser(image_id);
}

deleteImageUser(image_id: string): void {
    this._profileService.deleteImageUser(image_id).pipe(takeUntil(this._unsubscribeAll)).subscribe({
        next: (response: any) => {
            this.Toast.fire({
                icon: 'success',
                title: 'Imagen eliminada correctamente',
            });
            this.profileData.imagen_perfil = null;
            // Set the file input value as null
            this._imageUrlInput.nativeElement.value = null;

            this.urlImg = null;

            this.file = null;

            this._changeDetectorRef.markForCheck();
        },
        error: (error) => {
            this.Toast.fire({
                icon: 'error',
                title: `Error: ${error.error.message}`,
            });
            this._changeDetectorRef.markForCheck();
        }
    });
}

}
