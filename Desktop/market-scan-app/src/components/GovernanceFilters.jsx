import React from 'react';
import { DB_ADOPTION_TIERS } from '../data/enterpriseProducts';
import { ShieldCheck, Server, FileText, Lock } from 'lucide-react';

export default function GovernanceFilters({
  activeTiers,
  toggleTier,
  activeCompliance,
  toggleCompliance,
  activeDeployments,
  toggleDeployment,
  resetFilters
}) {
  return (
    <aside className="filter-sidebar">
      <div className="filter-title">
        <span>Neurosymbolic Market Filters</span>
        <button className="filter-reset" onClick={resetFilters}>Reset</button>
      </div>

      {/* DB Adoption Tier */}
      <div className="filter-group">
        <div className="filter-group-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={14} color="#00E5FF" />
          Adoption Status
        </div>
        <div className="checkbox-list">
          {Object.entries(DB_ADOPTION_TIERS).map(([key, tier]) => {
            const isChecked = activeTiers.includes(key);
            return (
              <label key={key} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTier(key)}
                />
                <span className="tier-dot" style={{ background: tier.color }} />
                <span>{tier.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Regulatory & Security Compliance */}
      <div className="filter-group">
        <div className="filter-group-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <FileText size={14} color="#00E5FF" />
          Market Compliance Baseline
        </div>
        <div className="checkbox-list">
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={activeCompliance.dora}
              onChange={() => toggleCompliance('dora')}
            />
            <span>Regulatory Readiness</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={activeCompliance.bafin}
              onChange={() => toggleCompliance('bafin')}
            />
            <span>Industry Standard Alignment</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={activeCompliance.gdpr}
              onChange={() => toggleCompliance('gdpr')}
            />
            <span>GDPR EU Data Sovereign</span>
          </label>
          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={activeCompliance.soc2}
              onChange={() => toggleCompliance('soc2')}
            />
            <span>SOC2 Type II Certified</span>
          </label>
        </div>
      </div>

      {/* Deployment Targets */}
      <div className="filter-group">
        <div className="filter-group-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Server size={14} color="#00E5FF" />
          Target Deployment Environments
        </div>
        <div className="checkbox-list">
          {[
            'Private Cloud',
            'AWS VPC',
            'GCP Sovereign Cloud',
            'On-Premises Air-gapped'
          ].map((target) => {
            const isChecked = activeDeployments.includes(target);
            return (
              <label key={target} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleDeployment(target)}
                />
                <span>{target}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.8rem',
        background: 'rgba(0, 229, 255, 0.05)',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        borderRadius: '10px',
        fontSize: '0.75rem',
        color: '#94A3B8',
        lineHeight: 1.4
      }}>
        <strong style={{ color: '#00E5FF', display: 'block', marginBottom: '0.2rem' }}>Market Policy Note:</strong>
        Products classified as <span style={{ color: '#EF4444' }}>Phase-out</span> or <span style={{ color: '#A855F7' }}>Prohibited</span> should be reviewed by the neurosymbolic market governance board.
      </div>
    </aside>
  );
}
