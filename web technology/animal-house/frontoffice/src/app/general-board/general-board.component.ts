import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NewPostComponent } from '../new-post/new-post.component';

@Component({
  selector: 'app-general-board',
  templateUrl: './general-board.component.html',
  styleUrls: ['./general-board.component.css']
})
export class GeneralBoardComponent implements OnInit {

  username: any;
  type: any;
  posts: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('user');
    this.type = this.route.snapshot.paramMap.get('type');
    this.getData();
  }

  async getData() {
    this.posts = [];
    fetch('/api/v1/boards/'+this.type, {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
      let listOfIds = data;
      for(let i=0; i<listOfIds.length; i++) {
        fetch('/api/v1/boards/'+this.type+'/'+listOfIds[i], {
          method: 'GET',
          credentials: "same-origin",
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then((data) => {
          this.posts[i] = data;
          let dateNotFormatted = new Date(this.posts[i].date);
          this.posts[i].date = dateNotFormatted.toLocaleDateString("it-IT");
          this.posts[i].comments.forEach((element: any) => {
            let dateNotFormatted = new Date(element.date);
            element.date = dateNotFormatted.toLocaleDateString("it-IT");
          });
          this.setComment();
        })
        .catch(() => {
          this.openSnackBar('Errore, riprova.', 'Chiudi')
        });
      }
      this.posts.forEach(function (element) {
        element.check = false;
      });
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  setComment() {
    this.posts.forEach(function (el) {
      el.comment = '';
    });
  }

  onChange(description: any, element: any) {
    this.posts.forEach(function (el) {
      if(element.id == el.id) el.comment = description;
    });
  }

  addComment(post: any) {
    const data = {
      description: post.comment
    };
    fetch('/api/v1/boards/'+this.type+'/'+post.id+'/comments', {
      method: 'PUT',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
    .then(() => {
      this.getData();
      this.openSnackBar('Commento aggiunto con successo.', 'Chiudi');
    })
    .catch(() => {
      this.openSnackBar('Errore, riprova.', 'Chiudi')
    });
  }

  changeShowing(post: any) {
    post.check = !post.check;
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 3000 });
  }

  addPost() {
    const dialogRef = this.dialog.open(NewPostComponent, {
      data: {
        type: this.type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == 'error') {
        this.openSnackBar('Errore, riprova.', 'Chiudi')
      } else if(result == 'ok') {
        this.getData();
        this.openSnackBar('Post aggiunto con successo.', 'Chiudi');
      }
    });
  }
}
