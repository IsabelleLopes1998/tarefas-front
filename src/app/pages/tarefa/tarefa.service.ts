import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TarefaResponse, TarefaRequest } from './tarefa-listar/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private tarefaApiUrl = `${environment.apiBaseUrl}/tarefas`;

  constructor(private http: HttpClient) {}

  salvarTarefa(tarefa: TarefaRequest): Observable<TarefaResponse> {
    return this.http.post<TarefaResponse>(`${this.tarefaApiUrl}/salvarTarefa`, tarefa);
  }

  getListaDeTarefas(): Observable<TarefaResponse[]> {
    return this.http.get<TarefaResponse[]>(`${this.tarefaApiUrl}/listaDeTarefas`);
  }

  getTarefaPorId(id: number): Observable<TarefaResponse> {
    return this.http.get<TarefaResponse>(`${this.tarefaApiUrl}/buscarPorId/${id}`);
  }

  atualizarTarefa(id: number, tarefa: TarefaRequest): Observable<TarefaResponse> {
    return this.http.put<TarefaResponse>(`${this.tarefaApiUrl}/atualizarTarefa/${id}`, tarefa);
  }

  excluirTarefa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.tarefaApiUrl}/excluirTarefa/${id}`);
  }
}
