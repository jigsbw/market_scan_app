import React, { useState } from 'react';
import { calculateMarketFitScore } from '../utils/governanceScorer';
import { X, Copy, Check, Printer, ShieldCheck, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportReportModal({ comparedProducts, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!comparedProducts || comparedProducts.length === 0) return null;

  const timestamp = new Date().toISOString().split('T')[0];

  const handleCopyReport = () => {
    const textReport = `
====================================================================
APOLLO-1 NEUROSYMBOLIC MARKET REVIEW
MARKET SCAN & ADOPTION REPORT
Generated: ${timestamp} | Classification: Internal Restricted
====================================================================

EXECUTIVE SUMMARY:
This market evaluation document assesses ${comparedProducts.length} product candidate(s) for Apollo-1 neurosymbolic market adoption based on regulatory readiness, standards alignment, and AI risk posture.

CANDIDATES EVALUATED:
${comparedProducts.map((p, idx) => `
${idx + 1}. ${p.name} (${p.vendor})
   - Adoption Tier: ${p.dbAdoptionStatus.toUpperCase()}
   - Market Fit Score: ${calculateMarketFitScore(p)}%
   - License: ${p.licenseType}
   - Regulatory Readiness: ${p.compliance?.dora ? 'Passed' : 'Pending Audit'}
   - Industry Standards: ${p.compliance?.bafin ? 'Aligned' : 'Exception Needed'}
   - Supported Envs: ${p.deployment?.join(', ')}
`).join('')}

RECOMMENDATION:
Candidates designated as "Approved Strategic Standard" are recommended for immediate adoption in Apollo-1 neurosymbolic deployments. Any "Conditional" entries require targeted review and integration planning.

====================================================================
End of Report - Apollo-1 Market Intelligence Division
`;

    navigator.clipboard.writeText(textReport.trim());
    setCopied(true);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '900px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF' }}>
              Market Intelligence Executive Report
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Official Apollo-1 neurosymbolic market scan summary ready for export or printing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn-secondary" onClick={handleCopyReport}>
              {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
              {copied ? 'Copied to Clipboard' : 'Copy Text'}
            </button>

            <button className="btn-primary" onClick={handlePrint}>
              <Printer size={16} />
              Print / Save PDF
            </button>
          </div>
        </div>

        <div className="arb-report-box">
          <div className="arb-header">
            <div>
            <div className="arb-title">Apollo-1 Neurosymbolic Market Intelligence</div>
            <div className="arb-subtitle">Market Scan & Adoption Assessment</div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '0.75rem', color: '#94A3B8' }}>
              <div>REF: ARB-SCAN-2026-{Math.floor(1000 + Math.random() * 9000)}</div>
              <div>DATE: {timestamp}</div>
            </div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: '#00E5FF', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              1. Evaluated Products Breakdown
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {comparedProducts.map((prod) => (
                <div key={prod.id} style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ color: '#FFF' }}>{prod.name} ({prod.vendor})</strong>
                    <span style={{ color: '#00E5FF', fontWeight: 800, fontFamily: 'monospace' }}>
                      Fit Index: {calculateMarketFitScore(prod)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>Adoption Tier: <span style={{ color: '#FFF' }}>{prod.dbAdoptionStatus.toUpperCase()}</span></div>
                    <div>DORA Resilience: <span style={{ color: prod.compliance?.dora ? '#10B981' : '#EF4444' }}>{prod.compliance?.dora ? 'Certified' : 'Pending'}</span></div>
                    <div>BaFin Standard: <span style={{ color: prod.compliance?.bafin ? '#10B981' : '#F59E0B' }}>{prod.compliance?.bafin ? 'Passed' : 'Requires Exception'}</span></div>
                    <div>License: <span style={{ color: '#FFF' }}>{prod.licenseType}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#00E5FF', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              2. Governance & Security Sign-off
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
              This report has been automatically evaluated against Apollo-1 market risk baselines and industry operational resilience frameworks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
