import {
  Component,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { Produto } from '../model/produto';
import { CommonModule } from '@angular/common';
import { Cesta } from '../model/cesta';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-vitrine',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.css'],
  animations: [
    trigger('fadeInOnScroll', [
      state('hidden', style({ opacity: 0, transform: 'translateY(30px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('600ms ease-out')),
    ])
  ]
})
export class VitrineComponent implements AfterViewInit {
  public lista: Produto[] = [
    {codigo:1, nome:"Parafusadeira", valor:100, descritivo:"Parafusadeira eletrica", quantidade:3, promo:100, destaque:1, keywords:""},
    {codigo:2, nome:"Serra", valor:150, descritivo:"Serra eletrica", quantidade:3, promo:100, destaque:1, keywords:""},
    {codigo:3, nome:"Martelete", valor:100, descritivo:"Martelete", quantidade:4, promo:100, destaque:1, keywords:""},
    {codigo:4, nome:"Makita", valor:350, descritivo:"Makita", quantidade:2, promo:250, destaque:1, keywords:""},
    {codigo:5, nome:"Furadeira", valor:120, descritivo:"Furadeira de impacto", quantidade:5, promo:110, destaque:1, keywords:""},
    {codigo:6, nome:"Lixadeira", valor:90, descritivo:"Lixadeira orbital", quantidade:6, promo:85, destaque:0, keywords:""},
    {codigo:7, nome:"Esmerilhadeira", valor:130, descritivo:"Esmerilhadeira angular", quantidade:4, promo:120, destaque:1, keywords:""},
    {codigo:8, nome:"Compressor de Ar", valor:500, descritivo:"Compressor 24L", quantidade:2, promo:450, destaque:0, keywords:""},
    {codigo:9, nome:"Pistola de Pintura", valor:80, descritivo:"Pistola de pintura HVLP", quantidade:1, promo:70, destaque:1, keywords:""},
    {codigo:10, nome:"Alicate de Pressão", valor:50, descritivo:"Alicate de pressão 10''", quantidade:10, promo:45, destaque:0, keywords:""},
    {codigo:11, nome:"Chave de Impacto", valor:280, descritivo:"Chave de impacto elétrica 1/2''", quantidade:3, promo:250,destaque:1, keywords:""},
    {codigo:12, nome:"Multímetro Digital", valor:95, descritivo:"Multímetro digital com teste de continuidade", quantidade:0, promo:85,destaque:0, keywords:""}
  ];

  public listaFiltrada: Produto[] = [];

  visibilidade: boolean[] = [];

  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

  constructor() {
    let filtro = localStorage.getItem("filtro");
    if (filtro) {
      this.fazerBusca(filtro);
    }
  }

  ngAfterViewInit(): void {
    const listaExibida = this.listaFiltrada.length > 0 ? this.listaFiltrada : this.lista;
    this.visibilidade = new Array(listaExibida.length).fill(false);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = +entry.target.getAttribute('data-index')!;
          this.visibilidade[index] = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.cardElements.forEach((el, i) => {
      el.nativeElement.setAttribute('data-index', i.toString());
      observer.observe(el.nativeElement);
    });
  }

  fazerBusca(filtro: string) {
    this.listaFiltrada = this.lista.filter(produto =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  verDetalhe(obj: Produto) {
    localStorage.setItem("produto", JSON.stringify(obj));
    location.href = "detalhe";
  }

  adicionar(obj: Produto) {
    let json = localStorage.getItem("cesta");
    let cesta = new Cesta();
    if (json != null) {
      cesta = JSON.parse(json);
    }
    cesta.itens.push(obj);
    cesta.total = cesta.total + obj.valor;
    localStorage.setItem("cesta", JSON.stringify(cesta));
    location.href = "cesta";
  }
}
