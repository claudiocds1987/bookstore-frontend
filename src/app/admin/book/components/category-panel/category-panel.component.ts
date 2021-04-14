import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../../services/category.service';
import { Category } from '../../../../models/category';
import { MyValidationsService } from '../../../../services/my-validations.service';
import { FormControl, Validators } from '@angular/forms';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-category-panel',
  templateUrl: './category-panel.component.html',
  styleUrls: ['./category-panel.component.scss'],
})
export class CategoryPanelComponent implements OnInit {
  categoryName: FormControl;
  categoryNameEdit: FormControl;
  inputValueSearch: FormControl;
  categoryArray: Category[];
  editing = false;
  categoryEdit = {} as Category;
  category = {} as Category;
  searchResult: boolean;
  activated: boolean = true;
  actualPage: number = 1; // para el pagination
  admin = {} as Admin;

  constructor(
    public categoryService: CategoryService,
    public myValidationsService: MyValidationsService
  ) {

    // para chequear si el admin esta como "invitado"
    if (localStorage.getItem('adminData') !== null) {
      this.admin = JSON.parse(localStorage.getItem('adminData'));
    }

    this.categoryName = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
      Validators.maxLength(25),
      Validators.minLength(4)
    ]);

    this.categoryNameEdit = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
      Validators.maxLength(25),
      Validators.minLength(4)
    ]);

    this.inputValueSearch = new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/),
      Validators.maxLength(25),
      Validators.minLength(4)
    ]);
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.activated = true; //deshabilita boton listar Todos
    this.searchResult = true;
    this.inputValueSearch.setValue('');
    this.categoryService.getCategories().subscribe(
      (res) => {
        this.categoryArray = res;
      },
      (err) =>
        console.error('Error, no se pudo obtener todas las categorias' + err)
    );
  }

  createCategory() {
    if (this.admin.email === 'invitado'){
      alert('Como invitado no puede realizar esta acción');
    }else{
      if (this.categoryName.valid) {
        this.category.name = this.categoryName.value;
        this.category.name = this.myValidationsService.textCapitalize(
          this.category.name
        );
        // verificando si ya existe la categoria en la db
        this.categoryService.existCategoryName(this.category.name).subscribe(
          (res) => {
            if (res === false) {
              if (
                confirm(
                  '¿Esta seguro/a que desea agregar la categoria: ' +
                    this.category.name +
                    '?'
                )
              ) {
                this.categoryService.createCategory(this.category).subscribe(
                  (resp) => {
                    alert('Se insertó una nueva categoria');
                    this.getCategories();
                    // limpio el input
                    this.categoryName.setValue('');
                  },
                  (err) =>
                    console.error(
                      'No se pudo insertar una nueva categoria ' + err
                    )
                );
              }
            } else {
              alert('Ya existe una categoria con ese nombre');
              this.category.name = '';
            }
          },
          (err) =>
            console.error('No se pudo obtener la categoria por nombre ' + err)
        );
      }
    }
  }

  editCategory(event, id) {
    // !this.editing, porque si esta en false cambia a true y viceversa
    this.editing = !this.editing;
    this.categoryNameEdit.setValue('');
    this.categoryEdit.id_category = id;
  }

  updateCategory() {
    if (this.admin.email === 'invitado'){
      alert('Como invitado no puede realizar esta acción');
    }else{
      if (this.categoryNameEdit.valid) {
        if (confirm('¿Esta seguro/a que desea actualizar la categoria?')) {
          // get del valor del FormControl categoryNameEdit
          this.categoryEdit.name = this.categoryNameEdit.value;
          this.categoryEdit.name = this.myValidationsService.textCapitalize(
            this.categoryEdit.name
          );
          this.categoryService.updateCategory(this.categoryEdit).subscribe(
            (res) => {
              this.editing = false;
              this.getCategories(); // lista todas las categorias
              this.categoryEdit = {} as Category; // limpio el objeto
            },
            (err) =>
              alert(
                'Error en el servicio o en la base de datos. No se pudo actualizar la categoria ' +
                  err
              )
          );
          alert('La categoria ah sido actualizada');
        }
      }
    }
  }

  getCategoryByName() {
    if (this.inputValueSearch.valid) {
      this.activated = false; // habilita boton listar Todos
      const name = this.myValidationsService.textCapitalize(
        this.inputValueSearch.value
      );
      this.categoryService.getCategoryByName(name).subscribe(
        (res) => {
          if (res.length === 0) {
            this.searchResult = false;        
          } else {
            this.searchResult = true;
            this.categoryArray = res;      
          }
        },
        (err) => console.error('No se pudo obtener la categoria ' + err)
      );
    }  
  }

  cleanUnnecessaryWhiteSpaces(control: FormControl) {
    let value = control.value;
    value = this.myValidationsService.cleanUnnecessaryWhiteSpaces(value);
    control.setValue(value);
  }

}
