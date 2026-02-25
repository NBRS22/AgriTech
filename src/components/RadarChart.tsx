import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { EquipementData } from '../data/equipement';
import { typesEquipement, equipementLabels, filiereColors, equipementData, usageData } from '../data/equipement';

interface RadarChartProps {
  filiere: 'comparaison' | 'vegetale' | 'animale';
  echelle: 'lineaire' | 'racine_carree' | 'logarithmique';
  selectedSpecialisations: Set<string>;
  allSpecialisations: string[];
  selectedFilieres?: Set<string>;
}

export default function RadarChart({ filiere, echelle, selectedSpecialisations, allSpecialisations, selectedFilieres }: RadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width || 800);
      }
    });
    observer.observe(containerRef.current);
    setContainerWidth(containerRef.current.clientWidth || 800);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const popupW = filiere === 'comparaison' ? 280 : 0;
    const width = Math.min(filiere === 'comparaison' ? 1100 : 900, containerWidth || 900);
    const height = 490;
    const margin = 70;
    const radarAreaWidth = width - (filiere === 'comparaison' ? popupW + 40 : 0);
    const radius = Math.min(radarAreaWidth, height) / 2 - margin;

    const radarOffsetX = radarAreaWidth / 2;
    const radarOffsetY = height / 2;
    const popupFixedX = radarAreaWidth + 20;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g')
      .attr('transform', `translate(${radarOffsetX}, ${radarOffsetY})`);

    let data: EquipementData[];
    let categories: string[];
    let colorScale: d3.ScaleOrdinal<string, string>;

    if (filiere === 'comparaison') {
      const grouped = d3.rollup(
        equipementData,
        v => d3.mean(v, d => d.taux)!,
        d => d.filiere,
        d => d.equipement
      );

      data = [];
      for (const [fil, equips] of grouped) {
        for (const [equip, taux] of equips) {
          data.push({
            filiere: fil as 'vegetale' | 'animale',
            specialisation: fil,
            equipement: equip,
            taux: Math.round(taux * 10) / 10
          });
        }
      }
      const allFilieres = ['vegetale', 'animale'];
      categories = allFilieres.filter(f => !selectedFilieres || selectedFilieres.has(f));
      data = data.filter(d => categories.includes(d.filiere));
      colorScale = d3.scaleOrdinal<string>()
        .domain(categories)
        .range([filiereColors.vegetale, filiereColors.animale]);
    } else {
      data = equipementData.filter(
        d => d.filiere === filiere && selectedSpecialisations.has(d.specialisation)
      );
      categories = [...selectedSpecialisations].sort();
      // Use allSpecialisations for stable color assignment regardless of what's selected
      colorScale = d3.scaleOrdinal<string>()
        .domain(allSpecialisations)
        .range(d3.schemeTableau10);
    }

    if (categories.length === 0) return;

    const dataByCategory = d3.group(data, d =>
      filiere === 'comparaison' ? d.filiere : d.specialisation
    );

    const maxValue = d3.max(data, d => d.taux) || 100;
    let maxScale: number;
    if (maxValue <= 10) maxScale = Math.ceil(maxValue / 2) * 2;
    else if (maxValue <= 50) maxScale = Math.ceil(maxValue / 10) * 10;
    else maxScale = Math.ceil(maxValue / 20) * 20;
    if (maxScale < 8) maxScale = 10;

    const angleScale = d3.scaleBand()
      .domain(typesEquipement as unknown as string[])
      .range([0, 2 * Math.PI])
      .align(0);

    let radiusScale: d3.ScaleContinuousNumeric<number, number>;
    if (echelle === 'lineaire') {
      radiusScale = d3.scaleLinear().domain([0, maxScale]).range([0, radius]);
    } else if (echelle === 'racine_carree') {
      radiusScale = d3.scaleSqrt().domain([0, maxScale]).range([0, radius]);
    } else {
      radiusScale = d3.scaleLog().domain([0.1, maxScale]).range([0, radius]).clamp(true);
    }

    const getAngle = (type: string) => (angleScale(type) || 0) + angleScale.bandwidth() / 2;
    const safeVal = (v: number) => echelle === 'logarithmique' && v < 0.1 ? 0.1 : v;

    // Grid
    let gridLevels: number[];
    if (echelle === 'lineaire') {
      const step = maxScale / 5;
      gridLevels = d3.range(step, maxScale + step, step).map(v => Math.round(v * 10) / 10);
    } else if (echelle === 'racine_carree') {
      gridLevels = [0.2, 0.4, 0.6, 0.8, 1].map(f => Math.round(f * maxScale * 10) / 10);
    } else {
      gridLevels = maxScale <= 10 ? [0.5, 1, 2, 5, maxScale]
        : maxScale <= 50 ? [0.5, 1, 2, 5, 10, 20, maxScale]
        : [0.5, 1, 2, 5, 10, 20, 40, maxScale];
      gridLevels = gridLevels.filter(v => v <= maxScale);
    }

    const grid = g.append('g').attr('class', 'grid');

    grid.selectAll('circle')
      .data(gridLevels)
      .join('circle')
      .attr('r', level => radiusScale(safeVal(level)))
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    grid.selectAll('.grid-label')
      .data(gridLevels)
      .join('text')
      .attr('class', 'grid-label')
      .attr('y', level => -radiusScale(safeVal(level)))
      .attr('x', 6)
      .text(level => `${level}%`)
      .attr('font-size', 10)
      .attr('fill', '#9ca3af');

    // Axes
    const axes = g.append('g').attr('class', 'axes');

    typesEquipement.forEach(type => {
      const angle = getAngle(type) - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      axes.append('line')
        .attr('x1', 0).attr('y1', 0)
        .attr('x2', x).attr('y2', y)
        .attr('stroke', '#d1d5db')
        .attr('stroke-width', 1.5);

      const labelX = Math.cos(angle) * (radius + 55);
      const labelY = Math.sin(angle) * (radius + 55);

      const labelGroup = axes.append('g')
        .attr('transform', `translate(${labelX}, ${labelY})`)
        .style('cursor', 'default');

      labelGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .text(equipementLabels[type])
        .attr('font-size', 11)
        .attr('font-weight', '600')
        .attr('fill', '#374151');
    });

    // Radar paths
    const radarLine = d3.lineRadial<EquipementData>()
      .angle(d => getAngle(d.equipement))
      .radius(d => radiusScale(safeVal(d.taux)))
      .curve(d3.curveLinearClosed);

    const radarGroup = g.append('g').attr('class', 'radar-lines');

    radarGroup.selectAll('.radar-path')
      .data(categories)
      .join('path')
      .attr('class', 'radar-path')
      .attr('d', cat => radarLine(dataByCategory.get(cat) || []))
      .attr('fill', cat => colorScale(cat))
      .attr('fill-opacity', 0.2)
      .attr('stroke', cat => colorScale(cat))
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseenter', function(_, cat) {
        d3.select(this).attr('fill-opacity', 0.4).attr('stroke-width', 5);
        radarGroup.selectAll('.radar-path').filter(c => c !== cat)
          .attr('fill-opacity', 0.05).attr('stroke-width', 2);
      })
      .on('mouseleave', () => {
        radarGroup.selectAll('.radar-path')
          .attr('fill-opacity', 0.2).attr('stroke-width', 3);
      });

    // Tooltip
    const tooltip = g.append('g').attr('class', 'point-tooltip').attr('opacity', 0).style('pointer-events', 'none');
    const tooltipRect = tooltip.append('rect')
      .attr('rx', 6).attr('fill', '#1e293b').attr('opacity', 0.9)
      .attr('height', 24);
    const tooltipText = tooltip.append('text')
      .attr('fill', '#fff').attr('font-size', 12).attr('font-weight', '600')
      .attr('dominant-baseline', 'middle').attr('text-anchor', 'middle');

    // Points
    const allPoints: (EquipementData & { category: string })[] = [];
    for (const [category, categoryData] of dataByCategory) {
      categoryData.forEach(d => allPoints.push({ ...d, category }));
    }

    radarGroup.selectAll('.radar-point')
      .data(allPoints)
      .join('circle')
      .attr('class', 'radar-point')
      .attr('cx', d => {
        const angle = getAngle(d.equipement) - Math.PI / 2;
        return Math.cos(angle) * radiusScale(safeVal(d.taux));
      })
      .attr('cy', d => {
        const angle = getAngle(d.equipement) - Math.PI / 2;
        return Math.sin(angle) * radiusScale(safeVal(d.taux));
      })
      .attr('r', 7)
      .attr('fill', d => colorScale(d.category))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', filiere === 'comparaison' ? 'pointer' : 'default')
      .on('mouseenter', function(_, d) {
        d3.select(this).transition().duration(100).attr('r', filiere === 'comparaison' ? 10 : 9);

        const angle = getAngle(d.equipement) - Math.PI / 2;
        const cx = Math.cos(angle) * radiusScale(safeVal(d.taux));
        const cy = Math.sin(angle) * radiusScale(safeVal(d.taux));

        const label = `${d.taux}%`;
        tooltipText.text(label);
        const textW = (tooltipText.node()?.getComputedTextLength() || label.length * 7) + 16;
        tooltipRect.attr('width', textW).attr('x', -textW / 2).attr('y', -12);
        tooltipText.attr('x', 0).attr('y', 0);
        tooltip.attr('transform', `translate(${cx},${cy - 20})`).attr('opacity', 1).raise();
      })
      .on('mouseleave', function() {
        d3.select(this).transition().duration(100).attr('r', 7);
        tooltip.attr('opacity', 0);
      });

    // Point click — comparaison mode only
    if (filiere === 'comparaison') {
      radarGroup.selectAll<SVGCircleElement, EquipementData & { category: string }>('.radar-point')
        .on('click', function(event, d) {
          event.stopPropagation();
          const existing = svg.select('.donut-overlay');
          if (!existing.empty() &&
              existing.attr('data-eq') === d.equipement &&
              existing.attr('data-cat') === d.category) {
            drawEmptyPanel(svg, popupFixedX, height);
            return;
          }
          drawDonut(svg, d, popupFixedX, height);
          svg.select('.donut-overlay')
            .attr('data-eq', d.equipement)
            .attr('data-cat', d.category);
        });
    }

    // Draw initial empty panel (comparaison mode only)
    if (filiere === 'comparaison') {
      drawEmptyPanel(svg, popupFixedX, height);
    }

    // Empty panel function (comparaison mode only)
    function drawEmptyPanel(
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      fixedX: number,
      svgHeight: number
    ) {
      svg.select('.donut-overlay').remove();

      const localPopupW = 280;
      const popupH = 320;
      const px = fixedX;
      const py = (svgHeight - popupH) / 2;

      const overlay = svg.append('g')
        .attr('class', 'donut-overlay')
        .attr('transform', `translate(${px}, ${py})`);

      // Shadow filter
      let defs = svg.select('defs') as d3.Selection<SVGDefsElement, unknown, null, undefined>;
      if (defs.empty()) defs = svg.append('defs');
      if (defs.select('#dshadow').empty()) {
        const f = defs.append('filter').attr('id', 'dshadow')
          .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
        f.append('feDropShadow')
          .attr('dx', 0).attr('dy', 2).attr('stdDeviation', 4)
          .attr('flood-color', '#00000020');
      }

      // Background
      overlay.append('rect')
        .attr('width', localPopupW)
        .attr('height', popupH)
        .attr('rx', 12)
        .attr('fill', '#fff')
        .attr('filter', 'url(#dshadow)');

      // Icon
      overlay.append('text')
        .attr('x', localPopupW / 2)
        .attr('y', popupH / 2 - 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', 40)
        .text('👆');

      // Message
      overlay.append('text')
        .attr('x', localPopupW / 2)
        .attr('y', popupH / 2 + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', '600')
        .attr('fill', '#64748b')
        .text('Sélectionnez un point');

      overlay.append('text')
        .attr('x', localPopupW / 2)
        .attr('y', popupH / 2 + 42)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('fill', '#94a3b8')
        .text('pour voir la répartition');

      overlay.append('text')
        .attr('x', localPopupW / 2)
        .attr('y', popupH / 2 + 58)
        .attr('text-anchor', 'middle')
        .attr('font-size', 11)
        .attr('fill', '#94a3b8')
        .text('des usages');
    }

    // Donut drawing function
    function drawDonut(
      svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
      datum: EquipementData & { category: string },
      fixedX: number,
      svgHeight: number
    ) {
      svg.select('.donut-overlay').remove();

      const fil = filiere === 'comparaison' ? datum.filiere : filiere;
      
      const getCategorieUsage = (equipement: string, f: string) => ({
        logiciel_specialise: 'Logiciels spécialisés',
        outil_aide_decision: "Outils d'aide à la décision",
        materiel_precision: 'Matériels précision',
        robot: f === 'animale' ? 'Robots automates' : 'Robots'
      }[equipement] || '');

      const categorie = getCategorieUsage(datum.equipement, fil);
      const usageRows = usageData.filter(d => d.filiere === fil && d.categorie === categorie);
      if (usageRows.length === 0) return;

      const dR = 70;
      const dHole = 40;
      const localPopupW = 280;
      const rowH = 20;
      const titleDonutGap = 28;
      const donutLegendGap = titleDonutGap;
      const popupH = 50 + titleDonutGap + dR * 2 + donutLegendGap + usageRows.length * rowH + 16;

      const px = fixedX;
      const py = (svgHeight - popupH) / 2;

      const overlay = svg.append('g')
        .attr('class', 'donut-overlay')
        .attr('transform', `translate(${px}, ${py})`);

      // Shadow filter
      let defs = svg.select('defs') as d3.Selection<SVGDefsElement, unknown, null, undefined>;
      if (defs.empty()) defs = svg.append('defs');
      if (defs.select('#dshadow').empty()) {
        const f = defs.append('filter').attr('id', 'dshadow')
          .attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
        f.append('feDropShadow')
          .attr('dx', 0).attr('dy', 2).attr('stdDeviation', 4)
          .attr('flood-color', '#00000030');
      }

      // Background
      overlay.append('rect')
        .attr('width', localPopupW)
        .attr('height', popupH)
        .attr('rx', 12)
        .attr('fill', '#fff')
        .attr('filter', 'url(#dshadow)');

      // Title
      overlay.append('text')
        .attr('x', localPopupW / 2)
        .attr('y', 22)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('font-weight', '700')
        .attr('fill', '#222')
        .text(equipementLabels[datum.equipement]);

      overlay.append('text')
        .attr('x', localPopupW / 2)
        .attr('y', 38)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#999')
        .text(`${fil === 'vegetale' ? 'Végétale' : 'Animale'} — répartition des usages`);

      // Donut (with space below title for popup)
      const donutGroup = overlay.append('g')
        .attr('transform', `translate(${localPopupW / 2}, ${50 + titleDonutGap + dR})`);

      const colorDonut = d3.scaleOrdinal<string>()
        .domain(usageRows.map(d => d.usage))
        .range(d3.schemeSet2);

      const pie = d3.pie<typeof usageRows[0]>().value(d => d.part).sort(null);
      const arc = d3.arc<d3.PieArcDatum<typeof usageRows[0]>>().innerRadius(dHole).outerRadius(dR);
      const arcHover = d3.arc<d3.PieArcDatum<typeof usageRows[0]>>().innerRadius(dHole).outerRadius(dR + 6);

      // Tooltip (positioned above donut)
      const ttY = -dR - 20;
      const tooltip = donutGroup.append('g').attr('opacity', 0).style('pointer-events', 'none');
      tooltip.append('rect')
        .attr('x', -70).attr('y', ttY - 10)
        .attr('width', 140).attr('height', 20)
        .attr('rx', 4).attr('fill', '#333').attr('opacity', 0.9);
      const ttText = tooltip.append('text')
        .attr('x', 0).attr('y', ttY)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#fff');

      donutGroup.selectAll('.arc')
        .data(pie(usageRows))
        .join('g')
        .attr('class', 'arc')
        .append('path')
        .attr('d', arc)
        .attr('fill', d => colorDonut(d.data.usage))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .style('cursor', 'pointer')
        .on('mouseenter', function(_, d) {
          d3.select(this).transition().duration(100).attr('d', arcHover as any);
          ttText.text(`${d.data.usage} : ${d.data.part}%`);
          tooltip.attr('opacity', 1);
        })
        .on('mouseleave', function() {
          d3.select(this).transition().duration(100).attr('d', arc as any);
          tooltip.attr('opacity', 0);
        });

      // Center text
      donutGroup.append('text')
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', 18)
        .attr('font-weight', '700')
        .attr('fill', '#333')
        .text(`${datum.taux}%`);

      // Usage legend — single column centered (same gap as title-donut)
      const lgGrp = overlay.append('g')
        .attr('transform', `translate(${(localPopupW - 200) / 2}, ${50 + titleDonutGap + dR * 2 + donutLegendGap})`);

      usageRows.forEach((d, i) => {
        const lg = lgGrp.append('g')
          .attr('transform', `translate(0, ${i * rowH})`);
        lg.append('rect')
          .attr('width', 9)
          .attr('height', 9)
          .attr('y', -1)
          .attr('rx', 2)
          .attr('fill', colorDonut(d.usage));
        lg.append('text')
          .attr('x', 13)
          .attr('y', 3)
          .attr('dominant-baseline', 'middle')
          .attr('font-size', 10)
          .attr('fill', '#555')
          .text(`${d.usage} (${d.part}%)`);
      });
    }

    // Auto-resize SVG to fit content tightly
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox();
      const paddingY = 12;
      const newHeight = bbox.y + bbox.height + paddingY;
      d3.select(svgRef.current)
        .attr('height', newHeight)
        .attr('viewBox', [0, 0, width, newHeight]);
    }

  }, [filiere, echelle, selectedSpecialisations, selectedFilieres, containerWidth]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="mx-auto block"></svg>
    </div>
  );
}
