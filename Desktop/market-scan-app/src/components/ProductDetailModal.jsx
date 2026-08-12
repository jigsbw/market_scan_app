import React from 'react';
import { DB_ADOPTION_TIERS } from '../data/enterpriseProducts';
import { calculateMarketFitScore } from '../utils/governanceScorer';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Server, FileCode, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const tier = DB_ADOPTION_TIERS[product.dbAdoptionStatus] || DB_ADOPTION_TIERS.conditional;
  const fitScore = calculateMarketFitScore(product);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="vendor-tag">{product.vendor} • Category: {product.category}</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', margin: '0.2rem 0 0.8rem 0' }}>
            {product.name}
          </h2>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`status-badge ${tier.badgeClass}`}>
              {product.dbAdoptionLabel || tier.label}
            </span>
            <span style={{
              background: 'rgba(0, 229, 255, 0.1)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: '#00E5FF',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              fontFamily: 'monospace'
            }}>
              Market Fit Index: {fitScore}%
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.78rem'
            }}>
              Vendor Risk: {product.vendorRisk || 'Low'}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.95rem', color: '#E2E8F0', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {product.description}
        </p>

        {/* Apollo-1 Market Guidance Banner */}
        <div style={{
          background: 'rgba(0, 24, 56, 0.9)',
          border: '1px solid #00E5FF',
          borderRadius: '14px',
          padding: '1.2rem',
          marginBottom: '1.5rem',
          boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)'
        }}>
          <h4 style={{
            fontSize: '0.88rem',
            fontWeight: 800,
            color: '#00E5FF',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <ShieldCheck size={18} />
            Apollo-1 Market Review Guidance
          </h4>
          <p style={{ fontSize: '0.88rem', color: '#F1F5F9', lineHeight: 1.5 }}>
            {product.dbArchitectureNotes || 'Evaluated for neurosymbolic market adoption and secure hybrid AI deployment.'}
          </p>
        </div>

        {/* Pros and Cons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '14px', padding: '1.2rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ThumbsUp size={16} /> Architectural Strengths
            </h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {product.pros?.map((pro, i) => (
                <li key={i}>{pro}</li>
              )) || <li>High enterprise scalability</li>}
            </ul>
          </div>

          <div style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '14px', padding: '1.2rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ThumbsDown size={16} /> Governance Risk Considerations
            </h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {product.cons?.map((con, i) => (
                <li key={i}>{con}</li>
              )) || <li>Requires initial security review</li>}
            </ul>
          </div>
        </div>

        {/* Technical Specs */}
        <div style={{ background: 'rgba(8, 15, 30, 0.7)', borderRadius: '14px', padding: '1.2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            Deployment & Licensing Specifications
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Pricing Model</span>
              <strong style={{ color: '#FFF' }}>{product.pricingModel}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>License Type</span>
              <strong style={{ color: '#FFF' }}>{product.licenseType}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Market Share</span>
              <strong style={{ color: '#FFF' }}>{product.marketShare}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
