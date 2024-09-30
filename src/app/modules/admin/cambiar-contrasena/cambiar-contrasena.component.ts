import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CambiarContrasenaService } from './cambiar-contrasena.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cambiar-contrasena',
    templateUrl: './cambiar-contrasena.component.html',
    styleUrls: ['./cambiar-contrasena.component.scss'],
})
export class CambiarContrasenaComponent implements OnInit {
    contrasenaForm: FormGroup;
    usrId: number;
    Toast: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data,
        private _formBuilder: FormBuilder,
        private _matDialogRef: MatDialogRef<CambiarContrasenaComponent>,
        private cambiarContrasenaService: CambiarContrasenaService
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
        // Obtener el ID del usuario desde el token
        const token = AuthUtils._decodeToken(
            localStorage.getItem('accessToken')
        );
        console.log('Token decodificado:', token); // Verifica el contenido del token
        this.usrId = token?.id;

        // Inicializar el formulario con el validador personalizado
        this.contrasenaForm = this._formBuilder.group(
            {
                contrasenaActual: ['', Validators.required],
                nuevaContrasena: [
                    '',
                    [Validators.required, Validators.minLength(6)],
                ],
                confirmarContrasena: ['', Validators.required],
            },
            {
                validator: this.passwordMatchValidator,
            }
        );
    }

    // Validador personalizado para verificar que las contraseñas coincidan
    passwordMatchValidator(form: FormGroup) {
        return form.get('nuevaContrasena').value ===
            form.get('confirmarContrasena').value
            ? null
            : { passwordMismatch: true };
    }

    confirmar(): void {
        if (this.contrasenaForm.valid) {
            const contrasenaActual =
                this.contrasenaForm.get('contrasenaActual')?.value;
            const nuevaContrasena =
                this.contrasenaForm.get('nuevaContrasena')?.value;

            this.cambiarContrasenaService
                .actualizarContrasena(
                    this.usrId,
                    nuevaContrasena,
                    contrasenaActual
                )
                .subscribe(
                    (response) => {
                        this.Toast.fire({
                            icon: 'success',
                            title: 'Contraseña actualizada exitosamente',
                        });
                        this._matDialogRef.close();
                        console.log(
                            'Contraseña actualizada exitosamente',
                            response
                        );
                    },
                    (error) => {
                        this.Toast.fire({
                            icon: 'error',
                            title: error.error.message,
                        });
                        console.error(
                            'Error actualizando la contraseña',
                            error
                        );
                    }
                );
        } else {
            console.log('Formulario inválido o las contraseñas no coinciden');
        }
    }

    onNoClick(): void {
        this._matDialogRef.close();
    }
}