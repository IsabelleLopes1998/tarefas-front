export interface TarefaResponse {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  dataCriacao: string; // ISO 8601
  prazo: string; // yyyy-MM-dd
}
export interface TarefaRequest {
  titulo: string;
  descricao: string;
  prazo: string;
  concluida?: boolean;// yyyy-MM-dd
}
