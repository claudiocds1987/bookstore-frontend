import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateBookComponent } from './components/create-book/create-book.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { EditBookComponent } from './components/edit-book/edit-book.component';
import { AuthorPanelComponent } from './components/author-panel/author-panel.component';
import { CategoryPanelComponent } from './components/category-panel/category-panel.component';
import { EditorialPanelComponent } from './components/editorial-panel/editorial-panel.component';
// Guardianes
import { AdminGuard } from 'src/app/admin.guard';

const routes: Routes = [
  {
    path: 'create-book',
    canActivate: [AdminGuard],
    component: CreateBookComponent
  },
  {
    path: 'book-list',
    canActivate: [AdminGuard],
    component: BookListComponent
  },
  {
    path: 'edit-book/:id',
    canActivate: [AdminGuard],
    component: EditBookComponent
  },
  {
    path: 'author-panel',
    canActivate: [AdminGuard],
    component: AuthorPanelComponent
  },
  {
    path: 'category-panel',
    canActivate: [AdminGuard],
    component: CategoryPanelComponent
  },
  {
    path: 'editorial-panel',
    canActivate: [AdminGuard],
    component: EditorialPanelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
