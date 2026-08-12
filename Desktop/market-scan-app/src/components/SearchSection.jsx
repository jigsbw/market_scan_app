import React from 'react';
import { Search, Globe, Sparkles, Tag, Layers, ShieldCheck, Cpu, Database, Landmark, Lock, Building2, Network } from 'lucide-react';

const SUGGESTED_CATEGORIES = [
  'Analytics Agents',
  'Neurosymbolic AI & Knowledge Graphs',
  'API Management & Gateway',
  'IAM & Zero Trust Security',
  'AML, KYC & Fraud Detection',
  'Enterprise Data Warehousing',
  'AI & LLM Orchestration',
  'Gen AI Security',
  'Cloud Security & Secrets Vault',
  'Financial CRM & Workflow'
];

export default function SearchSection({
  productQuery,
  setProductQuery,
  categoryQuery,
  setCategoryQuery,
  onRunMarketScan,
  isWebScraperMode,
  setIsWebScraperMode,
  isScanning
}) {

  const handleSubmit = (e) => {
    e.preventDefault();
    onRunMarketScan(productQuery, categoryQuery);
  };

  return (
    <section className="search-card">
      <div className="search-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Market Competitor & Adoption Scanner</h2>
          <p>Type any product name and custom category to run an instant neurosymbolic market scan & adoption assessment.</p>
        </div>

        {/* Live Web Scraper Mode Toggle */}
        <div style={{
          background: 'rgba(8, 16, 36, 0.9)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          padding: '0.6rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Globe size={16} color={isWebScraperMode ? '#00E5FF' : '#64748B'} />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isWebScraperMode ? '#FFF' : '#94A3B8' }}>
              Live Web Scraper Mode
            </span>
          </div>
          <label className="checkbox-item" style={{ margin: 0 }}>
            <input
              type="checkbox"
              checked={isWebScraperMode}
              onChange={(e) => setIsWebScraperMode(e.target.checked)}
            />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: isWebScraperMode ? '#00E5FF' : '#64748B'
            }}>
              {isWebScraperMode ? 'REAL-TIME WEB' : 'INSTANT DB'}
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="scan-form-grid">
        {/* Product Name Input */}
        <div className="input-field-group">
          <label>Target Product Name</label>
          <div className="input-wrapper">
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. Lakera, Kong, Okta, Databricks, Feedzai, Snowflake (comma-separated)"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Free-form Category Input */}
        <div className="input-field-group">
          <label>Product Category (Type Anything)</label>
          <div className="input-wrapper">
            <Tag className="input-icon" size={18} />
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. API Security, Core Ledger, Incident Mgmt, ESG..."
              value={categoryQuery}
              onChange={(e) => setCategoryQuery(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-scan" disabled={isScanning}>
          <Sparkles size={18} className={isScanning ? 'spin-icon' : ''} />
          {isScanning ? 'Scraping Web...' : 'Scan Market'}
        </button>
      </form>

      {/* Suggested Category Quick Chips */}
      <div className="presets-bar">
        <span className="presets-label">Suggested Categories:</span>
        {SUGGESTED_CATEGORIES.map((cat) => {
          const isActive = categoryQuery.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => {
                setCategoryQuery(cat);
                onRunMarketScan(productQuery, cat);
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </section>
  );
}
