import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module'; // Cambiar el routing module
import { StatisticsComponent } from './statistics.component'; // Cambiar el componente
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [StatisticsComponent], // Cambiar al componente de estadísticas
  imports: [
    CommonModule,
    StatisticsRoutingModule, // Cambiar el routing
    HttpClientModule,
    MatIconModule,           // Si se requieren íconos en estadísticas
    MatFormFieldModule,      // Si se requieren form fields en estadísticas
    MatInputModule,          // Si se requieren inputs en estadísticas
    NgApexchartsModule,      // Para gráficos (si lo usas en statistics)
    MatProgressBarModule,
    MatDividerModule,
    SharedModule
  ]
})
export class StatisticsModule { }
