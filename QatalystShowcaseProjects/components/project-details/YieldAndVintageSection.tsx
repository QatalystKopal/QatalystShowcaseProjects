'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Project } from '@/lib/projects';
import { Card } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface YieldAndVintageSectionProps {
  project: Project;
}

const kuburayaVintageData = [
  { vintage: '2023', reductions: 815815.21, removals: 535.37, total: 816350.58 },
  { vintage: '2024', reductions: 1028386.12, removals: 1137.11, total: 1029523.23 },
  { vintage: '2025', reductions: 1006061.77, removals: 2988.12, total: 1009049.89 },
  { vintage: '2026', reductions: 1304081.28, removals: 5472.45, total: 1309553.73 },
  { vintage: '2027', reductions: 1188990.05, removals: 12528.45, total: 1201518.50 },
  { vintage: '2028', reductions: 1273781.92, removals: 14142.04, total: 1287923.97 },
  { vintage: '2029', reductions: 1392206.03, removals: 18799.83, total: 1411005.86 },
  { vintage: '2030', reductions: 2467107.35, removals: 22940.91, total: 2490048.26 },
  { vintage: '2031', reductions: 2398146.11, removals: 27120.54, total: 2425266.65 },
  { vintage: '2032', reductions: 2030542.07, removals: 30746.54, total: 2061288.62 },
  { vintage: '2033', reductions: 2162773.61, removals: 35554.00, total: 2198327.61 },
  { vintage: '2034', reductions: 1987555.26, removals: 39734.64, total: 2027289.90 },
  { vintage: '2035', reductions: 2113065.12, removals: 43918.13, total: 2156983.25 },
  { vintage: '2036', reductions: 2390971.04, removals: 48133.44, total: 2439104.48 },
  { vintage: '2037', reductions: 2481916.23, removals: 52324.64, total: 2534240.87 },
  { vintage: '2038', reductions: 1990849.73, removals: 56271.95, total: 2047121.68 },
  { vintage: '2039', reductions: 2039428.90, removals: 60694.52, total: 2100123.42 },
  { vintage: '2040', reductions: 2471843.81, removals: 64858.73, total: 2536702.54 },
  { vintage: '2041', reductions: 3650427.07, removals: 69042.22, total: 3719469.29 },
  { vintage: '2042', reductions: 3110121.55, removals: 72620.02, total: 3182741.58 },
  { vintage: '2043', reductions: 2334609.23, removals: 77427.48, total: 2412036.71 },
  { vintage: '2044', reductions: 2028709.50, removals: 81608.12, total: 2110317.63 },
  { vintage: '2045', reductions: 1802711.82, removals: 85791.62, total: 1888503.43 },
  { vintage: '2046', reductions: 1959897.81, removals: 90006.92, total: 2049904.73 },
  { vintage: '2047', reductions: 1782352.44, removals: 94198.12, total: 1876550.57 },
  { vintage: '2048', reductions: 1773557.61, removals: 98145.43, total: 1871703.04 },
  { vintage: '2049', reductions: 1910917.96, removals: 102568.00, total: 2013485.96 },
  { vintage: '2050', reductions: 2868105.80, removals: 106732.21, total: 2974838.01 },
  { vintage: '2051', reductions: 2730998.65, removals: 110915.70, total: 2841914.36 },
  { vintage: '2052', reductions: 2299890.16, removals: 114493.50, total: 2414383.67 },
];

