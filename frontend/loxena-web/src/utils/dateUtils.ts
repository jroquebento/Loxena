const formatadorDataBrasileira = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});

const formatadorHoraBrasileira = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23'
});

export function formatDataBrasileira(data: string): string {
  const dataNormalizada = data.trim();
  const possuiFusoHorario = /(?:Z|[+-]\d{2}:\d{2})$/i.test(dataNormalizada);
  const dataUtc = new Date(possuiFusoHorario ? dataNormalizada : `${dataNormalizada}Z`);
  return `${formatadorDataBrasileira.format(dataUtc)} ${formatadorHoraBrasileira.format(dataUtc)}`;
}
