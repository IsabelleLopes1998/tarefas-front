import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from './auth.guard';
import {TarefaListarComponent} from './pages/tarefa/tarefa-listar/tarefa-listar.component'
import { TarefaCriarNovoComponent } from './pages/tarefa/tarefa-criar-novo/tarefa-criar-novo.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    children: [
      { path: 'index', component: IndexComponent },
      { path: 'tarefa-criar-novo', component: TarefaCriarNovoComponent },
      { path: 'tarefa-criar-novo/:id', component: TarefaCriarNovoComponent },
      { path: 'tarefa-listar', component: TarefaListarComponent },

    ]
  },
  { path: '**', redirectTo: 'index' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
