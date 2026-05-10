'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/projects';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface DetailedReviewSectionProps {
  project: Project;
}

export function DetailedReviewSection({ project }: DetailedReviewSectionProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const isKuburaya = project.shortName === 'Kuburaya';

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  return (
    <motion.section
      className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 md:px-6 lg:px-8 bg-white border-t border-gray-200"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Additionality Section */}
        <motion.div
          className="mt-4 sm:mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="p-4 sm:p-5 md:p-6 bg-gray-50 border border-gray-200 rounded-lg mb-4 sm:mb-5 md:mb-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black">
                {isKuburaya ? 'Rare Mangrove Blue Carbon Conservation Project' : 'Additionality'}
              </h3>
              <span className="px-2 sm:px-3 py-1 bg-[#0D9488] text-white text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                {isKuburaya ? 'Premium' : 'AAA'}
              </span>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-light leading-relaxed mt-2 sm:mt-3">
              {isKuburaya
                ? 'Kuburaya Mangrove Project protects and restores mangrove ecosystems, one of the rarest and most carbon-dense blue carbon habitats globally. Mangroves sequester and store significantly more carbon per hectare than most terrestrial forests, particularly in long-lived soil carbon pools, making the climate impact both high-impact and durable. Unlike many ARR or generic forest conservation projects, mangrove conservation delivers simultaneous climate mitigation, coastal protection, and marine ecosystem benefits, placing this project in a scarce, premium segment of the carbon market.'
                : 'The project receives the highest additionality rating (AAA) due to the rarity of conserving production-zoned forest in Indonesia, strong evidence that industrial Acacia plantation development was the most plausible counterfactual, and clear financial dependence on carbon revenues.'}
            </p>
            <Button
              variant="outline"
              onClick={() => toggleSection('additionality')}
              className="mt-2 sm:mt-3 md:mt-4 border-gray-300 text-gray-700 hover:bg-gray-100 group text-xs sm:text-sm"
            >
              {expandedSections.additionality ? 'Read Less' : 'Read More'}
              <ChevronDown
                className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform duration-300 ${
                  expandedSections.additionality ? 'rotate-180' : ''
                }`}
              />
            </Button>
            <AnimatePresence>
              {expandedSections.additionality && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Competing PBPHHTI applications, the area's production-forest zoning, and national pulpwood-sector expansion all reinforce that conversion would likely have occurred absent the project. Forest-loss analysis shows a 73% reduction in deforestation after project initiation, confirming effectiveness.
                    </p>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Restoration is financially non-viable without carbon finance, and existing peatland regulations would not have prevented plantation development. "Restoration is highly uncommon… Conversion to a plantation was the most likely counterfactual scenario."
                    </p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h5 className="font-bold text-black mb-2">a. Activity Analysis</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Conservation in production forest is extremely uncommon, and the project area had active competing plantation applications. Historical degradation, zoning, and national plantation trends confirm that industrial Acacia development was the realistic counterfactual. Forest-loss reductions post-2022 demonstrate strong project effectiveness.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">b. Financial Analysis</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          The PBPH restoration licence generates no revenue, while plantation development would have been profitable. PT NRS recorded losses in 2022–2024 and relies entirely on carbon finance to meet operating costs. Auditors note continuation depends on external financial support, confirming restoration is not financially viable without credits.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">c. Legal & Policy</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Peatland and forest-protection regulations do not constrain plantation development in this concession. Deep-peat protections were not operationalised, moratorium overlaps were excluded from accounting, and PBPHHTI applications were accepted, confirming regulatory permissibility of conversion. Thus, policy would not have prevented the baseline scenario.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Carbon Accounting Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">
                {isKuburaya ? 'Exceptional Biodiversity and Conservation Value' : 'Carbon Accounting'}
              </h3>
              <span className="px-3 py-1 bg-[#0D9488] text-white text-sm font-semibold rounded-full">
                {isKuburaya ? 'High' : 'A'}
              </span>
            </div>
            <p className="text-sm text-gray-700 font-light leading-relaxed mt-3">
              {isKuburaya
                ? 'The Project Area supports high biodiversity, functioning as a critical habitat and nursery for: • Fish, crustaceans, and molluscs that underpin coastal and marine food webs • Migratory and resident bird species • Endemic and threatened flora and fauna adapted to intertidal ecosystems. Mangroves are globally recognised as disproportionately important for biodiversity relative to their area, yet among the most threatened ecosystems worldwide. Protecting intact mangrove systems delivers true conservation additionality, not just avoided damage.'
                : 'Carbon accounting is rated A, reflecting a high likelihood of accuracy with some moderate risks. The baseline uses a credible, plan-based deforestation scenario aligned with actual HTI proposals and stratified peat-depth mapping.'}
            </p>
            <Button
              variant="outline"
              onClick={() => toggleSection('carbon')}
              className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-100 group"
            >
              {expandedSections.carbon ? 'Read Less' : 'Read More'}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                  expandedSections.carbon ? 'rotate-180' : ''
                }`}
              />
            </Button>
            <AnimatePresence>
              {expandedSections.carbon && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Most credits (72%) derive from avoided peat-oxidation emissions. Peat-depth sampling and conservative midpoint depths support integrity, though interpolation may smooth local variability. Baseline peat-oxidation factors use IPCC defaults, omitting early drainage pulses (under-crediting) but also omitting subsidence-driven emission declines (potential over-crediting).
                    </p>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      The largest risk is underestimated Acacia biomass in the baseline, which may inflate avoided emissions by ~10%. Market leakage from national pulpwood expansion is material but unaccounted for. Project-scenario emissions are conservatively monitored, with forest loss deducted annually and canal emissions included.
                    </p>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Planned empirical monitoring—water-table loggers, subsidence poles, flux measurements, and PSPs—will reduce uncertainty over time.
                    </p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h5 className="font-bold text-black mb-2">a. Direct Accounting</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Baseline peat-oxidation emissions dominate issuance and are generally appropriate, though early drainage pulses are omitted. Acacia biomass is significantly underestimated, creating ~10% over-crediting risk. Forest-biomass estimates are credible, and canal-emission assumptions align with industrial practice. Project-scenario emissions are conservatively deducted.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">b. Leakage Accounting</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Activity-shifting leakage is negligible, with no evidence of displaced clearing. Ecological leakage is unlikely due to hydrological isolation. Market leakage is material: national pulpwood expansion could generate ~17.2 MtCO₂e of displaced emissions, equivalent to ~25% of issuance, but is not deducted in the project accounting.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Permanence Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">
                {isKuburaya ? 'Protection of a Highly Threatened Ecosystem' : 'Permanence'}
              </h3>
              <span className="px-3 py-1 bg-[#0D9488] text-white text-sm font-semibold rounded-full">
                {isKuburaya ? 'Critical' : 'BBB'}
              </span>
            </div>
            <p className="text-sm text-gray-700 font-light leading-relaxed mt-3">
              {isKuburaya
                ? 'Mangroves face intense pressure from coastal development and land conversion, unsustainable harvesting, aquaculture expansion, pollution and hydrological disruption. This project prevents irreversible ecosystem loss in an environment where natural recovery is slow or impossible without intervention. Buyers are supporting permanent ecosystem protection, not short-term restoration gains.'
                : 'Permanence is rated BBB, reflecting moderate long-term risk. The project benefits from intact hydrology, low current fire incidence, limited encroachment, and strong access control. However, long-term permanence depends on renewing the PBPH licence beyond its initial 30-year term to cover the 120-year commitment period.'}
            </p>
            <Button
              variant="outline"
              onClick={() => toggleSection('permanence')}
              className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-100 group"
            >
              {expandedSections.permanence ? 'Read Less' : 'Read More'}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                  expandedSections.permanence ? 'rotate-180' : ''
                }`}
              />
            </Button>
            <AnimatePresence>
              {expandedSections.permanence && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Climate-driven drought and fire risk may intensify, especially under ENSO and IOD events, despite current low fire activity. Stakeholder engagement is strong but not fully resolved: one village has not yet provided consent, and early grievances highlight residual social sensitivity. A 12% buffer covers routine disturbances but may not fully mitigate rare, high-impact events.
                    </p>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Overall, permanence is credible but exposed to structural tenure risk and long-term climatic uncertainty.
                    </p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h5 className="font-bold text-black mb-2">a. Natural Risks</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Fire risk is low due to intact hydrology and strong fire-management systems, though ENSO-driven droughts could increase future susceptibility. Drought projections show more frequent extreme events mid-century, potentially affecting peat stability despite rewetting.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">b. Anthropogenic Risks</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Permanence depends on PBPH licence renewal. Encroachment risk is low due to blocked canals and patrols. One village has not yet consented, and past grievances show residual sensitivity. Broader PBPH governance dynamics introduce systemic uncertainty.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">c. Risk Mitigation Instruments</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          A 12% buffer covers routine disturbances. Strong fire-management, hydrological restoration, patrols, and stakeholder engagement reduce risks. Benefit-sharing SOPs and grievance mechanisms support long-term cooperation, though effectiveness depends on consistent implementation.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Project Execution Risks Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">
                {isKuburaya ? 'Community Livelihoods Tied Directly to Conservation' : 'Project Execution Risks'}
              </h3>
              <span className="px-3 py-1 bg-[#0D9488] text-white text-sm font-semibold rounded-full">
                {isKuburaya ? 'Strong' : 'Very Low'}
              </span>
            </div>
            <p className="text-sm text-gray-700 font-light leading-relaxed mt-3">
              {isKuburaya
                ? 'Local communities depend on mangroves for fisheries and food security, coastal protection from storms and erosion, traditional livelihoods. The project creates direct incentives for conservation through sustainable livelihood alternatives, local employment in monitoring, restoration, and management, revenue sharing and community development programmes. This alignment ensures that biodiversity protection and social outcomes reinforce each other, reducing long-term risk and leakage.'
                : 'Execution risk is rated Very Low, reflecting strong operational progress, regulatory clarity, and robust technical capacity. Core activities—rewetting, canal blocking, fire management, patrols, and monitoring—have been operational since 2022–2023. The PBPH licence provides a clear legal basis, and Indonesia\'s 2025 decree lifted the credit-export moratorium, reducing regulatory uncertainty.'}
            </p>
            <Button
              variant="outline"
              onClick={() => toggleSection('execution')}
              className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-100 group"
            >
              {expandedSections.execution ? 'Read Less' : 'Read More'}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                  expandedSections.execution ? 'rotate-180' : ''
                }`}
              />
            </Button>
            <AnimatePresence>
              {expandedSections.execution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden mt-4"
                >
                  <div className="space-y-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Financially, the project has sufficient liquidity to reach first issuance despite timing uncertainty. The implementation team includes experienced partners in peat ecology, hydrology, carbon modelling, and community engagement.
                    </p>
                    <p className="text-sm text-gray-700 font-light leading-relaxed">
                      Remaining risks include issuance-timeline uncertainty, untested benefit-sharing mechanisms, and reliance on investor capital until monetisation.
                    </p>

                    <div className="mt-6 space-y-4">
                      <div>
                        <h5 className="font-bold text-black mb-2">a. Technical Risks</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Technical risk is very low: rewetting completed, fire-management systems operational, SMART patrols active, and FPIC processes conducted. Methods rely on standard, proven peatland-restoration techniques.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">b. Legal & Regulatory Risk</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          PBPH licensing provides clear tenure and carbon-rights authority. Boundary conflicts were resolved before issuance. Indonesia's 2025 decree enables international credit issuance, reducing regulatory uncertainty.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">c. Financial Risks</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Issuance-timing uncertainty persists, but liquidity buffers cover costs through late 2026. Neo Terra financing is equity-like, with no near-term repayment obligations. Scenario analysis shows resilient long-term cash flows.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">d. Project Proponent's Past Experience</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          PT NRS is a first-time developer, but risk is mitigated by experienced partners: Ata Marie, Neo Terra, IPB University, and Universitas Palangka Raya, covering carbon modelling, peat ecology, hydrology, and FPIC.
                        </p>
                      </div>
                      <div>
                        <h5 className="font-bold text-black mb-2">e. Operational Risks</h5>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          Operational systems—patrols, monitoring, fire management, hydrological restoration—are fully established. The benefit-sharing mechanism is formalised but untested; ensuring smooth implementation will be critical once revenues begin.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Climate Adaptation and Resilience Benefits - Only for Kuburaya */}
        {isKuburaya && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-black">High Climate Adaptation and Resilience Benefits</h3>
                <span className="px-3 py-1 bg-[#0D9488] text-white text-sm font-semibold rounded-full">Exceptional</span>
              </div>
              <p className="text-sm text-gray-700 font-light leading-relaxed mt-3">
                Beyond mitigation, mangroves provide natural climate adaptation infrastructure, including storm surge and flood protection, shoreline stabilization, reduced erosion and saltwater intrusion.
              </p>
              <Button
                variant="outline"
                onClick={() => toggleSection('adaptation')}
                className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-100 group"
              >
                {expandedSections.adaptation ? 'Read Less' : 'Read More'}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                    expandedSections.adaptation ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              <AnimatePresence>
                {expandedSections.adaptation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="space-y-4 border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-700 font-light leading-relaxed">
                        Mangrove protection delivers multiple co-benefits beyond carbon sequestration. These ecosystems act as natural buffers against climate impacts, providing critical adaptation services for vulnerable coastal communities.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
