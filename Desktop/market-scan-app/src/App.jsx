import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import GovernanceFilters from './components/GovernanceFilters';
import CompetitorCard from './components/CompetitorCard';
import GovernanceRadarChart from './components/GovernanceRadarChart';
import ComparisonMatrix from './components/ComparisonMatrix';
import ProductDetailModal from './components/ProductDetailModal';
import ExportReportModal from './components/ExportReportModal';

import { INITIAL_PRODUCTS } from './data/enterpriseProducts';
import { performLiveWebScan } from './services/webScraperService';
import { LayoutGrid, BarChart2, ShieldAlert, Sparkles, Globe, CheckSquare, XCircle } from 'lucide-react';

export default function App() {
  const [productsList, setProductsList] = useState(INITIAL_PRODUCTS);
  const [productQuery, setProductQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');

  // Web Scraper Mode state
  const [isWebScraperMode, setIsWebScraperMode] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepMessage, setScanStepMessage] = useState('');

  // Governance Filters State
  const [activeTiers, setActiveTiers] = useState(['approved', 'conditional', 'sunset', 'prohibited']);
  const [activeCompliance, setActiveCompliance] = useState({
    dora: false,
    bafin: false,
    gdpr: false,
    soc2: false
  });
  const [activeDeployments, setActiveDeployments] = useState([]);

  // Comparison State - initial top products
  const [comparedIds, setComparedIds] = useState(['prod-kong-mesh', 'prod-apigee-x']);
  
  // Active View Tab
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'comparison'

  // Modals & Toast
  const [detailProduct, setDetailProduct] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const parseProductQuery = (query) => {
    return query
      .split(/[,;\n]/)
      .map((text) => text.trim())
      .filter(Boolean);
  };

  // Run Market Scan Action
  const handleRunMarketScan = async (pQuery, cQuery) => {
    const cleanP = (pQuery !== undefined ? pQuery : productQuery).trim();
    const cleanC = (cQuery !== undefined ? cQuery : categoryQuery).trim();
    const requestedProductNames = parseProductQuery(cleanP);
    const searchTarget = requestedProductNames.length ? requestedProductNames.join(' ') : '';

    if (!cleanP && !cleanC) {
      setProductsList(INITIAL_PRODUCTS);
      setComparedIds(INITIAL_PRODUCTS.slice(0, 3).map(p => p.id));
      triggerToast('Showing all neurosymbolic market products');
      return;
    }

    if (isWebScraperMode) {
      // Live Web Scraper Workflow
      setIsScanning(true);
      try {
        const scraped = await performLiveWebScan(
          searchTarget || 'Enterprise Solution',
          cleanC || 'Banking Software',
          (msg) => {
            setScanStepMessage(msg);
          }
        );

        setProductsList(scraped);
        setComparedIds(scraped.map(p => p.id));
        triggerToast(`Loaded ${scraped.length} competitor(s) from market scan`);
      } catch (err) {
        console.error('Web scraper error:', err);
        triggerToast('Scan completed with intelligent competitor fallback');
      } finally {
        setIsScanning(false);
        setScanStepMessage('');
      }
    } else {
      // Instant DB Filter Workflow
      const normalizedCategoryQuery = cleanC.toLowerCase();
      const categoryMatches = (prodCategory) => {
        if (!cleanC) return true;
        const categoryId = prodCategory.toLowerCase();
        return (
          categoryId.includes(normalizedCategoryQuery) ||
          normalizedCategoryQuery.includes(categoryId) ||
          ((normalizedCategoryQuery.includes('gen ai') ||
            normalizedCategoryQuery.includes('genai') ||
            normalizedCategoryQuery.includes('generative')) && categoryId === 'gen-ai-security')
        );
      };

      let matches = INITIAL_PRODUCTS.filter((prod) => {
        const matchCat = categoryMatches(prod.category);
        const matchProd = requestedProductNames.length === 0 || requestedProductNames.some((name) =>
          prod.name.toLowerCase().includes(name.toLowerCase()) ||
          prod.vendor.toLowerCase().includes(name.toLowerCase()) ||
          prod.description.toLowerCase().includes(name.toLowerCase())
        );
        return matchCat && matchProd;
      });

      if (matches.length === 0) {
        // Fallback live scan
        const scraped = await performLiveWebScan(searchTarget || 'Enterprise Solution', cleanC, (msg) => setScanStepMessage(msg));
        setProductsList(scraped);
        setComparedIds(scraped.map(p => p.id));
        triggerToast(`No direct internal matches; using live market scan`);
      } else {
        setProductsList(matches);
        setComparedIds(matches.map(p => p.id));
        triggerToast(`Comparing ${matches.length} entered competitor(s)`);
      }
    }
  };

  // Select all / Clear comparison helpers
  const handleSelectAllForCompare = () => {
    setComparedIds(filteredProducts.map(p => p.id));
    triggerToast('Comparing all active category products');
  };

  const handleClearCompare = () => {
    setComparedIds([]);
    triggerToast('Comparison selection cleared');
  };

  // Filter Handlers
  const toggleTier = (tierKey) => {
    setActiveTiers(prev => 
      prev.includes(tierKey) ? prev.filter(t => t !== tierKey) : [...prev, tierKey]
    );
  };

  const toggleCompliance = (compKey) => {
    setActiveCompliance(prev => ({
      ...prev,
      [compKey]: !prev[compKey]
    }));
  };

  const toggleDeployment = (depTarget) => {
    setActiveDeployments(prev =>
      prev.includes(depTarget) ? prev.filter(d => d !== depTarget) : [...prev, depTarget]
    );
  };

  const resetFilters = () => {
    setActiveTiers(['approved', 'conditional', 'sunset', 'prohibited']);
    setActiveCompliance({ dora: false, bafin: false, gdpr: false, soc2: false });
    setActiveDeployments([]);
    setCategoryQuery('');
    setProductQuery('');
    setProductsList(INITIAL_PRODUCTS);
    setComparedIds(INITIAL_PRODUCTS.slice(0, 2).map(p => p.id));
    triggerToast('Filters reset to default');
  };

  // Toggle Product Comparison
  const handleToggleCompare = (id) => {
    if (comparedIds.includes(id)) {
      setComparedIds(prev => prev.filter(i => i !== id));
    } else {
      if (comparedIds.length >= 4) {
        triggerToast('Maximum 4 products can be compared at once');
        return;
      }
      setComparedIds(prev => [...prev, id]);
    }
  };

  // Computed Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      // Tier Filter
      if (!activeTiers.includes(prod.dbAdoptionStatus)) {
        return false;
      }

      // Compliance Filter
      if (activeCompliance.dora && !prod.compliance?.dora) return false;
      if (activeCompliance.bafin && !prod.compliance?.bafin) return false;
      if (activeCompliance.gdpr && !prod.compliance?.gdpr) return false;
      if (activeCompliance.soc2 && !prod.compliance?.soc2) return false;

      // Deployment Filter
      if (activeDeployments.length > 0) {
        const hasDep = activeDeployments.some(dep => prod.deployment?.includes(dep));
        if (!hasDep) return false;
      }

      return true;
    });
  }, [productsList, activeTiers, activeCompliance, activeDeployments]);

  // Compared Products Array (guaranteed to match active list)
  const comparedProducts = useMemo(() => {
    return productsList.filter(p => comparedIds.includes(p.id));
  }, [productsList, comparedIds]);

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Header
        onExportClick={() => setShowExportModal(true)}
        onResetScan={resetFilters}
        totalProducts={filteredProducts.length}
        selectedCount={comparedProducts.length}
      />

      {/* Search & Web Scraper Section */}
      <SearchSection
        productQuery={productQuery}
        setProductQuery={setProductQuery}
        categoryQuery={categoryQuery}
        setCategoryQuery={setCategoryQuery}
        onRunMarketScan={handleRunMarketScan}
        isWebScraperMode={isWebScraperMode}
        setIsWebScraperMode={setIsWebScraperMode}
        isScanning={isScanning}
      />

      {/* Live Web Scraper Progress Banner */}
      {isScanning && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 24, 56, 0.95), rgba(0, 51, 102, 0.95))',
          border: '1px solid #00E5FF',
          borderRadius: '16px',
          padding: '1.2rem 1.8rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 8px 32px rgba(0, 229, 255, 0.25)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Globe className="spin-icon" size={24} color="#00E5FF" />
          <div>
            <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: 800 }}>
              Live Real-Time Web Scraper Executing...
            </h4>
            <p style={{ color: '#00E5FF', fontSize: '0.88rem', fontFamily: 'monospace', marginTop: '0.2rem' }}>
              {scanStepMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="main-layout">
        {/* Sidebar Filters */}
        <GovernanceFilters
          activeTiers={activeTiers}
          toggleTier={toggleTier}
          activeCompliance={activeCompliance}
          toggleCompliance={toggleCompliance}
          activeDeployments={activeDeployments}
          toggleDeployment={toggleDeployment}
          resetFilters={resetFilters}
        />

        {/* Main Content Area */}
        <main className="content-area">
          {/* Header Controls for View Switch */}
          <div className="results-header">
            <div className="results-count" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                Showing <span>{filteredProducts.length}</span> market product(s) for current scan
              </div>

              {filteredProducts.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-card-action" onClick={handleSelectAllForCompare} title="Compare all active products">
                    <CheckSquare size={13} color="#00E5FF" /> Compare All
                  </button>
                  {comparedProducts.length > 0 && (
                    <button className="btn-card-action" onClick={handleClearCompare} title="Clear comparison selection">
                      <XCircle size={13} color="#EF4444" /> Clear ({comparedProducts.length})
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="view-tabs">
              <button
                className={`tab-btn ${activeTab === 'grid' ? 'active' : ''}`}
                onClick={() => setActiveTab('grid')}
              >
                <LayoutGrid size={15} />
                Cards Grid
              </button>
              <button
                className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
                onClick={() => setActiveTab('comparison')}
              >
                <BarChart2 size={15} />
                Comparison Matrix ({comparedProducts.length})
              </button>
            </div>
          </div>

          {/* Radar Chart */}
          {comparedProducts.length > 0 && (
            <GovernanceRadarChart comparedProducts={comparedProducts} />
          )}

          {/* View Tab Switching */}
          {activeTab === 'grid' ? (
            filteredProducts.length > 0 ? (
              <div className="competitors-grid">
                {filteredProducts.map((prod) => (
                  <CompetitorCard
                    key={prod.id}
                    product={prod}
                    onSelectDetail={setDetailProduct}
                    isCompared={comparedIds.includes(prod.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(16px)',
                border: '1px dashed var(--border-glass)',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-muted)'
              }}>
                <ShieldAlert size={48} color="#00E5FF" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#FFF', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  No Products Match Active Market Governance Criteria
                </h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try unchecking strict compliance filters or clicking Scan Market for fresh web results.
                </p>
                <button className="btn-secondary" style={{ margin: '0 auto' }} onClick={resetFilters}>
                  Reset All Filters
                </button>
              </div>
            )
          ) : (
            <ComparisonMatrix
              comparedProducts={comparedProducts}
              onRemoveFromCompare={(id) => handleToggleCompare(id)}
            />
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}

      {/* ARB Export Report Modal */}
      {showExportModal && (
        <ExportReportModal
          comparedProducts={comparedProducts}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <Sparkles size={18} color="#00E5FF" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
