import { PRODUCT_CATEGORIES, DB_ADOPTION_TIERS } from '../data/enterpriseProducts';

/**
 * Calculates an Apollo-1 Market Fit Score (0 - 100%)
 */
export function calculateMarketFitScore(product) {
  if (!product) return 0;
  const { governanceScores, compliance, dbAdoptionStatus, licenseType } = product;

  // Base weighted governance score
  let securityWeight = (governanceScores?.security || 75) * 0.25;
  let complianceWeight = (governanceScores?.compliance || 75) * 0.25;
  let opRiskWeight = (governanceScores?.operationalRisk || 75) * 0.20;
  let integrationWeight = (governanceScores?.integrationEffort || 70) * 0.15;
  let costWeight = (governanceScores?.costEfficiency || 70) * 0.15;

  let baseScore = securityWeight + complianceWeight + opRiskWeight + integrationWeight + costWeight;

  // Modifiers based on compliance checkboxes
  if (compliance?.dora) baseScore += 3;
  if (compliance?.bafin) baseScore += 3;
  if (compliance?.gdpr) baseScore += 2;

  // Penalties for risky licensing and legal exposure
  if (licenseType && licenseType.includes('AGPL')) {
    baseScore -= 15;
  } else if (licenseType && licenseType.includes('Copyleft')) {
    baseScore -= 8;
  }

  // Tier status cap / boost
  if (dbAdoptionStatus === 'approved') {
    baseScore = Math.max(88, baseScore);
  } else if (dbAdoptionStatus === 'sunset') {
    baseScore = Math.min(65, baseScore);
  } else if (dbAdoptionStatus === 'prohibited') {
    baseScore = Math.min(45, baseScore);
  }

  return Math.min(99, Math.max(25, Math.round(baseScore)));
}

/**
 * Generates an AI-synthesized competitor scan entry if the user searches a custom product not in database
 */
export function synthesizeCustomProductScan(productName, categoryId) {
  const categoryObj = PRODUCT_CATEGORIES.find(c => c.id === categoryId) || PRODUCT_CATEGORIES[0];
  const cleanName = productName.trim();
  
  // Hash name for deterministic pseudo-random scoring
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = (hash << 5) - hash + cleanName.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const securityScore = 78 + (positiveHash % 20);
  const complianceScore = 75 + ((positiveHash >> 2) % 22);
  const opRiskScore = 70 + ((positiveHash >> 3) % 25);
  const integrationScore = 72 + ((positiveHash >> 4) % 24);
  const costScore = 68 + ((positiveHash >> 5) % 28);

  const isDora = (positiveHash % 2) === 0;
  const isBafin = (positiveHash % 3) !== 0;

  // Determine synthesized adoption status
  let adoptionStatus = 'conditional';
  let adoptionLabel = 'Conditional / Market Review Required';

  if (securityScore > 90 && complianceScore > 90 && isDora) {
    adoptionStatus = 'approved';
    adoptionLabel = 'Approved for Apollo-1 Enterprise Evaluation';
  } else if (positiveHash % 7 === 0) {
    adoptionStatus = 'prohibited';
    adoptionLabel = 'License & Security Audit Warning';
  }

  const mainProd = {
    id: `custom-scanned-${Date.now()}`,
    name: cleanName,
    vendor: `${cleanName} Technology Solutions`,
    category: categoryId,
    description: `Scanned market candidate for ${categoryObj.name}. Evaluated against Apollo-1 market risk and security baseline.`, 
    marketShare: `${12 + (positiveHash % 20)}%`,
    pricingModel: 'Enterprise Commercial Licensing',
    dbAdoptionStatus: adoptionStatus,
    dbAdoptionLabel: adoptionLabel,
    compliance: {
      dora: isDora,
      bafin: isBafin,
      gdpr: true,
      soc2: true,
      iso27001: isDora
    },
    deployment: ['Private Cloud', 'AWS VPC', 'GCP Sovereign Cloud'],
    licenseType: 'Commercial Enterprise',
    governanceScores: {
      security: securityScore,
      compliance: complianceScore,
      operationalRisk: opRiskScore,
      integrationEffort: integrationScore,
      costEfficiency: costScore
    },
    vendorRisk: securityScore > 88 ? 'Low' : 'Medium',
    pros: [
      `Active market competitor in ${categoryObj.name}`,
      `Compatible with modern REST/gRPC API standards`,
      `Supports EU data protection baseline`
    ],
    cons: [
      `Requires formal market governance clearance`, 
      `Pending full BaFin audit certification report`
    ],
      dbArchitectureNotes: `Dynamically scanned candidate. Recommended for sandbox evaluation with the Apollo-1 market governance team.`
  };

  // Generate 2 competitive alternatives in the same market space
  const alt1Name = `${cleanName} Alternative Alpha`;
  const alt2Name = `Global ${categoryObj.name.split(' ')[0]} Enterprise`;

  const alt1 = {
    ...mainProd,
    id: `custom-alt1-${Date.now()}`,
    name: alt1Name,
    vendor: 'Apex Enterprise Software',
    marketShare: '24%',
    dbAdoptionStatus: 'approved',
    dbAdoptionLabel: 'Tier-1 Strategic Market Leader',
    governanceScores: {
      security: Math.min(98, securityScore + 8),
      compliance: Math.min(96, complianceScore + 5),
      operationalRisk: Math.min(94, opRiskScore + 10),
      integrationEffort: 88,
      costEfficiency: 75
    },
    compliance: { dora: true, bafin: true, gdpr: true, soc2: true, iso27001: true },
    pros: ['Established enterprise track record', 'Full DORA & BaFin compliance out of the box'],
    cons: ['Higher enterprise tier license pricing']
  };

  const alt2 = {
    ...mainProd,
    id: `custom-alt2-${Date.now()}`,
    name: alt2Name,
    vendor: 'Nexus Core Systems',
    marketShare: '18%',
    dbAdoptionStatus: 'conditional',
    dbAdoptionLabel: 'Conditional Sandbox Pilot',
    governanceScores: {
      security: Math.max(65, securityScore - 6),
      compliance: Math.max(68, complianceScore - 4),
      operationalRisk: 75,
      integrationEffort: 80,
      costEfficiency: 92
    },
    pros: ['High cost efficiency and modern developer experience'],
    cons: ['Requires custom compliance wrapper for BaFin regulatory audit']
  };

  return [mainProd, alt1, alt2];
}
