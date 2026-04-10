import type { FaqEntry, NormalizedMatch } from './types';

export function buildMatchFaq(match: Pick<
  NormalizedMatch,
  'homeTeam' | 'awayTeam' | 'leagueDisplayName' | 'time' | 'channelCount' | 'timezoneRow'
>): FaqEntry[] {
  return [
    {
      question: `Donde mirar ${match.homeTeam} contra ${match.awayTeam}?`,
      answer: `Puedes ver ${match.homeTeam} vs ${match.awayTeam} en vivo gratis aqui en Tarjeta Roja TV. El partido comienza a las ${match.time} y esta disponible en ${match.channelCount} canales.`,
    },
    {
      question: `A que hora juega ${match.homeTeam} hoy?`,
      answer: `${match.homeTeam} juega a las ${match.time} contra ${match.awayTeam} por ${match.leagueDisplayName}. Horarios destacados: ${match.timezoneRow}.`,
    },
    {
      question: `En que canal se transmite ${match.homeTeam} vs ${match.awayTeam}?`,
      answer: `El partido ${match.homeTeam} vs ${match.awayTeam} se puede seguir en ${match.channelCount} canales y cuatro servidores por canal en Tarjeta Roja TV.`,
    },
  ];
}

export function buildHubFaq(label: string, matches: NormalizedMatch[]): FaqEntry[] {
  const examples = matches.slice(0, 2).map((match) => `${match.homeTeam} vs ${match.awayTeam}`);
  return [
    {
      question: `Donde ver ${label} en vivo?`,
      answer: `Puedes ver ${label.toLowerCase()} en vivo gratis en Tarjeta Roja TV. Hoy hay ${matches.length} partidos disponibles, incluyendo ${examples.join(' y ')}.`,
    },
    {
      question: `Que partidos hay hoy de ${label}?`,
      answer: `Hoy hay ${matches.length} partidos de ${label.toLowerCase()} en vivo. Consulta los horarios, canales y servidores actualizados en esta pagina.`,
    },
  ];
}

