import type { LeagueGroup, NormalizedMatch } from './types';

function matchLine(match: NormalizedMatch): string {
  return `${match.homeTeam} vs ${match.awayTeam} a las ${match.time}`;
}

export function buildHomeSeoParagraphs(matches: NormalizedMatch[]): string[] {
  const topMatches = matches.slice(0, 3).map(matchLine).join(', ');
  return [
    `Tarjeta Roja TV organiza los partidos en vivo del dia en un formato rapido de leer, con futbol, MLB, NBA, NHL y mas deportes en una sola portada. Hoy destacamos ${topMatches}.`,
    `Tambien cubrimos las busquedas relacionadas con Roja Directa y Pirlo TV, pero la identidad principal del sitio es Tarjeta Roja TV: horarios claros, canales disponibles y cuatro servidores por canal para cada partido compatible.`,
  ];
}

export function buildHubSeoParagraphs(label: string, matches: NormalizedMatch[]): string[] {
  const lead = matches.slice(0, 2).map(matchLine).join(', ');
  return [
    `${label} en vivo hoy en Tarjeta Roja TV. Aqui puedes revisar ${matches.length} partidos actualizados, con horarios, idiomas y accesos rapidos para entrar al partido correcto sin navegar varias paginas.`,
    `Entre los cruces destacados de este bloque estan ${lead}. Tambien mantenemos visibles las variantes de busqueda relacionadas con Roja Directa y Pirlo TV para cubrir la demanda real del usuario hispanohablante.`,
  ];
}

export function buildBrandSeoParagraphs(brand: string, matches: NormalizedMatch[]): string[] {
  const lead = matches.slice(0, 2).map(matchLine).join(', ');
  return [
    `${brand} es una de las formas mas buscadas para encontrar partidos en vivo gratis. Esta pagina de Tarjeta Roja TV reune los encuentros del dia, como ${lead}, con acceso directo a canales y servidores disponibles.`,
    `Si llegaste buscando ${brand}, Roja Directa o Pirlo TV, aqui tienes una alternativa ordenada y enfocada en la programacion del dia, con ligas destacadas, horarios multi-zona y preguntas frecuentes listas para responder la intencion de busqueda.`,
  ];
}

export function buildLeagueSeoParagraphs(group: LeagueGroup): string[] {
  const lead = group.matches.slice(0, 2).map(matchLine).join(', ');
  return [
    `${group.displayName} en vivo hoy en Tarjeta Roja TV. Esta portada de liga concentra ${group.matches.length} partidos y deja visibles los horarios, los idiomas disponibles y los accesos a cada transmision.`,
    `Entre los partidos mas relevantes aparecen ${lead}. La pagina esta preparada para responder consultas del tipo donde ver, a que hora juega y en que canal transmiten cada cruce de ${group.displayName}.`,
  ];
}

export function buildTeamSeoParagraphs(teamName: string, matches: NormalizedMatch[]): string[] {
  const lead = matches.slice(0, 2).map(matchLine).join(', ');
  return [
    `${teamName} en vivo hoy y en sus proximos partidos dentro de Tarjeta Roja TV. Este perfil agrupa ${matches.length} encuentros relacionados con el equipo y facilita saltar al partido correcto desde una sola pagina.`,
    `Los cruces mas visibles del equipo incluyen ${lead}. Tambien usamos esta pagina para captar busquedas como donde mirar ${teamName} hoy o en que canal juega ${teamName}.`,
  ];
}

export function buildMatchSeoParagraphs(match: NormalizedMatch): string[] {
  return [
    `Ver ${match.homeTeam} vs ${match.awayTeam} en vivo por ${match.leagueDisplayName}. El partido empieza a las ${match.time} y cuenta con ${match.channelCount} canales, cuatro servidores por canal y un resumen de horarios internacionales para seguirlo desde varios paises.`,
    `Tarjeta Roja TV prioriza esta pagina como destino directo para consultas de ${match.homeTeam} contra ${match.awayTeam}, incluyendo variantes asociadas a Roja Directa y Pirlo TV. La informacion clave esta arriba: canales, horarios, servidores y partidos relacionados.`,
  ];
}
