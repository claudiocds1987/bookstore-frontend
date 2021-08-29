import { Component, isDevMode, OnDestroy,OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Book } from 'src/app/models/book';
import { BookService } from '../../../services/book.service';
import { CartService } from '../../../services/cart.service';
import { MyValidationsService } from '../../../services/my-validations.service';
// servicio Toastr para alerts
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  
  private unsubscribe$ = new Subject<void>(); // for unsubscribe observables
  SERVER = 'http://localhost:3000';
  bookList$: Observable<Book[]>;
  inputValue = ''; // value del input search
  selectValue; // value de la opcion seleccionada en el select
  username: string;
  ocultar = false;
  actualPage: number = 1;
  // VARIABLES PARA DETALLE DE LIBRO
  book = {} as Book; // objeto book
  authorName;
  editorialName;
  categoryName;

  constructor(
    public bookService: BookService,
    public cartService: CartService,
    public myValidationsService: MyValidationsService,
    public alertService: AlertService
  ) {
    // con esta linea Angular reconoce si la aplicacion se esta corriendo en local(desarrollo) o en produccion.
    // si esta en local la aplicacion corre en 'http://localhost:3000
    // si es produccion corre en https://bookstore-cds-server.herokuapp.com
    if (!isDevMode()) {
      this.SERVER = 'https://bookstore-cds-server.herokuapp.com';
    }
  }

  ngOnInit(): void {
    this.getAvailableBooksWithAuthorName();

    if (localStorage.getItem('username') != null) {
      this.username = localStorage.getItem('username');
    }
  }

  getAvailableBooksWithAuthorName() {
    this.bookList$ = this.bookService.getAvailableBooksWithAuthorName()
    .pipe(
      takeUntil(this.unsubscribe$), // para unsubscribe observalbes ver en ngOnDestroy() abajo de todo
      // explicacion: todo lo que hay en "bookList$"" copialo a array "books: Book[]"
      // y "mapealo (accede a sus elementos)" con la "variable book"
      map((books: Book[]) =>
        books.map((book) => {
          return {
            // devuelve el objeto book con la url_image limpia para verla en html y quantity seteado en 1 para order.html
            ...book,
            url_image: this.linkImg(book.url_image),
          };
        })
      )
    );
  }

  linkImg(urlImage) {
    // quito la palabra public
    let str = urlImage.replace(/public/g, '');
    // quito la barra '\'
    str = str.replace('\\', '');
    // invierto la barra en sentido a '/'
    str = str.replace('\\', '/');
    const URL = this.SERVER + '/';
    const link = URL + str;
    // console.log(link);
    return link;
  }

  selectChangeHandler(event: any) {
    // tomo la opcion elegida del <select>
    this.selectValue = event.target.value;
  }

  filterBook() {
    const filter = {
      column: '',
      value: '',
    };
    // "inputValue" es lo se escribe en el input - "selectValue" es la opcion elegida (todos, titulo, autor,editorial)
    if (this.inputValue === '' && this.selectValue !== 'all') {
      this.alertService.showWarning('El campo no puede estar vacio', 'ERROR');
    } else {
      filter.column = this.selectValue;
      filter.value = this.inputValue;

      this.bookList$ = this.bookService.filterAvailableBooks(filter)
      .pipe(
        takeUntil(this.unsubscribe$), // para unsubscribe observalbes ver en ngOnDestroy() abajo de todo
        /* explicacion: al resultado de lo que trae el servicio lo voy a modificar por eso "pipe"
        ya que necesito modificar la prop. url_image, seguido con 1er "map" creo funcion que va a guardar
        en array books: Book[] cada registro de tipo Book con la url modificada. Para esto el 2do map accede
        a cada elemento de lo que trajo el servicio y a la prop.url_image le asigna la funcion linkImg()
        para modificarla y hace un return del objeto de tipo Book para guardarse en array books y
        por ultimo guardarse el array books completo en bookList$*/
        map((books: Book[]) =>
          books.map((book) => {
            return {
              // devuelve el objeto book con la url_image limpia para verla en html
              ...book,
              url_image: this.linkImg(book.url_image),
            };
          })
        )
      );
      // .pipe(
      //   catchError(error => {
      //     // manejo de error
      //     console.log('Hay un error en el servicio o en la base de datos ' + error);
      //     return of([]);
      //   })
      // );

      this.bookList$
      .pipe(
        takeUntil(this.unsubscribe$), // para unsubscribe observalbes ver en ngOnDestroy() abajo de todo
      )
      .subscribe((res) => {
        if (res.length === 0) {
          this.alertService.showError(
            'No se encontraron resultados',
            'NO HAY MATCH'
          );
          this.inputValue = '';
        }
      });

      if (this.selectValue === 'all'){
        this.inputValue = '';
      }
    }

  }

  listBooks() {
    this.inputValue = '';
    this.getAvailableBooksWithAuthorName();
  }

  addCarrito(book: Book) {
    if (book.quantity <= 0) {
      this.alertService.showError('', 'NO HAY STOCK');
    } else {
      let bookArray: Book[] = [];
      let exist = false;
      // existe la localStorageStorage ?
      if (localStorage.getItem('books') != null) {
        // Obtengo la data almacenada en localStorage
        const items = JSON.parse(localStorage.getItem('books'));
        // guardo el contenido de la localStorage en bookArray
        for (const value of items) {
          bookArray = [...bookArray, value];
        }
        // checkeo si el nuevo producto ya existe en el carrito
        for (const item of bookArray) {
          if (book.id_book === item.id_book) {
            exist = true;
          }
        }
        if (exist) {
          this.alertService.showWarning(
            'El producto ya fue agregado al carrito!',
            ''
          );
        } else {
          // guardo en bookArray el nuevo proucto
          bookArray = [...bookArray, book];
          // grabo array actualizado en localStorage books
          localStorage.setItem('books', JSON.stringify(bookArray));
          // guardo el libro en el carrito
          this.cartService.addCart(book);
          this.alertService.showSuccess('Producto agregado al carrito', '');
        }
      } else {
        bookArray = [...bookArray, book];
        // 1er carga del producto y creo la localStorage books
        localStorage.setItem('books', JSON.stringify(bookArray));
        // guardo el libro en el carrito
        this.cartService.addCart(book);
        this.alertService.showSuccess('Producto agregado al carrito', '');
      }
    }
  }

  getBookDetail(idBook: number) {
    const id = idBook.toString();
    this.bookService.getRealDataBook(id)
    .pipe(
      takeUntil(this.unsubscribe$), // para unsubscribe observalbes ver en ngOnDestroy() abajo de todo
    )
    .subscribe(
      (res) => {
        this.book.description = res[0].description;
        this.book.id_author = res[0].id_author;
        this.book.id_book = res[0].id_book;
        this.book.id_category = res[0].id_category;
        this.book.id_editorial = res[0].id_editorial;
        this.book.name = res[0].name;
        this.book.price = res[0].price;
        this.book.quantity = res[0].quantity;
        this.book.state = res[0].state;
        this.book.url_image = this.linkImg(res[0].url_image);
        this.book.year = res[0].year;
        this.authorName = res[0].autor;
        this.editorialName = res[0].editorial;
        this.categoryName = res[0].category;
      },
      (err) => console.error('Error al intentar obtener el libro por id ' + err)
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
