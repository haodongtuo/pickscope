/**
 * PickScope Stability Knowledge Base — v1.0
 * Ingredient-level stability, storage, and compatibility intelligence.
 * Used to enrich the STEP 2.5 Stability & Compatibility Audit.
 *
 * Risk Levels: HIGH / MEDIUM / LOW
 * Interaction Severity: CRITICAL / MODERATE / LOW
 */

const STABILITY_INGREDIENTS = [
  {
    id: "ghk_cu",
    name: "GHK-Cu (Copper Peptide)",
    keywords: ["ghk", "ghk-cu", "copper peptide", "蓝铜胜肽", "铜肽", "copper tripeptide"],
    stability: {
      ph_sensitivity: {
        risk: "HIGH",
        optimal_ph: "6.0–7.0",
        detail: "GHK-Cu is extremely pH-sensitive. Copper ion dissociates from the peptide chain at pH below 5.5, causing the characteristic cobalt-blue color to fade. Once dissociated, the peptide loses its tissue-remodeling and collagen-stimulating bioactivity entirely.",
        checklist: [
          "Solution should remain deep cobalt blue — color shift to green/clear = copper dissociation = inactive",
          "Do not mix with any formula below pH 5.5 (most Vitamin C serums, AHA/BHA toners)",
          "Use a pH meter strip to check any liquid you're combining it with"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "UV light and heat above 25°C accelerate copper-peptide bond degradation. Peptide backbone can also oxidize under prolonged light exposure.",
        checklist: [
          "Store in amber/opaque glass vial, never clear plastic",
          "Keep refrigerated at 2–8°C; never leave on bathroom counter",
          "Avoid freezing (ice crystal formation disrupts peptide structure)"
        ]
      },
      reconstitution: {
        risk: "HIGH",
        applicable: true,
        detail: "Once reconstituted in bacteriostatic water, GHK-Cu has an estimated active half-life of 14 days at 2–8°C. Bioactivity drops to approximately 60% by day 14 and continues to decline.",
        checklist: [
          "Label vial with reconstitution date",
          "Discard after 14 days refrigerated (or 30 days if frozen in single-use aliquots)",
          "Use bacteriostatic water, NOT sterile water (bacteriostatic extends shelf life)"
        ]
      },
      quality_flags: [
        "Excess free copper (pro-oxidant): reputable suppliers provide COA showing Cu:peptide molar ratio ≈ 1:1",
        "Avoid suppliers without third-party HPLC purity verification (>98% purity standard)",
        "Lyophilized powder is more stable than pre-dissolved liquid formulations"
      ]
    },
    interactions: [
      {
        with: "Vitamin C (L-Ascorbic Acid, high concentration >10%)",
        severity: "CRITICAL",
        mechanism: "Ascorbic acid lowers local pH below 5.5 and acts as a reducing agent, both of which promote copper disassociation from the peptide. The free copper then acts as a pro-oxidant, catalyzing vitamin C degradation while simultaneously destroying GHK-Cu efficacy.",
        recommendation: "Strict time separation: Vitamin C in AM routine, GHK-Cu in PM routine. Minimum 4-hour gap."
      },
      {
        with: "AHA / BHA (Glycolic acid, Salicylic acid, Lactic acid)",
        severity: "CRITICAL",
        mechanism: "All alpha and beta hydroxy acids operate at pH 3.0–4.0, well below GHK-Cu's stability window. Direct combination causes near-immediate copper dissociation.",
        recommendation: "Never layer on the same skin area within the same routine. Use AHA/BHA AM only, GHK-Cu PM only."
      },
      {
        with: "Retinol / Retinoids",
        severity: "MODERATE",
        mechanism: "Retinol oxidizes in the presence of free copper ions. Combined use can accelerate retinol degradation while simultaneously increasing skin irritation potential.",
        recommendation: "Alternate nights rather than layering. If combining in same routine, apply GHK-Cu first and wait 20 minutes before retinol."
      },
      {
        with: "EDTA-containing products",
        severity: "MODERATE",
        mechanism: "EDTA is a chelating agent that binds copper ions, effectively stripping copper from the GHK-Cu complex and rendering it inactive.",
        recommendation: "Check ingredient lists for disodium EDTA or tetrasodium EDTA. Avoid layering over GHK-Cu."
      }
    ]
  },

  {
    id: "nmn",
    name: "NMN (Nicotinamide Mononucleotide)",
    keywords: ["nmn", "nicotinamide mononucleotide", "nad+", "nad precursor", "烟酰胺单核苷酸", "抗衰老", "nad前体"],
    stability: {
      ph_sensitivity: {
        risk: "MEDIUM",
        optimal_ph: "6.5–8.0",
        detail: "NMN is moderately pH-sensitive. Acidic environments (pH < 5.0) promote hydrolysis of the phosphate-ribose bond, breaking NMN down into nicotinamide and ribose-5-phosphate — losing NAD+ precursor activity.",
        checklist: [
          "Do not dissolve NMN powder in acidic beverages (citrus juice, coffee, kombucha)",
          "Water or milk at neutral pH is ideal",
          "Sublingual administration bypasses stomach acid — preferred for maximum absorption"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "NMN is highly susceptible to oxidative degradation under UV light and temperatures above 40°C. Studies show up to 30% potency loss in open-air powder within 4 weeks at room temperature.",
        checklist: [
          "Store in airtight, opaque container at 2–8°C (refrigerator)",
          "Never store in humid bathroom environments (hydrolysis risk)",
          "Check packaging: nitrogen-flushed or oxygen-absorber packaging = quality indicator"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "NMN is typically taken as powder or capsule, not reconstituted. However, if dissolving powder, consume immediately after dissolving."
      },
      quality_flags: [
        "Purity matters enormously: look for >99% HPLC-verified NMN; low-purity products may contain NR (nicotinamide riboside) as filler",
        "COA should distinguish between α-NMN (bioactive) and β-NMN — verify it's β-NMN",
        "Brands claiming >500mg/capsule without excipients warrant scrutiny — verify fill weight matches label"
      ]
    },
    interactions: [
      {
        with: "Niacin (Vitamin B3, high dose >500mg)",
        severity: "MODERATE",
        mechanism: "Both NMN and high-dose niacin converge on the same NAD+ biosynthesis pathway. Excess niacin can saturate NAMPT enzyme, competing with NMN conversion and potentially causing flushing.",
        recommendation: "Avoid combining NMN with high-dose niacin (>500mg). Low-dose niacinamide (<100mg) is safe to combine."
      },
      {
        with: "Resveratrol",
        severity: "LOW",
        mechanism: "Resveratrol activates SIRT1, which consumes NAD+. Taking with NMN is synergistic in theory (NMN replenishes NAD+ that resveratrol uses), but evidence for the combination in humans is limited.",
        recommendation: "Commonly stacked together (popularized by David Sinclair protocol). Take simultaneously. Not harmful, potentially synergistic."
      },
      {
        with: "Metformin",
        severity: "MODERATE",
        mechanism: "Metformin inhibits Complex I of the mitochondrial electron transport chain, which can blunt the mitochondrial benefits of increased NAD+ from NMN supplementation.",
        recommendation: "If on Metformin, consult physician. Some researchers suggest NMN may partially counteract Metformin's longevity-related mechanisms."
      }
    ]
  },

  {
    id: "glutathione",
    name: "Glutathione (Reduced / Liposomal)",
    keywords: ["glutathione", "gsh", "reduced glutathione", "liposomal glutathione", "谷胱甘肽", "还原型谷胱甘肽", "抗氧化", "master antioxidant"],
    stability: {
      ph_sensitivity: {
        risk: "HIGH",
        optimal_ph: "5.0–7.0",
        detail: "The thiol (-SH) group that gives glutathione its antioxidant power is extremely reactive. In alkaline conditions (pH > 8.0), the thiol rapidly oxidizes to form GSSG (oxidized glutathione), which is biologically inactive.",
        checklist: [
          "Never combine with strongly alkaline supplements in the same solution",
          "Stomach acid degrades oral glutathione significantly — liposomal or sublingual forms bypass this",
          "Check product for 'reduced' glutathione (GSH), not oxidized (GSSG)"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "Glutathione oxidizes rapidly under UV light and heat. Oxygen exposure is the primary enemy — even opening a container repeatedly exposes powder to air oxidation.",
        checklist: [
          "Refrigerate at 2–8°C; ideal in nitrogen-flushed packaging",
          "If using powder, reseal immediately after each use",
          "Liposomal liquid formulations: check for cloudiness/separation = degradation"
        ]
      },
      reconstitution: {
        risk: "MEDIUM",
        applicable: false,
        detail: "Oral absorption of regular glutathione is poor (~<10% bioavailability). Liposomal encapsulation improves this to ~30–40%. IV is the only route with near-complete bioavailability."
      },
      quality_flags: [
        "Regular (non-liposomal) oral glutathione has very limited evidence for raising blood GSH levels",
        "Setria® is the only clinically-validated glutathione form with RCT data for oral supplementation",
        "Liposomal brands: verify encapsulation efficiency is >85% — many brands don't disclose this",
        "NAC (N-Acetyl Cysteine) is often more effective than oral glutathione at raising intracellular GSH"
      ]
    },
    interactions: [
      {
        with: "Vitamin C",
        severity: "LOW",
        mechanism: "Synergistic: Vitamin C regenerates oxidized glutathione back to its reduced (active) form. One of the best documented antioxidant synergies.",
        recommendation: "Take together or in close timing. Vitamin C + Glutathione is an evidence-backed combination."
      },
      {
        with: "Alpha Lipoic Acid (ALA)",
        severity: "LOW",
        mechanism: "ALA also regenerates oxidized glutathione and independently raises intracellular GSH levels. Strong synergy in antioxidant cycling.",
        recommendation: "Can combine. ALA + Glutathione + Vitamin C forms a potent antioxidant triad."
      },
      {
        with: "Alcohol",
        severity: "MODERATE",
        mechanism: "Alcohol metabolism massively depletes hepatic glutathione (liver GSH). Supplementing glutathione after heavy drinking may help restoration, but does not prevent alcohol liver damage.",
        recommendation: "Do not use glutathione as a 'hangover cure' justification for drinking. Separate by 12+ hours from alcohol consumption."
      }
    ]
  },

  {
    id: "bpc_157",
    name: "BPC-157 (Body Protection Compound)",
    keywords: ["bpc", "bpc-157", "bpc157", "body protection compound", "bpc 157", "pentadecapeptide", "gut peptide", "healing peptide"],
    stability: {
      ph_sensitivity: {
        risk: "HIGH",
        optimal_ph: "5.0–7.5",
        detail: "BPC-157 is a 15-amino acid peptide whose secondary structure is disrupted by extreme pH. Stomach acid (pH 1.5–3.5) theoretically degrades it, though some research suggests oral BPC-157 retains activity — possibly because it stabilizes itself against proteolysis. This remains debated.",
        checklist: [
          "Reconstituted solution: maintain neutral pH, do not mix with acidic liquids",
          "Oral form: take on empty stomach to minimize protease exposure",
          "Sublingual or injectable routes bypass gastric degradation entirely"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "Lyophilized BPC-157 is stable for 12–24 months when stored dry and cold. Once reconstituted, the peptide structure begins degrading at room temperature due to hydrolysis and microbial growth.",
        checklist: [
          "Lyophilized (freeze-dried) powder: store at -20°C for long-term, 2–8°C for use within 6 months",
          "Reconstituted solution: use within 14–21 days at 2–8°C",
          "Never expose to light — amber vials only",
          "Use bacteriostatic water (0.9% benzyl alcohol) not sterile water to extend reconstituted shelf life"
        ]
      },
      reconstitution: {
        risk: "HIGH",
        applicable: true,
        detail: "Reconstituted BPC-157 in bacteriostatic water remains effective for approximately 14–21 days refrigerated. Bioactivity is estimated to decline to 70% by day 14 and accelerates after that.",
        checklist: [
          "Date your vial on reconstitution day",
          "Typical reconstitution: 1mg BPC-157 + 2mL bacteriostatic water = 500mcg/mL concentration",
          "Inspect before each use: discard if solution turns cloudy or develops particulates",
          "Never freeze reconstituted peptide — degrades structure"
        ]
      },
      quality_flags: [
        "Purity standard: >98% by HPLC is minimum acceptable; >99% preferred",
        "Sequence verification via mass spectrometry (MS) is the gold standard — ask suppliers for MS data",
        "Amino acid sequence should be: Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
        "Endotoxin testing (LAL test) result should be <1 EU/mg for injectable-grade peptides"
      ]
    },
    interactions: [
      {
        with: "NSAIDs (Ibuprofen, Naproxen)",
        severity: "MODERATE",
        mechanism: "BPC-157 promotes prostaglandin-dependent healing. NSAIDs block COX enzymes and prostaglandin synthesis, potentially counteracting BPC-157's healing mechanism.",
        recommendation: "Avoid concurrent use when using BPC-157 for injury healing. If pain management needed, consider acetaminophen instead."
      },
      {
        with: "Anticoagulants (Warfarin, Heparin)",
        severity: "MODERATE",
        mechanism: "BPC-157 has been shown to modulate nitric oxide pathways and may influence clotting. Theoretical interaction with anticoagulant medications.",
        recommendation: "Consult physician before combining with prescription anticoagulants. Monitor INR more frequently if combining."
      },
      {
        with: "TB-500 (Thymosin Beta-4)",
        severity: "LOW",
        mechanism: "Commonly stacked — BPC-157 promotes local tissue repair via growth factor signaling; TB-500 promotes systemic cell migration and repair. Complementary mechanisms.",
        recommendation: "Synergistic stack for injury recovery. No known adverse interactions. Common protocol: BPC-157 250–500mcg + TB-500 2.5mg, 2–3x/week."
      }
    ]
  },

  {
    id: "coq10",
    name: "CoQ10 / Ubiquinol",
    keywords: ["coq10", "ubiquinol", "ubiquinone", "coenzyme q10", "辅酶q10", "泛醇", "心脏健康", "线粒体能量"],
    stability: {
      ph_sensitivity: {
        risk: "LOW",
        optimal_ph: "N/A",
        detail: "CoQ10 is relatively pH-stable in solid form. The primary stability concern is oxidation, not pH.",
        checklist: [
          "Capsule form is stable at room temperature if stored away from heat/light",
          "Liquid softgel formulations have better bioavailability but shorter shelf life once opened"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "CoQ10 (ubiquinone form) is highly susceptible to UV light and oxidizes to inactive forms upon light exposure. Heat above 50°C can cause crystal structure changes that reduce bioavailability.",
        checklist: [
          "Store in cool, dark place; do not leave on countertop near sunlight",
          "Softgel formulations in opaque bottles are preferable to clear capsules",
          "Ubiquinol (reduced form) oxidizes back to ubiquinone upon air exposure — buy in sealed blister packs"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "CoQ10 is fat-soluble. Take with a meal containing dietary fat for optimal absorption (up to 3x better absorption vs. fasting state)."
      },
      quality_flags: [
        "Ubiquinol (reduced) vs. Ubiquinone (oxidized): ubiquinol has ~4–8x better bioavailability in most populations",
        "Elderly and those on statins convert ubiquinone to ubiquinol less efficiently — ubiquinol preferred",
        "Crystalline CoQ10 has very poor absorption — look for formulations with absorption-enhancing excipients (cyclodextrin, lipid carriers, BioPerine)"
      ]
    },
    interactions: [
      {
        with: "Statins (Atorvastatin, Rosuvastatin, etc.)",
        severity: "LOW",
        mechanism: "Statins block the mevalonate pathway, which inhibits both cholesterol AND CoQ10 synthesis. CoQ10 supplementation can partially restore levels depleted by statins. Beneficial, not harmful.",
        recommendation: "If on statins, CoQ10 supplementation (100–300mg ubiquinol/day) is broadly recommended. No drug interaction risk."
      },
      {
        with: "Warfarin",
        severity: "MODERATE",
        mechanism: "CoQ10 has structural similarity to vitamin K2 and may modestly potentiate warfarin's anticoagulant effect or occasionally reduce it. Results are inconsistent across studies.",
        recommendation: "Monitor INR more closely when starting CoQ10 if on warfarin. Inform prescribing physician."
      },
      {
        with: "Vitamin E",
        severity: "LOW",
        mechanism: "Synergistic antioxidant relationship: CoQ10 regenerates Vitamin E from its oxidized form. Taking together is theoretically beneficial.",
        recommendation: "Can combine. Common heart health stack: CoQ10 + Vitamin E + Omega-3."
      }
    ]
  },

  {
    id: "omega3",
    name: "Omega-3 / Fish Oil (EPA + DHA)",
    keywords: ["omega-3", "omega 3", "fish oil", "epa", "dha", "鱼油", "欧米伽3", "omega3", "fish oil capsules", "marine omega"],
    stability: {
      ph_sensitivity: {
        risk: "LOW",
        detail: "Omega-3 fatty acids are not pH-sensitive. Primary degradation pathway is oxidation.",
        checklist: [
          "Smell the oil: fresh fish oil should have mild ocean smell, NOT strong fishy odor",
          "Rancid (oxidized) fish oil has a sharp, foul smell — discard immediately"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "Omega-3 polyunsaturated fatty acids (PUFA) oxidize rapidly upon exposure to oxygen, heat, or light. Oxidized fish oil generates lipid peroxides that are actively harmful — worse than taking no omega-3 at all.",
        checklist: [
          "Refrigerate after opening — especially liquid fish oil",
          "Consume within 3 months of opening for capsules; within 30–45 days for liquid",
          "TOTOX value <10 = fresh oil; >26 = rancid (ask for COA with oxidation markers)",
          "Look for oils with added Vitamin E (tocopherol) as antioxidant preservative"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "Triglyceride (TG) form has superior absorption to ethyl ester (EE) form. Take with a high-fat meal for up to 2x better absorption."
      },
      quality_flags: [
        "Three oxidation markers on COA: Peroxide Value (PV) <5 meq/kg, Anisidine Value (AV) <20, TOTOX <26",
        "Third-party testing: IFOS 5-star certification is the gold standard for fish oil purity and freshness",
        "Heavy metals: verify COA shows mercury, lead, PCBs below detectable limits",
        "Triglyceride form (re-esterified TG) > Ethyl Ester form for absorption and stability"
      ]
    },
    interactions: [
      {
        with: "Anticoagulants / Blood Thinners",
        severity: "MODERATE",
        mechanism: "EPA/DHA inhibit platelet aggregation and have mild anticoagulant effects. High doses (>3g EPA+DHA/day) combined with warfarin, aspirin, or other anticoagulants can increase bleeding risk.",
        recommendation: "Above 2g EPA+DHA/day: inform physician if on blood thinners. Standard 1g doses are generally safe."
      },
      {
        with: "Vitamin D3",
        severity: "LOW",
        mechanism: "Both are fat-soluble; taking together with a meal enhances absorption of both simultaneously. No adverse interaction.",
        recommendation: "Excellent combination. Take together with a fat-containing meal."
      },
      {
        with: "High-dose Vitamin E (>400 IU/day)",
        severity: "MODERATE",
        mechanism: "Very high-dose Vitamin E may paradoxically act as a pro-oxidant at supplemental doses and could theoretically interact with omega-3's antiplatelet effects. Additive anticoagulation possible.",
        recommendation: "Keep Vitamin E below 400 IU/day if combining with omega-3 and anticoagulants."
      }
    ]
  },

  {
    id: "vitamin_c",
    name: "Vitamin C (L-Ascorbic Acid)",
    keywords: ["vitamin c", "ascorbic acid", "维生素c", "维C", "抗坏血酸", "vc", "ascorbate", "liposomal vitamin c", "脂质体维C"],
    stability: {
      ph_sensitivity: {
        risk: "HIGH",
        optimal_ph: "2.5–3.5 (stable acidic) or liposomal (pH-neutral)",
        detail: "Paradoxically, L-ascorbic acid is most stable at its own acidic pH (2.5–3.5). In neutral or alkaline conditions (pH > 7.0), it oxidizes rapidly to dehydroascorbic acid (DHAA), which has significantly lower bioactivity. This creates a dilemma: the pH effective for skin penetration irritates sensitive skin.",
        checklist: [
          "Vitamin C serums at pH > 4.0 have poor skin penetration — look for serums at pH 2.5–3.5",
          "Yellowing or browning of Vitamin C serum = oxidized = discard",
          "Oral: L-ascorbic acid tablets are more stable than dissolved powder; consume dissolved solutions immediately"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "Vitamin C degrades rapidly under UV light (half-life <1 hour in direct sunlight) and heat. Even room-temperature storage causes measurable potency loss over months.",
        checklist: [
          "Topical serums: store in refrigerator, use within 3 months of opening",
          "Oral supplements: store in cool, dark place; gelatin capsules offer some protection",
          "Avoid leaving on bathroom counter — humidity + heat = accelerated oxidation"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "Liposomal Vitamin C offers superior absorption and stability compared to standard ascorbic acid. Sodium ascorbate (buffered) is gentler on the stomach for high-dose supplementation."
      },
      quality_flags: [
        "Liposomal Vitamin C: verify phospholipid encapsulation efficiency — many brands use poorly formed liposomes",
        "Ester-C (calcium ascorbate): gentler on stomach but may have slightly lower bioavailability than standard ascorbic acid",
        "Ascorbyl palmitate (fat-soluble form): primarily antioxidant for product preservation, less effective as systemic vitamin C"
      ]
    },
    interactions: [
      {
        with: "Iron (non-heme / plant-based iron)",
        severity: "LOW",
        mechanism: "Vitamin C dramatically enhances non-heme iron absorption (up to 6x). This is intentionally beneficial for iron deficiency, but can be harmful in those with hemochromatosis or iron overload.",
        recommendation: "Take together if iron absorption is the goal. Avoid high-dose Vitamin C + iron supplementation if you have hemochromatosis or elevated ferritin."
      },
      {
        with: "GHK-Cu / Copper supplements",
        severity: "CRITICAL",
        mechanism: "Ascorbic acid acts as a reducing agent and lowers local pH, both conditions that strip copper from peptide chelates. Free copper then becomes pro-oxidant and catalyzes further Vitamin C degradation.",
        recommendation: "Strict time separation: Vitamin C AM, GHK-Cu PM. Minimum 4-hour gap."
      },
      {
        with: "B12 (Cyanocobalamin)",
        severity: "MODERATE",
        mechanism: "High-dose Vitamin C (>1000mg) can destroy cyanocobalamin in the GI tract before absorption. Methylcobalamin is more resistant to this effect.",
        recommendation: "Take B12 separately from high-dose Vitamin C. Or switch to methylcobalamin form."
      }
    ]
  },

  {
    id: "magnesium",
    name: "Magnesium (Various Forms)",
    keywords: ["magnesium", "镁", "magnesium glycinate", "magnesium malate", "magnesium threonate", "magnesium oxide", "甘氨酸镁", "苹果酸镁", "氧化镁", "mag glycinate"],
    stability: {
      ph_sensitivity: {
        risk: "LOW",
        detail: "Magnesium salts are generally pH-stable. The primary concern is form selection for bioavailability, not degradation.",
        checklist: [
          "Magnesium oxide: avoid — only 4% elemental absorption, causes diarrhea at therapeutic doses",
          "Magnesium glycinate/bisglycinate: superior — 80%+ absorption, no laxative effect",
          "Magnesium threonate: crosses blood-brain barrier — best for cognitive/neurological goals"
        ]
      },
      light_heat: {
        risk: "LOW",
        detail: "Magnesium supplements are highly stable under normal storage conditions.",
        checklist: [
          "No special storage required beyond cool, dry place",
          "Avoid moisture — magnesium powders can clump in humidity"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "Elemental magnesium content varies widely by salt: Oxide (60% elemental) but poorest absorption; Glycinate (14% elemental) but excellent absorption; Threonate (7.2% elemental). Always calculate dose based on elemental magnesium, not compound weight."
      },
      quality_flags: [
        "CRITICAL label reading: 'Magnesium (as Glycinate) 400mg' — the 400mg is compound weight; elemental Mg is ~56mg",
        "Proprietary blends hiding form ratios are a red flag",
        "Avoid products mixing glycinate with oxide to pad elemental numbers"
      ]
    },
    interactions: [
      {
        with: "Zinc (high-dose, >40mg elemental Zinc)",
        severity: "MODERATE",
        mechanism: "Zinc and magnesium compete for the same intestinal transporter (DMT1). High-dose zinc supplementation can significantly impair magnesium absorption.",
        recommendation: "Separate doses by 2+ hours. Do not take high-dose zinc and magnesium simultaneously. Evening Mg, morning Zn is a practical protocol."
      },
      {
        with: "Calcium (high-dose, >500mg)",
        severity: "MODERATE",
        mechanism: "Calcium and magnesium share absorption pathways. Traditional Ca:Mg 2:1 ratio recommendation has been challenged — some evidence suggests equal ratio is preferable for cardiac health.",
        recommendation: "Take calcium and magnesium in separate doses. Ideal Ca:Mg ratio for supplementation: 1:1 to 2:1 maximum."
      },
      {
        with: "Antibiotics (Tetracyclines, Fluoroquinolones)",
        severity: "MODERATE",
        mechanism: "Magnesium (and other divalent minerals) chelate with these antibiotics in the GI tract, significantly reducing antibiotic absorption and effectiveness.",
        recommendation: "Take antibiotics 2 hours before or 6 hours after magnesium. This is clinically important — antibiotic failure can result from mineral co-administration."
      }
    ]
  },

  {
    id: "probiotics",
    name: "Probiotics",
    keywords: ["probiotics", "probiotic", "lactobacillus", "bifidobacterium", "益生菌", "肠道菌群", "gut bacteria", "microbiome", "lactobacillus acidophilus"],
    stability: {
      ph_sensitivity: {
        risk: "HIGH",
        detail: "Probiotic bacteria are highly vulnerable to stomach acid (pH 1.5–3.5). Most unprotected strains lose 90%+ viability during gastric transit. Enteric coating or acid-resistant capsules are critical for survival.",
        checklist: [
          "Choose enteric-coated capsules or strains documented to survive stomach acid (L. rhamnosus GG, L. plantarum)",
          "Take with food — stomach acid is diluted and pH temporarily rises post-meal",
          "Soil-based organisms (SBOs) like Bacillus coagulans naturally survive stomach acid without coating"
        ]
      },
      light_heat: {
        risk: "HIGH",
        detail: "Live bacterial cultures die at temperatures above 40°C. Even brief exposure to body temperature during shipping without cold chain can devastate CFU counts.",
        checklist: [
          "Refrigeration is required for most Lactobacillus/Bifidobacterium strains",
          "Shelf-stable probiotics (Bacillus coagulans, spore-forming strains) don't require refrigeration",
          "Check if product was shipped with ice pack — if not, CFU count may already be compromised on arrival"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "CFU (Colony Forming Units) count on label should be 'at time of expiration' not 'at time of manufacture'. Brands guaranteeing CFU at expiration are more reliable."
      },
      quality_flags: [
        "CFU at expiration vs. at manufacture: demand 'at expiration' guarantee",
        "Strain specificity matters: 'Lactobacillus' is not enough — need full strain designation (e.g., L. rhamnosus GG, L. acidophilus NCFM)",
        "Multi-strain products: more strains ≠ better; studied strain combinations are preferable to random 30-strain blends",
        "Third-party verification: NSF or USP certified products guarantee label CFU accuracy"
      ]
    },
    interactions: [
      {
        with: "Antibiotics",
        severity: "CRITICAL",
        mechanism: "Antibiotics kill probiotic bacteria. Taking simultaneously completely negates probiotic supplementation.",
        recommendation: "Take probiotics 2 hours after antibiotics to minimize die-off. Continue probiotic supplementation for 4 weeks after antibiotic course to restore microbiome."
      },
      {
        with: "Immunosuppressants",
        severity: "MODERATE",
        mechanism: "Live bacteria, even beneficial strains, carry a small risk of translocation in severely immunocompromised individuals (chemotherapy, organ transplant patients).",
        recommendation: "Consult physician before starting probiotics if on immunosuppressant therapy or if severely immunocompromised."
      },
      {
        with: "Prebiotic Fiber (Inulin, FOS, Psyllium)",
        severity: "LOW",
        mechanism: "Prebiotics are fermentable fiber that feeds probiotic bacteria. Synergistic when combined — the combination is called a 'synbiotic'.",
        recommendation: "Beneficial combination. Take prebiotic fiber with or slightly before probiotics for maximum synbiotic effect."
      }
    ]
  },

  {
    id: "collagen",
    name: "Collagen Peptides / Hydrolyzed Collagen",
    keywords: ["collagen", "collagen peptides", "hydrolyzed collagen", "marine collagen", "bovine collagen", "胶原蛋白", "胶原肽", "水解胶原", "美容胶原"],
    stability: {
      ph_sensitivity: {
        risk: "LOW",
        detail: "Hydrolyzed collagen peptides are highly stable — the hydrolysis process has already broken the large collagen protein into small dipeptides and tripeptides resistant to further degradation under normal conditions.",
        checklist: [
          "Powder form is extremely stable; no pH concerns for typical use",
          "Dissolves easily in hot or cold liquids without structural change"
        ]
      },
      light_heat: {
        risk: "LOW",
        detail: "Collagen peptide powder is highly stable at room temperature. Unlike intact collagen protein, hydrolyzed peptides don't denature with typical cooking temperatures.",
        checklist: [
          "Can add to hot coffee or tea without degradation",
          "Store in cool, dry place; no refrigeration required",
          "Liquid collagen formulations: check for added preservatives; more prone to bacterial growth than powder"
        ]
      },
      reconstitution: {
        risk: "LOW",
        applicable: false,
        detail: "Key absorption point: collagen dipeptides (Pro-Hyp and Hyp-Gly) are absorbed intact and detected in bloodstream within 1 hour of ingestion. Type I and III collagen are most relevant for skin/hair/nail goals; Type II for joint goals."
      },
      quality_flags: [
        "Source matters: marine collagen (Type I, smaller peptide size) may absorb faster than bovine (Type I + III)",
        "Molecular weight: hydrolyzed collagen should be <5,000 Da for optimal absorption (look for 'low molecular weight' on label)",
        "Vitamin C is required for collagen synthesis — collagen supplementation without adequate Vitamin C may be suboptimal",
        "Avoid 'collagen boosters' with no actual collagen — some products are amino acid blends that support collagen synthesis but don't contain collagen"
      ]
    },
    interactions: [
      {
        with: "Vitamin C",
        severity: "LOW",
        mechanism: "Strongly synergistic: Vitamin C is a required cofactor for prolyl hydroxylase, the enzyme that cross-links collagen fibers into stable triple-helix structures. Without Vitamin C, newly synthesized collagen cannot be properly assembled.",
        recommendation: "Take collagen peptides with Vitamin C. Many high-quality collagen products include Vitamin C in the formula for this reason."
      },
      {
        with: "GHK-Cu",
        severity: "LOW",
        mechanism: "Potentially synergistic for skin: GHK-Cu stimulates TGF-β and collagen gene expression, while hydrolyzed collagen provides the proline/hydroxyproline substrate for new collagen synthesis.",
        recommendation: "Complementary mechanisms. Can combine — take collagen orally in AM/PM and apply GHK-Cu topically in PM routine."
      }
    ]
  }
];

/**
 * Find relevant ingredients based on user query.
 * Returns array of matched ingredient objects.
 */
function findRelevantIngredients(query, maxResults = 3) {
  if (!query) return [];
  const q = query.toLowerCase();
  const scored = STABILITY_INGREDIENTS.map(ingredient => {
    let score = 0;
    for (const keyword of ingredient.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score += keyword.length > 4 ? 3 : 1; // longer keyword = more specific match
      }
    }
    return { ingredient, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults).map(x => x.ingredient);
}

/**
 * Format stability intelligence into a prompt injection block.
 */
function formatStabilityContext(ingredients) {
  if (!ingredients || ingredients.length === 0) return "";

  let block = `\n\n## STABILITY INTELLIGENCE (Proprietary PickScope Ingredient Audit Data)\n`;
  block += `The following ingredients have known stability vulnerabilities. Use this data to:\n`;
  block += `1. Fill in the stability_audit JSON field accurately with specific, non-generic findings\n`;
  block += `2. Alert users to critical incompatibilities and interaction risks\n`;
  block += `3. Provide checklist items the user can act on immediately\n\n`;

  for (const ing of ingredients) {
    block += `---\n`;
    block += `### INGREDIENT: ${ing.name}\n`;

    if (ing.stability.ph_sensitivity.risk !== "LOW" || ing.stability.light_heat.risk !== "LOW") {
      block += `**Stability Profile:**\n`;
      if (ing.stability.ph_sensitivity.detail) {
        block += `- pH Stability (${ing.stability.ph_sensitivity.risk} RISK): ${ing.stability.ph_sensitivity.detail}\n`;
        if (ing.stability.ph_sensitivity.checklist) {
          block += `  Checklist: ${ing.stability.ph_sensitivity.checklist.join(" | ")}\n`;
        }
      }
      if (ing.stability.light_heat.detail) {
        block += `- Light/Heat (${ing.stability.light_heat.risk} RISK): ${ing.stability.light_heat.detail}\n`;
        if (ing.stability.light_heat.checklist) {
          block += `  Checklist: ${ing.stability.light_heat.checklist.join(" | ")}\n`;
        }
      }
      if (ing.stability.reconstitution?.applicable) {
        block += `- Reconstitution Half-Life (HIGH RISK): ${ing.stability.reconstitution.detail}\n`;
        if (ing.stability.reconstitution.checklist) {
          block += `  Checklist: ${ing.stability.reconstitution.checklist.join(" | ")}\n`;
        }
      }
    }

    if (ing.stability.quality_flags?.length) {
      block += `**Quality Red Flags:** ${ing.stability.quality_flags.join(" | ")}\n`;
    }

    if (ing.interactions?.length) {
      block += `**Known Interactions:**\n`;
      for (const ix of ing.interactions) {
        block += `- ${ing.name} × ${ix.with} [${ix.severity}]: ${ix.mechanism} → ${ix.recommendation}\n`;
      }
    }
    block += `\n`;
  }

  block += `---\n`;
  block += `IMPORTANT: Translate the above technical data into the stability_audit JSON format. Be specific and use the exact checklist items provided. Do not genericize.\n`;

  return block;
}

module.exports = { STABILITY_INGREDIENTS, findRelevantIngredients, formatStabilityContext };
