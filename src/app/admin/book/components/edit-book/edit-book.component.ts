import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Book } from 'src/app/models/book';
import { Author } from 'src/app/models/author';
import { Category } from 'src/app/models/category';
import { Editorial } from 'src/app/models/editoral';
import { Observable } from 'rxjs';
import { BookService } from './../../../../services/book.service';
import { AuthorService } from './../../../../services/author.service';
import { CategoryService } from './../../../../services/category.service';
import { EditorialService } from './../../../../services/editorial.service';
import { MyValidationsService } from './../../../../services/my-validations.service';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss']
})
export class EditBookComponent implements OnInit {

  form: FormGroup;
  idBook_url: string;
  selectedIdAut: string = '';
  selectedIdCat: string = '';
  selectedIdEdi: string = '';
  authorList$: Observable<Author[]>;
  categoryList$: Observable<Category[]>;
  editorialList$: Observable<Editorial[]>;
  book = {} as Book; // declaro un objeto Book vacio, no es un array
  autor = {} as Author;
  categoria = {} as Category;
  editorial = {} as Editorial;
  // obteniendo año actual
  today = new Date();
  year = this.today.getFullYear();
  selectedFile = null;
  imageSelected;
  defaultUrlImage;
  // para hacer un preview de la img seleccionada
  imgPreview: string | ArrayBuffer;
  public arrayToIterate = new Set([]);
  mostrar = true;
  imageDefault;

