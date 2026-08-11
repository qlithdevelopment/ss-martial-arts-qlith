import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Award, Check, Edit2, Trash2 } from 'lucide-react';

const BELTS = [
  { name: 'white', label: 'White', hex: '#fffffc', textDark: true },
  { name: 'yellow', label: 'Yellow', hex: '#eab308', textDark: true },
  { name: 'orange', label: 'Orange', hex: '#ea580c', textDark: false },
  { name: 'green', label: 'Green', hex: '#15803d', textDark: false },
  { name: 'blue', label: 'Blue', hex: '#1d4ed8', textDark: false },
  { name: 'purple', label: 'Purple', hex: '#7c3aed', textDark: false },
  { name: 'red 1', label: 'Red 1', hex: '#dc2626', textDark: false },
  { name: 'red 2', label: 'Red 2', hex: '#dc2626', textDark: false },
  { name: 'brown 1', label: 'Brown 1', hex: '#4a2e2a', textDark: false },
  { name: 'brown 2', label: 'Brown 2', hex: '#4a2e2a', textDark: false },
  { name: 'brown 3', label: 'Brown 3', hex: '#4a2e2a', textDark: false },
  { name: 'black', label: 'Black', hex: '#0a0a0a', textDark: false },
].map((belt) => {
  const match = belt.label.match(/(\d+)\s*$/);
  return { ...belt, stripes: match ? parseInt(match[1], 10) : 0 };
});

const KNOWN_COLORS = BELTS.map((b) => b.name).filter(
  (v, i, arr) => arr.indexOf(v) === i
);

const INACTIVE_OPACITY = 0.28;
const ACTIVE_OPACITY = 1;

// Layout constants
const CHART_HEIGHT = 360;
const PADDING = 10;
const GAP = 7;
const ROW_COUNT = BELTS.length;
const ROW_HEIGHT = (CHART_HEIGHT - PADDING * 2 - GAP * (ROW_COUNT - 1)) / ROW_COUNT;

const CALLOUT_WIDTH = 200; // px
const CALLOUT_HEIGHT = 50;
const CALLOUT_GAP_X = 34; // gap between chart edge and column 1
const COLUMN_GAP = 16; // gap between column 1 and column 2
const CALLOUT_MIN_SPACING = 8;

const fmtDate = (dateStr) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : null;

const rowCenterY = (index) =>
  PADDING + index * (ROW_HEIGHT + GAP) + ROW_HEIGHT / 2;


const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

// Fabric-like sheen overlay — a soft diagonal highlight across the belt
const Sheen = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background:
        'linear-gradient(115deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0) 45%, rgba(0,0,0,0.06) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// Elastic "loop tabs" like the ones holding real belts on a rack
const LoopTab = ({ side }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      [side]: '22%',
      width: '6px',
      background:
        'linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))',
      borderRadius: '3px',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
      pointerEvents: 'none',
    }}
  />
);

// Vertical tape-mark stripes indicating sub-rank (kyu level)
const StripeMarks = ({ count, dark }) => {
  if (!count) return null;
  const barColor = 'black';

  let r;
  if (count === 1) {
    r = 50;
  } else if (count === 2) {
    r = 48;
  } else {
    r = 46;
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: `${r}%`,
        top: '14%',
        bottom: '14%',
        display: 'flex',
        alignItems: 'stretch',
        gap: '15px',
        pointerEvents: 'none',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '5px',
            height: '100%',
            backgroundColor: barColor,
            borderRadius: '2px',
            boxShadow: 'inset 1px 1px 2px -1px white',
            
          }}
        />
      ))}
    </div>
  );
};

