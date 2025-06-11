import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Interfaces para tipagem dos dados
export interface ProdutoPedido {
  id: number;
  nome: string;
  quantidade: number;
  valor: number;
}
export interface Pedido {
  id: number;
  total: number;
  data: string;
  produtos: ProdutoPedido[];
}

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule], // HttpClient é provido globalmente
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {

  historico: Pedido[] = [];
  mensagem: string = '';
  carregando: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const dadosUsuarioJSON = localStorage.getItem('usuarioLogado');

    if (dadosUsuarioJSON) {
      const usuario = JSON.parse(dadosUsuarioJSON);
      this.carregarHistorico(usuario.id);
    } else {
      this.mensagem = 'Você precisa estar logado para ver seu histórico.';
      this.carregando = false;
    }
  }

  carregarHistorico(clienteId: number) {
    const apiUrl = `http://localhost:3000/api/pedidos/historico/${clienteId}`;
    this.http.get<Pedido[]>(apiUrl).subscribe({
      next: (pedidos) => {
        this.historico = pedidos;
        if (pedidos.length === 0) {
          this.mensagem = 'Você ainda não possui nenhum pedido finalizado.';
        }
        this.carregando = false;
      },
      error: (err) => {
        this.mensagem = 'Erro ao carregar o histórico de pedidos.';
        console.error(err);
        this.carregando = false;
      }
    });
  }
}