  constructor(
    public bookService: BookService,
    public authorService: AuthorService,
    public categoryService: CategoryService,
    public editorialService: EditorialService,
    public myValidationsService: MyValidationsService,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.buildForm(); // function buildForm
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.idBook_url = params.id;  // obteniendo el id que viene en la url
      // console.log('el id de book recibido es: ' + this.idBook_url);
      this.bookService.getBookById(this.idBook_url)
      .subscribe(book => {
        console.log('los valores del libro son: ' + book[0].id_author);
        // para mostrar los valores del book a editar en el formulario
        this.book.description = book[0].description;
        this.book.id_author = book[0].id_author;
        this.book.id_category = book[0].id_category;
        this.book.id_editorial = book[0].id_editorial;
        this.book.name = book[0].name;
        this.book.price = book[0].price;
        this.book.quantity = book[0].quantity;
        this.book.state = book[0].state;
        this.book.url_image = book[0].url_image;
        this.defaultUrlImage = book[0].url_image; // por si no elige nueva imagen, guardo el path de img original
        this.imageDefault = this.linkImg(this.defaultUrlImage);
        // this.gg = this.gg + this.defaultUrlImage;
        this.book.year = book[0].year;
        // get nombre de autor para mostrar en select como opcion default
        this.authorService.getAuthorById(book[0].id_author.toString())
        .subscribe(
          res => {
            this.autor.id_author = res.id_author;
            this.autor.name = res.name;
            this.selectedIdAut = res.id_author.toString();
            // console.log('id autor: ' + this.autor.id_author, ' nombre: ' + this.autor.name);
          },
          err => console.error(err)
        );
        // get nombre de categoria para mostrar en select como opcion default
        this.categoryService.getCategoryById(book[0].id_category.toString())
        .subscribe(
          res => {
            this.categoria.id_category = res.id_category;
            this.categoria.name = res.name;
            this.selectedIdCat = res.id_category.toString();
            // console.log('id categoria: ' + this.autor.id_author, ' nombre: ' + this.categoria.name);
          },
          err => console.error(err)
        );
        // get nombre de editorial para mostrar en select como opcion default
        this.editorialService.getEditorialById(book[0].id_editorial.toString())
        .subscribe(
          res => {
            this.editorial.id_editorial = res.id_editorial;
            this.editorial.name = res.name;
            this.selectedIdEdi = res.id_editorial.toString();
            // console.log('id editorial: ' + this.editorial.id_editorial, ' nombre: ' + this.editorial.name);
          },
          err => console.error(err)
        );
        this.form.patchValue(book[0]);
      });
    });
    // para evitar que en el select aparezca el autor dos veces repetido
    // El pipe se utiliza para hacer modificaciones al stream filter,
    // maps, take hay muchos operadores que se pueden utilizar para modificar
    // los datos antes de llegar a su destino final
    this.authorList$ = this.authorService.getAuthors().pipe(
      map(authorList => {
        // 1) se crea un array de los puros id_author dentro de una clase Set
        // que no permite valores repetidos (eliminando los ids repetidos)
        return Array.from(new Set(authorList.map(a => a.id_author)))
        // 2) el segundo map itera los ids del Set y los busca en el array principal "authorList"
          .map(id => {
              return authorList.find(a => a.id_author === id);
         });
      })
  );
  // para evitar que en el select aparezca al categoria dos veces repetida
    this.categoryList$ = this.categoryService.getCategories().pipe(
      map(categoryList => {
        return Array.from(new Set(categoryList.map(c => c.id_category)))
        .map(id => {
          return categoryList.find(c => c.id_category === id);
        });
      })
    );
    // para evitar que en el select aparezca la editorial dos veces repetida
    this.editorialList$ = this.editorialService.getEditorials().pipe(
      map(editorialList => {
        return Array.from(new Set(editorialList.map(e => e.id_editorial)))
        .map(id => {
          return editorialList.find(e => e.id_editorial === id);
        });
      })
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      name: ['1', [Validators.required, Validators.maxLength(50)]],
      year: ['1', [Validators.required, Validators.max(this.year)]],
      author: ['1', [Validators.required]],
      category: [1, [Validators.required]],
      editorial: [1, [Validators.required]],
      description: ['1', [Validators.required, Validators.maxLength(2500)]],
      quantity: [1, [Validators.required]],
      price: [1, [Validators.required]],
      image: ['1'],
      state: [true]
    });
  }

  linkImg(urlImage) {
    // quito la palabra public
    let str = urlImage.replace(/public/g, '');
    // quito la barra '\'
    str = str.replace('\\', '');
    // invierto la barra en sentido a '/'
    str = str.replace('\\', '/');
    // console.log(str);
    const URL = 'http://localhost:4000/';
    const link = URL + str;
    console.log(link);
    return link;
  }

  // captura el value del <select> autor
  captureIdAutor (event: any) {
    this.selectedIdAut = event.target.value;
    this.form.get('author').setValue(this.book.id_author, {
           onlySelf: true
    });
    console.log(this.selectedIdAut);
  }

  // captura el value del <select> categoria
  captureIdCategory (event: any) {
    this.selectedIdCat = event.target.value;
    this.form.get('category').setValue(this.book.id_category, {
      onlySelf: true
   });
  }

  // captura el value del <select> editorial
  captureIdEditorial (event: any) {
    this.selectedIdEdi = event.target.value;
    this.form.get('editorial').setValue(this.book.id_editorial, {
      onlySelf: true
   });
  }

  resetForm(){
    this.form.reset();
    console.log(this.book);
    this.book = {} as Book;
    console.log('book esta vacio' + this.book);
  }

  cleanUnnecessaryWhiteSpaces(cadena: string){
    const a = this.myValidationsService.cleanUnnecessaryWhiteSpaces(cadena);
    return a;
  }

  selectImage(event) {
    if (event.target.files.length > 0) {
      // oculto imagen default
      this.mostrar = false;
      const file = event.target.files[0];
      this.imageSelected = file;
      // preview de la img
      const reader = new FileReader();
      // leo el archivo seleccionado
      reader.onload = e => this.imgPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  // Carga la imagen y cuando termina, asigna el path a la variable url_image.
  // envia el formulario al servidor
  uploadImage() {
    const formData = new FormData();
    formData.append('file', this.imageSelected);
    // subo la imagen a nodejs
    this.http.post<any>('http://localhost:4000/file', formData).subscribe(
      (res) => {
        this.book.url_image = res.path; // guardo el path de la img
        this.endUpdateBook(); // envío el formualario al servidor nodejs y espero respuesta
      },
      (err) => console.log(err)
    );
    this.cleanImgPreview(); // hago desaparecer la img preview
    this.mostrar = false; // oculto la img que estaba por default
  }

    // borro la img seleccionada en el input file
    cleanImgPreview() {
      this.imgPreview = null;
      this.form.get('image').setValue('');
      this.imageSelected = null;
      // muestro imagen default
      this.mostrar = true;
    }

  updateBook(event: Event){
    event.preventDefault();
    if (this.form.valid) {
      if (confirm('¿Esta seguro/a que desea actualizar los datos?')) {
        // obtengo todos los valores del formulario
        this.book = this.form.value;
        // le paso el id de book de la url al objeto book
        this.book.id_book = parseInt(this.idBook_url);
        this.book.id_author = parseInt(this.selectedIdAut);
        this.book.id_editorial = parseInt(this.selectedIdEdi);
        this.book.id_category = parseInt(this.selectedIdCat);

        if (this.imageSelected != null) {
          // SUBO IMAGEN
          this.uploadImage(); // Si tiene imagen la carga
        } else {
          // aca asignale el valor por defecto de imagen si no eligió una
          this.book.url_image = this.defaultUrlImage;
          this.endUpdateBook(); // Si no manda el formulario como va
        }
      }
    }
  }

  endUpdateBook(){
    this.book.name = this.cleanUnnecessaryWhiteSpaces(this.book.name);
    // convierto solo la 1er letra de cada palabra a mayuscula (capitalize)
    this.book.name = this.myValidationsService.textCapitalize(this.book.name);
    // actualizo los datos
    this.bookService.updateBook(this.book).subscribe(
      res => {
        console.log(res);
        alert('Los datos se actualizaron extosamente');
        this.selectedIdAut = '';
        this.selectedIdCat = '';
        this.selectedIdEdi = '';
        // para limpiar el formulario
        this.resetForm();
        this.router.navigateByUrl('book/book-list');
      },
      err => alert('No se pudo actualizar')
    );
  }

}
