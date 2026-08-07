// src/data/reactions.js
// Curated set of well-known, classroom-relevant element + element reactions.
// Keys are symbol pairs sorted alphabetically and joined with "-", so
// lookup is order-independent. Only element+element reactions are covered
// here — compound-based reactions (e.g. acid-base) require a different
// picker UI and aren't part of this table's scope.

export const REACTIONS = {
  // --- Original set ---
  'H-O': {
    equation: '2H2 + O2 -> 2H2O',
    product: 'Water (H2O)',
    explanation: 'Hydrogen burns in oxygen to form water — one of the most fundamental reactions in chemistry, and the basis of hydrogen fuel cells.',
  },
  'Cl-Na': {
    equation: '2Na + Cl2 -> 2NaCl',
    product: 'Sodium Chloride (NaCl) — table salt',
    explanation: 'Sodium metal reacts violently with chlorine gas to form ordinary table salt, releasing a bright yellow flame.',
  },
  'Fe-O': {
    equation: '4Fe + 3O2 -> 2Fe2O3',
    product: 'Iron(III) Oxide (Fe2O3) — rust',
    explanation: 'Iron reacts slowly with oxygen (especially in the presence of moisture) to form rust, a process called oxidation.',
  },
  'C-O': {
    equation: 'C + O2 -> CO2',
    product: 'Carbon Dioxide (CO2)',
    explanation: 'Carbon burns completely in oxygen to form carbon dioxide — the same reaction that happens when you burn wood, coal, or exhale.',
  },
  'H-N': {
    equation: 'N2 + 3H2 -> 2NH3',
    product: 'Ammonia (NH3)',
    explanation: 'Nitrogen and hydrogen combine under high pressure (the Haber process) to form ammonia, the basis of most nitrogen fertilizers.',
  },
  'Ca-O': {
    equation: '2Ca + O2 -> 2CaO',
    product: 'Calcium Oxide (CaO) — quicklime',
    explanation: 'Calcium burns in oxygen to form calcium oxide, historically known as quicklime, used in cement and construction.',
  },
  'Al-O': {
    equation: '4Al + 3O2 -> 2Al2O3',
    product: 'Aluminum Oxide (Al2O3)',
    explanation: 'Aluminum reacts with oxygen to form a thin, protective oxide layer — this is why aluminum resists corrosion so well.',
  },
  'Cl-H': {
    equation: 'H2 + Cl2 -> 2HCl',
    product: 'Hydrogen Chloride (HCl)',
    explanation: 'Hydrogen and chlorine gases combine explosively in light to form hydrogen chloride, which dissolves in water to make hydrochloric acid.',
  },
  'Br-K': {
    equation: '2K + Br2 -> 2KBr',
    product: 'Potassium Bromide (KBr)',
    explanation: 'Potassium reacts vigorously with bromine to form potassium bromide, once widely used in early photography and medicine.',
  },
  'Mg-O': {
    equation: '2Mg + O2 -> 2MgO',
    product: 'Magnesium Oxide (MgO)',
    explanation: 'Magnesium burns in oxygen with an intense white light to form magnesium oxide — this is the classic bright "magnesium ribbon" reaction seen in classrooms.',
  },
  'H-S': {
    equation: 'H2 + S -> H2S',
    product: 'Hydrogen Sulfide (H2S)',
    explanation: "Hydrogen and sulfur combine to form hydrogen sulfide, the gas responsible for rotten eggs' distinctive smell.",
  },
  'N-O': {
    equation: 'N2 + O2 -> 2NO',
    product: 'Nitric Oxide (NO)',
    explanation: 'Nitrogen and oxygen react at very high temperatures (like inside a car engine or lightning strike) to form nitric oxide, a precursor to smog.',
  },
  'Cu-O': {
    equation: '2Cu + O2 -> 2CuO',
    product: 'Copper(II) Oxide (CuO)',
    explanation: 'Copper reacts with oxygen when heated to form copper oxide, giving old copper surfaces their dark, tarnished appearance.',
  },
  'F-H': {
    equation: 'H2 + F2 -> 2HF',
    product: 'Hydrogen Fluoride (HF)',
    explanation: 'Hydrogen and fluorine react explosively, even in the dark, to form hydrogen fluoride — one of the most reactive halogen combinations.',
  },
  'Ag-S': {
    equation: '2Ag + S -> Ag2S',
    product: 'Silver Sulfide (Ag2S) — tarnish',
    explanation: 'Silver slowly reacts with sulfur (or trace hydrogen sulfide in the air) to form silver sulfide, which is why silver jewelry and cutlery tarnish over time.',
  },

  // --- Batch 1: alkali metal + oxygen trend (JEE/NEET-relevant) ---
  'Li-O': {
    equation: '4Li + O2 -> 2Li2O',
    product: 'Lithium Oxide (Li2O)',
    explanation: 'Lithium burns in oxygen to form a simple oxide (Li2O) — unlike its heavier alkali metal neighbors, which form peroxides or superoxides instead.',
  },
  'Na-O': {
    equation: '2Na + O2 -> Na2O2',
    product: 'Sodium Peroxide (Na2O2)',
    explanation: 'Sodium burns in excess oxygen to form a peroxide (Na2O2), not a simple oxide — a key trend difference from lithium, tested in inorganic chemistry.',
  },
  'K-O': {
    equation: 'K + O2 -> KO2',
    product: 'Potassium Superoxide (KO2)',
    explanation: 'Potassium burns in oxygen to form a superoxide (KO2) — the third distinct pattern in Group 1, after lithium\'s oxide and sodium\'s peroxide.',
  },

  // --- Batch 1: metal + halogen / chalcogen salts ---
  'O-Zn': {
    equation: '2Zn + O2 -> 2ZnO',
    product: 'Zinc Oxide (ZnO)',
    explanation: 'Zinc burns in oxygen to form zinc oxide, a white compound used in sunscreen, paints, and rubber manufacturing.',
  },
  'S-Zn': {
    equation: 'Zn + S -> ZnS',
    product: 'Zinc Sulfide (ZnS)',
    explanation: 'Zinc and sulfur combine directly when heated to form zinc sulfide, a compound used in phosphorescent (glow-in-the-dark) materials.',
  },
  'Fe-S': {
    equation: 'Fe + S -> FeS',
    product: 'Iron(II) Sulfide (FeS)',
    explanation: 'Iron filings and sulfur powder react when heated to form iron sulfide — a classic classroom demonstration of a chemical reaction forming a completely new substance.',
  },
  'Cu-S': {
    equation: '2Cu + S -> Cu2S',
    product: 'Copper(I) Sulfide (Cu2S)',
    explanation: 'Copper reacts with sulfur when heated to form copper(I) sulfide, a compound also found naturally in copper ore minerals.',
  },
  'Na-S': {
    equation: '2Na + S -> Na2S',
    product: 'Sodium Sulfide (Na2S)',
    explanation: 'Sodium reacts with sulfur to form sodium sulfide, used industrially in paper pulping and leather processing.',
  },
  'Br-H': {
    equation: 'H2 + Br2 -> 2HBr',
    product: 'Hydrogen Bromide (HBr)',
    explanation: 'Hydrogen and bromine react to form hydrogen bromide, which dissolves in water to make hydrobromic acid.',
  },
  'H-I': {
    equation: 'H2 + I2 -> 2HI',
    product: 'Hydrogen Iodide (HI)',
    explanation: 'Hydrogen and iodine react (more slowly and reversibly than the other halogens) to form hydrogen iodide — a classic equilibrium reaction studied in chemical kinetics.',
  },
  'Ca-Cl': {
    equation: 'Ca + Cl2 -> CaCl2',
    product: 'Calcium Chloride (CaCl2)',
    explanation: 'Calcium reacts with chlorine gas to form calcium chloride, commonly used as a de-icing salt on roads in winter.',
  },
  'Al-S': {
    equation: '2Al + 3S -> Al2S3',
    product: 'Aluminum Sulfide (Al2S3)',
    explanation: 'Aluminum reacts with sulfur when heated to form aluminum sulfide, which reacts vigorously with water to release hydrogen sulfide gas.',
  },
  'Cl-Zn': {
    equation: 'Zn + Cl2 -> ZnCl2',
    product: 'Zinc Chloride (ZnCl2)',
    explanation: 'Zinc reacts with chlorine gas to form zinc chloride, widely used as a flux in metal soldering.',
  },
  'Ag-Cl': {
    equation: '2Ag + Cl2 -> 2AgCl',
    product: 'Silver Chloride (AgCl)',
    explanation: 'Silver reacts with chlorine to form silver chloride, a light-sensitive compound historically central to photographic film.',
  },

  // --- Batch 1: nonmetal oxides ---
  'O-P': {
    equation: 'P4 + 5O2 -> P4O10',
    product: 'Phosphorus Pentoxide (P4O10, commonly written P2O5)',
    explanation: 'Phosphorus burns in oxygen with a bright flame to form phosphorus pentoxide, a powerful drying agent that reacts vigorously with water.',
  },
  'O-S': {
    equation: 'S + O2 -> SO2',
    product: 'Sulfur Dioxide (SO2)',
    explanation: 'Sulfur burns in oxygen with a blue flame to form sulfur dioxide, a major component of industrial pollution and acid rain formation.',
  },
  'O-Si': {
    equation: 'Si + O2 -> SiO2',
    product: 'Silicon Dioxide (SiO2) — quartz/silica',
    explanation: 'Silicon reacts with oxygen to form silicon dioxide, the main component of sand, quartz, and glass.',
  },
  'C-S': {
    equation: 'C + 2S -> CS2',
    product: 'Carbon Disulfide (CS2)',
    explanation: 'Carbon and sulfur combine at high temperature to form carbon disulfide, a volatile liquid used as an industrial solvent.',
  },
  'H-Se': {
    equation: 'H2 + Se -> H2Se',
    product: 'Hydrogen Selenide (H2Se)',
    explanation: 'Hydrogen and selenium combine to form hydrogen selenide, chemically similar to hydrogen sulfide but even more toxic.',
  },

  // --- Batch 1: transition metal oxides ---
  'O-Ti': {
    equation: 'Ti + O2 -> TiO2',
    product: 'Titanium Dioxide (TiO2)',
    explanation: 'Titanium reacts with oxygen to form titanium dioxide, the bright white pigment used in paints, sunscreen, and toothpaste.',
  },
  'Cr-O': {
    equation: '4Cr + 3O2 -> 2Cr2O3',
    product: 'Chromium(III) Oxide (Cr2O3)',
    explanation: 'Chromium reacts with oxygen to form chromium(III) oxide, a green pigment and the source of chromium\'s corrosion resistance in stainless steel.',
  },
  'Mn-O': {
    equation: 'Mn + O2 -> MnO2',
    product: 'Manganese Dioxide (MnO2)',
    explanation: 'Manganese reacts with oxygen to form manganese dioxide, a key component in dry-cell (alkaline) batteries.',
  },
  'Ni-O': {
    equation: '2Ni + O2 -> 2NiO',
    product: 'Nickel(II) Oxide (NiO)',
    explanation: 'Nickel reacts with oxygen when heated to form nickel oxide, used in the manufacture of rechargeable nickel-based batteries.',
  },
  'O-Sn': {
    equation: 'Sn + O2 -> SnO2',
    product: 'Tin(IV) Oxide (SnO2)',
    explanation: 'Tin reacts with oxygen to form tin(IV) oxide, used as a coating for glass to make it electrically conductive.',
  },
  'O-Pb': {
    equation: '2Pb + O2 -> 2PbO',
    product: 'Lead(II) Oxide (PbO)',
    explanation: 'Lead reacts with oxygen to form lead(II) oxide, historically used in ceramic glazes and older types of glass.',
  },

  // --- Batch 1: alkaline earth metal + oxygen (anomalous behavior) ---
  'Ba-O': {
    equation: 'Ba + O2 -> BaO2',
    product: 'Barium Peroxide (BaO2)',
    explanation: 'Unlike lighter alkaline earth metals, barium reacts with excess oxygen to form a peroxide rather than a simple oxide — mirroring the alkali metal trend down the group.',
  },

  // --- Batch 2: ionic hydrides (Group 1 & 2 metals + hydrogen) ---
  'H-Li': {
    equation: '2Li + H2 -> 2LiH',
    product: 'Lithium Hydride (LiH)',
    explanation: 'Lithium reacts directly with hydrogen gas to form an ionic hydride, where hydrogen exists as the H- ion — used as a lightweight reducing agent and in nuclear applications.',
  },
  'H-Na': {
    equation: '2Na + H2 -> 2NaH',
    product: 'Sodium Hydride (NaH)',
    explanation: 'Sodium reacts with hydrogen under heat to form sodium hydride, a strong base and reducing agent used in organic synthesis.',
  },
  'Ca-H': {
    equation: 'Ca + H2 -> CaH2',
    product: 'Calcium Hydride (CaH2)',
    explanation: 'Calcium reacts with hydrogen to form calcium hydride, commonly used as a drying agent for solvents and gases in laboratories.',
  },

  // --- Batch 2: nitrides (includes the classic Li vs. Na/K anomaly) ---
  'Li-N': {
    equation: '6Li + N2 -> 2Li3N',
    product: 'Lithium Nitride (Li3N)',
    explanation: 'Lithium is the only alkali metal that reacts directly with nitrogen gas at room temperature — the other Group 1 metals do not form nitrides this easily, a classic anomalous-behavior fact.',
  },
  'Mg-N': {
    equation: '3Mg + N2 -> Mg3N2',
    product: 'Magnesium Nitride (Mg3N2)',
    explanation: 'Magnesium burns in nitrogen gas (as well as oxygen) to form magnesium nitride, which reacts with water to release ammonia gas.',
  },
  'Ca-N': {
    equation: '3Ca + N2 -> Ca3N2',
    product: 'Calcium Nitride (Ca3N2)',
    explanation: 'Calcium reacts with nitrogen at high temperature to form calcium nitride, which hydrolyzes in water to produce ammonia.',
  },
  'Al-N': {
    equation: '2Al + N2 -> 2AlN',
    product: 'Aluminum Nitride (AlN)',
    explanation: 'Aluminum reacts with nitrogen at high temperature to form aluminum nitride, a ceramic material valued for its high thermal conductivity in electronics.',
  },

  // --- Batch 2: more metal halides ---
  'Al-Cl': {
    equation: '2Al + 3Cl2 -> 2AlCl3',
    product: 'Aluminum Chloride (AlCl3)',
    explanation: 'Aluminum reacts with chlorine gas to form aluminum chloride, a key catalyst in Friedel-Crafts reactions in organic chemistry.',
  },
  'Cl-Fe': {
    equation: '2Fe + 3Cl2 -> 2FeCl3',
    product: 'Iron(III) Chloride (FeCl3)',
    explanation: 'Iron reacts with excess chlorine gas to form iron(III) chloride — note that iron forms a different chloride (FeCl2) when reacting with weaker acids like HCl, showing iron\'s variable oxidation states.',
  },
  'Cl-Cu': {
    equation: 'Cu + Cl2 -> CuCl2',
    product: 'Copper(II) Chloride (CuCl2)',
    explanation: 'Copper reacts with chlorine gas to form copper(II) chloride, a compound that gives a green-blue color to flames — sometimes used in fireworks.',
  },
  'Cl-Mg': {
    equation: 'Mg + Cl2 -> MgCl2',
    product: 'Magnesium Chloride (MgCl2)',
    explanation: 'Magnesium reacts with chlorine gas to form magnesium chloride, commercially extracted from seawater and used as a de-icing agent.',
  },
  'Cl-K': {
    equation: '2K + Cl2 -> 2KCl',
    product: 'Potassium Chloride (KCl)',
    explanation: 'Potassium reacts vigorously with chlorine gas to form potassium chloride, widely used as a fertilizer and a salt substitute.',
  },
  'Br-Ca': {
    equation: 'Ca + Br2 -> CaBr2',
    product: 'Calcium Bromide (CaBr2)',
    explanation: 'Calcium reacts with bromine to form calcium bromide, used in drilling fluids and as a flame retardant.',
  },
  'Br-Mg': {
    equation: 'Mg + Br2 -> MgBr2',
    product: 'Magnesium Bromide (MgBr2)',
    explanation: 'Magnesium reacts with bromine to form magnesium bromide, used in some pharmaceutical and organic synthesis applications.',
  },
  'Br-Zn': {
    equation: 'Zn + Br2 -> ZnBr2',
    product: 'Zinc Bromide (ZnBr2)',
    explanation: 'Zinc reacts with bromine to form zinc bromide, used in some high-density radiation-shielding solutions.',
  },
  'Cl-Sn': {
    equation: 'Sn + 2Cl2 -> SnCl4',
    product: 'Tin(IV) Chloride (SnCl4)',
    explanation: 'Tin reacts with excess chlorine gas to form tin(IV) chloride, a fuming liquid historically used to make "tin cry" sound effects in glassmaking.',
  },
  'Cl-Pb': {
    equation: 'Pb + Cl2 -> PbCl2',
    product: 'Lead(II) Chloride (PbCl2)',
    explanation: 'Lead reacts with chlorine to form lead(II) chloride, a poorly water-soluble compound once used in some pigments.',
  },
  'Cl-Sb': {
    equation: '2Sb + 3Cl2 -> 2SbCl3',
    product: 'Antimony Trichloride (SbCl3)',
    explanation: 'Antimony reacts with chlorine to form antimony trichloride, an important intermediate in flame-retardant chemical manufacturing.',
  },
  'Cl-P': {
    equation: 'P4 + 6Cl2 -> 4PCl3',
    product: 'Phosphorus Trichloride (PCl3)',
    explanation: 'Phosphorus reacts with limited chlorine gas to form phosphorus trichloride, a key starting material in the production of pesticides and flame retardants.',
  },
  'Cl-Si': {
    equation: 'Si + 2Cl2 -> SiCl4',
    product: 'Silicon Tetrachloride (SiCl4)',
    explanation: 'Silicon reacts with chlorine gas to form silicon tetrachloride, a critical intermediate in producing ultra-pure silicon for semiconductors.',
  },

  // --- Batch 2: more sulfides ---
  'Ca-S': {
    equation: 'Ca + S -> CaS',
    product: 'Calcium Sulfide (CaS)',
    explanation: 'Calcium reacts with sulfur to form calcium sulfide, historically used in luminous paints and currently in some desulfurization processes.',
  },
  'Ba-S': {
    equation: 'Ba + S -> BaS',
    product: 'Barium Sulfide (BaS)',
    explanation: 'Barium reacts with sulfur to form barium sulfide, a precursor used in producing other barium compounds and pigments.',
  },
  'K-S': {
    equation: '2K + S -> K2S',
    product: 'Potassium Sulfide (K2S)',
    explanation: 'Potassium reacts with sulfur to form potassium sulfide, used in some depilatory (hair-removal) products and in leather tanning.',
  },

  // --- Batch 2: more transition metal oxide ---
  'O-W': {
    equation: '2W + 3O2 -> 2WO3',
    product: 'Tungsten Trioxide (WO3)',
    explanation: 'Tungsten reacts with oxygen at high temperature to form tungsten trioxide, a yellow compound used in electrochromic ("smart") window coatings.',
  },

  // --- Batch 3: interhalogen compounds ---
  'Cl-F': {
    equation: 'Cl2 + F2 -> 2ClF',
    product: 'Chlorine Monofluoride (ClF)',
    explanation: 'Chlorine and fluorine form an interhalogen compound under controlled conditions — interhalogens are generally more reactive than either parent halogen alone.',
  },
  'Br-Cl': {
    equation: 'Br2 + Cl2 -> 2BrCl',
    product: 'Bromine Monochloride (BrCl)',
    explanation: 'Bromine and chlorine combine under controlled conditions to form an interhalogen compound, unstable and prone to decomposing back into its parent halogens.',
  },
  'Br-F': {
    equation: 'Br2 + 3F2 -> 2BrF3',
    product: 'Bromine Trifluoride (BrF3)',
    explanation: 'Bromine reacts with excess fluorine under controlled conditions to form bromine trifluoride, an extremely reactive fluorinating agent used in specialized industrial processes.',
  },
  'F-I': {
    equation: 'I2 + 5F2 -> 2IF5',
    product: 'Iodine Pentafluoride (IF5)',
    explanation: 'Iodine reacts with excess fluorine under controlled conditions to form iodine pentafluoride, a powerful and corrosive fluorinating agent.',
  },
  'Cl-I': {
    equation: 'I2 + Cl2 -> 2ICl',
    product: 'Iodine Monochloride (ICl)',
    explanation: 'Iodine and chlorine combine to form iodine monochloride, a reddish-brown compound used historically as a source of "active" iodine in some chemical tests.',
  },

  // --- Batch 3: remaining common transition metals ---
  'Co-O': {
    equation: '3Co + 2O2 -> Co3O4',
    product: 'Cobalt(II,III) Oxide (Co3O4)',
    explanation: 'Cobalt reacts with oxygen to form a mixed-oxidation-state oxide, historically used to produce the deep blue color in "cobalt blue" glass and ceramics.',
  },
  'Cd-O': {
    equation: '2Cd + O2 -> 2CdO',
    product: 'Cadmium Oxide (CdO)',
    explanation: 'Cadmium reacts with oxygen to form cadmium oxide, once widely used in rechargeable nickel-cadmium batteries.',
  },
  'Au-Cl': {
    equation: '2Au + 3Cl2 -> 2AuCl3',
    product: 'Gold(III) Chloride (AuCl3)',
    explanation: 'Gold, normally very unreactive, will react with chlorine gas under heat to form gold(III) chloride — a rare example of gold forming a simple compound, reflecting its position as one of the least reactive metals.',
  },
  'Cl-Pt': {
    equation: 'Pt + 2Cl2 -> PtCl4',
    product: 'Platinum(IV) Chloride (PtCl4)',
    explanation: 'Platinum reacts with excess chlorine gas under heat to form platinum(IV) chloride — like gold, platinum is normally very unreactive, so this requires forcing conditions.',
  },
  'Cl-V': {
    equation: '2V + 5Cl2 -> 2VCl5',
    product: 'Vanadium(V) Chloride (VCl5)',
    explanation: 'Vanadium reacts with excess chlorine gas to form vanadium(V) chloride, reflecting vanadium\'s ability to reach a high +5 oxidation state, common among early transition metals.',
  },

  // --- Batch 3: lanthanide/actinide oxides (rounding out coverage) ---
  'La-O': {
    equation: '4La + 3O2 -> 2La2O3',
    product: 'Lanthanum Oxide (La2O3)',
    explanation: 'Lanthanum, the first lanthanide, reacts readily with oxygen to form lanthanum oxide — used in specialty glass and as a catalyst support.',
  },
  'Ce-O': {
    equation: 'Ce + O2 -> CeO2',
    product: 'Cerium(IV) Oxide (CeO2)',
    explanation: 'Cerium reacts with oxygen to form cerium(IV) oxide, widely used as a polishing compound for glass and in catalytic converters.',
  },
  'O-Th': {
    equation: 'Th + O2 -> ThO2',
    product: 'Thorium Dioxide (ThO2)',
    explanation: 'Thorium reacts with oxygen to form thorium dioxide, which has the highest melting point of any known oxide and is being studied as a potential nuclear fuel.',
  },
  'O-U': {
    equation: '3U + 4O2 -> U3O8',
    product: 'Triuranium Octoxide (U3O8)',
    explanation: 'Uranium metal reacts with oxygen in air to form this stable mixed-oxidation-state oxide, the most common form uranium takes in nature and the standard form used for storage.',
  },
};

export function lookupReaction(symbolA, symbolB) {
  const key = [symbolA, symbolB].sort().join('-');
  return REACTIONS[key] || null;
}