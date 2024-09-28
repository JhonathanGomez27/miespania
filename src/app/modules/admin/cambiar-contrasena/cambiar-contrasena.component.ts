import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss'],
})
export class CambiarContrasenaComponent implements OnInit {
    contrasenaForm: FormGroup;
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data,
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<CambiarContrasenaComponent>,
    ) {}

    ngOnInit(): void {
        this.contrasenaForm = this._formBuilder.group({
          contrasenaActual: ['', [Validators.required]],
          nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
          confirmarContrasena: ['', [Validators.required]]
        });
        // }, { validator: this.checkPasswords });
      }

      // Valida que las contraseñas coincidan
    //   checkPasswords(group: FormGroup) {
    //     const pass = group.get('nuevaContrasena').value;
    //     const confirmPass = group.get('confirmarContrasena').value;

    //     return pass === confirmPass ? null : { passwordMismatch: true };
    //   }

      confirmar(): void {
        if (this.contrasenaForm.valid) {
          const nuevaContrasena = this.contrasenaForm.get('nuevaContrasena').value;
          // Aquí puedes realizar la llamada al servicio para actualizar la contraseña
          console.log('Nueva contraseña:', nuevaContrasena);
          this._matDialogRef.close(nuevaContrasena);
        }
      }

      onNoClick(): void {
        this._matDialogRef.close();
      }

}
