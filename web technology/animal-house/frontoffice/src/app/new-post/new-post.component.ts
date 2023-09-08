import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadService } from '../services/file-upload.service';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  title = '';
  description = '';
  type = '';
  selectedFile!: ImageSnippet;
  img: any;

  constructor(
    public dialogRef: MatDialogRef<NewPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.type = this.data.type
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);

      this.fileUploadService.uploadImage(this.selectedFile).subscribe(
        (res) => {
          this.img = res.url;
        }
      )
    });

    reader.readAsDataURL(file);
  }

  publicPost() {
    let data;
    if(this.img) {
      data = {
        title: this.title,
        description: this.description,
        image: this.img ? this.img : null
      };
    } else {
      data = {
        title: this.title,
        description: this.description
      };
    }
    fetch('/api/v1/boards/'+this.type, {
      method: 'PUT',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(() => {
      this.dialogRef.close('ok');
    })
    .catch(() => {
      this.dialogRef.close('error');
    });
  }

}
