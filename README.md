# Bilheteria concorrente

Projeto final de Paradigmas de Linguagens de Programação. Enunciado completo no Blackboard.

Os arquivos de `src/` que vocês escrevem já existem, vazios; o `tipos.ts` e o `servidor.ts` vêm prontos. O que vai em cada um está no passo
indicado do enunciado:

| Arquivo | Passo do enunciado |
| :--- | :--- |
| `src/tipos.ts` (pronto) | 1: os tipos |
| `src/regras.ts` | 2: meia-entrada |
| `src/preco.ts` | 3: preço (funcional) |
| `src/dominio.ts` | 4: evento e erros (orientado a objetos) |
| `src/bilheteria.ts` | 5: a venda, onde a concorrência aparece |
| `src/servidor.ts` (pronto) e `src/main.ts` | 6: ligar o servidor |

Não alterem `src/pagamento.ts`, `src/servidor.ts`, `src/bench.ts` nem `testes/`: a correção usa os originais.

Para começar, sigam o `GUIA.md`. Depois dele, os comandos são:

```bash
npm install
npm test          # correção automática: mostra os pontos
npm start         # serviço em http://localhost:3000
npm run bench     # com o serviço no ar: 200 pedidos simultâneos no evento 1, dois por poltrona
```

Exemplo de pedido:

```bash
curl -X POST localhost:3000/reservas -H 'Content-Type: application/json' \
  -d '{"eventoId":1,"ingressos":[{"nome":"Ana","idade":20,"estudante":true,"pcd":false,"poltrona":7}]}'
```

---

## Preencham (avaliado no vídeo)

**Link do vídeo:** 

### Integrantes

| Nome | Usuário do GitHub | Parte principal |
| :--- | :--- | :--- |
| Maria Clara | MaraLeao | Estrutura do repositório, OO (`dominio.ts`) e concorrência (`bilheteria.ts`) |
| Gabriel Guberson | Gabril64 | Funcional (`regras.ts` e `preco.ts`) |
| Eduardo Ramalho | eduardoramalhoz | `main.ts`, bench, README e vídeo |

### Decisões

1. **Concorrência.** Como vocês garantem que duas pessoas não ficam com a mesma poltrona? Onde estava o
   `await` perigoso?

   **Resposta**: A poltrona é marcada antes do pagamento. Um pedido só dá a vez para outro no `await`, e a
   marcação acontece antes dele. Então, quando o segundo pedido chega, a poltrona já está ocupada e
   ele recebe erro 409 sem ser cobrado.

   O `await` perigoso é o do pagamento. Se a poltrona fosse marcada depois dele, várias pessoas
   seriam cobradas pela mesma poltrona enquanto esperavam a operadora. Se o pagamento falha ou
   demora demais, a poltrona é devolvida com `liberar`.

2. **OO.** O que o `Evento` esconde e por quê? Por que o `reservar` é tudo ou nada? Por que os erros são uma hierarquia de classes?

   **Resposta**: O `Evento` esconde a lista de poltronas vendidas (`#vendidas`). De fora só dá para ver quantas
   restam (`disponivel`). Assim, as poltronas só mudam pelo `reservar` e pelo `liberar`, que
   conferem tudo antes.

   O `reservar` é tudo ou nada porque uma família compra junta: não faz sentido vender só parte das
   poltronas. Ele confere todas primeiro e só depois marca.

   Os erros são uma hierarquia porque cada um guarda o próprio status HTTP (400, 404, 409, 502).
   Assim o servidor só lê `erro.status`, sem precisar de um `if` para cada erro.

3. **Funcional.** O que ganhamos com `preco.ts` puro? Como vocês testariam ele sem subir o servidor?

   **Resposta**: Com o preco.ts puro, ganhamos reutilização, organização e facilidade de manutenção, pois as funções não dependem do servidor nem de estados externos, tornando seus resultados mais previsíveis.

   Podemos testá-lo diretamente, chamando as funções com diferentes valores e verificando os resultados esperados, sem precisar subir o servidor. Assim, validamos os cálculos e identificamos erros de forma rápida e isolada.
   
5. **Se fosse em outro paradigma.** Escolham uma das partes e expliquem como ficaria em outro
   paradigma, e se ficaria melhor ou pior.

   **Resposta**: Escolhemos o `Evento` no paradigma funcional. Em vez de mudar o objeto, o `reservar` devolveria
   um evento novo com as poltronas marcadas.

   Ficaria mais fácil de testar, mas pior para este problema: todos os pedidos precisam ver o
   mesmo evento atualizado, então alguém ainda teria que guardar e trocar o "evento atual" a cada
   venda. No OO, o próprio objeto guarda o estado e protege as poltronas.

6. **Concorrente × paralelo.** O Node roda o JavaScript numa linha só: os pedidos de vocês são
   concorrentes, não paralelos. O que mudaria se a venda rodasse em vários núcleos ao mesmo tempo?

   **Resposta**: Hoje só um pedido roda por vez, e eles só se alternam no `await`. Por isso conferir e marcar a
   poltrona nunca é interrompido, e não precisamos de trava.

   Em vários núcleos, dois pedidos poderiam conferir a mesma poltrona ao mesmo tempo, os dois
   veriam ela livre e os dois marcariam. Aí seria preciso uma trava para só um pedido mexer
   nas poltronas por vez, ou deixar o banco de dados garantir isso.

### Resultados do bench

| Cenário | Pedidos | Tempo (ms) | Vendidos | Poltrona ocupada | Falha de pagamento |
| :--- | ---: | ---: | ---: | ---: | ---: |
| Padrão (`main.ts`) | 200 | | | | |

O bench ocupa as poltronas do evento 1: para rodar de novo, parem o `npm start` (Ctrl+C) e subam outra
vez.

O que os números mostram:
