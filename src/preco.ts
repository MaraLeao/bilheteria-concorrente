import type { Pessoa, Ingresso, TipoIngresso } from "./tipos.ts";

export function valorDoIngresso(precoBase: number) {
  return (tipo: TipoIngresso): number =>
    Math.round((tipo === "meia" ? precoBase / 2 : precoBase) * 100) / 100;
}


export function aplicarTaxa(percentual: number) {
  return (valor: number): number => Math.round(valor * (1 + percentual) * 100) / 100;
}


export function montarIngressos(
  precoBase: number,
  pessoas: Pessoa[],
  temDireitoAMeia: (pessoa: Pessoa) => boolean,
): Ingresso[] {
  const obterValor = valorDoIngresso(precoBase);
  return pessoas.map((pessoa) => {
    const tipo: TipoIngresso = temDireitoAMeia(pessoa) ? "meia" : "inteira";
    return {
      nome: pessoa.nome,
      poltrona: pessoa.poltrona,
      tipo,
      valor: obterValor(tipo),
    };
  });
}


export function calcularTotal(ingressos: Ingresso[]): number {
  if (ingressos.length === 0) return 0;
  const subtotal = ingressos.reduce((total, ingresso) => total + ingresso.valor, 0);
  return aplicarTaxa(0.1)(subtotal);
}
