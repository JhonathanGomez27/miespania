import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'environments/environment';
import { UserService } from 'app/core/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  @ViewChild('imageUrlInput') private _imageUrlInput: ElementRef;

  Toast: any;

  user: any = {};

  constructor(
    private _profileService: ProfileService,
    private _changeDetectorRef: ChangeDetectorRef,
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
  }

  urlImg: any = null;
  file: File = null;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this._profileService.dataUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
      this.profileData = response;
      if (this.profileData.imagen_perfil) {
        this.urlImg = `${environment.imageUrl}${this.profileData.imagen_perfil.id}`;
      }
      this._changeDetectorRef.markForCheck();
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
      this.user = response;
      this._changeDetectorRef.markForCheck();
    });
  }

  uploadImageToUser(id_user: string, file: File): void {
    if (!file) {
      return;
    }

    this._profileService.uploadImageToUser(id_user, file[0]).pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (response: any) => {
        this.Toast.fire({
          icon: 'success',
          title: `Imagen subida correctamente`,
        });
        this.profileData.imagen_perfil = response ? response : null;
        this.urlImg = `${environment.imageUrl}${this.profileData.imagen_perfil.id}`;
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
    if (!this.file) {
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
      },
    });
  }
}
