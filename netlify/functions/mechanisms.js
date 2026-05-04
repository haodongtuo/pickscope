/**
 * PickScope Mechanism Knowledge Base — v1.0
 * 20 core biological mechanisms with supplement interventions,
 * synergy/antagonism relationships, and evidence tiers.
 *
 * Evidence Tiers:
 *   A = Multiple RCTs, consistent results
 *   B = Some RCTs, mixed or small samples
 *   C = Observational / animal studies
 *   D = No credible clinical evidence
 */

const MECHANISMS = [
  {
    id: "glutamate_overload",
    name_en: "Glutamate Excitotoxicity",
    name_zh: "谷氨酸过载 / 神经兴奋毒性",
    keywords: ["anxiety", "anxious", "nervous", "焦虑", "紧张", "神经兴奋", "过度兴奋", "racing thoughts", "brain overactive", "nmda", "glutamate", "irritable", "易怒"],
    symptoms: ["anxiety", "racing thoughts", "insomnia", "irritability", "muscle tension", "hypersensitivity to stimuli"],
    description: "Excess glutamate or insufficient GABA leads to overstimulation of NMDA receptors, causing neural hyperexcitability. Common in chronic stress, poor sleep, and magnesium deficiency.",
    interventions: [
      {
        supplement: "Magnesium Glycinate",
        mechanism: "NMDA receptor antagonist — blocks excess glutamate signaling",
        effect: "Reduces neural overexcitability, improves sleep, lowers anxiety",
        dose: "200–400mg elemental magnesium/day",
        evidence_tier: "A",
        synergy: ["Taurine", "L-Theanine", "Glycine"],
        antagonism: [],
        pmids: ["17544905", "28445426", "26863234"]
      },
      {
        supplement: "L-Theanine",
        mechanism: "Modulates AMPA/NMDA receptors, increases GABA and alpha brain waves",
        effect: "Calm focus without sedation, reduces anxiety",
        dose: "100–200mg/day",
        evidence_tier: "A",
        synergy: ["Magnesium Glycinate", "Ashwagandha"],
        antagonism: [],
        pmids: ["16930802", "22214254"]
      },
      {
        supplement: "Taurine",
        mechanism: "GABA-A receptor agonist, inhibitory neurotransmitter support",
        effect: "Reduces neuronal excitability, anxiolytic",
        dose: "500–2000mg/day",
        evidence_tier: "B",
        synergy: ["Magnesium Glycinate", "GABA"],
        antagonism: [],
        pmids: ["19239135"]
      }
    ],
    key_synergies: "Magnesium + L-Theanine = additive NMDA dampening + GABA support",
    key_antagonisms: "High-dose Vitamin B6 (>200mg/day) may paradoxically increase glutamate synthesis"
  },

  {
    id: "hpa_dysregulation",
    name_en: "HPA Axis Dysregulation",
    name_zh: "HPA轴失调 / 慢性压力皮质醇过高",
    keywords: ["stress", "cortisol", "burnout", "压力", "皮质醇", "精疲力竭", "倦怠", "chronic stress", "adrenal", "疲劳", "overworked", "burned out", "hpa", "adaptogen", "适应原"],
    symptoms: ["chronic fatigue", "elevated cortisol", "insomnia", "anxiety", "weight gain around belly", "brain fog", "low libido"],
    description: "Chronic activation of the hypothalamic-pituitary-adrenal axis leads to cortisol excess, disrupting sleep, immune function, metabolism, and mood.",
    interventions: [
      {
        supplement: "Ashwagandha (KSM-66 or Sensoril extract)",
        mechanism: "Modulates HPA axis via withanolides, reduces cortisol synthesis",
        effect: "Reduces cortisol by 20–30% in RCTs, improves stress resilience",
        dose: "300–600mg extract/day",
        evidence_tier: "A",
        synergy: ["Rhodiola Rosea", "Phosphatidylserine"],
        antagonism: ["Avoid with thyroid medications (may increase T3/T4)"],
        pmids: ["23439798", "28829155", "31737537"]
      },
      {
        supplement: "Rhodiola Rosea",
        mechanism: "Adaptogen — modulates stress response via monoamine neurotransmitters and cortisol",
        effect: "Reduces fatigue, improves mental performance under stress",
        dose: "200–600mg standardized extract (3% rosavins, 1% salidroside)/day",
        evidence_tier: "A",
        synergy: ["Ashwagandha", "Eleuthero"],
        antagonism: ["May interact with SSRIs/MAOIs"],
        pmids: ["12725561", "29325481"]
      },
      {
        supplement: "Phosphatidylserine",
        mechanism: "Blunts cortisol response to physical and mental stress",
        effect: "Lowers exercise-induced cortisol spike, improves mood under stress",
        dose: "300–400mg/day",
        evidence_tier: "B",
        synergy: ["Ashwagandha"],
        antagonism: [],
        pmids: ["12323088", "10604851"]
      }
    ],
    key_synergies: "Ashwagandha + Rhodiola = dual adaptogenic mechanism, additive cortisol modulation",
    key_antagonisms: "High caffeine intake (>400mg/day) exacerbates HPA dysregulation and undermines adaptogen benefits"
  },

  {
    id: "mitochondrial_dysfunction",
    name_en: "Mitochondrial Dysfunction",
    name_zh: "线粒体功能障碍 / 细胞能量不足",
    keywords: ["fatigue", "exhausted", "no energy", "疲劳", "精力不足", "没精神", "mitochondria", "线粒体", "cellular energy", "atp", "chronic fatigue syndrome", "cfs", "me/cfs", "post-covid fatigue", "brain fog", "脑雾"],
    symptoms: ["persistent fatigue not relieved by rest", "brain fog", "exercise intolerance", "muscle weakness", "cold hands/feet"],
    description: "Impaired mitochondrial ATP production reduces cellular energy in high-demand tissues (brain, heart, muscle). Caused by oxidative stress, nutrient deficiencies, aging, or illness.",
    interventions: [
      {
        supplement: "CoQ10 (Ubiquinol form)",
        mechanism: "Essential electron carrier in mitochondrial respiratory chain (Complex I-III)",
        effect: "Improves ATP synthesis, reduces oxidative stress in mitochondria",
        dose: "100–300mg ubiquinol/day (ubiquinol > ubiquinone for absorption)",
        evidence_tier: "A",
        synergy: ["PQQ", "L-Carnitine", "Riboflavin (B2)"],
        antagonism: ["Statins deplete CoQ10 — supplementation especially important for statin users"],
        pmids: ["18272714", "26766547"]
      },
      {
        supplement: "PQQ (Pyrroloquinoline Quinone)",
        mechanism: "Stimulates mitochondrial biogenesis (growth of new mitochondria) via PGC-1α pathway",
        effect: "Increases mitochondrial number and efficiency, neuroprotective",
        dose: "10–20mg/day",
        evidence_tier: "B",
        synergy: ["CoQ10 (powerful combination)", "Nicotinamide Riboside"],
        antagonism: [],
        pmids: ["20010505", "22465791"]
      },
      {
        supplement: "Nicotinamide Riboside (NR) or NMN",
        mechanism: "NAD+ precursor — NAD+ is essential for mitochondrial energy metabolism",
        effect: "Raises cellular NAD+ levels, supports mitochondrial function and longevity pathways",
        dose: "250–500mg NR/day",
        evidence_tier: "B",
        synergy: ["Resveratrol", "PQQ", "CoQ10"],
        antagonism: [],
        pmids: ["28615312", "29184669"]
      }
    ],
    key_synergies: "CoQ10 + PQQ = existing mitochondria work better AND new ones are created (complementary mechanisms)",
    key_antagonisms: "Statins block CoQ10 synthesis — if user takes statins, CoQ10 is especially critical"
  },

  {
    id: "methylation_defect",
    name_en: "Methylation Cycle Dysfunction",
    name_zh: "甲基化循环障碍 / MTHFR / 高同型半胱氨酸",
    keywords: ["mthfr", "methylation", "甲基化", "homocysteine", "同型半胱氨酸", "b12 deficiency", "folate", "叶酸", "depression", "抑郁", "mood", "情绪", "cardiovascular risk", "heart health", "心血管"],
    symptoms: ["depression", "anxiety", "brain fog", "cardiovascular risk markers", "elevated homocysteine", "poor detox", "fatigue"],
    description: "Impaired methylation cycle (often from MTHFR gene variants) reduces production of SAMe and other methyl donors, affecting neurotransmitter synthesis, DNA repair, and detoxification.",
    interventions: [
      {
        supplement: "Methylfolate (L-5-MTHF)",
        mechanism: "Active form of folate bypassing MTHFR enzyme defect, directly supports methylation",
        effect: "Reduces homocysteine, supports serotonin/dopamine synthesis",
        dose: "400–1000mcg L-5-MTHF/day",
        evidence_tier: "A",
        synergy: ["Methylcobalamin (B12)", "P5P (B6)", "Betaine/TMG"],
        antagonism: ["Folic acid (synthetic) may actually block methylfolate receptors in MTHFR variants"],
        pmids: ["26376608", "22269485"]
      },
      {
        supplement: "Methylcobalamin (Methyl-B12)",
        mechanism: "Active B12 form, methyl donor in homocysteine remethylation pathway",
        effect: "Lowers homocysteine, supports myelin and nerve function",
        dose: "500–2000mcg/day",
        evidence_tier: "A",
        synergy: ["Methylfolate", "P5P"],
        antagonism: ["Cyanocobalamin is inferior for MTHFR variants — choose methylcobalamin"],
        pmids: ["23194986"]
      },
      {
        supplement: "TMG (Trimethylglycine / Betaine)",
        mechanism: "Alternative methyl donor via BHMT pathway, independent of MTHFR",
        effect: "Lowers homocysteine, liver protection",
        dose: "500–3000mg/day",
        evidence_tier: "B",
        synergy: ["Methylfolate", "Methylcobalamin"],
        antagonism: [],
        pmids: ["15514282"]
      }
    ],
    key_synergies: "Methylfolate + Methylcobalamin + P5P = complete methylation cycle co-factor stack",
    key_antagonisms: "Synthetic folic acid (in cheap multivitamins) can competitively inhibit methylfolate — always choose active form"
  },

  {
    id: "gut_brain_axis",
    name_en: "Gut-Brain Axis Dysregulation",
    name_zh: "肠脑轴失调 / 肠道菌群紊乱",
    keywords: ["gut health", "肠道健康", "gut brain", "肠脑", "microbiome", "菌群", "ibs", "bloating", "胀气", "constipation", "便秘", "leaky gut", "肠漏", "mood gut", "probiotics", "益生菌", "digestive", "消化"],
    symptoms: ["digestive discomfort", "bloating", "mood disturbances linked to gut", "skin issues", "brain fog", "immune dysregulation"],
    description: "The gut microbiome communicates bidirectionally with the brain via the vagus nerve, immune signaling, and neurotransmitter precursors. Dysbiosis impairs serotonin production (90% made in gut), immunity, and mood.",
    interventions: [
      {
        supplement: "Multi-strain Probiotic (Lactobacillus + Bifidobacterium)",
        mechanism: "Restores microbial diversity, produces SCFA, supports gut barrier integrity",
        effect: "Reduces bloating, IBS symptoms, improves mood via gut-brain axis",
        dose: "10–50 billion CFU/day, multi-strain",
        evidence_tier: "A",
        synergy: ["Prebiotics (Inulin/FOS)", "L-Glutamine"],
        antagonism: ["Antibiotics kill probiotics — take probiotics 2+ hours after antibiotics"],
        pmids: ["26222247", "31423057"]
      },
      {
        supplement: "L-Glutamine",
        mechanism: "Primary fuel for intestinal epithelial cells, supports tight junction integrity",
        effect: "Repairs leaky gut, reduces intestinal permeability",
        dose: "5–15g/day",
        evidence_tier: "B",
        synergy: ["Probiotics", "Zinc Carnosine"],
        antagonism: [],
        pmids: ["24965526"]
      },
      {
        supplement: "Prebiotics (Inulin / FOS / Psyllium)",
        mechanism: "Feed beneficial bacteria (Bifidobacterium, Lactobacillus), increase SCFA production",
        effect: "Supports microbiome diversity, improves gut motility",
        dose: "5–10g/day, increase gradually to avoid gas",
        evidence_tier: "A",
        synergy: ["Probiotics (synbiotic effect)"],
        antagonism: ["Rapid dose increase causes bloating — titrate slowly"],
        pmids: ["16633129"]
      }
    ],
    key_synergies: "Probiotics + Prebiotics = synbiotic effect, significantly more effective than either alone",
    key_antagonisms: "NSAIDs and alcohol damage gut lining and undermine probiotic benefits"
  },

  {
    id: "chronic_inflammation",
    name_en: "Chronic Systemic Inflammation",
    name_zh: "慢性系统性炎症 / NF-κB激活",
    keywords: ["inflammation", "炎症", "inflammatory", "joint pain", "关节痛", "crp", "c-reactive protein", "nf-kb", "anti-inflammatory", "抗炎", "arthritis", "关节炎", "autoimmune", "自身免疫", "chronic pain", "慢性疼痛"],
    symptoms: ["joint pain", "elevated CRP/ESR", "fatigue", "brain fog", "weight gain", "premature aging signs"],
    description: "Low-grade chronic inflammation driven by NF-κB pathway activation. Linked to poor diet, stress, dysbiosis, and environmental toxins. Underlies most chronic diseases.",
    interventions: [
      {
        supplement: "Curcumin with Piperine or Liposomal Curcumin",
        mechanism: "NF-κB pathway inhibitor, COX-2 inhibitor, antioxidant",
        effect: "Reduces inflammatory cytokines (IL-6, TNF-α), comparable to NSAIDs in some joint studies",
        dose: "500–1000mg curcumin + 5–10mg piperine/day (or liposomal equivalent)",
        evidence_tier: "A",
        synergy: ["Omega-3 (EPA/DHA)", "Boswellia", "Resveratrol"],
        antagonism: ["Plain curcumin without piperine has <5% bioavailability — formulation critical"],
        pmids: ["17569207", "29480523"]
      },
      {
        supplement: "Omega-3 (EPA/DHA Fish Oil)",
        mechanism: "EPA/DHA compete with arachidonic acid, produce pro-resolving mediators (resolvins, protectins)",
        effect: "Reduces circulating inflammatory markers, cardioprotective",
        dose: "2–4g combined EPA+DHA/day for anti-inflammatory effect",
        evidence_tier: "A",
        synergy: ["Curcumin", "Vitamin D3"],
        antagonism: ["High doses (>3g) may increase bleeding risk with anticoagulants"],
        pmids: ["17335257", "26745681"]
      },
      {
        supplement: "Boswellia Serrata (AKBA extract)",
        mechanism: "5-LOX pathway inhibitor (different from COX pathway) — unique non-NSAID mechanism",
        effect: "Reduces joint inflammation, osteoarthritis pain without GI side effects of NSAIDs",
        dose: "100–250mg AKBA standardized extract/day",
        evidence_tier: "A",
        synergy: ["Curcumin (complementary pathways)", "Omega-3"],
        antagonism: [],
        pmids: ["18187591"]
      }
    ],
    key_synergies: "Curcumin (NF-κB/COX-2) + Boswellia (5-LOX) + Omega-3 (AA competition) = three distinct anti-inflammatory pathways simultaneously",
    key_antagonisms: "Refined sugar, trans fats, and alcohol activate NF-κB and counteract all anti-inflammatory supplements"
  },

  {
    id: "insulin_resistance",
    name_en: "Insulin Resistance / Blood Sugar Dysregulation",
    name_zh: "胰岛素抵抗 / 血糖失调",
    keywords: ["blood sugar", "血糖", "insulin resistance", "胰岛素抵抗", "diabetes", "糖尿病", "prediabetes", "糖尿病前期", "metabolic syndrome", "代谢综合征", "sugar cravings", "嗜糖", "energy crash", "能量崩溃", "belly fat", "腹部脂肪"],
    symptoms: ["energy crashes after meals", "sugar cravings", "weight gain", "elevated fasting glucose", "belly fat", "fatigue after eating"],
    description: "Impaired insulin signaling causes hyperglycemia and compensatory hyperinsulinemia. Drives inflammation, fat storage, mitochondrial dysfunction, and accelerated aging.",
    interventions: [
      {
        supplement: "Berberine",
        mechanism: "AMPK activator, similar mechanism to Metformin — improves glucose uptake and reduces hepatic glucose output",
        effect: "Lowers fasting blood glucose by 20–30% in studies, comparable to some diabetic medications",
        dose: "500mg 2–3x/day with meals",
        evidence_tier: "A",
        synergy: ["Alpha-Lipoic Acid", "Chromium"],
        antagonism: ["May interact with diabetes medications causing hypoglycemia — monitor blood glucose"],
        pmids: ["19800084", "23093488"]
      },
      {
        supplement: "Alpha-Lipoic Acid (ALA)",
        mechanism: "Improves insulin signaling via GLUT4 translocation, potent antioxidant in both fat and water-soluble compartments",
        effect: "Reduces insulin resistance, neuropathy pain, antioxidant",
        dose: "300–600mg R-ALA/day (R form is more bioavailable than racemic ALA)",
        evidence_tier: "A",
        synergy: ["Berberine", "CoQ10"],
        antagonism: [],
        pmids: ["20842754"]
      },
      {
        supplement: "Chromium Picolinate",
        mechanism: "Enhances insulin receptor sensitivity via chromodulin",
        effect: "Modest reduction in fasting glucose and HbA1c, reduces sugar cravings",
        dose: "200–1000mcg/day",
        evidence_tier: "B",
        synergy: ["Berberine", "Magnesium"],
        antagonism: [],
        pmids: ["14641733"]
      }
    ],
    key_synergies: "Berberine + Alpha-Lipoic Acid = AMPK activation + improved insulin receptor signaling — additive effect on glucose control",
    key_antagonisms: "Simple carbohydrates and fructose undermine all insulin sensitizers; must be combined with dietary changes"
  },

  {
    id: "circadian_disruption",
    name_en: "Circadian Rhythm / Sleep Disruption",
    name_zh: "昼夜节律失调 / 睡眠问题",
    keywords: ["sleep", "睡眠", "insomnia", "失眠", "can't sleep", "睡不着", "melatonin", "褪黑素", "circadian", "昼夜节律", "jet lag", "时差", "sleep quality", "睡眠质量", "sleep cycle", "night shift", "夜班"],
    symptoms: ["difficulty falling asleep", "frequent waking", "non-restorative sleep", "daytime fatigue", "delayed sleep phase"],
    description: "Disruption of the suprachiasmatic nucleus-driven circadian clock impairs melatonin synthesis, cortisol rhythm, and sleep architecture. Worsened by blue light, irregular schedules, and shift work.",
    interventions: [
      {
        supplement: "Melatonin (low dose)",
        mechanism: "Exogenous melatonin signals darkness to SCN, shifts circadian phase",
        effect: "Reduces sleep onset time by 7–12 minutes on average; best for jet lag and circadian shifting",
        dose: "0.5–3mg, 30–60 min before desired bedtime (less is more — high doses cause grogginess)",
        evidence_tier: "A",
        synergy: ["Magnesium Glycinate", "L-Theanine"],
        antagonism: ["High doses (10mg+) can cause next-day grogginess and paradoxically disrupt sleep architecture"],
        pmids: ["13678581", "22648661"]
      },
      {
        supplement: "Magnesium Glycinate",
        mechanism: "NMDA antagonist and GABA activator promotes relaxation; glycine itself is calming",
        effect: "Improves sleep quality and depth, reduces cortisol at night",
        dose: "300–400mg elemental magnesium 1 hour before bed",
        evidence_tier: "A",
        synergy: ["Melatonin", "L-Theanine", "Glycine"],
        antagonism: [],
        pmids: ["28445426"]
      },
      {
        supplement: "Glycine",
        mechanism: "Lowers core body temperature (key sleep trigger), activates NMDA receptors in SCN to reset circadian phase",
        effect: "Improves subjective sleep quality, reduces daytime fatigue from poor sleep",
        dose: "3g before bed",
        evidence_tier: "B",
        synergy: ["Magnesium Glycinate", "Melatonin"],
        antagonism: [],
        pmids: ["22293292", "23853635"]
      }
    ],
    key_synergies: "Magnesium Glycinate + Glycine = temperature drop + GABA support + NMDA modulation before bed",
    key_antagonisms: "Blue light exposure (screens) within 2 hours of bed suppresses melatonin by 50%+ — supplements cannot fully compensate"
  },

  {
    id: "dopamine_dysregulation",
    name_en: "Dopamine System Dysregulation",
    name_zh: "多巴胺系统失调 / 动力缺失 / 专注力差",
    keywords: ["motivation", "动力", "adhd", "注意力", "focus", "专注", "dopamine", "多巴胺", "procrastination", "拖延", "reward", "奖励", "anhedonia", "快感缺失", "low drive", "lack of motivation", "apathy", "冷漠"],
    symptoms: ["low motivation", "difficulty focusing", "procrastination", "anhedonia", "craving stimulants"],
    description: "Insufficient dopamine synthesis or receptor sensitivity impairs reward processing, motivation, focus, and executive function. Often linked to low tyrosine, iron deficiency, or excessive dopamine depletion.",
    interventions: [
      {
        supplement: "L-Tyrosine",
        mechanism: "Rate-limiting precursor to dopamine and norepinephrine synthesis",
        effect: "Improves focus, stress tolerance, and cognitive performance under demand",
        dose: "500–2000mg/day on empty stomach (best taken in morning or pre-demand)",
        evidence_tier: "B",
        synergy: ["Vitamin B6 (P5P)", "Vitamin C", "Iron (cofactors for conversion)"],
        antagonism: ["Avoid with MAOIs", "Competition with large neutral amino acids — take separate from protein meals"],
        pmids: ["15507277", "11498727"]
      },
      {
        supplement: "Mucuna Pruriens (L-DOPA)",
        mechanism: "Contains natural L-DOPA, direct dopamine precursor that crosses blood-brain barrier",
        effect: "Raises dopamine levels more directly than tyrosine; also raises testosterone",
        dose: "250–500mg standardized extract (15% L-DOPA)/day",
        evidence_tier: "B",
        synergy: ["L-Tyrosine"],
        antagonism: ["Do not combine with dopaminergic medications without physician oversight", "Can cause nausea at high doses"],
        pmids: ["18344392"]
      },
      {
        supplement: "Lion's Mane Mushroom",
        mechanism: "Stimulates Nerve Growth Factor (NGF) and BDNF synthesis, promotes neuroplasticity",
        effect: "Improves focus, memory, and mood long-term; neuroprotective",
        dose: "500–1000mg standardized extract (30% polysaccharides) 2x/day",
        evidence_tier: "B",
        synergy: ["Bacopa Monnieri", "Phosphatidylserine"],
        antagonism: [],
        pmids: ["23510212", "20834180"]
      }
    ],
    key_synergies: "L-Tyrosine + P5P (B6) + Vitamin C = complete dopamine synthesis co-factor stack",
    key_antagonisms: "Chronic overuse of stimulants (caffeine, Adderall) downregulates dopamine receptors and depletes precursors over time"
  },

  {
    id: "serotonin_deficiency",
    name_en: "Serotonin Pathway Deficiency",
    name_zh: "血清素不足 / 情绪低落",
    keywords: ["depression", "抑郁", "low mood", "情绪低落", "sad", "sad", "serotonin", "血清素", "5-ht", "mood support", "情绪支持", "seasonal", "季节性", "sad", "tryptophan", "色氨酸", "winter blues", "winter mood"],
    symptoms: ["persistent low mood", "emotional flatness", "carbohydrate cravings", "poor sleep quality", "irritability", "anxiety"],
    description: "Insufficient serotonin synthesis (from tryptophan deficiency, poor conversion, or low sunlight) impairs mood regulation, sleep, and impulse control.",
    interventions: [
      {
        supplement: "5-HTP (5-Hydroxytryptophan)",
        mechanism: "Direct serotonin precursor, bypasses rate-limiting tryptophan hydroxylase step",
        effect: "Increases brain serotonin, improves mood, sleep quality, reduces carb cravings",
        dose: "50–200mg/day (start low, take with food to avoid nausea)",
        evidence_tier: "B",
        synergy: ["Vitamin B6 (P5P)", "Magnesium", "SAMe"],
        antagonism: ["NEVER combine with SSRIs, SNRIs, or MAOIs — risk of serotonin syndrome", "May deplete dopamine with long-term use — consider EGCG or L-Tyrosine to balance"],
        pmids: ["20020979", "22796482"]
      },
      {
        supplement: "SAMe (S-Adenosyl Methionine)",
        mechanism: "Universal methyl donor, supports monoamine (serotonin, dopamine, norepinephrine) synthesis and reuptake",
        effect: "Antidepressant effect comparable to tricyclic antidepressants in some trials",
        dose: "400–1600mg/day (take on empty stomach in morning)",
        evidence_tier: "A",
        synergy: ["Methylfolate", "Methylcobalamin"],
        antagonism: ["Avoid with antidepressants without physician guidance", "Can cause anxiety in some individuals at high doses"],
        pmids: ["10440825"]
      },
      {
        supplement: "Saffron Extract (Affron)",
        mechanism: "Inhibits serotonin reuptake and modulates dopamine, comparable to mild SSRI effect",
        effect: "Reduces mild-to-moderate depression and anxiety symptoms",
        dose: "28–30mg standardized extract (3.5% lepticrosalides)/day",
        evidence_tier: "B",
        synergy: ["5-HTP", "Magnesium"],
        antagonism: ["Avoid with blood thinners in high doses"],
        pmids: ["26468457", "28271921"]
      }
    ],
    key_synergies: "5-HTP + P5P (B6) = B6 is required cofactor for 5-HTP→Serotonin conversion",
    key_antagonisms: "5-HTP + SSRIs = serotonin syndrome risk (potentially dangerous — never combine without physician supervision)"
  },

  {
    id: "testosterone_decline",
    name_en: "Testosterone / Androgen Deficiency",
    name_zh: "雄激素/睾酮下降 / 男性活力不足",
    keywords: ["testosterone", "睾酮", "low t", "low testosterone", "男性活力", "libido", "性欲", "muscle loss", "肌肉减少", "fatigue men", "男性疲劳", "trt", "androgen", "雄激素", "erectile", "勃起"],
    symptoms: ["low libido", "muscle loss", "fatigue", "mood decline", "increased body fat", "poor recovery from exercise"],
    description: "Declining testosterone (natural aging, stress, obesity, endocrine disruptors) impairs muscle protein synthesis, libido, mood, and metabolic rate.",
    interventions: [
      {
        supplement: "Ashwagandha (KSM-66)",
        mechanism: "Reduces cortisol (which suppresses testosterone), may directly stimulate LH",
        effect: "Increases testosterone by 15–20% and improves sperm quality in studies",
        dose: "300–600mg KSM-66 extract/day",
        evidence_tier: "A",
        synergy: ["Zinc", "Vitamin D3"],
        antagonism: [],
        pmids: ["28829155", "19789214"]
      },
      {
        supplement: "Zinc + Boron",
        mechanism: "Zinc is cofactor for testosterone synthesis and 5-alpha reductase; Boron reduces SHBG (freeing bound testosterone)",
        effect: "Corrects zinc deficiency-induced testosterone drop; boron increases free testosterone",
        dose: "15–30mg Zinc (as picolinate or bisglycinate) + 3–10mg Boron/day",
        evidence_tier: "B",
        synergy: ["Vitamin D3", "Ashwagandha"],
        antagonism: ["Zinc >40mg/day can cause copper deficiency — include copper or maintain ratio"],
        pmids: ["8875519", "25525977"]
      },
      {
        supplement: "Vitamin D3 (high dose)",
        mechanism: "Vitamin D receptor in Leydig cells directly regulates testosterone synthesis",
        effect: "Deficient men show 25% testosterone increase with D3 supplementation",
        dose: "3000–5000 IU/day with K2 (100–200mcg MK-7)",
        evidence_tier: "B",
        synergy: ["Zinc", "Ashwagandha", "Magnesium (required for D3 activation)"],
        antagonism: [],
        pmids: ["21154195"]
      }
    ],
    key_synergies: "Ashwagandha (cortisol↓) + Zinc (synthesis cofactor) + Vitamin D3 (Leydig cell support) = comprehensive testosterone support stack",
    key_antagonisms: "Alcohol >2 drinks/day, chronic sleep deprivation, and obesity each independently suppress testosterone — supplements cannot override these"
  },

  {
    id: "oxidative_stress",
    name_en: "Oxidative Stress / Free Radical Damage",
    name_zh: "氧化应激 / 自由基损伤 / 抗衰老",
    keywords: ["antioxidant", "抗氧化", "aging", "衰老", "anti-aging", "抗衰老", "oxidative stress", "氧化应激", "free radicals", "自由基", "longevity", "长寿", "skin aging", "皮肤老化", "cellular damage"],
    symptoms: ["premature aging signs", "chronic fatigue", "slow recovery", "inflammation", "DNA damage markers"],
    description: "Excess reactive oxygen species (ROS) overwhelm endogenous antioxidant defenses (glutathione, SOD), damaging DNA, proteins, and lipid membranes. Central to aging and most chronic diseases.",
    interventions: [
      {
        supplement: "Glutathione (Liposomal or S-Acetyl)",
        mechanism: "Master antioxidant — directly neutralizes ROS and regenerates other antioxidants (Vitamin C, E)",
        effect: "Reduces oxidative damage, supports immune function and detoxification",
        dose: "250–500mg liposomal glutathione or 200–400mg S-acetyl glutathione/day",
        evidence_tier: "B",
        synergy: ["NAC (glutathione precursor)", "Vitamin C", "Alpha-Lipoic Acid"],
        antagonism: ["Oral regular glutathione has poor absorption — formulation choice critical"],
        pmids: ["14988435"]
      },
      {
        supplement: "NAC (N-Acetyl Cysteine)",
        mechanism: "Provides cysteine for glutathione synthesis, directly scavenges some ROS",
        effect: "Raises intracellular glutathione, anti-inflammatory, mucolytic",
        dose: "600–1800mg/day",
        evidence_tier: "A",
        synergy: ["Glycine (NAC+Glycine = GlyNAC, highly effective)", "Alpha-Lipoic Acid"],
        antagonism: [],
        pmids: ["21654222", "33541973"]
      },
      {
        supplement: "Astaxanthin",
        mechanism: "Carotenoid antioxidant — 6000x stronger than Vitamin C for singlet oxygen quenching; unique ability to span cell membrane",
        effect: "Reduces oxidative stress markers, improves skin elasticity, exercise recovery, eye health",
        dose: "4–12mg/day with food (fat-soluble)",
        evidence_tier: "B",
        synergy: ["CoQ10", "Omega-3"],
        antagonism: [],
        pmids: ["20205737"]
      }
    ],
    key_synergies: "NAC + Glycine (GlyNAC protocol) = both glutathione precursors, clinically shown to reverse mitochondrial/oxidative aging markers",
    key_antagonisms: "Excessive antioxidant supplementation during exercise can blunt hormetic adaptations — timing matters"
  },

  {
    id: "cholinergic_deficit",
    name_en: "Cholinergic System Deficit",
    name_zh: "胆碱能系统不足 / 记忆力下降 / 认知功能",
    keywords: ["memory", "记忆力", "memory loss", "记忆力下降", "cognitive", "认知", "acetylcholine", "乙酰胆碱", "brain function", "脑功能", "alzheimer", "老年痴呆", "dementia", "dementia prevention", "focus", "学习能力"],
    symptoms: ["memory lapses", "difficulty learning new information", "brain fog", "low attention span", "cognitive decline"],
    description: "Insufficient acetylcholine production or signaling impairs memory consolidation, attention, and neuroplasticity. Key in age-related cognitive decline and Alzheimer's pathology.",
    interventions: [
      {
        supplement: "Alpha-GPC",
        mechanism: "Highly bioavailable choline source — most efficiently crosses BBB to raise brain acetylcholine",
        effect: "Improves memory, attention, and learning; shown to slow cognitive decline",
        dose: "300–600mg/day",
        evidence_tier: "A",
        synergy: ["Huperzine A (acetylcholinesterase inhibitor)", "Lion's Mane", "Bacopa"],
        antagonism: ["Excess choline may worsen depression in some individuals"],
        pmids: ["15736236"]
      },
      {
        supplement: "Bacopa Monnieri",
        mechanism: "Increases acetylcholine, reduces acetylcholinesterase activity, promotes BDNF",
        effect: "Improves memory acquisition and retention (effects build over 8–12 weeks)",
        dose: "300–600mg standardized extract (45% bacosides)/day with fat",
        evidence_tier: "A",
        synergy: ["Alpha-GPC", "Lion's Mane"],
        antagonism: ["Take with food — can cause nausea on empty stomach", "Full effects require 8+ weeks of consistent use"],
        pmids: ["16106065", "21671741"]
      },
      {
        supplement: "Huperzine A",
        mechanism: "Reversible acetylcholinesterase inhibitor — prevents breakdown of acetylcholine in synaptic cleft",
        effect: "Improves working memory, learning, and concentration",
        dose: "50–200mcg/day (cycle: 2 weeks on, 1 week off recommended)",
        evidence_tier: "B",
        synergy: ["Alpha-GPC (precursor + preservation of acetylcholine)", "Bacopa"],
        antagonism: ["Do not combine with Alzheimer's medications (e.g., donepezil) — additive acetylcholinesterase inhibition"],
        pmids: ["16183566"]
      }
    ],
    key_synergies: "Alpha-GPC (make more ACh) + Huperzine A (break down less ACh) = powerful combination to maximize acetylcholine availability",
    key_antagonisms: "Anticholinergic drugs (antihistamines, sleep aids, some antidepressants) directly counteract cholinergic supplements"
  },

  {
    id: "athletic_recovery",
    name_en: "Athletic Performance & Muscle Recovery",
    name_zh: "运动表现与肌肉恢复",
    keywords: ["workout", "运动", "muscle", "肌肉", "recovery", "恢复", "gym", "健身", "strength", "力量", "creatine", "肌酸", "endurance", "耐力", "athletic", "protein", "蛋白质", "muscle building", "增肌", "pre-workout", "锻炼前", "plateau", "瓶颈", "joint pain", "关节痛", "tendon", "肌腱", "ligament", "韧带", "collagen gym", "strength plateau", "力量停滞", "lift", "举重"],
    symptoms: ["slow post-workout recovery", "muscle soreness", "performance plateau", "limited endurance", "joint pain during lifting", "strength stagnation"],
    description: "Adequate substrate supply, signaling support, and recovery optimization are essential for training adaptation. Deficiencies in creatine, protein, or electrolytes limit progress.",
    interventions: [
      {
        supplement: "Creatine Monohydrate",
        mechanism: "Regenerates ATP via phosphocreatine system, increases water content in muscle, promotes IGF-1",
        effect: "Increases strength 5–15%, power output, and lean mass. Most researched supplement in sports science.",
        dose: "3–5g/day (no loading phase needed; take consistently)",
        evidence_tier: "A",
        synergy: ["Beta-Alanine", "Protein", "HMB"],
        antagonism: ["Caffeine may slightly reduce creatine uptake — separate timing if possible"],
        pmids: ["12701815", "14636102"]
      },
      {
        supplement: "Beta-Alanine",
        mechanism: "Precursor to carnosine, which buffers lactic acid in muscle during high-intensity exercise",
        effect: "Delays muscle fatigue, improves performance in 1–4 minute high-intensity efforts",
        dose: "3.2–6.4g/day (split doses to reduce paresthesia/tingling)",
        evidence_tier: "A",
        synergy: ["Creatine (complementary — ATP system + lactic acid buffering)", "HMB"],
        antagonism: ["Tingling (paresthesia) is harmless but unpleasant — start with 800mg doses"],
        pmids: ["18548368"]
      },
      {
        supplement: "Citrulline Malate",
        mechanism: "Increases arginine → nitric oxide production, improves blood flow and ATP recycling",
        effect: "Reduces muscle soreness, increases training volume capacity",
        dose: "6–8g citrulline malate 30–60min pre-workout",
        evidence_tier: "A",
        synergy: ["Creatine", "Beta-Alanine"],
        antagonism: [],
        pmids: ["20386132"]
      },
      {
        supplement: "Hydrolyzed Collagen Peptides + Vitamin C",
        mechanism: "Three-layer mechanism: (1) STRUCTURAL — Glycine, Proline, and Hydroxyproline are the specific amino acids that reinforce the collagen matrix inside tendons and ligaments. Regular whey/meat protein lacks sufficient concentrations of these three. (2) NEUROLOGICAL — The CNS continuously monitors joint stability via mechanoreceptors. Unstable or painful joints trigger a protective inhibition: the nervous system caps motor unit recruitment below the muscle's actual capacity. Stronger connective tissue = CNS 'unlocks' higher force output from the same muscle mass. (3) KINETIC CHAIN INTEGRITY — Force production is limited by the weakest structural link in the chain. Strengthening tendons/ligaments/fascia removes this structural ceiling, allowing MPS gains to actually express as strength. Most gym plateaus are not muscle-limited but connective-tissue-limited.",
        effect: "Reduces joint pain during training, improves tendon/ligament resilience, and — critically — removes the CNS force inhibition caused by joint instability. Users report strength gains on all major lifts within 3–6 weeks without increasing muscle mass. 20g collagen replacing 20g regular protein (keeping total protein constant) is a validated swap protocol.",
        dose: "15–20g hydrolyzed collagen peptides + 500mg Vitamin C, taken 30–60min before workout (Vitamin C is required cofactor for hydroxylation step; without it, collagen synthesis is impaired)",
        evidence_tier: "B",
        synergy: ["Vitamin C (essential cofactor — do not skip)", "Creatine (complementary systems: collagen for joint integrity, creatine for ATP)", "Omega-3 (synergistic anti-inflammation in connective tissue)"],
        antagonism: ["Not a complete protein — lacks tryptophan; never replace all protein with collagen", "Collagen : regular protein ratio should not exceed 1:3 by weight to preserve MPS signaling"],
        pmids: ["29949514", "31031003", "28177716", "26353786"],
        protein_ratio_note: "Optimal protein strategy for high-frequency/high-joint-stress training: balance MPS-focused protein (whey, meat) with connective tissue support (collagen) based on training volume and joint load. A 20g collagen / 120–160g total protein daily ratio is a reasonable starting point.",
        user_evidence: "r/Biohackers: swapping 20g regular protein → 20g collagen (total protein constant) resolved multi-month strength plateau across all lifts within weeks. Secondary benefits: skin quality, joint pain elimination."
      }
    ],
    key_synergies: "Creatine (ATP system) + Beta-Alanine (lactate buffering) + Citrulline (blood flow) = three separate performance mechanisms. Collagen (connective tissue integrity + CNS force inhibition removal) is the fourth dimension — often the actual bottleneck in experienced lifters.",
    key_antagonisms: "Alcohol within 4–8 hours post-workout significantly impairs muscle protein synthesis and recovery"
  },

  {
    id: "bone_density",
    name_en: "Bone Density Loss / Osteoporosis Prevention",
    name_zh: "骨密度下降 / 骨质疏松预防",
    keywords: ["bone", "骨", "osteoporosis", "骨质疏松", "bone density", "骨密度", "fracture", "骨折", "calcium", "钙", "vitamin d", "维生素d", "bone health", "骨骼健康", "menopause", "更年期", "postmenopause"],
    symptoms: ["low bone mineral density", "fracture risk", "height loss", "back pain from vertebral compression"],
    description: "Bone remodeling imbalance where osteoclast resorption exceeds osteoblast formation. Calcium, D3, K2, and mechanical loading are all required for optimal bone matrix.",
    interventions: [
      {
        supplement: "Calcium Citrate + Vitamin D3 + K2 (MK-7)",
        mechanism: "Calcium = building block; D3 = absorption regulator; K2 directs calcium to bone not arteries (via osteocalcin carboxylation)",
        effect: "Reduces fracture risk, improves bone mineral density",
        dose: "500–1000mg Calcium Citrate + 2000–4000 IU D3 + 100–200mcg MK-7/day",
        evidence_tier: "A",
        synergy: ["Magnesium (required for D3 activation)", "Collagen peptides", "Boron"],
        antagonism: ["Calcium carbonate requires stomach acid — inferior to citrate for older adults or those on PPIs"],
        pmids: ["17762377", "26085559"]
      },
      {
        supplement: "Collagen Peptides (Type I)",
        mechanism: "Provides glycine and proline for collagen matrix synthesis in bone osteoid",
        effect: "Improves bone collagen quality and density markers, especially in postmenopausal women",
        dose: "5–10g hydrolyzed collagen peptides/day",
        evidence_tier: "B",
        synergy: ["Vitamin C (essential cofactor for collagen synthesis)", "Calcium + D3 + K2"],
        antagonism: [],
        pmids: ["30681787"]
      },
      {
        supplement: "Strontium Ranelate / Strontium Citrate",
        mechanism: "Stimulates osteoblast activity and inhibits osteoclast — dual mechanism for bone building",
        effect: "Increases bone mineral density significantly in studies",
        dose: "340–680mg Strontium Citrate/day (away from calcium — compete for absorption)",
        evidence_tier: "B",
        synergy: ["Calcium + D3 + K2"],
        antagonism: ["Separate from calcium by 2+ hours — absorption competition"],
        pmids: ["15769993"]
      }
    ],
    key_synergies: "D3 + K2 (MK-7) is essential — D3 without K2 can cause calcium to deposit in arteries instead of bones",
    key_antagonisms: "Calcium carbonate without food, or calcium alone without D3/K2, provides minimal bone benefit and may increase cardiovascular calcification risk"
  },

  {
    id: "immune_support",
    name_en: "Immune System Support",
    name_zh: "免疫系统支持 / 提高免疫力",
    keywords: ["immune", "免疫", "sick often", "经常生病", "cold", "感冒", "flu", "流感", "infection", "感染", "vitamin c", "维生素c", "zinc immune", "锌", "immunity", "抵抗力"],
    symptoms: ["frequent infections", "slow recovery from illness", "low energy during illness", "prolonged sick periods"],
    description: "Optimal immune function requires adequate micronutrient status (Vitamin C, D3, Zinc), adaptogen support, and a healthy microbiome. Deficiencies in any impair both innate and adaptive immunity.",
    interventions: [
      {
        supplement: "Vitamin C (high dose / liposomal)",
        mechanism: "Essential for neutrophil function, antibody production, and antiviral activity",
        effect: "Reduces cold duration by 8–14%, severity, and supports immune cell proliferation",
        dose: "500–1000mg/day for maintenance; 2000–4000mg during illness (liposomal for better absorption)",
        evidence_tier: "A",
        synergy: ["Zinc", "Vitamin D3", "Elderberry"],
        antagonism: ["Doses >2g may cause GI distress — use liposomal or split doses"],
        pmids: ["29099763"]
      },
      {
        supplement: "Vitamin D3 (optimizing 25-OH-D levels)",
        mechanism: "Activates over 200 immune genes, regulates both innate and adaptive immunity, antimicrobial peptide production",
        effect: "Deficient individuals have 40% higher respiratory infection risk — correction dramatically improves immunity",
        dose: "2000–5000 IU/day (test blood levels; optimal 25-OH-D = 40–60 ng/mL)",
        evidence_tier: "A",
        synergy: ["Vitamin C", "Zinc", "K2 (for D3 safety at high doses)"],
        antagonism: [],
        pmids: ["17344501", "26063738"]
      },
      {
        supplement: "Zinc Bisglycinate",
        mechanism: "Required for T-cell development, NK cell activity, antiviral enzyme function",
        effect: "Reduces cold duration by 33% when taken within 24h of symptom onset (lozenges); supports long-term immunity",
        dose: "15–30mg/day zinc (as bisglycinate or picolinate for best absorption)",
        evidence_tier: "A",
        synergy: ["Vitamin C", "Vitamin D3"],
        antagonism: ["Zinc >40mg/day inhibits copper absorption — balance with 1–2mg copper if long-term high dose"],
        pmids: ["12597411"]
      }
    ],
    key_synergies: "Vitamin C + D3 + Zinc = the classic immune triad — each covers different arms of immune function",
    key_antagonisms: "Zinc and copper compete for absorption — avoid high zinc doses without copper supplementation long-term"
  },

  {
    id: "cardiovascular_health",
    name_en: "Cardiovascular Health / Endothelial Function",
    name_zh: "心血管健康 / 内皮功能",
    keywords: ["heart health", "心脏健康", "cardiovascular", "心血管", "blood pressure", "血压", "hypertension", "高血压", "cholesterol", "胆固醇", "nitric oxide", "一氧化氮", "arterial", "动脉", "vascular", "血管", "hdl", "ldl"],
    symptoms: ["elevated blood pressure", "high LDL", "low HDL", "poor circulation", "cold extremities", "cardiovascular risk"],
    description: "Endothelial dysfunction and dyslipidemia are central to atherosclerosis risk. Nitric oxide production, inflammation control, and lipid balance are key modifiable targets.",
    interventions: [
      {
        supplement: "Omega-3 (EPA/DHA — high dose)",
        mechanism: "Reduces triglycerides (primary), anti-inflammatory, anti-arrhythmic, improves endothelial function",
        effect: "Lowers triglycerides by 15–30%, reduces cardiovascular events in high-risk patients",
        dose: "2–4g combined EPA+DHA/day for cardiovascular benefit",
        evidence_tier: "A",
        synergy: ["CoQ10", "Magnesium", "Vitamin D3"],
        antagonism: ["High doses with anticoagulants — monitor INR"],
        pmids: ["17335257"]
      },
      {
        supplement: "Coenzyme Q10 (Ubiquinol)",
        mechanism: "Improves mitochondrial function in cardiac muscle, antioxidant for LDL oxidation prevention",
        effect: "Reduces blood pressure modestly, improves heart failure outcomes, essential for statin users",
        dose: "200–400mg ubiquinol/day",
        evidence_tier: "A",
        synergy: ["Omega-3", "Magnesium"],
        antagonism: [],
        pmids: ["18272714"]
      },
      {
        supplement: "Bergamot Extract",
        mechanism: "Inhibits HMG-CoA reductase (same mechanism as statins), increases LDL receptor expression",
        effect: "Reduces LDL by 15–25%, raises HDL, reduces oxidized LDL",
        dose: "500–1000mg standardized extract (30–40% polyphenols)/day",
        evidence_tier: "B",
        synergy: ["Omega-3", "Red Yeast Rice"],
        antagonism: ["May interact with statins — monitor liver enzymes"],
        pmids: ["21056640"]
      }
    ],
    key_synergies: "Omega-3 (triglycerides + inflammation) + CoQ10 (cardiac energy + LDL protection) = foundational cardiovascular stack",
    key_antagonisms: "Trans fats and oxidized vegetable oils promote LDL oxidation and counteract all cardiovascular supplements"
  },

  {
    id: "thyroid_support",
    name_en: "Thyroid Function Support",
    name_zh: "甲状腺功能支持",
    keywords: ["thyroid", "甲状腺", "hypothyroid", "甲减", "tsh", "t3", "t4", "slow metabolism", "代谢慢", "weight gain thyroid", "甲状腺减重", "hashimoto", "桥本", "iodine", "碘", "selenium", "硒", "fatigue thyroid"],
    symptoms: ["unexplained weight gain", "fatigue", "cold intolerance", "hair thinning", "constipation", "elevated TSH"],
    description: "Suboptimal thyroid hormone production impairs metabolism, energy, and temperature regulation. Iodine, selenium, and zinc are essential cofactors for thyroid hormone synthesis and conversion.",
    interventions: [
      {
        supplement: "Selenium (as Selenomethionine)",
        mechanism: "Required for iodothyronine deiodinase enzymes that convert T4 to active T3; protects thyroid from oxidative damage",
        effect: "Reduces thyroid antibodies (TPO-Ab) in Hashimoto's by 40% in studies, improves T4→T3 conversion",
        dose: "100–200mcg selenium as selenomethionine/day",
        evidence_tier: "A",
        synergy: ["Iodine (balance critical)", "Zinc", "Vitamin D3"],
        antagonism: ["Excess selenium (>400mcg) is toxic — do not exceed"],
        pmids: ["14671160", "22855469"]
      },
      {
        supplement: "Zinc (as Picolinate)",
        mechanism: "Required for thyroid hormone synthesis, TSH binding, and T3 nuclear receptor activity",
        effect: "Corrects zinc-deficiency hypothyroidism, supports T3 receptor sensitivity",
        dose: "15–30mg/day",
        evidence_tier: "B",
        synergy: ["Selenium", "Iodine"],
        antagonism: [],
        pmids: ["13678473"]
      },
      {
        supplement: "Ashwagandha",
        mechanism: "Stimulates thyroid gland activity, increases T4 production via unknown mechanism",
        effect: "Modest increase in T3 and T4 levels in subclinical hypothyroidism",
        dose: "300–600mg KSM-66/day",
        evidence_tier: "B",
        synergy: ["Selenium"],
        antagonism: ["Monitor thyroid levels — may push hyperthyroid in those already on thyroid medication"],
        pmids: ["28829155"]
      }
    ],
    key_synergies: "Selenium + Iodine must be in balance — selenium protects the thyroid from iodine-induced oxidative damage",
    key_antagonisms: "Soy, cruciferous vegetables (raw), and gluten (in Hashimoto's) can suppress thyroid function — dietary context critical"
  },

  {
    id: "skin_hair_collagen",
    name_en: "Skin, Hair & Collagen Synthesis",
    name_zh: "皮肤/头发/胶原蛋白合成",
    keywords: ["skin", "皮肤", "hair loss", "脱发", "hair growth", "毛发", "collagen", "胶原蛋白", "biotin", "生物素", "wrinkles", "皱纹", "skin elasticity", "皮肤弹性", "acne", "痘痘", "nails", "指甲", "beauty", "美容"],
    symptoms: ["hair thinning", "brittle nails", "skin dullness", "wrinkles", "slow wound healing", "dry skin"],
    description: "Collagen (Type I/III) requires glycine, proline, vitamin C, and copper for synthesis. Hair growth depends on DHT sensitivity, iron, zinc, and biotin. Multiple mechanisms often overlap.",
    interventions: [
      {
        supplement: "Collagen Peptides (Type I/III) + Vitamin C",
        mechanism: "Provides glycine/proline for collagen matrix; Vitamin C is essential cofactor for hydroxylation step in collagen formation",
        effect: "Improves skin elasticity, reduces wrinkle depth, supports hair and nail growth",
        dose: "10g hydrolyzed collagen peptides + 500mg Vitamin C/day",
        evidence_tier: "A",
        synergy: ["Biotin", "Zinc", "Silica"],
        antagonism: [],
        pmids: ["26362093", "29949889"]
      },
      {
        supplement: "Biotin (Vitamin B7)",
        mechanism: "Required for keratin synthesis (primary protein of hair, skin, nails)",
        effect: "Improves brittle nails (strong evidence), hair texture — benefits mainly in deficient individuals",
        dose: "2500–5000mcg/day",
        evidence_tier: "B",
        synergy: ["Collagen Peptides", "Zinc"],
        antagonism: ["High dose biotin interferes with lab tests (thyroid, troponin) — disclose to doctor before bloodwork"],
        pmids: ["28879195"]
      },
      {
        supplement: "Saw Palmetto",
        mechanism: "5-alpha reductase inhibitor — reduces DHT conversion, addressing hormonal hair loss mechanism",
        effect: "Reduces DHT-driven hair loss (androgenic alopecia) in men and women",
        dose: "320mg standardized extract/day",
        evidence_tier: "B",
        synergy: ["Zinc", "Pumpkin Seed Oil"],
        antagonism: ["May reduce PSA levels — disclose to doctor if prostate monitoring"],
        pmids: ["23298508"]
      }
    ],
    key_synergies: "Collagen Peptides + Vitamin C (required cofactor) — collagen without vitamin C has severely reduced efficacy",
    key_antagonisms: "Excess Vitamin A (>10,000 IU/day) paradoxically causes hair loss; smoking destroys collagen faster than supplementation can rebuild it"
  }
];

