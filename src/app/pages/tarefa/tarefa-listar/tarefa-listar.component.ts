import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { TarefaService } from '../tarefa.service';
import { TarefaResponse } from './tarefa.model';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-tarefa-listar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PrimeNgModule,
    AccordionModule,
    DividerModule,
    BreadcrumbModule,
    PaginatorModule,
    HttpClientModule,
    CommonModule,
    ToastModule,
    ProgressSpinnerModule
  ],
  templateUrl: './tarefa-listar.component.html',
  styleUrls: ['./tarefa-listar.component.css']
})
export class TarefaListarComponent {
  @ViewChild(PaginatorModule) paginator: PaginatorModule;
  @Input() TITULO = 'Lista de Tarefas';
  pesquisar: string = '';

  tarefas: TarefaResponse[] = [];
  tarefasFiltradas: TarefaResponse[] = [];
  tarefaSelecionada!: TarefaResponse;

  breadcrumbs = [
    { label: 'Início', url: '#' },
    { label: 'Lista de Tarefas', url: '#/tarefa-listar' }
  ];

  isLoading = true;
  first = 0;
  rows = 10;
  pageIndex = 0;
  pageSize = 5;
  modalExclusaoVisivel = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private tarefaService: TarefaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getListaDeTarefas();
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.paginarTarefas(this.pageIndex, this.pageSize);
  }

  paginarTarefas(page: number, size: number): void {
    this.tarefasFiltradas = this.tarefas.slice(page * size, (page + 1) * size);
  }

  getListaDeTarefas(): void {
    this.isLoading = true;
    this.tarefaService.getListaDeTarefas()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: TarefaResponse[]) => {
          this.tarefas = res;
          this.tarefasFiltradas = [...this.tarefas];
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao carregar as tarefas.',
            life: 5000
          });
        }
      });
  }

  criarNovaTarefa() {
    this.router.navigate(['/tarefa-criar-novo']);
  }

  editarTarefa(id: number | undefined) {
    if (!id) return ;
    this.router.navigate(['/tarefa-criar-novo', id]);
  }

  confirmarExclusao(tarefa: TarefaResponse) {
    this.tarefaSelecionada = tarefa;
    this.modalExclusaoVisivel = true;
  }

  excluirTarefa() {
    if (!this.tarefaSelecionada || !this.tarefaSelecionada.id) return;

    this.tarefaService.excluirTarefa(this.tarefaSelecionada.id).subscribe({
      next: () => {
        this.modalExclusaoVisivel = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tarefa excluída com sucesso!'
        });
        this.getListaDeTarefas();
      },
      error: () => {
        this.modalExclusaoVisivel = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao excluir tarefa!'
        });
      }
    });
  }

    alternarConclusao(tarefa: TarefaResponse) {
      const atualizada = { ...tarefa, concluida: !tarefa.concluida }; // Inverte o valor atual

      this.tarefaService.atualizarTarefa(atualizada.id, atualizada).subscribe({
        next: () => {
          const status = atualizada.concluida ? 'concluída' : 'marcada como não concluída';
          this.messageService.add({
            severity: 'success',
            summary: 'Tarefa atualizada',
            detail: `Tarefa ${status}!`
          });
          this.getListaDeTarefas(); // Recarrega a lista
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível atualizar a tarefa.'
          });
        }
      });
    }
}