const Belts = ({ belts = [], onEditBelt, onDeleteBelt }) => {
  const wrapperRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);
  const isDark = useIsDarkMode();

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setChartWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const detailsByColor = {};
  belts.forEach((record) => {
    const normalized = (record?.belt_position || '').toLowerCase().trim();
    const color = KNOWN_COLORS.find((c) => normalized.includes(c));
    if (!color) return;
    const existing = detailsByColor[color];
    const isNewer =
      !existing || new Date(record.date_of_issue) > new Date(existing._rawDate || 0);
    if (isNewer) {
      detailsByColor[color] = {
        id: record.id,
        belt_position: record.belt_position,
        certification_no: record.certification_no,     
        kyu_no: record.kyu_no,
        date_of_issue: fmtDate(record.date_of_issue) || '—',
        _rawDate: record.date_of_issue,
      };
    }
  });

  // Reserve space for the chart edge + gap + two callout columns + gap between them
  const reservedWidth = CALLOUT_GAP_X + CALLOUT_WIDTH * 2 + COLUMN_GAP;
  const chartInnerWidth = Math.max(0, chartWidth - reservedWidth +50 );

  const activeRows = BELTS.map((belt, index) => ({ belt, index }))
    .filter(({ belt }) => detailsByColor[belt.name])
    .map(({ belt, index }) => ({
      belt,
      index,
      details: detailsByColor[belt.name],
      anchorY: rowCenterY(index),
    }));

  // Split active belts into two columns: 1st, 3rd, 5th... -> column 0; 2nd, 4th, 6th... -> column 1
  const column0Active = [];
  const column1Active = [];
  activeRows.forEach((row, i) => {
    if (i % 2 === 0) {
      column0Active.push(row);
    } else {
      column1Active.push(row);
    }
  });

  // Stack callouts vertically within each column independently, avoiding overlap per column
  const layoutColumn = (rows) => {
    let prevBottom = -Infinity;
    return rows.map((row) => {
      let top = row.anchorY - CALLOUT_HEIGHT / 2;
      if (top < prevBottom + CALLOUT_MIN_SPACING) top = prevBottom + CALLOUT_MIN_SPACING;
      prevBottom = top + CALLOUT_HEIGHT;
      return { ...row, calloutTop: top };
    });
  };

  const column0Callouts = layoutColumn(column0Active).map((c) => ({ ...c, column: 0 }));
  const column1Callouts = layoutColumn(column1Active).map((c) => ({ ...c, column: 1 }));
  const callouts = [...column0Callouts, ...column1Callouts];

  const column0Bottom = column0Callouts.length
    ? column0Callouts[column0Callouts.length - 1].calloutTop + CALLOUT_HEIGHT
    : 0;
  const column1Bottom = column1Callouts.length
    ? column1Callouts[column1Callouts.length - 1].calloutTop + CALLOUT_HEIGHT
    : 0;

  const contentHeight = Math.max(CHART_HEIGHT, column0Bottom + PADDING, column1Bottom + PADDING);

  // X positions for each column's callout box and connector endpoint
  const column0Left = chartInnerWidth + CALLOUT_GAP_X;
  const column1Left = column0Left + CALLOUT_WIDTH + COLUMN_GAP;
  const columnLeft = (col) => (col === 0 ? column0Left : column1Left);

  return (
    <div ref={wrapperRef} style={{ width: '730px' }} className='mt-3 lg:!w-[90%]'>
      <div style={{ position: 'relative', width: '100%', height: `${contentHeight}px` }}>

        {/* Belt chart */}
        <div 
        // className='belt-container'
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${chartInnerWidth}px`,
            height: `${CHART_HEIGHT}px`,
            borderRadius: '20px',
            padding: `${PADDING}px`,
            boxSizing: 'border-box',
            background: isDark
              ? 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
            boxShadow: isDark
              ? '0 12px 32px -10px rgba(0,0,0,0.55), 0 2px 8px -2px rgba(0,0,0,0.35)'
              : '0 12px 32px -10px rgba(0,0,0,0.18), 0 2px 8px -2px rgba(0,0,0,0.06)',
            border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: `${GAP}px`,
          }}
        >
          {BELTS.map((belt, i) => {
            const isActive = Boolean(detailsByColor[belt.name]);
            const textColor = belt.textDark ? '#1a1a1a' : '#ffffff';

            return (
              <div className='md:!pl-[16px]'
                key={i}
                style={{
                  position: 'relative',
                  flex: 1,
                  minHeight: 0,
                  width: '100%',
                  borderRadius: '9px',
                  background: `linear-gradient(180deg, ${belt.hex} 0%, ${belt.hex} 55%, rgba(0,0,0,0.12) 200%)`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 8px',
                  boxSizing: 'border-box',
                  opacity: isActive ? ACTIVE_OPACITY : INACTIVE_OPACITY,
                  filter: isActive ? 'none' : 'saturate(0.9)',
                  transform: isActive ? 'scale(1.015)' : 'scale(1)',
                  transformOrigin: 'left center',
                  boxShadow: isActive
                    ? `0 4px 14px 0px ${belt.hex}aa, 0 0 0 1.5px ${belt.hex}`
                    : isDark
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                    : 'inset 0 0 0 1px rgba(0,0,0,0.5)',
                  border: belt.name === 'white' ? `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : '#d9d9d6'}` : 'none',
                  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                }}
              >
                <Sheen />
                <LoopTab side="left" />
                <LoopTab side="right" />

                <span className='md:!text-[9px]'
                  style={{
                    position: 'relative',
                    fontSize: '6.5px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: textColor,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textShadow: belt.textDark ? 'none' : '0 1px 2px rgba(0,0,0,0.25)',
                  }}
                >
                  {belt.label}
                </span>

                <StripeMarks count={belt.stripes} dark={belt.textDark} />

                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                    }}
                  >
                    <Check size={9} strokeWidth={3.5} color={belt.hex} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connector lines */}
        {chartInnerWidth > 0 && (
          <svg
            width={chartWidth}
            height={contentHeight}
            style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
          >
            {callouts.map(({ belt, anchorY, calloutTop, column }, i) => {
              const startX = chartInnerWidth - 4;
              const startY = anchorY;
              const endX = columnLeft(column) - 6;
              const endY = calloutTop + CALLOUT_HEIGHT / 2;
              const midX = startX + (endX - startX) * 0.55;
              const strokeColor = belt.hex === '#fffffc' ? '#808080' : belt.hex;
              return (
                <g key={i}>
                  <path
                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeOpacity="0.55"
                    strokeWidth="1.5"
                    strokeDasharray="1,4"
                    strokeLinecap="round"
                  />
                  {/* <circle cx={startX} cy={startY} r="2.5" fill={strokeColor} /> */}
                  <circle cx={endX} cy={endY} r="2.5" fill={strokeColor} />
                </g>
              );
            })}
          </svg>
        )}

        {/* Callout badges */}
        {callouts.map(({ belt, details, calloutTop, column }, i) => (
          <div
            key={i}
            className="group"
            style={{
              position: 'absolute',
              left: `${columnLeft(column)}px`,
              top: `${calloutTop}px`,
              width: `${CALLOUT_WIDTH}px`,
              height: `${CALLOUT_HEIGHT}px`,
              borderRadius: '10px',
              background: isDark
                ? 'linear-gradient(180deg, #1e293b, #172033)'
                : 'linear-gradient(180deg, #ffffff, #fbfbfb)',
              border: `1px solid ${belt.hex}33`,
              boxShadow: isDark
                ? `0 3px 10px -3px ${belt.hex === '#fffffc' ? '#808080' : belt.hex}66, 0 1px 2px rgba(0,0,0,0.4)`
                : `0 3px 10px -3px ${belt.hex === '#fffffc' ? '#808080' : belt.hex}55, 0 1px 2px rgba(0,0,0,0.06)`,
              boxSizing: 'border-box',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '999px',
                backgroundColor: `${belt.hex === '#fffffc' ? '#0a0a0a' : belt.hex}1a`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              
              <Award size={10} color={belt.hex === '#fffffc' ? '#808080' : belt.hex}  strokeWidth={2.5} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1.25 }}>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={`Cert #${details.certification_no}`}
              >
               <span className='font-bold uppercase tracking-tight text-gray-700 dark:text-gray-500'> Certificate No :</span> {details.certification_no || '—'}
              </span>
              <span className='text-[8px] font-semibold '>
              <span className='font-bold uppercase tracking-tight text-gray-700 dark:text-gray-500'> Kyu No :</span> {details.kyu_no}

              </span>
              <span
                style={{
                  fontSize: '7.5px',
                  fontWeight: 600,
                  color: isDark ? '#64748b' : '#94a3b8',
                  whiteSpace: 'nowrap',
                }}
              >
                {details.date_of_issue}
              </span>
            </div>

            {/* Edit / Delete — always visible now */}
            {(onEditBelt || onDeleteBelt) && (
              <div
                className="absolute top-1 right-1 flex items-center gap-1"
                style={{ zIndex: 1 }}
              >
                {onEditBelt && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBelt(details);
                    }}
                    title="Edit belt"
                    className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center shadow-sm"
                  >
                    <Edit2 size={10} strokeWidth={2.5} />
                  </button>
                )}
                {onDeleteBelt && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBelt(details.id);
                    }}
                    title="Delete belt"
                    className="w-5 h-5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center shadow-sm"
                  >
                    <Trash2 size={10} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Belts;