/**
 * Find the most relevant mechanisms for a given user query.
 * Returns top N mechanisms sorted by keyword match score.
 */
function findRelevantMechanisms(query, topN = 2) {
  const q = query.toLowerCase();
  
  const scored = MECHANISMS.map(mechanism => {
    let score = 0;
    
    // Check keywords
    for (const keyword of mechanism.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        score += 3; // Strong signal
      }
    }
    
    // Check symptoms
    for (const symptom of mechanism.symptoms) {
      if (q.includes(symptom.toLowerCase())) {
        score += 2;
      }
    }
    
    // Check mechanism name itself
    if (q.includes(mechanism.name_en.toLowerCase()) || q.includes(mechanism.name_zh)) {
      score += 5;
    }
    
    return { mechanism, score };
  });
  
  // Sort by score descending, return top N with score > 0
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(item => item.mechanism);
}

/**
 * Format mechanisms into a prompt injection block.
 */
function formatMechanismContext(mechanisms) {
  if (!mechanisms || mechanisms.length === 0) return "";
  
  let block = `\n\n## MECHANISM KNOWLEDGE BASE (Use this to provide root-cause analysis — this is proprietary PickScope intelligence)\n`;
  block += `Based on the user's query, the following biological mechanisms are likely relevant. Use this data to:\n`;
  block += `1. Identify and explain the ROOT MECHANISM behind their symptoms (not just surface-level symptom matching)\n`;
  block += `2. Recommend supplements that address the mechanism, not just the symptom\n`;
  block += `3. Highlight key synergies and antagonisms in your recommendations\n`;
  block += `4. Teach the user something they couldn't easily learn by googling\n\n`;
  
  for (const m of mechanisms) {
    block += `---\n`;
    block += `### MECHANISM: ${m.name_en} (${m.name_zh})\n`;
    block += `**Biological Description:** ${m.description}\n\n`;
    block += `**Key Interventions:**\n`;
    
    for (const inv of m.interventions) {
      block += `- **${inv.supplement}** (Evidence Tier: ${inv.evidence_tier})\n`;
      block += `  - Mechanism: ${inv.mechanism}\n`;
      block += `  - Effect: ${inv.effect}\n`;
      block += `  - Dose: ${inv.dose}\n`;
      if (inv.synergy.length > 0) {
        block += `  - Synergizes with: ${inv.synergy.join(", ")}\n`;
      }
      if (inv.antagonism.length > 0) {
        block += `  - ⚠️ Antagonism/Caution: ${inv.antagonism.join("; ")}\n`;
      }
      if (inv.pmids && inv.pmids.length > 0) {
        block += `  - PubMed refs: ${inv.pmids.join(", ")}\n`;
      }
    }
    
    block += `\n**Key Synergies:** ${m.key_synergies}\n`;
    block += `**Key Antagonisms:** ${m.key_antagonisms}\n\n`;
  }
  
  block += `---\n`;
  block += `IMPORTANT: In your response, include a "Mechanism Insight" section that explains the ROOT MECHANISM to the user in plain language. This is what sets PickScope apart from generic supplement recommendations.\n`;
  
  return block;
}

module.exports = { MECHANISMS, findRelevantMechanisms, formatMechanismContext };
