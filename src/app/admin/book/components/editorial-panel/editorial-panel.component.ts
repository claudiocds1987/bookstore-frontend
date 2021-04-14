import { Component, OnInit } from '@angular/core';
import { EditorialService } from '../../../../services/editorial.service';
import { Editorial } from './../../../../models/editoral';
import { MyValidationsService } from '../../../../services/my-validations.service';
import { FormControl, Validators } from '@angular/forms';
import { Admin } from 'src/app/models/admin';

@Component({
  selector: 'app-editorial-panel',
  templateUrl: './editorial-panel.component.html',
  styleUrls: ['./editorial-panel.component.scss'],
})
export class EditorialPanelComponent implements OnInit {
  editorialName: FormControl;
  editorialNameEdit: FormControl;
  inputValueSearch: FormControl;

  editorialArray: Editorial[];
  editing = false;
  editorialEdit = {} as Editorial;
  editorial = {} as Editorial;
  searchResult: boolean;
  activated: boolean = true;
  actualPage: number = 1; // para el pagination
  admin = {} as Admin;

  constructor(
    public editorialService: EditorialService,
    public myValidationsService: MyValidationsService
  ) {
    // para chequear si el admin esta como "invitado"
    if (localStorage.getItem('adminData') !== null) {
      this.admin = JSON.parse(localStorage.getItem('adminData'));
    }

    this.editorialName = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(4),
    ]);
    this.editorialNameEdit = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(4),
    ]);
    this.inputValueSearch = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.minLength(4),
    ]);
  }

  ngOnInit(): void {
    this.getEditorials();
  }

  getEditorials() {
    this.activated = true; // deshabilita boton listar Todos
    this.searchResult = true;
    this.inputValueSearch.setValue(''); // limpia input
    this.editorialService.getEditorials().subscribe(
      (res) => {
        this.editorialArray = res;
      },
      (err) =>
        console.error('Error, no se pudo obtener todas las editoriales' + err)
    );
  }

  createEditorial() {
    if (this.admin.email === 'invitado') {
      alert('Como invitado no puede realizar esta acción');
    } else {
      if (this.editorialName.valid) {
        if (
          confirm(
            '¿Esta seguro/a que desea agregar la editorial ' +
              this.editorialName.value
          )
        ) {
          this.editorial.name = this.myValidationsService.textCapitalize(
            this.editorialName.value
          );
          // verifico si la editorial ya existe en la db
          this.editorialService
            .existEditorialByName(this.editorial.name)
            .subscribe(
              (res) => {
                if (res === false) {
                  this.editorialService
                    .createEditorial(this.editorial)
                    .subscribe(
                      (resp) => {
                        alert('Se insertó una nueva editorial');
                        this.getEditorials();
                        this.editorialName.setValue(''); // limpia el input
                      },
                      (err) =>
                        console.error(
                          'No se pudo insertar una nueva editorial ' + err
                        )
                    );
                } else {
                  alert('Ya existe una editorial con ese nombre');
                  // this.editorialName.setValue ('');
                }
              },
              (err) =>
                console.error(
                  'No se pudo obtener la editorial por nombre ' + err
                )
            );
        }
      }
    }
  }

  editEditorial(event, id) {
    // !this.editing, porque si esta en false cambia a true y viceversa
    this.editing = !this.editing;
    this.editorialEdit.id_editorial = id;
  }

  updateEditorial() {
    if (this.admin.email === 'invitado'){
      alert('Como invitado no puede realizar esta acción');
    }else{
      if (this.editorialNameEdit.valid) {
        if (confirm('¿Esta seguro/a que desea actualizar la editorial?')) {
          this.editorialEdit.name = this.myValidationsService.textCapitalize(
            this.editorialNameEdit.value // get value del formControl
          );
          this.editorialService.updateEditorial(this.editorialEdit).subscribe(
            (res) => {
              this.editing = false;
              this.getEditorials(); // lista toda las editoriales
              this.editorialEdit = {} as Editorial; // limpio el objeto
            },
            (err) => console.error('No se pudo actualizar la editorial ' + err)
          );
          alert('La editorial ah sido actualizada');
        }
      }
    }
  }

  getEditorialByName() {
    if (this.inputValueSearch.valid) {
      this.activated = false; // habilita boton listar Todos
      const name = this.inputValueSearch.value; // get value del fromControl inputValueSearch
      this.editorialService.getEditorialByName(name).subscribe(
        (res) => {
          if (res.length === 0) {
            this.searchResult = false;
          } else {
            this.searchResult = true;
            this.editorialArray = res;
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
