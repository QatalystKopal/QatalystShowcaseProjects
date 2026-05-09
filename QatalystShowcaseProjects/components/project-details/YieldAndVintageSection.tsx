'use client';

import { motion } from 'framer-motion';
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

const vintageData = [
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

const chartData = vintageData.slice(0, 20);

export function YieldAndVintageSection({ project }: YieldAndVintageSectionProps) {
  const totalReductions = 38648258;
  const totalRemovals = 28189917;
  const totalVCUs = 58817594;

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
                <YAxis stroke="#64748b" label={{ value: 'VCUs (units)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => value.toLocaleString()}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="reductions"
                  stackId="1"
                  stroke="#0D9488"
                  fillOpacity={1}
                  fill="url(#colorReductions)"
                  name="Estimated Reductions"
                />
                <Area
                  type="monotone"
                  dataKey="removals"
                  stackId="1"
                  stroke="#F86501"
                  fillOpacity={1}
                  fill="url(#colorRemovals)"
                  name="Estimated Removals"
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
                    gap: '1px',
                    background: '#cbd5e1',
                    padding: '12px',
                  }}
                >
                  <div style={{ background: '#f8fafc', padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                    Vintage Year
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', fontWeight: 'bold', color: '#0f172a', textAlign: 'right' }}>
                    Estimated Reduction VCUs (tCO2e)
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', fontWeight: 'bold', color: '#0f172a', textAlign: 'right' }}>
                    Estimated Removal VCUs (tCO2e)
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', fontWeight: 'bold', color: '#0f172a', textAlign: 'right' }}>
                    Estimated Total VCUs (tCO2e)
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
              <div style={{ overflowY: 'scroll', height: 'calc(100% - 56px - 56px)' }}>
                {vintageData.map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 2fr 2fr',
                      gap: '1px',
                      background: '#e2e8f0',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: '12px', fontWeight: '500', color: '#0f172a' }}>
                      {row.vintage}
                    </div>
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: '12px', textAlign: 'right', color: '#374151', fontFamily: 'monospace' }}>
                      {row.reductions.toLocaleString()}
                    </div>
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: '12px', textAlign: 'right', color: '#374151', fontFamily: 'monospace' }}>
                      {row.removals.toLocaleString()}
                    </div>
                    <div style={{ background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', padding: '12px', textAlign: 'right', color: '#0D9488', fontWeight: '600', fontFamily: 'monospace' }}>
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
                    gap: '1px',
                    background: '#cbd5e1',
                    padding: '12px',
                  }}
                >
                  <div style={{ background: '#f1f5f9', padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                    Total
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '12px', fontWeight: 'bold', color: '#0f172a', textAlign: 'right', fontFamily: 'monospace' }}>
                    {totalReductions.toLocaleString()}
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '12px', fontWeight: 'bold', color: '#0f172a', textAlign: 'right', fontFamily: 'monospace' }}>
                    {totalRemovals.toLocaleString()}
                  </div>
                  <div style={{ background: '#f1f5f9', padding: '12px', fontWeight: 'bold', color: '#0D9488', textAlign: 'right', fontFamily: 'monospace' }}>
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
