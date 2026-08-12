import React from 'react';
import { DB_ADOPTION_TIERS } from '../data/enterpriseProducts';
import { calculateMarketFitScore } from '../utils/governanceScorer';
import { CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function ComparisonMatrix({ comparedProducts, onRemoveFromCompare }) {
  if (!comparedProducts || comparedProducts.length === 0) return null;

  return (
    <section className="radar-card-section" style={{ marginTop: '2rem' }}>
      <div className="radar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>Competitor Comparison Matrix</h3>
          <p>Side-by-side breakdown of market position, adoption status, and governance compliance.</p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.88rem',
          color: '#F1F5F9'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#94A3B8', minWidth: '180px' }}>Attribute</th>
              {comparedProducts.map((prod) => (
                <th key={prod.id} style={{ padding: '1rem', textAlign: 'left', minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem', color: '#FFF' }}>{prod.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#00E5FF' }}>{prod.vendor}</span>
                    </div>
                    <button
                      onClick={() => onRemoveFromCompare(prod.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                      title="Remove from comparison"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Adoption Tier */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Adoption Tier</td>
              {comparedProducts.map((prod) => {
                const tier = DB_ADOPTION_TIERS[prod.dbAdoptionStatus] || DB_ADOPTION_TIERS.conditional;
                return (
                  <td key={prod.id} style={{ padding: '1rem' }}>
                    <span className={`status-badge ${tier.badgeClass}`}>
                      {prod.dbAdoptionLabel || tier.label}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Market Fit Score */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Market Fit Score</td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 800, color: '#00E5FF', fontSize: '1.1rem' }}>
                  {calculateMarketFitScore(prod)}%
                </td>
              ))}
            </tr>

            {/* License Type */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Software License</td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} style={{ padding: '1rem' }}>
                  {prod.licenseType}
                </td>
              ))}
            </tr>

            {/* Regulatory Readiness */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Regulatory Readiness</td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} style={{ padding: '1rem' }}>
                  {prod.compliance?.dora ? (
                    <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <CheckCircle size={16} /> Certified
                    </span>
                  ) : (
                    <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <XCircle size={16} /> Pending Audit
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Industry Standards */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Industry Standards</td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} style={{ padding: '1rem' }}>
                  {prod.compliance?.bafin ? (
                    <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                      <CheckCircle size={16} /> Aligned
                    </span>
                  ) : (
                    <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <XCircle size={16} /> Exception Required
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Deployment Targets */}
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Supported Environments</td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {prod.deployment?.map(dep => (
                      <span key={dep} style={{
                        fontSize: '0.7rem',
                        background: 'rgba(0, 229, 255, 0.1)',
                        border: '1px solid rgba(0, 229, 255, 0.2)',
                        color: '#38BDF8',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {dep}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Market Share */}
            <tr>
              <td style={{ padding: '1rem', fontWeight: 700, color: '#94A3B8' }}>Est. Market Share</td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} style={{ padding: '1rem', fontWeight: 600 }}>
                  {prod.marketShare}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
