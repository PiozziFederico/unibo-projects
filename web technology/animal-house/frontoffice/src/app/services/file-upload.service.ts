import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {
	
  baseApiUrl = "/api/v1/images/";
    
  constructor(private http:HttpClient) { }

  public uploadImage(image: any): Observable<any> {
    const formData = new FormData();

    formData.append('image', image.file);
    formData.append('src', image.src);

    return this.http.post(this.baseApiUrl, formData);
  }
}
