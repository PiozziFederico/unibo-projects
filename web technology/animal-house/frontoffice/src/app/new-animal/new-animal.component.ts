import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadService } from '../services/file-upload.service';
class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
@Component({
  selector: 'app-new-animal',
  templateUrl: './new-animal.component.html',
  styleUrls: ['./new-animal.component.css']
})
export class NewAnimalComponent implements OnInit {

  name = '';
  type = '';
  typeSpecific = '';
  breed = '';
  gender = '';
  typeList: string[] = ['Gatto', 'Cane', 'Coniglio', 'Tartaruga', 'Altro'];
  genderList: string[] = ['Maschio', 'Femmina', 'Altro'];
  age = '';
  description = '';
  newAnimal: any;
  fieldType = false;
  modifyAnimal = false;
  oldAnimalName = '';
  selectedFile!: ImageSnippet;
  img: any;

  constructor(
    public dialogRef: MatDialogRef<NewAnimalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.name = this.data?.dataKey[0] != undefined ? this.data.dataKey[0] : '';
    this.type = this.data?.dataKey[1]?.type != undefined ? this.checkType() : '';
    this.breed = this.data?.dataKey[1]?.breed != undefined ? this.data.dataKey[1].breed : '';
    this.gender = this.data?.dataKey[1]?.gender != undefined ? this.data.dataKey[1].gender : '';
    this.age = this.data?.dataKey[1]?.age != undefined ? this.data.dataKey[1].age : null;
    this.description = this.data?.dataKey[1]?.description != undefined ? this.data.dataKey[1].description : '';
    this.img = this.data?.dataKey[1]?.image ? this.data.dataKey[1].image : '';
    this.modifyAnimal = this.data?.dataKey[0] != undefined ? true : false;
    this.oldAnimalName = this.name;
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
  
  checkType() {
    if(this.data.dataKey[1].type != 'Gatto' && this.data.dataKey[1].type != 'Cane' && this.data.dataKey[1].type != 'Coniglio' && this.data.dataKey[1].type != 'Tartaruga') {
      this.type = 'Altro';
      this.fieldType = true;
      this.typeSpecific = this.data.dataKey[1].type;
    } else {
      this.type = this.data.dataKey[1].type;
    }
    return this.type;
  }

  saveAnimal() {
    this.newAnimal = [{
      'name': this.name,
      'age': this.age,
      'type': this.type != 'Altro' ? this.type : this.typeSpecific,
      'gender': this.gender,
      'breed': this.breed,
      'description': this.description,
      'image': this.img ? this.img : null
    }];
    const data = [
      this.newAnimal,
      this.oldAnimalName
    ];
    this.dialogRef.close(data);
  }

  onChange(event: any) {
    if(event == 'Altro') {
      this.fieldType = true;
    } else {
      this.fieldType = false;
    }
  }

}
