import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthorService } from '../../../../services/author.service';
import { Author } from '../../../../models/author';
import { MyValidationsService } from '../../../../services/my-validations.service';
import { FormControl, Validators } from '@angular/forms';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-author-panel',
  templateUrl: './author-panel.component.html',
  styleUrls: ['./author-panel.component.scss'],
})
export class AuthorPanelComponent implements OnInit {
  authorName: FormControl;
  authorNameEdit: FormControl;
  inputValueSearch: FormControl;

  authorList$: Observable<Author[]>;
  authorArray: Author[]; // array de tipo User
  author = {} as Author; // declaro objeto Author
  authorEdit = {} as Author; // declaro objeto Author para editar author
  editing = false;
  activated: boolean = true;
  actualPage: number = 1; // para el pagination
  admin = {} as Admin;

  constructor(
    public authorService: AuthorService,
    public myValidationsService: MyValidationsService
  ) {
    // para chequear si el admin esta como "invitado"
    if (localStorage.getItem('adminData') !== null) {
      this.admin = JSON.parse(localStorage.getItem('adminData'));
    }

    this.authorName = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
      Validators.maxLength(35),
      Validators.minLength(4),
    ]);
    this.authorNameEdit = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
      Validators.maxLength(35),
      Validators.minLength(4),
    ]);
    this.inputValueSearch = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
      Validators.maxLength(35),
      Validators.minLength(4),
    ]);
  }

  ngOnInit(): void {
    // this.authorList$ = this.authorService.getAuthors();
    this.getAuthors();
  }

  createAuthor() {
    if (this.admin.email === 'invitado') {
      alert('Como invitado no puede realizar esta acción.');
    } else {
      if (this.authorName.valid) {
        if (
          confirm(
            '¿Esta seguro/a que desea agregar el autor ' + this.authorName.value
          )
        ) {
          this.author.name = this.authorName.value;
          this.author.name = this.myValidationsService.textCapitalize(
            this.author.name
          );
          console.log('nombre de autor: ' + this.author.name);
          // validando si ya existe el autor
          this.authorService.existAuthorByName(this.author.name).subscribe(
            (resp) => {
              if (resp === false) {
                this.authorService.createAuthor(this.author).subscribe(
                  (res) => {
                    alert('el autor fue guardado exitosamente');
                    // vuelvo a listar todos los autores
                    this.getAuthors();
                    // seteo input vacio
                    this.author.name = '';
                  },
                  (err) => console.error('el autor no se pudo guardar ' + err)
                );
              } else {
                alert(
                  'Ya existe un autor con el mismo nombre en la base de datos'
                );
                // para poner el input vacio
                this.author.name = '';
              }
            },
            (err) =>
              alert(
                'Error, no se pudo comprobar si el author ya existe en la base de datos'
              )
          );
        }
      }
    }
  }

  getAuthors() {
    this.activated = true; //deshabilita boton listar Todos
    this.inputValueSearch.setValue(''); // limpia input
    this.authorService.getAuthors().subscribe(
      (res) => {
        this.authorService.authorArray = res;
      },
      (err) => console.error(err)
    );
  }

  getAuthorByName() {
    if (this.inputValueSearch.valid) {
      this.activated = false; // habilita boton listar Todos
      const name = this.myValidationsService.textCapitalize(
        this.inputValueSearch.value
      );
      this.authorService.getAuthorByName(name).subscribe(
        (res) => {
          console.log('el autor es: ' + res);
          this.authorService.authorArray = res;
        },
        (err) => console.error('No se pudo obtener el autor: ' + err) // si hay error, mostralo en consola
      );
    }
  }

  editAuthor(event, id) {
    this.editing = !this.editing; // cierra o abre el div para editar author
    this.authorNameEdit.setValue(''); // seteo a vacio el formControl
    this.authorEdit.id_author = id;
  }

  updateAuthor() {
    if (this.admin.email === 'invitado') {
      alert('Como invitado no puede realizar esta acción');
    } else {
      if (this.authorNameEdit.valid) {
        if (confirm('¿Esta seguro/a que desea actualizar al autor?')) {
          this.authorEdit.name = this.myValidationsService.textCapitalize(
            this.authorNameEdit.value // get value del formControl authorNameEdit
          );
          this.authorService.updateAuthor(this.authorEdit).subscribe(
            (res) => {
              this.getAuthors(); // listar todos los autores
              this.authorEdit = {} as Author; // limpio el objeto
              this.editing = false;
            },
            (err) => console.error('No se pudo actualizar el author ' + err)
          );
          alert('Autor actualizado!');
        }
      }
    }
  }

  cleanUnnecessaryWhiteSpaces(control: FormControl) {
    let value = control.value;
    value = this.myValidationsService.cleanUnnecessaryWhiteSpaces(value);
    control.setValue(value);
  }
}