const sbkVintageData = [
  { vintage: '2022', reductions: 297069, removals: 6426, total: 267076 },
  { vintage: '2023', reductions: 1144420, removals: 140687, total: 1130894 },
  { vintage: '2024', reductions: 1431874, removals: 425860, total: 1634806 },
  { vintage: '2025', reductions: 1221480, removals: 452214, total: 1472851 },
  { vintage: '2026', reductions: 1106966, removals: 472309, total: 1389762 },
  { vintage: '2027', reductions: 1052456, removals: 488507, total: 1356048 },
  { vintage: '2028', reductions: 1278430, removals: 506451, total: 1570695 },
  { vintage: '2029', reductions: 1382003, removals: 520948, total: 1674598 },
  { vintage: '2030', reductions: 1464769, removals: 534570, total: 1759419 },
  { vintage: '2031', reductions: 1414125, removals: 546679, total: 1725508 },
  { vintage: '2032', reductions: 1079792, removals: 548570, total: 1432959 },
  { vintage: '2033', reductions: 979440, removals: 548570, total: 1344649 },
  { vintage: '2034', reductions: 952121, removals: 548570, total: 1320609 },
  { vintage: '2035', reductions: 928423, removals: 548570, total: 1299754 },
  { vintage: '2036', reductions: 908378, removals: 548570, total: 1282114 },
  { vintage: '2037', reductions: 892006, removals: 548570, total: 1267707 },
  { vintage: '2038', reductions: 875411, removals: 548570, total: 1253104 },
  { vintage: '2039', reductions: 862397, removals: 548570, total: 1241651 },
  { vintage: '2040', reductions: 849753, removals: 548570, total: 1230525 },
  { vintage: '2041', reductions: 837697, removals: 539107, total: 1211588 },
  { vintage: '2042', reductions: 835981, removals: 499219, total: 1174976 },
  { vintage: '2043', reductions: 835981, removals: 457430, total: 1138202 },
  { vintage: '2044', reductions: 835981, removals: 457026, total: 1137846 },
  { vintage: '2045', reductions: 754186, removals: 457026, total: 1065866 },
  { vintage: '2046', reductions: 529218, removals: 457026, total: 867895 },
  { vintage: '2047', reductions: 434555, removals: 457026, total: 784591 },
  { vintage: '2048', reductions: 399833, removals: 457026, total: 754036 },
  { vintage: '2049', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2050', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2051', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2052', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2053', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2054', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2055', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2056', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2057', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2058', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2059', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2060', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2061', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2062', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2063', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2064', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2065', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2066', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2067', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2068', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2069', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2070', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2071', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2072', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2073', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2074', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2075', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2076', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2077', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2078', reductions: 387657, removals: 457026, total: 743321 },
  { vintage: '2079', reductions: 387657, removals: 455170, total: 741688 },
  { vintage: '2080', reductions: 387657, removals: 450054, total: 737185 },
  { vintage: '2081', reductions: 387657, removals: 448158, total: 735517 },
  { vintage: '2082', reductions: 270829, removals: 313084, total: 513843 },
];

export function YieldAndVintageSection({ project }: YieldAndVintageSectionProps) {
  const [isMobile, setIsMobile] = useState(false);
  const isKuburaya = project.shortName === 'Kuburaya';

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const vintageData = isKuburaya ? kuburayaVintageData : sbkVintageData;
  const chartData = vintageData.slice(0, 20);

  let totalReductions: number;
  let totalRemovals: number;
  let totalVCUs: number;

  if (isKuburaya) {
    totalReductions = 60795821.22;
    totalRemovals = 1641450.78;
    totalVCUs = 62437272.00;
  } else {
    totalReductions = 38648258;
    totalRemovals = 28189917;
    totalVCUs = 58817594;
  }

  const cellPadding = isMobile ? '8px' : '12px';
  const columnGap = isMobile ? '0px' : '1px';
  const textAlign = isMobile ? 'left' : 'right';

  return (
    <motion.section
      className="py-16 px-2 sm:px-3 lg:px-4 bg-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-black mb-3">Yield & Vintage Intelligence</h2>
          <p className="text-lg text-gray-600">
            Projected VCU issuance and detailed vintage breakdown for full project lifetime (2022–2082)
          </p>
        </motion.div>

        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="p-8 border-gray-200">
            <h3 className="text-xl font-bold text-black mb-6">Projected VCU Issuance (2022–2041)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReductions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRemovals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F86501" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F86501" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="vintage" stroke="#64748b" />
                <YAxis
                  stroke="#64748b"
                  label={{ value: 'VCUs (tCO₂e)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value: number) => {
                    if (value >= 1000000) {
                      return (value / 1000000).toFixed(1) + 'M';
                    }
                    return (value / 1000).toFixed(0) + 'K';
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => {
                    if (typeof value === 'number') {
                      return [value.toLocaleString() + ' tCO₂e', ''];
                    }
                    return value.toLocaleString();
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#0D9488"
                  fillOpacity={0.3}
                  fill="url(#colorReductions)"
                  name="Total VCUs"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Data Table with Frozen Header and Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Card className="border-gray-200 overflow-hidden">
            <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
              {/* Frozen Header */}
              <div
                style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                  background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                  borderBottom: '2px solid #cbd5e1',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 2fr 2fr',
                    gap: columnGap,
                    background: '#cbd5e1',
                    padding: cellPadding,
                    minWidth: isMobile ? '480px' : 'auto',
                  }}
                >
                  <div style={{ background: '#f8fafc', padding: cellPadding, fontWeight: 'bold', color: '#0f172a' }}>
                    Vintage Year
                  </div>
                  <div style={{ background: '#f8fafc', padding: cellPadding, fontWeight: 'bold', color: '#0f172a', textAlign }}>
                    Estimated Reduction VCUs (tCO2e)
                  </div>
                  <div style={{ background: '#f8fafc', padding: cellPadding, fontWeight: 'bold', color: '#0f172a', textAlign }}>
                    Estimated Removal VCUs (tCO2e)
                  </div>
                  <div style={{ background: '#f8fafc', padding: cellPadding, fontWeight: 'bold', color: '#0f172a', textAlign }}>
                    Estimated Total VCUs (tCO2e)
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div style={{ overflowY: 'scroll', overflowX: 'auto', height: 'calc(100% - 56px - 56px)' }}>
                {vintageData.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 2fr 2fr',
                      gap: columnGap,
                      background: '#e2e8f0',
                      borderBottom: '1px solid #e2e8f0',
                      minWidth: isMobile ? '480px' : 'auto',
                    }}
                  >
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: cellPadding, fontWeight: '500', color: '#0f172a' }}>
                      {row.vintage}
                    </div>
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: cellPadding, textAlign, color: '#374151', fontFamily: 'monospace' }}>
                      {row.reductions.toLocaleString()}
                    </div>
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: cellPadding, textAlign, color: '#374151', fontFamily: 'monospace' }}>
                      {row.removals.toLocaleString()}
                    </div>
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: cellPadding, textAlign, color: '#0D9488', fontWeight: '600', fontFamily: 'monospace' }}>
                      {row.total.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Frozen Footer */}
              <div
                style={{
                  position: 'sticky',
                  bottom: 0,
                  zIndex: 10,
                  background: 'linear-gradient(to right, #f1f5f9, #e2e8f0)',
                  borderTop: '2px solid #cbd5e1',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 2fr 2fr',
                    gap: columnGap,
                    background: '#cbd5e1',
                    padding: cellPadding,
                    minWidth: isMobile ? '480px' : 'auto',
                  }}
                >
                  <div style={{ background: '#f1f5f9', padding: cellPadding, fontWeight: 'bold', color: '#0f172a' }}>
                    Total
                  </div>
                  <div style={{ background: '#f1f5f9', padding: cellPadding, fontWeight: 'bold', color: '#0f172a', textAlign, fontFamily: 'monospace' }}>
                    {totalReductions.toLocaleString()}
                  </div>
                  <div style={{ background: '#f1f5f9', padding: cellPadding, fontWeight: 'bold', color: '#0f172a', textAlign, fontFamily: 'monospace' }}>
                    {totalRemovals.toLocaleString()}
                  </div>
                  <div style={{ background: '#f1f5f9', padding: cellPadding, fontWeight: 'bold', color: '#0D9488', textAlign, fontFamily: 'monospace' }}>
                    {totalVCUs.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
