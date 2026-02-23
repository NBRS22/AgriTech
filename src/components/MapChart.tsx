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

export default function MapChart({ outilSelectionne }: MapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [robotData, setRobotData] = useState<RobotiqueRow[]>([]);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CSV + GeoJSON once
  useEffect(() => {
    Promise.all([
      d3.csv('/Robotique.csv', d => ({
        region: d.region as string,
        outil: d.outil as string,
        esea_2023: +d.esea_2023!,
        demi_intervalle: +d.demi_intervalle!,
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
  }, []);

  // Render map
  useEffect(() => {
    if (!svgRef.current || !robotData.length || !geoData) return;

    const width = 820;
    const height = 580;

    // Data for the selected outil
    const filtered = robotData.filter(d => d.outil === outilSelectionne);
    const dataMap = new Map(filtered.map(d => [normalizeRegion(d.region), d]));

    const vals = filtered.map(d => d.esea_2023).filter(v => v > 0).sort(d3.ascending);
    const maxVal = d3.max(vals) || 1;

    // Quantile threshold scale → 6 discrete color steps
    const quantileScale = d3.scaleQuantile<string>()
      .domain(vals)
      .range(COLOR_STEPS);

    const getColor = (esea: number) => esea > 0 ? quantileScale(esea) : '#e8edf2';

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

    // White halo filter for readable text labels
    const halo = defs.append('filter').attr('id', 'halo');
    halo.append('feMorphology')
      .attr('in', 'SourceGraphic').attr('operator', 'dilate').attr('radius', 1.5).attr('result', 'e');
    halo.append('feFlood').attr('flood-color', '#fff').attr('result', 'c');
    halo.append('feComposite').attr('in', 'c').attr('in2', 'e').attr('operator', 'in').attr('result', 'o');
    const haloMerge = halo.append('feMerge');
    haloMerge.append('feMergeNode').attr('in', 'o');
    haloMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // ─── Projection ──────────────────────────────────────────────────
    const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .scale(2800)
      .translate([width / 2 - 20, height / 2 + 10]);

    const path = d3.geoPath().projection(projection);

    // ─── Tooltip group ───────────────────────────────────────────────
    const tooltip = svg.append('g')
      .attr('class', 'tooltip').attr('opacity', 0)
      .style('pointer-events', 'none');

    const ttW = 230;
    const ttH = 66;
    const ttRect = tooltip.append('rect')
      .attr('width', ttW).attr('height', ttH).attr('rx', 10)
      .attr('fill', '#1e293b').attr('opacity', 0.96);
    const ttRegion = tooltip.append('text')
      .attr('x', 12).attr('y', 22)
      .attr('font-size', 12).attr('font-weight', '700').attr('fill', '#fff');
    const ttRank = tooltip.append('text')
      .attr('x', ttW - 12).attr('y', 22)
      .attr('text-anchor', 'end')
      .attr('font-size', 10).attr('fill', '#86efac');
    const ttVal = tooltip.append('text')
      .attr('x', 12).attr('y', 42)
      .attr('font-size', 11).attr('fill', '#a8c8e8');
    const ttDi = tooltip.append('text')
      .attr('x', 12).attr('y', 58)
      .attr('font-size', 10).attr('fill', '#7a9ab8');

    // Ranked list for rank badge
    const ranked = [...filtered].sort((a, b) => b.esea_2023 - a.esea_2023);
    const rankMap = new Map(ranked.map((d, i) => [normalizeRegion(d.region), i + 1]));

    const showTooltip = (nom: string) => {
      const key = normalizeRegion(nom);
      const val = dataMap.get(key);
      const rank = rankMap.get(key);
      if (!val) return;
      ttRect.attr('fill', '#1e293b');
      ttRegion.text(nom);
      ttRank.text(rank ? `#${rank} / ${ranked.length}` : '');
      ttVal.text(`Exploitations : ${val.esea_2023.toLocaleString('fr-FR')}`);
      ttDi.text(val.demi_intervalle > 0
        ? `IC ± ${val.demi_intervalle.toLocaleString('fr-FR')}`
        : 'IC non disponible');

    };

    // ─── Region paths ────────────────────────────────────────────────
    const regionsGroup = svg.append('g');

    regionsGroup.selectAll<SVGPathElement, GeoFeature>('path')
      .data(geoData.features)
      .join('path')
      .attr('d', d => path(d as unknown as d3.GeoPermissibleObjects) || '')
      .attr('fill', feature => {
        const val = dataMap.get(normalizeRegion(feature.properties.nom));
        return getColor(val?.esea_2023 ?? 0);
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
        let tx = mx + 14, ty = my - ttH - 10;
        if (tx + ttW > width - 8) tx = mx - ttW - 14;
        if (ty < 8) ty = my + 14;
        tooltip.attr('transform', `translate(${tx},${ty})`).attr('opacity', 1).raise();
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke', '#fff').attr('stroke-width', 1.5);
        tooltip.attr('opacity', 0);
      });

    // ─── Region labels ───────────────────────────────────────────────
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
        const g = d3.select(this);

        g.append('text')
          .attr('y', isSmall ? -5 : -6)
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isSmall ? 6 : 8)
          .attr('font-weight', '700')
          .attr('fill', '#1e293b')
          .attr('filter', 'url(#halo)')
          .text(abrev);

        g.append('text')
          .attr('y', isSmall ? 4 : 7)
          .attr('dominant-baseline', 'middle')
          .attr('font-size', isSmall ? 6 : 9)
          .attr('font-weight', '600')
          .attr('fill', '#1e293b')
          .attr('filter', 'url(#halo)')
          .text(esea > 0 ? esea.toLocaleString('fr-FR') : '—');
      });

    // ─── Discrete step legend ────────────────────────────────────────
    const lgX = 30;
    const lgY = height - 110;
    const stepW = 28;
    const stepH = 14;
    const thresholds = quantileScale.quantiles();
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





    // ─── Top 3 panel ─────────────────────────────────────────────────
    const top3 = ranked.slice(0, 3);
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

      rowG.append('circle')
        .attr('cx', 18).attr('cy', 9).attr('r', 8).attr('fill', medalColors[i]);
      rowG.append('text')
        .attr('x', 18).attr('y', 9)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('font-size', 8).attr('font-weight', '700').attr('fill', '#fff')
        .text(i + 1);

      // Region name — truncate if too long
      const nom = d.region.charAt(0) + d.region.slice(1).toLowerCase();
      const shortNom = nom.length > 20 ? nom.slice(0, 19) + '…' : nom;
      rowG.append('text')
        .attr('x', 32).attr('y', 6)
        .attr('font-size', 9).attr('font-weight', '600').attr('fill', '#1e293b')
        .text(shortNom);

      rowG.append('text')
        .attr('x', 32).attr('y', 18)
        .attr('font-size', 9).attr('fill', '#64748b')
        .text(`${d.esea_2023.toLocaleString('fr-FR')} exploit.`);
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
    <div ref={containerRef} className="w-full">
      <div className="mb-3 px-1 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          Robotique agricole — {outilSelectionne}
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
