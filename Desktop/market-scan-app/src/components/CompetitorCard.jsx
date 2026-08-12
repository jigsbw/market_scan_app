import React from 'react';
import { DB_ADOPTION_TIERS } from '../data/enterpriseProducts';
import { calculateMarketFitScore } from '../utils/governanceScorer';
import { CheckCircle2, AlertTriangle, Clock, XCircle, Info, PlusCircle, Check, Globe, ExternalLink } from 'lucide-react';

const TIER_ICONS = {
  approved: CheckCircle2,
  conditional: AlertTriangle,
  sunset: Clock,
  prohibited: XCircle
};

export default function CompetitorCard({
  product,
  onSelectDetail,
  isCompared,
  onToggleCompare
}) {
  const tierConfig = DB_ADOPTION_TIERS[product.dbAdoptionStatus] || DB_ADOPTION_TIERS.conditional;
  const TierIcon = TIER_ICONS[product.dbAdoptionStatus] || AlertTriangle;
  const fitScore = calculateMarketFitScore(product);

  return (
    <div className="competitor-card">
      <div className="card-top">
        <div className="card-header-flex">
          <div>
            <div className="vendor-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {product.vendor}
              {product.webSourceUrl && (
                <a
                  href={product.webSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00E5FF', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}
                  title="View live web source"
                >
                  <Globe size={11} /> Source <ExternalLink size={9} />
                </a>
              )}
            </div>
            <h3 className="product-title">{product.name}</h3>
          </div>
          <span className={`status-badge ${tierConfig.badgeClass}`}>
            <TierIcon size={13} />
            {product.dbAdoptionStatus.toUpperCase()}
          </span>
        </div>

        <p className="product-desc">{product.description}</p>

        {/* Compliance Pills */}
        <div className="compliance-row">
          <span className={`pill-comp ${product.compliance?.dora ? 'active' : ''}`}>
            DORA {product.compliance?.dora ? '✓' : '✗'}
          </span>
          <span className={`pill-comp ${product.compliance?.bafin ? 'active' : ''}`}>
            BaFin {product.compliance?.bafin ? '✓' : '✗'}
          </span>
          <span className={`pill-comp ${product.compliance?.gdpr ? 'active' : ''}`}>
            GDPR {product.compliance?.gdpr ? '✓' : '✗'}
          </span>
          <span className={`pill-comp ${product.compliance?.soc2 ? 'active' : ''}`}>
            SOC2 {product.compliance?.soc2 ? '✓' : '✗'}
          </span>
        </div>

        {/* Market Fit Score Meter */}
        <div className="score-box">
          <div className="score-header">
            <span className="score-label">Market Fit Score</span>
            <span className="score-val">{fitScore}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${fitScore}%`,
                background: fitScore > 85
                  ? 'linear-gradient(90deg, #0066FF, #00E5FF)'
                  : fitScore > 70
                  ? 'linear-gradient(90deg, #D97706, #F59E0B)'
                  : 'linear-gradient(90deg, #DC2626, #EF4444)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="card-footer">
        <button
          className="btn-card-action"
          onClick={() => onSelectDetail(product)}
        >
          <Info size={14} />
          Details & Market Notes
        </button>

        <button
          className={`btn-card-action btn-compare ${isCompared ? 'selected' : ''}`}
          onClick={() => onToggleCompare(product.id)}
        >
          {isCompared ? <Check size={14} /> : <PlusCircle size={14} />}
          {isCompared ? 'Comparing' : 'Compare'}
        </button>
      </div>
    </div>
  );
}
