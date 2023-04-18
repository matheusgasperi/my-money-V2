import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileImage: string | ArrayBuffer | null = null;
  uploadProgress = 0;
  userId: string;

  constructor(private storage: AngularFireStorage, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.userId = user.uid;
    });
  }

  selectImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      this.uploadImage(file);
    };
    input.click();
  }

  uploadImage(file: File) {
    const filePath = `users/${this.userId}/profile-picture`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task.percentageChanges().subscribe(progress => {
      this.uploadProgress = progress || 0;
    });
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.profileImage = url;
        });
      })
    ).subscribe();
  }

  saveProfile() {

  }

}
