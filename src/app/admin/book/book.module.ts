import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookRoutingModule } from './book-routing.module';
import { CreateBookComponent } from './components/create-book/create-book.component';
import { MaterialModule } from '../../material/material.module';
import { BookListComponent } from './components/book-list/book-list.component';
import { NgxPaginationModule } from 'ngx-pagination'; // para los pagination
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { AuthorPanelComponent } from './components/author-panel/author-panel.component';
import { CategoryPanelComponent } from './components/category-panel/category-panel.component';
import { EditorialPanelComponent } from './components/editorial-panel/editorial-panel.component';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
// imports para el funcionamiento del spinner/loader para peticiones http
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxMaskModule, IConfig } from 'ngx-mask';


@NgModule({
  declarations: [
    CreateBookComponent,
    BookListComponent,
    EditBookComponent,
    AuthorPanelComponent,
    CategoryPanelComponent,
    EditorialPanelComponent
  ],
  imports: [
    CommonModule,
    BookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    MaterialModule,
    NgxMaskModule.forRoot()
  ],
  providers: [CurrencyPipe, DecimalPipe]
  // providers: [{
  //   provide: LOCALE_ID,
  //   useValue: 'es-Ar'
  //   },
  // ]
})
export class BookModule { }
