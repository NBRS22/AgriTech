import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface RobotiqueRow {
  region: string;
  outil: string;
  esea_2023: number;
  demi_intervalle: number;
}

interface GeoFeature {
  type: string;
  properties: { nom: string; code: string; [key: string]: unknown };
  geometry: unknown;
}

interface GeoData {
  type: string;
  features: GeoFeature[];
}

interface MapChartProps {
  outilSelectionne: string;
  csvSource?: string;
  titre?: string;
}

const ABREV: Record<string, string> = {
  'Auvergne-Rhône-Alpes':       'ARA',
  'Bourgogne-Franche-Comté':    'BFC',
  'Bretagne':                   'BRE',
  'Centre-Val de Loire':        'CVL',
  'Corse':                      'COR',
  'Grand Est':                  'GES',
  'Hauts-de-France':            'HDF',
  'Île-de-France':              'IDF',
  'Normandie':                  'NOR',
  'Nouvelle-Aquitaine':         'NAQ',
  'Occitanie':                  'OCC',
  'Pays de la Loire':           'PDL',
  "Provence-Alpes-Côte d'Azur": 'PAC',
};

// Small regions where labels must stay very small
const SMALL_REGIONS = new Set(['Île-de-France', 'Corse']);

// 6-step green ramp matching the app's green theme
const COLOR_STEPS = [
  '#f0fdf4',
  '#bbf7d0',
  '#4ade80',
  '#16a34a',
  '#166534',
  '#052e16',
];

