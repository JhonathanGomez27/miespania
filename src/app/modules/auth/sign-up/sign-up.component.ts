import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;


    signUpForm: FormGroup;
    Toast: any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
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

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                nombre      : ['', Validators.required],
                apellido    : ['',Validators.required],
                nombre_a_mostrar  : ['', Validators.required],
                correo     : ['', [Validators.required, Validators.email]],
                contrasena  : ['', Validators.required],
                rama   : [''],
                agreements: ['', Validators.requiredTrue]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.signUpForm.invalid )
        {
            console.log(this.signUpForm.value);
            this.Toast.fire({
                icon: 'error',
                title: 'Verifique los campos requeridos',
            });
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert

        // Sign up
        this._authService.signUp(this.signUpForm.value)
        .subscribe({
            next:(response:any) => {
                this.Toast.fire({
                    icon: 'success',
                    title: 'Usuario registrado correctamente',
                });
                this._router.navigateByUrl('/confirmation-required');
            },
            error:(error) => {
                this.signUpForm.enable();
                this.signUpForm.reset();
                this.Toast.fire({
                    icon: 'error',
                    title: 'Upss hubo un error al registrarse',
                });
            }
        });
    }
}
