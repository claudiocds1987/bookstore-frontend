import {
  Component,
  isDevMode,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BookService } from './../../../../services/book.service';
import { MyValidationsService } from './../../../../services/my-validations.service';
import { AuthorService } from './../../../../services/author.service';
import { Author } from 'src/app/models/author';
import { Book } from 'src/app/models/book';
declare var $: any; // para que funcione jquery
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  admin = {} as Admin;
  SERVER = 'http://localhost:3000';
  inputValue;
  // declaro como "any" porque bookService.getOneBookWithAuthorName() devuelve un campo autors.name as "Autor"
  // entonces si desde el html quiero mostrar esa propiedad si es de tipo Book no la va a reconocer
  bookList: any[];
  radioValue;
  authorArray: Author[] = [];
  filterArray: any[] = [];
  btnDisabled: boolean = true;
  actualPage: number = 1; // para el pagination
  idBook: number; // ngModel
  // PARA EL MODAL CUANDO SE DA DE BAJA UN LIBRO
  @ViewChild('templateModal')
  public modalRef: TemplateRef<any>;
  bookitoId: number;
  // ------------------------------------------
  constructor(
    public bookService: BookService,
    public myValidationsService: MyValidationsService,
    public modal: NgbModal,
    public authorService: AuthorService,
    public router: Router
  ) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  ngOnInit(): void {
    this.getBooksWithAuthorName();
    if (localStorage.getItem('adminData') !== null) {
      this.admin = JSON.parse(localStorage.getItem('adminData'));
    }
  }

  getBooksWithAuthorName() {
    this.btnDisabled = true; // deshabilita el btn listar todos
    this.inputValue = '';
    this.bookService.getBooksWithAuthorName().subscribe((res) => {
      this.bookList = res;
      this.filterArray = res;
    });
  }

  linkImg(urlImage) {
    // quito la palabra public
    let str = urlImage.replace(/public/g, '');
    // quito la barra '\'
    str = str.replace('\\', '');
    // invierto la barra en sentido a '/'
    str = str.replace('\\', '/');
    // const URL = 'http://localhost:4000/';
    const URL = `${this.SERVER}/`;
    const link = URL + str;
    console.log(link);
    return link;
  }

  filter() {
    if (!this.inputValue) {
      alert('Debe escribir algo para realizar el filtrado!');
    } else {
      if (
        this.radioValue === 'id' ||
        this.radioValue === 'name' ||
        this.radioValue === 'author'
      ) {
        this.btnDisabled = false; // habilita el btn listar todos
        // si el input radio id is checked
        if (this.radioValue === 'id') {
          // pongo vacio el array filterArray
          this.filterArray = [];
          const id = parseInt(this.inputValue);
          this.filterArray.push(
            ...this.bookList.filter((item) => item.id_book === id)
          );
        }
        // si el input radio name is checked
        else if (this.radioValue === 'name') {
          this.filterArray = []; // pongo vacio el array filterArray
          const name = this.myValidationsService.textCapitalize(
            this.inputValue
          );
          // no se como hacer para buscar coincidencias con .filter por eso utilizo el servicio
          this.bookService.filterBooksByName(name).subscribe(
            (res) => {
              this.filterArray = res;
            },
            (err) =>
              console.error(
                'Error al intentar filtrar el libro por nombre ' + err
              )
          );
        }
        // si el input radio author is checked
        else if (this.radioValue === 'author') {
          this.filterArray = []; // pongo vacio el array filterArray
          const authorName = this.myValidationsService.textCapitalize(
            this.inputValue
          );
          // busco coincidencias ej: si authorName es "Pig" => (devuelve) Felipe Pigna
          this.authorService.filterAuthorsByName(authorName).subscribe(
            (res) => {
              this.authorArray = res; // guardo autores que hicieron match con la coincidencia
              for (const author of this.authorArray) {
                const id = this.authorArray[0].id_author;
                // guardo en filterArray todos los libros cuyos autores estan en autorArray
                this.filterArray.push(
                  ...this.bookList.filter((item) => item.id_author === id)
                );
              }
            },
            (err) => console.error('No se pudo filtrar el autor. ' + err)
          );
        }
      }
      // si no se selecciono ningun radio button
      else {
        alert('Elija una opcion para hacer el filtrado');
      }
    }
  }

  showModal(book: Book) {
    if (this.admin.email === 'invitado') {
      alert('Como invitado no puede realizar esta acción');
    } else {
      this.modal.open(this.modalRef);
      // obtengo el id para utilizarlo en function darDeBaja()
      this.bookitoId = book.id_book;
    }
  }

  closeModal() {
    this.modal.dismissAll(this.modalRef);
  }

  darDeBaja() {
    const updateBook: Partial<Book> = {
      state: false, // le mando la propiedad state = false
    };
    this.bajaBook(this.bookitoId, updateBook);
    // hago refresh de la pagina
    this.router.navigate(['book/book-list']).then(() => {
      window.location.reload();
    });
  }

  bajaBook(id: number, changes: Partial<Book>) {
    this.bookService.bajaBook(id, changes).subscribe(
      (res) => {
        if (res) {
          console.log('Fue dado de baja');
          // cierro el modal
          this.modal.dismissAll(this.modalRef);
          return true;
        }
      },
      (err) => console.error('Error al dar de baja el libro ' + err)
    );
  }

  darDeAlta(id: number) {
    const updateBook: Partial<Book> = {
      state: true, // le mando la propiedad state = true
    };

    this.altaBook(id, updateBook);
    // hago refresh de la pagina
    this.router.navigate(['book/book-list']).then(() => {
      window.location.reload();
    });
  }

  altaBook(id: number, changes: Partial<Book>) {
    this.bookService.altaBook(id, changes).subscribe(
      (res) => {
        if (res) {
          console.log('Fue dado de alta');
        }
      },
      (err) => console.error('Error al dar de alta el libro ' + err)
    );
  }
}
