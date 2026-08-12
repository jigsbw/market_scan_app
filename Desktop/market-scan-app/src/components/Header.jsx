import React from 'react';
import { Building, ShieldCheck, Download, RefreshCw, Layers } from 'lucide-react';

export default function Header({ onExportClick, onResetScan, totalProducts, selectedCount }) {
  return (
    <header className="navbar">
      <div className="brand-group">
        <div className="db-logo-box">
          <Layers size={24} />
        </div>
        <div className="brand-title">
          <h1>RnD Market Scan</h1>
          <p>
            AI Adoption & Market Intelligence Scanner
            <span className="badge-badge badge-arb">Market Vetted 2026</span>
          </p>
        </div>
      </div>

      <div className="nav-actions">
        {selectedCount > 0 && (
          <button className="btn-secondary" onClick={onExportClick}>
            <Download size={16} />
            Export Market Report ({selectedCount})
          </button>
        )}

        <button className="btn-secondary" onClick={onResetScan} title="Reset search to defaults">
          <RefreshCw size={16} />
          Reset Filter
        </button>
      </div>
    </header>
  );
}
