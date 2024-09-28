import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { CambiarContrasenaComponent } from './cambiar-contrasena.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,    // Para formularios reactivos
    MatIconModule,          // Para iconos
    MatInputModule,         // Para campos de entrada (input)
    MatButtonModule,        // Para los botones
    MatDialogModule,        // Para el diálogo (modal)
    MatTooltipModule,       // Para tooltips
    MatSelectModule,        // Si usas mat-select (opcional)
    MatRadioModule  ,        // Para los radio buttons (opcional)
    MatFormFieldModule
  ],
  declarations: [
    CambiarContrasenaComponent  // Asegúrate de declarar el componente
  ]
})
export class CambiarContrasenaModule { }
