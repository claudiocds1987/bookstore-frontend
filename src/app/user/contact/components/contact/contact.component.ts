import { Component, OnInit } from '@angular/core';
// formuluario
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required, Validators.maxLength(50)]],
      text: ['', [Validators.required, Validators.maxLength(400)]],
    });
  }

  // convenienza getter para facil acceso a lo campos del formulario
  get f() {
    return this.form.controls;
  }

}