function normalizeRegion(nom: string): string {
  return nom
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Codes non numériques = données non disponibles (s, execo, ns, etc.)
const NON_NUMERIC_CODES = new Set(['s', 'execo', 'ns', 'p', 'r', 'z', '']);
function parseEsea(val: string | undefined): number {
  if (val == null || val === '' || NON_NUMERIC_CODES.has(val.trim().toLowerCase())) return NaN;
  const n = +val;
  return Number.isNaN(n) ? NaN : n;
}

// Noms officiels des régions (majuscules, accents, tirets)
const REGION_DISPLAY_NAMES: Record<string, string> = {
  'auvergne rhone alpes': 'Auvergne-Rhône-Alpes',
  'bourgogne franche comte': 'Bourgogne-Franche-Comté',
  'bretagne': 'Bretagne',
  'centre val de loire': 'Centre-Val de Loire',
  'corse': 'Corse',
  'grand est': 'Grand Est',
  'hauts de france': 'Hauts-de-France',
  'ile de france': 'Île-de-France',
  'normandie': 'Normandie',
  'nouvelle aquitaine': 'Nouvelle-Aquitaine',
  'occitanie': 'Occitanie',
  'pays de la loire': 'Pays de la Loire',
  'provence alpes cote d azur': 'Provence-Alpes-Côte d\'Azur',
};

export default function MapChart({ outilSelectionne, csvSource = '/robotique_animal.csv', titre = 'Robotique agricole' }: MapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [robotData, setRobotData] = useState<RobotiqueRow[]>([]);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV + GeoJSON once
  useEffect(() => {
    Promise.all([
      d3.csv(csvSource, d => ({
        region: d.region as string,
        outil: d.outil as string,
        esea_2023: parseEsea(d.esea_2023),
        demi_intervalle: parseEsea(d.demi_intervalle),
      })).catch(() => { throw new Error('CSV'); }),
      fetch('/regions.geojson')
        .then(r => { if (!r.ok) throw new Error('GeoJSON'); return r.json(); })
    ])
      .then(([csv, geo]) => {
        setRobotData(csv as RobotiqueRow[]);
        setGeoData(geo as GeoData);
        setLoading(false);
      })
      .catch((e: Error) => {
        setError(`Impossible de charger les données (${e.message}).`);
        setLoading(false);
      });
  }, [csvSource]);

  // Render map
  useEffect(() => {
    if (!svgRef.current || !robotData.length || !geoData) return;

    const width = 720;
    const height = 510;

    const filtered = robotData.filter(
      d => d.outil === outilSelectionne && normalizeRegion(d.region) !== 'total france metropolitaine'
    );
    const dataMap = new Map(filtered.map(d => [normalizeRegion(d.region), d]));

    const vals = filtered.map(d => d.esea_2023).filter(v => v > 0).sort(d3.ascending);

    // Quantile threshold scale → 6 discrete color steps
    const quantileScale = d3.scaleQuantile<string>()
      .domain(vals)
      .range(COLOR_STEPS);

    const COLOR_NO_DATA = '#e2e8f0';
    const COLOR_ZERO = '#e8edf2';
    const getColor = (val: { esea_2023: number } | undefined, esea: number) => {
      const noData = val == null || Number.isNaN(esea);
      if (noData) return COLOR_NO_DATA;
      if (esea === 0) return COLOR_ZERO;
      return quantileScale(esea);
    };

    // Build SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('font-family', "'Inter', system-ui, sans-serif")
      .style('background', '#ffffff')
      .style('border-radius', '16px');

    // ─── Defs ────────────────────────────────────────────────────────
    const defs = svg.append('defs');

    // Drop shadow for regions
    const shadow = defs.append('filter').attr('id', 'rshadow')
      .attr('x', '-4%').attr('y', '-4%').attr('width', '108%').attr('height', '108%');
    shadow.append('feDropShadow')
      .attr('dx', 0).attr('dy', 1).attr('stdDeviation', 1.5)
      .attr('flood-color', '#00000022');

    // White halo filter (dark text on light fills)
    const halo = defs.append('filter').attr('id', 'halo-light');
    halo.append('feMorphology')
      .attr('in', 'SourceGraphic').attr('operator', 'dilate').attr('radius', 2).attr('result', 'e');
    halo.append('feFlood').attr('flood-color', '#ffffff').attr('result', 'c');
    halo.append('feComposite').attr('in', 'c').attr('in2', 'e').attr('operator', 'in').attr('result', 'o');
    const haloMerge = halo.append('feMerge');
    haloMerge.append('feMergeNode').attr('in', 'o');
    haloMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Dark halo filter (white text on dark fills)
    const halo2 = defs.append('filter').attr('id', 'halo-dark');
    halo2.append('feMorphology')
      .attr('in', 'SourceGraphic').attr('operator', 'dilate').attr('radius', 2).attr('result', 'e2');
    halo2.append('feFlood').attr('flood-color', '#052e16').attr('result', 'c2');
    halo2.append('feComposite').attr('in', 'c2').attr('in2', 'e2').attr('operator', 'in').attr('result', 'o2');
    const haloMerge2 = halo2.append('feMerge');
    haloMerge2.append('feMergeNode').attr('in', 'o2');
    haloMerge2.append('feMergeNode').attr('in', 'SourceGraphic');

    // ─── Projection ──────────────────────────────────────────────────
    const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(2450)
      .translate([width / 2 - 20, height / 2 + 10]);

    const path = d3.geoPath().projection(projection);

    // Tooltip shadow filter
    const ttShadow = defs.append('filter').attr('id', 'ttshadow')
      .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    ttShadow.append('feDropShadow')
      .attr('dx', 0).attr('dy', 4).attr('stdDeviation', 8)
      .attr('flood-color', '#000000').attr('flood-opacity', 0.25);

    // ─── Tooltip group ───────────────────────────────────────────────
    const tooltip = svg.append('g')
      .attr('class', 'tooltip').attr('opacity', 0)
      .style('pointer-events', 'none');

    const ttH = 84;
    const ttPad = 16;
    const ttMinW = 300;
    const ttMaxW = 420;
    let currentTtW = ttMinW;
    let currentTtH = ttH;

    // Background with shadow (width updated dynamically)
    const ttRect = tooltip.append('rect')
      .attr('width', currentTtW).attr('height', ttH).attr('rx', 12)
      .attr('fill', '#ffffff')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('filter', 'url(#ttshadow)');

    // Region name
    const ttRegionGroup = tooltip.append('g')
      .attr('transform', `translate(${ttPad + 8}, 10)`);
    const ttRegion = ttRegionGroup.append('text')
      .attr('y', 0)
      .attr('font-size', 14).attr('font-weight', '700')
      .attr('fill', '#0f172a')
      .attr('dominant-baseline', 'hanging');
    // Rank badge group (transform x updated dynamically)
    const rankBadgeGroup = tooltip.append('g')
      .attr('class', 'rank-badge')
      .attr('transform', `translate(${currentTtW - ttPad}, 16)`);

    // Divider (x2 updated dynamically)
    const ttDivider = tooltip.append('line')
      .attr('x1', ttPad + 8).attr('y1', 36)
      .attr('x2', currentTtW - ttPad).attr('y2', 36)
      .attr('stroke', '#e2e8f0').attr('stroke-width', 1);

    // Exploitations label
    const ttExploitationsLabel = tooltip.append('text')
      .attr('x', ttPad + 8).attr('y', 48)
      .attr('font-size', 10).attr('font-weight', '500')
      .attr('fill', '#64748b')
      .text('Exploitations équipées');
    const ttVal = tooltip.append('text')
      .attr('x', ttPad + 8).attr('y', 64)
      .attr('font-size', 13).attr('font-weight', '700')
      .attr('fill', '#0f172a');

    // IC label (x updated dynamically)
    const ttIcLabel = tooltip.append('text')
      .attr('text-anchor', 'end').attr('font-size', 10)
      .attr('font-weight', '500').attr('fill', '#64748b')
      .attr('y', 48)
      .text('Intervalle de confiance');
    const ttDi = tooltip.append('text')
      .attr('text-anchor', 'end').attr('font-size', 11)
      .attr('font-weight', '600').attr('fill', '#64748b')
      .attr('y', 64);

    // Ranked list pour le badge et Top 3 (exclure uniquement données non dispo, inclure 0 exploitation)
    const ranked = [...filtered]
      .filter(d => !Number.isNaN(d.esea_2023))
      .sort((a, b) => b.esea_2023 - a.esea_2023);
    // Classement avec ex-aequo (même rang pour même valeur)
    const rankMap = new Map<string, number>();
    let rank = 1;
    for (let i = 0; i < ranked.length; i++) {
      if (i > 0 && ranked[i].esea_2023 !== ranked[i - 1].esea_2023) rank = i + 1;
      rankMap.set(normalizeRegion(ranked[i].region), rank);
    }

    const RANK_COLORS = ['#f59e0b', '#94a3b8', '#b45309'] as const; // or, argent, bronze

    const wrapRegionName = (text: string, maxWidth: number) => {
      const charWidth = 9;
      if (text.length * charWidth <= maxWidth) return [text];
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let line = '';
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (test.length * charWidth > maxWidth && line) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    const showTooltip = (nom: string) => {
      const key = normalizeRegion(nom);
      const val = dataMap.get(key);
      const rank = rankMap.get(key);
      const hasData = !!val;

      // Largeur dynamique selon le nom (charWidth ≈ 9px, + espace badge 70, + padding)
      const nameWidth = nom.length * 9;
      const badgeSpace = hasData ? 70 : 0;
      currentTtW = Math.max(ttMinW, Math.min(ttMaxW, nameWidth + ttPad * 2 + badgeSpace));
      const regionNameMaxWidth = currentTtW - ttPad * 2 - badgeSpace;

      currentTtH = ttH;
      ttRect.attr('width', currentTtW).attr('height', currentTtH);

      ttRegion.selectAll('tspan').remove();
      const lines = wrapRegionName(nom, regionNameMaxWidth);
      lines.forEach((line, i) => {
        ttRegion.append('tspan')
          .attr('x', 0).attr('dy', i === 0 ? 0 : 18)
          .text(line);
      });

      if (hasData) {
        ttDivider.attr('x2', currentTtW - ttPad).style('visibility', 'visible');
        ttExploitationsLabel.style('visibility', 'visible');
        const eseaVal = val!.esea_2023;
        const eseaNaN = Number.isNaN(eseaVal);
        const eseaText = eseaNaN ? '—' : eseaVal.toLocaleString('fr-FR');
        ttVal.style('visibility', 'visible').text(eseaText);
        ttIcLabel.attr('x', currentTtW - ttPad).style('visibility', 'visible');
        const diVal = val!.demi_intervalle;
        const diNaN = Number.isNaN(diVal);
        const diText = diNaN ? '—' : diVal > 0 ? `± ${diVal.toLocaleString('fr-FR')}` : '0';
        ttDi.attr('x', currentTtW - ttPad).style('visibility', 'visible').text(diText);
        rankBadgeGroup.attr('transform', `translate(${currentTtW - ttPad}, 16)`);
        rankBadgeGroup.selectAll('*').remove();
        if (rank) {
          const isTop3 = rank <= 3;
          const rankLabel = rank === 1 ? '1er' : rank === 2 ? '2e' : rank === 3 ? '3e' : `${rank}e`;
          const displayText = isTop3 ? rankLabel : `${rank} / ${ranked.length}`;
          const badgeColor = isTop3 ? RANK_COLORS[rank - 1] : '#e2e8f0';
          const textColor = isTop3 ? '#ffffff' : '#475569';
          const badgeW = Math.max(displayText.length * 7 + 16, 36);

          rankBadgeGroup.append('rect')
            .attr('x', -badgeW)
            .attr('y', -11)
            .attr('width', badgeW)
            .attr('height', 22)
            .attr('rx', 11)
            .attr('fill', badgeColor);
          rankBadgeGroup.append('text')
            .attr('x', -badgeW / 2)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-size', 11)
            .attr('font-weight', '700')
            .attr('fill', textColor)
            .text(displayText);
        }
      } else {
        ttDivider.attr('x2', currentTtW - ttPad).style('visibility', 'visible');
        ttExploitationsLabel.style('visibility', 'visible');
        ttVal.style('visibility', 'visible').text('—');
        ttIcLabel.attr('x', currentTtW - ttPad).style('visibility', 'visible');
        ttDi.attr('x', currentTtW - ttPad).style('visibility', 'visible').text('—');
        rankBadgeGroup.selectAll('*').remove();
      }
    };

    // ─── Region paths ────────────────────────────────────────────────
    const regionsGroup = svg.append('g');

    regionsGroup.selectAll<SVGPathElement, GeoFeature>('path')
      .data(geoData.features)
      .join('path')
      .attr('d', d => path(d as unknown as d3.GeoPermissibleObjects) || '')
      .attr('fill', feature => {
        const val = dataMap.get(normalizeRegion(feature.properties.nom));
        const esea = val?.esea_2023 ?? 0;
        return getColor(val, esea);
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .attr('filter', 'url(#rshadow)')
      .style('cursor', 'pointer')
      .on('mouseenter', function (_, feature) {
        d3.select(this).attr('stroke', '#1e293b').attr('stroke-width', 2.5);
        showTooltip(feature.properties.nom);
      })
      .on('mousemove', function (event) {
        const [mx, my] = d3.pointer(event, svgRef.current);
        let tx = mx + 14, ty = my - currentTtH - 10;
        if (tx + currentTtW > width - 8) tx = mx - currentTtW - 14;
        if (tx < 8) tx = 8;
        if (ty < 8) ty = my + 14;
        if (ty + currentTtH > height - 8) ty = height - currentTtH - 8;
        tooltip.attr('transform', `translate(${tx},${ty})`).attr('opacity', 1).raise();
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1.5);
        tooltip.attr('opacity', 0);
      });

    // ─── Region labels ───────────────────────────────────────────────
    // Determine text color based on fill darkness
    const getLabelColors = (val: { esea_2023: number } | undefined, esea: number) => {
      const noData = val == null || Number.isNaN(esea);
      if (noData || esea <= 0) return { text: '#64748b', halo: 'url(#halo-light)' };
      const idx = COLOR_STEPS.indexOf(quantileScale(esea));
      return idx >= 3
        ? { text: '#ffffff', halo: 'url(#halo-dark)' }
        : { text: '#1e293b', halo: 'url(#halo-light)' };
    };

    regionsGroup.selectAll<SVGGElement, GeoFeature>('.rlabel')
      .data(geoData.features)
      .join('g')
      .attr('class', 'rlabel')
      .attr('transform', feature => {
        const c = path.centroid(feature as unknown as d3.GeoPermissibleObjects);
        return `translate(${c[0]},${c[1]})`;
      })
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .each(function (feature) {
        const val = dataMap.get(normalizeRegion(feature.properties.nom));
        const esea = val?.esea_2023 ?? 0;
        const isSmall = SMALL_REGIONS.has(feature.properties.nom);
        const abrev = ABREV[feature.properties.nom] ?? feature.properties.nom.slice(0, 4);
        const { text, halo } = getLabelColors(val, esea);
        const g = d3.select(this);

        // Abbreviation
        g.append('text')
          .attr('y', isSmall ? -4 : -5)
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isSmall ? 7 : 10)
          .attr('font-weight', '800')
          .attr('letter-spacing', '0.5')
          .attr('fill', text)
          .attr('filter', halo)
          .text(abrev);

        // Value — tiret si données non disponibles, "0" si zéro exploitation
        const noData = val == null || Number.isNaN(esea);
        const displayText = noData ? '—' : esea.toLocaleString('fr-FR');
        g.append('text')
          .attr('y', isSmall ? 5 : 7)
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isSmall ? 6 : 9)
          .attr('font-weight', '600')
          .attr('fill', text)
          .attr('filter', halo)
          .text(displayText);
      });

    // ─── Discrete step legend ────────────────────────────────────────
    const lgX = 30;
    const lgY = height - 70;
    const stepW = 28;
    const stepH = 14;
    const lgGroup = svg.append('g').attr('transform', `translate(${lgX},${lgY})`);

    lgGroup.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('font-size', 11).attr('font-weight', '700').attr('fill', '#1e293b')
      .text('Exploitations équipées');

    COLOR_STEPS.forEach((color, i) => {
      lgGroup.append('rect')
        .attr('x', i * (stepW + 2)).attr('y', 0)
        .attr('width', stepW).attr('height', stepH)
        .attr('rx', 3).attr('fill', color)
        .attr('stroke', '#cbd5e1').attr('stroke-width', 0.5);
    });


    // ─── Top 3 panel (exclut données non dispo et 0 exploitation) ──────
    const top3 = ranked.filter(d => d.esea_2023 > 0).slice(0, 3);
    const panelX = width - 192;
    const panelY = 60;
    const panelW = 178;
    const panelH = 22 + top3.length * 28 + 10;

    const panel = svg.append('g').attr('transform', `translate(${panelX},${panelY})`);
    panel.append('rect')
      .attr('width', panelW).attr('height', panelH).attr('rx', 10)
      .attr('fill', '#fff').attr('opacity', 0.93)
      .attr('stroke', '#e2e8f0').attr('stroke-width', 1);

    panel.append('text')
      .attr('x', 12).attr('y', 18)
      .attr('font-size', 10).attr('font-weight', '700').attr('fill', '#64748b')
      .text('TOP RÉGIONS');

    const medalColors = ['#f59e0b', '#94a3b8', '#b45309'];
    top3.forEach((d, i) => {
      const rowY = 26 + i * 28;
      const rowG = panel.append('g').attr('transform', `translate(0,${rowY})`);
      const r = rankMap.get(normalizeRegion(d.region)) ?? i + 1;
      const medalColor = medalColors[Math.min(r - 1, 2)];

      rowG.append('circle')
        .attr('cx', 18).attr('cy', 9).attr('r', 8).attr('fill', medalColor);
      rowG.append('text')
        .attr('x', 18).attr('y', 9)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('dy', '0.05em')
        .attr('font-size', 8).attr('font-weight', '700').attr('fill', '#fff')
        .text(r);

      // Nom officiel de la région (majuscules, accents, tirets)
      const nom = REGION_DISPLAY_NAMES[normalizeRegion(d.region)] ?? d.region;
      const shortNom = nom.length > 20 ? nom.slice(0, 19) + '…' : nom;
      rowG.append('text')
        .attr('x', 32).attr('y', 6)
        .attr('font-size', 9).attr('font-weight', '600').attr('fill', '#1e293b')
        .text(shortNom);

      const countText = `${d.esea_2023.toLocaleString('fr-FR')} exploitation${d.esea_2023 !== 1 ? 's' : ''}`;
      rowG.append('text')
        .attr('x', 32).attr('y', 18)
        .attr('font-size', 9).attr('fill', '#64748b')
        .text(countText);
    });

  }, [robotData, geoData, outilSelectionne]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Chargement de la carte…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 text-sm">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 px-1 text-center min-w-0">
        <h3 className="text-lg font-bold text-slate-800 break-words">
          {titre} — {outilSelectionne}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Nombre d'exploitations équipées par région
        </p>
      </div>
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="mx-auto block" />
      </div>
    </div>
  );
}
