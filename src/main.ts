// Liga tudo: cria os eventos, a operadora falsa, a bilheteria e sobe o servidor HTTP.
import { criarBilheteria } from "./bilheteria.ts";
import { Evento } from "./dominio.ts";
import { criarPagamentoFalso } from "./pagamento.ts";
import { criarServidor } from "./servidor.ts";

const eventos = [
  new Evento(1, "Show de Rock", 150, 100), // o bench usa este: 100 poltronas
  new Evento(2, "Peça de Teatro", 80, 50),
  new Evento(3, "Stand-up", 60, 30),
];

const pagar = criarPagamentoFalso({ latenciaMs: 80, taxaDeFalha: 0.1 });

const bilheteria = criarBilheteria({ eventos, pagar, limitePagamentoMs: 500 });

criarServidor(bilheteria).listen(3000, () => {
  console.log("bilheteria no ar em http://localhost:3000");
});
