import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    profileData: any;
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profileService.getUserData().subscribe(
      (data) => {
        this.profileData = data;
        console.log(this.profileData);  // Puedes eliminar esto después de verificar que la data llega bien
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
}

}
