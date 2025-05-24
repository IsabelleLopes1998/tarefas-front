import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'src/app/componentes/breadcrumb/breadcrumb.module';
import { PrimeNgModule } from 'src/app/componentes/primeng/primeng.module';
import { TarefaService } from '../tarefa.service';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { TarefaResponse } from '../tarefa-listar/tarefa.model';


@Component({
  selector: 'app-tarefa-criar-novo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    ToastModule,
    ProgressSpinnerModule,
    PrimeNgModule,
    BreadcrumbModule,
    DialogModule,
    CheckboxModule
  ],
  templateUrl: './tarefa-criar-novo.component.html',
  styleUrls: ['./tarefa-criar-novo.component.css'],
  providers: [MessageService]
})
export class TarefaCriarNovoComponent {
  tarefaForm: FormGroup;
  isFormValid = false;
  isLoading = false;
  isEditing = false;
  id: number | null = null;
  breadcrumbs = [
    { label: 'Início', url: '#' },
    { label: 'Nova tarefa', url: 'javascript:void(0)' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tarefaService: TarefaService,
    private messageService: MessageService
  ) {
    this.tarefaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      descricao: ['', [Validators.maxLength(1000)]],
      prazo: ['', Validators.required],
      concluida: [false]
    });
  }

  ngOnInit(): void {
    const idparam = this.route.snapshot.paramMap.get('id');
    console.log('[DEBUG] ID recebido:', idparam);

    this.isFormValid = this.tarefaForm.valid;

    if (idparam) {
      this.isEditing = true;
      this.id = Number(idparam);
      this.carregarTarefa();
    }

    this.tarefaForm.valueChanges.subscribe(() => {
      this.isFormValid = this.tarefaForm.valid;
    });
  }


  carregarTarefa() {
    if (!this.id) return;


    this.isLoading = true;
    this.tarefaService.getTarefaPorId(this.id).subscribe({
      next: (tarefa) => {

        console.log('[DEBUG] ID:', this.id);
        console.log('[DEBUG] tarefa retornada:', tarefa);
        console.log('[DEBUG] tarefa.prazo vindo do backend:', tarefa.prazo);
        const data = parseDateLocal(tarefa.prazo);
        console.log('[DEBUG] Resultado parseDateLocal:', data);

        this.tarefaForm.patchValue({
          titulo: tarefa.titulo,
          descricao: tarefa.descricao,
          prazo: parseDateLocal(tarefa.prazo),
          concluida: tarefa.concluida
        });

        console.log('[DEBUG] Tipo prazo após patch:', typeof this.tarefaForm.get('prazo')?.value);
        console.log('[DEBUG] Valor no form:', this.tarefaForm.get('prazo')?.value);

        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar tarefa.'
        });
        this.isLoading = false;
      }
    });
  }


  salvarTarefa(): void {
    if (this.tarefaForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Formulário inválido.' });
      return;
    }

    this.isLoading = true;
    const formValues = this.tarefaForm.getRawValue();
    const tarefa = {
      ...formValues,
      prazo: this.toISODate(formValues.prazo),
      concluida: formValues.concluida
    };

    if (this.isEditing && this.id) {
      this.tarefaService.atualizarTarefa(this.id, tarefa).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa atualizada com sucesso!' });
          setTimeout(() => this.router.navigate(['/tarefa-listar']), 2000);
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar tarefa.' });
        }
      });
    } else {
      this.tarefaService.salvarTarefa(tarefa).subscribe({
        next: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa salva com sucesso!' });
          setTimeout(() => this.router.navigate(['/tarefa-listar']), 2000);
        },
        error: () => {
          this.isLoading = false;
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao salvar tarefa.' });
        }
      });
    }
  }

  limparFormulario(): void {
    this.tarefaForm.reset({
      titulo: '',
      descricao: '',
      prazo: ''
    });
  }

  private toISODate(date: any): string {
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date instanceof Date ? date.toISOString().split('T')[0] : '';
  }
}
function parseDateLocal(dateStr: string): Date | null {
  if (!dateStr) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(dateStr); // fallback
}
