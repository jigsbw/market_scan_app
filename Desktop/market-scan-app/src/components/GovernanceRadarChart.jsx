import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const CHART_COLORS = ['#00E5FF', '#10B981', '#F59E0B', '#A855F7', '#EC4899'];

export default function GovernanceRadarChart({ comparedProducts }) {
  if (!comparedProducts || comparedProducts.length === 0) return null;

  // Format data for Recharts Radar
  const metrics = [
    { key: 'security', label: 'Security & Encryption' },
    { key: 'compliance', label: 'Regulatory Compliance' },
    { key: 'operationalRisk', label: 'Operational Risk (Inverse)' },
    { key: 'integrationEffort', label: 'Integration Simplicity' },
    { key: 'costEfficiency', label: 'Cost Efficiency' }
  ];

  const chartData = metrics.map(({ key, label }) => {
    const entry = { subject: label };
    comparedProducts.forEach((prod) => {
      entry[prod.name] = prod.governanceScores?.[key] || 70;
    });
    return entry;
  });

  return (
    <section className="radar-card-section">
      <div className="radar-header">
        <h3>Governance & Technical Fit Radar</h3>
        <p>Comparing 5 enterprise risk & governance axes across selected market candidates.</p>
      </div>

      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748B', fontSize: 10 }}
              stroke="rgba(255, 255, 255, 0.1)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#050c1e',
                borderColor: '#00E5FF',
                borderRadius: '10px',
                color: '#FFF'
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                color: '#E2E8F0',
                fontSize: '13px'
              }}
            />

            {comparedProducts.map((prod, idx) => (
              <Radar
                key={prod.id}
                name={prod.name}
                dataKey={prod.name}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                fillOpacity={0.25}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
