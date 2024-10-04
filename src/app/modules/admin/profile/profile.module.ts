import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    HttpClientModule,
    MatIconModule,          // Importar Angular Material iconos
    MatFormFieldModule,     // Importar Angular Material form fields
    MatInputModule,          // Importar Angular Material input
    NgApexchartsModule,
    MatProgressBarModule,
    MatDividerModule
  ]
})
export class ProfileModule { }
