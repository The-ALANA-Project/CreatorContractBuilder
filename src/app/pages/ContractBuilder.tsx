import { useState, useEffect, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { 
  FileText, 
  Download, 
  ChevronDown, 
  Upload,
  Briefcase,
  Package,
  Video,
  FileCheck,
  Clock,
  DollarSign,
  Shield,
  RefreshCw,
  XCircle,
  Lock,
  Plus,
  Trash2,
  RotateCcw,
  Eye,
  Edit3,
  Home,
  BookOpen,
  Scale,
  ShieldAlert,
  Gavel,
  Check
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import jsPDF from "jspdf";
import gsap from "gsap";

interface ContractData {
  // Contract Type
  contractType: "digital" | "physical" | "content";
  
  // Basic Info
  clientName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  creatorName: string;
  
  // Creator Contact Info
  creatorAddress: string;
  creatorCity: string;
  creatorState: string;
  creatorZip: string;
  creatorCountry: string;
  creatorEmail: string;
  creatorPhone: string;
  
  // Client Contact Info
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientCountry: string;
  clientEmail: string;
  clientPhone: string;
  
  // Toggleable Sections
  sections: {
    scopeOfWork: boolean;
    deliverables: boolean;
    timeline: boolean;
    payment: boolean;
    rights: boolean;
    revisions: boolean;
    cancellation: boolean;
    confidentiality: boolean;
    jurisdiction: boolean;
    liability: boolean;
    disputeResolution: boolean;
  };
  
  // Section Content
  scopeOfWork: string;
  deliverables: string;
  timeline: string;
  paymentTerms: string;
  paymentAmount: string;
  paymentSchedule: string;
  currency: string;
  paymentMethod: string;
  paymentDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    swiftBic: string;
    paypalEmail: string;
    venmoHandle: string;
    zelleInfo: string;
    cryptoWallet: string;
    cryptoNetwork: string;
    otherDetails: string;
  };
  rightsUsage: string;
  revisionsLimit: string;
  revisionsTimeline: string;
  revisionsDefinition: string;
  revisionsOverflow: string;
  revisionsAdditional: string;
  cancellationNotice: string;
  cancellationFee: string;
  cancellationAdditional: string;
  confidentialityTerms: string;
  governingLaw: string;
  jurisdictionVenue: string;
  
  // Liability & Warranties
  independentContractorTerms: string;
  liabilityLimit: string;
  indemnificationTerms: string;
  warrantyTerms: string;
  
  // Dispute Resolution
  disputeResolutionTerms: string;
  forceMajeureTerms: string;
  
  // Confidentiality Sub-clauses
  confidentialitySubclauses: {
    defineConfidential: boolean;
    exclusions: boolean;
    portfolioRights: boolean;
    socialMediaRights: boolean;
    teamDisclosure: boolean;
    duration: boolean;
    returnMaterials: boolean;
    breachRemedies: boolean;
  };
  confidentialityDuration: string;
  portfolioUsageDelay: string;
  
  // Custom Clauses
  customClauses: Array<{ id: string; title: string; content: string }>;
  
  exportDate: string;
  version: string;
}

// Currency symbol helper
const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "CA$",
    AUD: "A$",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    BRL: "R$",
    MXN: "MX$",
    USDT: "USDT",
    USDC: "USDC",
    DAI: "DAI",
    BUSD: "BUSD",
    EURC: "EURC",
    USDGLO: "USDGLO",
  };
  return symbols[currency] || currency + " ";
};

// Get payment details text for display
const getPaymentDetailsText = (method: string, details: ContractData["paymentDetails"]): string => {
  switch (method) {
    case "bank":
      return `Bank Name: ${details.bankName || "[BANK_NAME]"}
Account Name: ${details.accountName || "[ACCOUNT_NAME]"}
Account Number: ${details.accountNumber || "[ACCOUNT_NUMBER]"}
Routing Number: ${details.routingNumber || "[ROUTING_NUMBER]"}${details.swiftBic ? `\nSWIFT/BIC: ${details.swiftBic}` : ""}`;
    case "paypal":
      return `PayPal Email: ${details.paypalEmail || "[PAYPAL_EMAIL]"}`;
    case "venmo":
      return `Venmo Handle: ${details.venmoHandle || "[VENMO_HANDLE]"}`;
    case "zelle":
      return `Zelle: ${details.zelleInfo || "[ZELLE_INFO]"}`;
    case "crypto":
      return `Wallet Address: ${details.cryptoWallet || "[WALLET_ADDRESS]"}
Network: ${details.cryptoNetwork || "[NETWORK]"}`;
    case "other":
      return details.otherDetails || "[PAYMENT_DETAILS]";
    default:
      return "";
  }
};

// Template generation functions
const getTemplateText = (
  field: string,
  contractType: "digital" | "physical" | "content",
  data: Partial<ContractData>
) => {
  const clientName = data.clientName || "[CLIENT_NAME]";
  const creatorName = data.creatorName || "[YOUR_NAME]";
  const projectName = data.projectName || "[PROJECT_NAME]";
  const amount = data.paymentAmount || "[AMOUNT]";
  const revisionsLimit = data.revisionsLimit || "[NUMBER]";
  const revisionsTimeline = data.revisionsTimeline || "[TIMEFRAME]";
  const creatorState = data.creatorState || "";
  const creatorCity = data.creatorCity || "";
  const creatorCountry = data.creatorCountry || "";
  const currencySymbol = getCurrencySymbol(data.currency || "USD");

  const templates = {
    digital: {
      scopeOfWork: `${creatorName} ("Creator") agrees to provide ${contractType} creator services to ${clientName} ("Client") for ${projectName}. This includes but is not limited to:

• Consulting and strategic guidance for the project
• Creation of digital assets as outlined in the Deliverables section
• Communication and collaboration throughout the project timeline
• Professional execution according to industry standards

The Creator will work independently and maintain creative control over the execution of deliverables, while incorporating Client feedback as outlined in the Revisions Policy.

Any work outside the scope defined in this agreement will require a separate agreement and additional compensation.`,
      
      deliverables: `The Creator will provide the following deliverables to the Client upon completion of ${projectName}:

• [List specific deliverables, e.g., "3 Instagram posts with captions"]
• [e.g., "1 brand strategy document (PDF format)"]
• [e.g., "2 rounds of design concepts"]
• [e.g., "Final files in high-resolution format"]

All deliverables will be provided in the format(s) specified and delivered via [delivery method, e.g., email, Google Drive, Dropbox]. The Client is responsible for downloading and securing all files within 30 days of delivery.`,

      timeline: `Project timeline for ${projectName}:

• Project Start Date: ${data.startDate || "[START_DATE]"}
• Project End Date: ${data.endDate || "[END_DATE]"}

Milestones:
• Initial concepts/drafts: [DATE]
• Client review period: [NUMBER] business days after delivery
• Revisions submitted: [DATE]
• Final delivery: [DATE]

Timeline is contingent upon Client providing necessary materials, feedback, and approvals within agreed timeframes. Delays in Client response may result in adjusted delivery dates.`,

      paymentTerms: `Total project fee: ${currencySymbol}${amount}

Payment schedule: ${data.paymentSchedule || "[e.g., 50% upfront, 50% upon completion]"}

Payment terms:
• Invoices are due within [NUMBER] days of receipt
• Accepted payment methods: [e.g., Bank transfer, PayPal, Venmo]
• Late payments will incur a fee of [e.g., 5%] per [week/month]
• Work will not commence until initial payment is received
• Final deliverables will be released upon receipt of final payment

All fees are non-refundable once work has commenced.`,

      rightsUsage: `Upon full payment, the Client receives an exclusive license to use the deliverables for ${projectName}. [EXCLUSIVE means only the client can use this work - you cannot resell or relicense it to others. Delete this explanation before sending.]

Rights granted:
• Usage: [e.g., Social media, website, print materials, etc.]
• Territory: [e.g., Worldwide/United States only]
• Duration: [e.g., Perpetual/1 year]

The Creator retains:
• Copyright ownership of all work created
• Right to display work in portfolio and promotional materials
• Right to create similar work for other clients

Any usage beyond the scope outlined above requires written permission and may incur additional licensing fees.`,

      revisionsLimit: `${revisionsLimit} rounds of revisions`,

      revisionsTimeline: `Client must request revisions within ${revisionsTimeline} of receiving deliverables`,

      cancellationNotice: `7 days written notice`,

      cancellationFee: `25% of total project fee for cancellations with proper notice. 50% for cancellations without proper notice.`,

      confidentialityTerms: `Both parties agree to keep confidential any proprietary information, trade secrets, or sensitive business information shared during the course of ${projectName}. This obligation extends for [NUMBER] years beyond the completion of this agreement.

Exceptions: Information that is publicly available, independently developed, or required to be disclosed by law.`,

      governingLaw: creatorState ? `State of ${creatorState}` : (creatorCountry ? creatorCountry : `State of [YOUR_STATE]`),

      jurisdictionVenue: (() => {
        if (creatorCity && creatorState) {
          return creatorCountry ? `Courts of ${creatorCity}, ${creatorState}, ${creatorCountry}` : `Courts of ${creatorCity}, ${creatorState}`;
        } else if (creatorCity && creatorCountry) {
          return `Courts of ${creatorCity}, ${creatorCountry}`;
        } else if (creatorCountry) {
          return `Courts of ${creatorCountry}`;
        }
        return `Courts of [YOUR_CITY], [YOUR_STATE]`;
      })(),

      independentContractorTerms: `${creatorName} is an independent contractor and not an employee, agent, partner, or joint venturer of ${clientName}. ${creatorName} shall be solely responsible for:

• All federal, state, and local taxes, including self-employment taxes
• Their own tools, equipment, software, and workspace
• Their own health insurance, retirement benefits, and other benefits
• Setting their own working hours and methods of completing the work

Nothing in this agreement shall be construed to create an employer-employee relationship. ${clientName} will not provide ${creatorName} with employee benefits and will not withhold taxes from payments made under this agreement. ${creatorName} is free to provide services to other clients during the term of this agreement, provided such work does not create a conflict of interest or breach the confidentiality provisions herein.`,

      liabilityLimit: `To the maximum extent permitted by law, ${creatorName}'s total liability arising out of or related to this agreement shall not exceed the total fees actually paid by ${clientName} under this agreement.

In no event shall ${creatorName} be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, regardless of whether such damages were foreseeable or whether ${creatorName} was advised of the possibility of such damages.

${clientName}'s sole remedy for dissatisfaction with the services or deliverables shall be limited to re-performance of the deficient services or a refund of the fees paid for the specific deliverable in question.`,

      indemnificationTerms: `${clientName} agrees to indemnify, defend, and hold harmless ${creatorName} from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorney's fees) arising out of or related to:

• ${clientName}'s use of the deliverables in a manner not authorized by this agreement
• Any materials, content, or direction provided by ${clientName} that infringes on third-party rights
• ${clientName}'s products, services, or business operations
• Any modification of the deliverables made by ${clientName} or third parties after delivery

${creatorName} agrees to indemnify, defend, and hold harmless ${clientName} from and against any claims that the original deliverables (unmodified) infringe on the intellectual property rights of any third party, provided that ${creatorName} had full creative control over the allegedly infringing elements.`,

      warrantyTerms: `${creatorName} represents and warrants that:

• They have the legal right and authority to enter into this agreement and perform the services described herein
• The deliverables will be original work created by ${creatorName} (except for any Client-provided materials or properly licensed third-party assets)
• The deliverables, to the best of ${creatorName}'s knowledge, will not infringe upon the intellectual property rights of any third party
• The services will be performed in a professional and workmanlike manner consistent with generally accepted industry standards

${clientName} represents and warrants that:

• They have the legal right and authority to enter into this agreement
• Any materials, content, briefs, or direction provided to ${creatorName} do not infringe upon the rights of any third party
• They will use the deliverables only in the manner permitted by this agreement

EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, ${creatorName} MAKES NO OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.`,

      disputeResolutionTerms: `In the event of any dispute, claim, or controversy arising out of or relating to this agreement, the parties agree to the following resolution process:

1. GOOD FAITH NEGOTIATION: The parties shall first attempt to resolve the dispute through direct, good faith negotiation for a period of [15/30] days from written notice of the dispute.

2. MEDIATION: If negotiation fails, the parties agree to submit the dispute to non-binding mediation administered by [a mutually agreed-upon mediator / the American Arbitration Association / your local mediation service]. The costs of mediation shall be shared equally between the parties.

3. [BINDING ARBITRATION / LITIGATION]: If mediation fails, the dispute shall be resolved by [binding arbitration under the rules of the American Arbitration Association, with a single arbitrator, in ${creatorCity || '[YOUR_CITY]'}, ${creatorState || '[YOUR_STATE]'} / litigation in the courts specified in the Governing Law & Jurisdiction section of this agreement].

[Choose arbitration for faster, more private resolution. Choose litigation if you prefer the option to appeal. Arbitration is generally cheaper and faster, but the decision is usually final.]

Each party shall bear their own attorney's fees and costs unless the arbitrator or court determines that one party's claims or defenses were frivolous, in which case the prevailing party may recover reasonable attorney's fees.`,

      forceMajeureTerms: `Neither party shall be liable for any failure or delay in performing their obligations under this agreement if such failure or delay results from circumstances beyond the party's reasonable control, including but not limited to:

• Natural disasters (earthquakes, floods, hurricanes, wildfires)
• Pandemics, epidemics, or public health emergencies
• Government actions, laws, regulations, embargoes, or sanctions
• War, terrorism, civil unrest, or armed conflict
• Power outages, internet service disruptions, or telecommunications failures
• Strikes, labor disputes, or supply chain disruptions
• Cyberattacks, data breaches, or technology platform failures

The affected party must notify the other party in writing within [5/10] business days of the force majeure event and make reasonable efforts to mitigate its impact. If the force majeure event continues for more than [30/60] days, either party may terminate this agreement with written notice, and the Creator shall be compensated for all work completed up to the date of the event.`
    },
    
    physical: {
      scopeOfWork: `${creatorName} ("Creator") agrees to create and deliver physical product(s) for ${clientName} ("Client") as part of ${projectName}. This includes:

• Design and creation of physical items as specified in Deliverables
• Sourcing of materials (unless otherwise specified)
• Quality control and craftsmanship meeting professional standards
• Packaging and preparation for delivery/shipment

The Creator maintains full creative control over the production process while incorporating Client specifications and feedback as outlined in the Revisions Policy.

Any additional items or modifications beyond the original scope require separate agreement and additional fees.`,

      deliverables: `The Creator will create and deliver the following physical items:

• [e.g., "1 handmade ceramic vase, approximately 12 inches tall"]
• [e.g., "3 custom embroidered patches, 4x4 inches"]
• [e.g., "Custom artwork on 16x20 canvas"]

Specifications:
• Materials: [e.g., "Premium cotton, ceramic, etc."]
• Colors: [e.g., "As per reference images provided"]
• Quantity: [NUMBER] units
• Packaging: [e.g., "Gift wrapped / Standard shipping box"]

Shipping: [e.g., "Domestic shipping included / International shipping additional"] via [carrier]. Client is responsible for any customs fees or import duties.`,

      timeline: `Production timeline for ${projectName}:

• Order confirmation & payment: ${data.startDate || "[START_DATE]"}
• Production begins: [DATE]
• Expected completion: ${data.endDate || "[END_DATE]"}
• Shipping time: [e.g., 3-5 business days]

Timeline notes:
• Production time begins after receipt of deposit
• Completion dates are estimates and may vary due to material availability
• Client will be notified of any significant delays
• Rush orders may be available for additional fee`,

      paymentTerms: `Total cost: ${currencySymbol}${amount}

Payment schedule: ${data.paymentSchedule || "[e.g., 50% deposit, 50% before shipping]"}

Payment details:
• Deposit required to begin work
• Final payment due before item(s) ship
• Accepted payment methods: [e.g., Bank transfer, PayPal, credit card]
• Shipping costs: [Included / Additional $[AMOUNT]]
• Late payments will result in delayed shipment

All sales are final once production begins. No refunds for change of mind.`,

      rightsUsage: `Upon full payment, the Client receives:

• Ownership of the physical item(s) created
• Right to resell, gift, or use items as desired
• Right to photograph items for personal or commercial use

The Creator retains:
• Copyright of the design and creative concept [This means YOU own the design even though the client owns the physical object. Delete this explanation before sending.]
• Right to photograph items for portfolio and marketing
• Right to create similar items for other clients
• Attribution rights when items are publicly displayed or published

The Client may not reproduce, replicate, or manufacture additional copies of the design without written permission.`,

      revisionsLimit: `${revisionsLimit} rounds of revisions (concept/design phase only)`,

      revisionsTimeline: `Design revisions must be requested within ${revisionsTimeline} of receiving concept images. No revisions possible once production begins.`,

      cancellationNotice: `3 business days written notice (before production begins only)`,

      cancellationFee: `Full project fee is due if cancellation occurs after production has commenced. Partially completed items become property of the Creator.`,

      confidentialityTerms: `Both parties agree to keep confidential any proprietary designs, techniques, or sensitive information shared during ${projectName}. This includes design specifications, pricing structures, and any private client information.

This obligation continues for [NUMBER] years after project completion.`,

      governingLaw: creatorState ? `State of ${creatorState}` : (creatorCountry ? creatorCountry : `State of [YOUR_STATE]`),

      jurisdictionVenue: (() => {
        if (creatorCity && creatorState) {
          return creatorCountry ? `Courts of ${creatorCity}, ${creatorState}, ${creatorCountry}` : `Courts of ${creatorCity}, ${creatorState}`;
        } else if (creatorCity && creatorCountry) {
          return `Courts of ${creatorCity}, ${creatorCountry}`;
        } else if (creatorCountry) {
          return `Courts of ${creatorCountry}`;
        }
        return `Courts of [YOUR_CITY], [YOUR_STATE]`;
      })(),

      independentContractorTerms: `${creatorName} is an independent contractor and not an employee, agent, partner, or joint venturer of ${clientName}. ${creatorName} shall be solely responsible for:

• All federal, state, and local taxes, including self-employment taxes
• Their own tools, materials, equipment, and workspace
• Their own health insurance, retirement benefits, and other benefits
• Setting their own working hours and production methods

Nothing in this agreement shall be construed to create an employer-employee relationship. ${clientName} will not provide ${creatorName} with employee benefits and will not withhold taxes from payments. ${creatorName} is free to accept commissions from other clients during the term of this agreement, provided such work does not create a conflict of interest or breach the confidentiality provisions herein.`,

      liabilityLimit: `To the maximum extent permitted by law, ${creatorName}'s total liability arising out of or related to this agreement shall not exceed the total fees actually paid by ${clientName} under this agreement.

In no event shall ${creatorName} be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill.

Due to the handmade/custom nature of physical products, minor variations in color, texture, size, and finish are inherent and do not constitute defects. ${clientName}'s sole remedy for material defects in craftsmanship shall be repair or replacement at ${creatorName}'s discretion, or a refund of the fees paid for the specific item in question.`,

      indemnificationTerms: `${clientName} agrees to indemnify, defend, and hold harmless ${creatorName} from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorney's fees) arising out of or related to:

• ${clientName}'s use, resale, or distribution of the delivered products
• Any specifications, designs, or materials provided by ${clientName} that infringe on third-party rights
• Product liability claims arising from ${clientName}'s modification, misuse, or resale of the products
• Any claims related to ${clientName}'s marketing or representation of the products

${creatorName} agrees to indemnify, defend, and hold harmless ${clientName} from and against any claims that the original, unmodified products infringe on the intellectual property rights of any third party.`,

      warrantyTerms: `${creatorName} represents and warrants that:

• They have the legal right and authority to enter into this agreement
• The products will be original work created by ${creatorName} using the materials and techniques specified
• The products will be free from material defects in craftsmanship for a period of [30/60/90] days from delivery
• The products will substantially conform to the agreed-upon specifications and approved design concepts

${clientName} represents and warrants that:

• They have the legal right and authority to enter into this agreement
• Any designs, specifications, or materials provided to ${creatorName} do not infringe upon the rights of any third party

EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, ${creatorName} MAKES NO OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Due to the handmade nature of the products, minor variations are expected and do not constitute a breach of warranty.`,

      disputeResolutionTerms: `In the event of any dispute, claim, or controversy arising out of or relating to this agreement, the parties agree to the following resolution process:

1. GOOD FAITH NEGOTIATION: The parties shall first attempt to resolve the dispute through direct, good faith negotiation for a period of [15/30] days from written notice of the dispute.

2. MEDIATION: If negotiation fails, the parties agree to submit the dispute to non-binding mediation administered by [a mutually agreed-upon mediator / the American Arbitration Association / your local mediation service]. The costs of mediation shall be shared equally between the parties.

3. [BINDING ARBITRATION / LITIGATION]: If mediation fails, the dispute shall be resolved by [binding arbitration under the rules of the American Arbitration Association, with a single arbitrator, in ${creatorCity || '[YOUR_CITY]'}, ${creatorState || '[YOUR_STATE]'} / litigation in the courts specified in the Governing Law & Jurisdiction section of this agreement].

Each party shall bear their own attorney's fees and costs unless the arbitrator or court determines that one party's claims or defenses were frivolous, in which case the prevailing party may recover reasonable attorney's fees.`,

      forceMajeureTerms: `Neither party shall be liable for any failure or delay in performing their obligations under this agreement if such failure or delay results from circumstances beyond the party's reasonable control, including but not limited to:

• Natural disasters (earthquakes, floods, hurricanes, wildfires)
• Pandemics, epidemics, or public health emergencies
• Government actions, laws, regulations, embargoes, or sanctions
• Supply chain disruptions, material shortages, or shipping delays
• Power outages or infrastructure failures
• War, terrorism, civil unrest, or armed conflict
• Strikes, labor disputes, or equipment failures

The affected party must notify the other party in writing within [5/10] business days of the force majeure event and make reasonable efforts to mitigate its impact. If the force majeure event continues for more than [30/60] days, either party may terminate this agreement with written notice, and the Creator shall be compensated for all work completed and materials purchased up to the date of the event.`
    },
    
    content: {
      scopeOfWork: `${creatorName} ("Creator") agrees to create original content for ${clientName} ("Client") as part of ${projectName}. This includes:

• Planning and conceptualizing content according to Client brief
• Production of content including [filming/photography/writing]
• Editing and post-production work
• Delivery of final content files in specified formats
• [NUMBER] rounds of revisions as outlined below

The Creator maintains editorial and creative control over content creation while collaborating with Client on overall direction and messaging.

Additional content pieces beyond the agreed scope will require separate agreement and compensation.`,

      deliverables: `The Creator will produce and deliver the following content:

• [e.g., "1 YouTube video, 8-12 minutes long, fully edited"]
• [e.g., "10 high-resolution photos, edited and color-graded"]
• [e.g., "5 blog posts, 1000-1500 words each, SEO optimized"]

Format specifications:
• Video: [e.g., "1080p MP4, H.264 codec"]
• Photos: [e.g., "JPEG, minimum 3000px wide"]
• Writing: [e.g., "Google Docs or Word format"]

Delivery: Files will be provided via [e.g., Google Drive, Dropbox, WeTransfer] by the agreed completion date. Raw footage/files [included/not included].`,

      timeline: `Content creation timeline for ${projectName}:

• Project kickoff: ${data.startDate || "[START_DATE]"}
• Content production: [DATE]
• First draft delivery: [DATE]
• Client feedback due: [NUMBER] business days after delivery
• Revisions completed: [DATE]
• Final delivery: ${data.endDate || "[END_DATE]"}

Schedule notes:
• Production schedule depends on location/talent availability
• Weather or unforeseen circumstances may affect filming dates
• Timeline adjusts if Client feedback is delayed
• Rush delivery available for additional fee`,

      paymentTerms: `Total project fee: ${currencySymbol}${amount}

Payment schedule: ${data.paymentSchedule || "[e.g., 40% upfront, 30% after filming, 30% upon delivery]"}

Payment terms:
• Initial payment due before any work begins
• Subsequent payments due according to milestones
• Accepted methods: [e.g., Bank transfer, PayPal, check]
• Expenses: [Travel, equipment rental, talent fees] [included / billed separately]
• Late payment fee: [PERCENTAGE]% per [week/month]

Final files released only upon receipt of final payment. No refunds after production begins.`,

      rightsUsage: `Upon full payment, Client receives license to use the content for ${projectName} as follows:

Rights granted:
• Platforms: [e.g., "YouTube, Instagram, Facebook, Company website"]
• Territory: [e.g., "Worldwide" / "North America only"]
• Duration: [e.g., "In perpetuity" / "2 years from delivery"]
• Exclusivity: [Choose Exclusive or Non-exclusive. EXCLUSIVE means only this client can use this content - you cannot resell it. NON-EXCLUSIVE means you can license the same content to others. Delete this explanation before sending.]

The Creator retains:
• Copyright ownership of all content created
• Right to use content in portfolio, demo reel, and marketing materials
• Raw footage and outtakes (unless negotiated otherwise)
• Right to create similar content for other clients

Any usage beyond scope (e.g., TV commercials, paid advertising, resale) requires additional licensing agreement and fees.`,

      revisionsLimit: `${revisionsLimit} rounds of revisions included`,

      revisionsTimeline: `Revision requests must be submitted within ${revisionsTimeline} of receiving draft. Additional revision rounds available at $[AMOUNT] per round.`,

      cancellationNotice: `14 days written notice (before production begins). 7 days notice during pre-production. No cancellation once production begins.`,

      cancellationFee: `50% of total fee for cancellations in pre-production with proper notice. 100% of fee if production has commenced. Completed work transfers to Client.`,

      confidentialityTerms: `Both parties agree to maintain confidentiality regarding:

• Unpublished content and creative concepts
• Proprietary business information
• Compensation and contract terms
• Any sensitive information marked as confidential

This obligation continues for [NUMBER] years after completion. Creator may announce the collaboration publicly unless otherwise agreed.`,

      governingLaw: creatorState ? `State of ${creatorState}` : (creatorCountry ? creatorCountry : `State of [YOUR_STATE]`),

      jurisdictionVenue: (() => {
        if (creatorCity && creatorState) {
          return creatorCountry ? `Courts of ${creatorCity}, ${creatorState}, ${creatorCountry}` : `Courts of ${creatorCity}, ${creatorState}`;
        } else if (creatorCity && creatorCountry) {
          return `Courts of ${creatorCity}, ${creatorCountry}`;
        } else if (creatorCountry) {
          return `Courts of ${creatorCountry}`;
        }
        return `Courts of [YOUR_CITY], [YOUR_STATE]`;
      })(),

      independentContractorTerms: `${creatorName} is an independent contractor and not an employee, agent, partner, or joint venturer of ${clientName}. ${creatorName} shall be solely responsible for:

• All federal, state, and local taxes, including self-employment taxes
• Their own equipment, software, studio space, and production tools
• Their own health insurance, retirement benefits, and other benefits
• Setting their own filming/production schedule and creative methods

Nothing in this agreement shall be construed to create an employer-employee relationship. ${clientName} will not provide ${creatorName} with employee benefits and will not withhold taxes from payments. ${creatorName} is free to create content for other clients during the term of this agreement, provided such work does not create a conflict of interest, violate any exclusivity provisions, or breach the confidentiality provisions herein.`,

      liabilityLimit: `To the maximum extent permitted by law, ${creatorName}'s total liability arising out of or related to this agreement shall not exceed the total fees actually paid by ${clientName} under this agreement.

In no event shall ${creatorName} be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, followers, engagement metrics, brand reputation, or business opportunities, regardless of whether such damages were foreseeable.

${creatorName} is not responsible for the performance of published content, including but not limited to views, engagement, conversions, or sales resulting from the content. ${clientName}'s sole remedy for dissatisfaction with the content shall be re-creation of the deficient content or a refund of the fees paid for the specific deliverable in question.`,

      indemnificationTerms: `${clientName} agrees to indemnify, defend, and hold harmless ${creatorName} from and against any and all claims, damages, losses, liabilities, and expenses (including reasonable attorney's fees) arising out of or related to:

• ${clientName}'s products, services, or claims that ${creatorName} is asked to feature or promote in the content
• Any scripts, talking points, product claims, or direction provided by ${clientName} (including FTC compliance of required messaging)
• Claims arising from ${clientName}'s use of the content beyond the scope authorized by this agreement
• Any modification of the content made by ${clientName} or third parties after delivery

${creatorName} agrees to indemnify, defend, and hold harmless ${clientName} from and against any claims that the original content (unmodified) infringes on the intellectual property rights of any third party, including unauthorized use of third-party music, footage, or images, provided that ${creatorName} had full creative control over the allegedly infringing elements.`,

      warrantyTerms: `${creatorName} represents and warrants that:

• They have the legal right and authority to enter into this agreement and create the content described herein
• The content will be original work created by ${creatorName} (except for any Client-provided materials, properly licensed music/assets, or content specifically identified as sourced from third parties)
• The content, to the best of ${creatorName}'s knowledge, will not infringe upon the intellectual property rights of any third party
• The content will be produced in a professional manner consistent with generally accepted industry standards
• ${creatorName} will comply with applicable FTC disclosure requirements and platform guidelines when creating sponsored content

${clientName} represents and warrants that:

• They have the legal right and authority to enter into this agreement
• Any product claims, scripts, briefs, or direction provided to ${creatorName} are truthful, substantiated, and comply with applicable advertising laws and FTC guidelines
• The products or services featured in the content are safe, legal, and accurately represented

EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, ${creatorName} MAKES NO WARRANTIES REGARDING CONTENT PERFORMANCE, INCLUDING BUT NOT LIMITED TO VIEWS, ENGAGEMENT, REACH, CONVERSIONS, OR SALES.`,

      disputeResolutionTerms: `In the event of any dispute, claim, or controversy arising out of or relating to this agreement, the parties agree to the following resolution process:

1. GOOD FAITH NEGOTIATION: The parties shall first attempt to resolve the dispute through direct, good faith negotiation for a period of [15/30] days from written notice of the dispute.

2. MEDIATION: If negotiation fails, the parties agree to submit the dispute to non-binding mediation administered by [a mutually agreed-upon mediator / the American Arbitration Association / your local mediation service]. The costs of mediation shall be shared equally between the parties.

3. [BINDING ARBITRATION / LITIGATION]: If mediation fails, the dispute shall be resolved by [binding arbitration under the rules of the American Arbitration Association, with a single arbitrator, in ${creatorCity || '[YOUR_CITY]'}, ${creatorState || '[YOUR_STATE]'} / litigation in the courts specified in the Governing Law & Jurisdiction section of this agreement].

Each party shall bear their own attorney's fees and costs unless the arbitrator or court determines that one party's claims or defenses were frivolous, in which case the prevailing party may recover reasonable attorney's fees.`,

      forceMajeureTerms: `Neither party shall be liable for any failure or delay in performing their obligations under this agreement if such failure or delay results from circumstances beyond the party's reasonable control, including but not limited to:

• Natural disasters (earthquakes, floods, hurricanes, wildfires)
• Pandemics, epidemics, or public health emergencies
• Government actions, laws, regulations, embargoes, or sanctions
• Social media platform outages, algorithm changes, or account suspensions beyond the Creator's control
• Power outages, internet service disruptions, or equipment failures
• War, terrorism, civil unrest, or armed conflict
• Strikes, labor disputes, or supply chain disruptions

The affected party must notify the other party in writing within [5/10] business days of the force majeure event and make reasonable efforts to mitigate its impact. If the force majeure event continues for more than [30/60] days, either party may terminate this agreement with written notice, and the Creator shall be compensated for all work completed up to the date of the event.`
    }
  };

  return templates[contractType][field] || "";
};

// Generate comprehensive confidentiality text based on selected subclauses
const generateConfidentialityText = (
  contractType: "digital" | "physical" | "content",
  data: Partial<ContractData>,
  subclauses: {
    defineConfidential: boolean;
    exclusions: boolean;
    portfolioRights: boolean;
    socialMediaRights: boolean;
    teamDisclosure: boolean;
    duration: boolean;
    returnMaterials: boolean;
    breachRemedies: boolean;
  }
) => {
  const projectName = data.projectName || "[PROJECT_NAME]";
  const creatorName = data.creatorName || "[YOUR_NAME]";
  const clientName = data.clientName || "[CLIENT_NAME]";
  const duration = data.confidentialityDuration || "3 years";
  const portfolioDelay = data.portfolioUsageDelay || "upon project completion";

  let sections = [];

  if (subclauses.defineConfidential) {
    const definitions = {
      digital: [
        "Unpublished creative work, design files, and source materials",
        "Business strategies, marketing plans, and proprietary processes",
        "Client lists, pricing structures, and financial information",
        "Trade secrets, technical specifications, and project methodologies",
        "Any information explicitly marked as confidential by either party"
      ],
      physical: [
        "Original designs, patterns, templates, and production techniques",
        "Supplier information, material sources, and pricing details",
        "Custom specifications and proprietary manufacturing processes",
        "Client personal information and order details",
        "Any information explicitly marked as confidential by either party"
      ],
      content: [
        "Unpublished content, scripts, outlines, and creative concepts",
        "Brand guidelines, content calendars, and strategic plans",
        "Analytics, performance data, and audience insights",
        "Compensation details and contract negotiations",
        "Any information explicitly marked as confidential by either party"
      ]
    };

    sections.push(`**1. CONFIDENTIAL INFORMATION DEFINED**

Both ${creatorName} ("Creator") and ${clientName} ("Client") agree that the following information related to ${projectName} is considered confidential:

${definitions[contractType].map(item => `• ${item}`).join('\n')}

Educational Note: This clearly defines what information must be kept private. Being specific helps prevent misunderstandings and protects both parties' interests.`);
  }

  if (subclauses.exclusions) {
    sections.push(`**2. EXCLUSIONS FROM CONFIDENTIALITY**

The following information is NOT considered confidential:

• Information that is publicly available or becomes public through no breach of this agreement
• Information independently developed without use of confidential information
• Information already known prior to this agreement
• Information required to be disclosed by law, court order, or government authority

Educational Note: These standard exclusions ensure you're not restricted from using publicly available information or your own independently created work.`);
  }

  if (subclauses.portfolioRights) {
    sections.push(`**3. PORTFOLIO & CASE STUDY USAGE**

Creator may use the work created for ${projectName} in their professional portfolio ${portfolioDelay}. This includes:

• Displaying final deliverables on personal website and portfolio platforms
• Including the project in case studies (with or without Client name, as agreed)
• Showcasing work samples in client pitches and proposals

The Creator will respect any Client requests to:
• Delay portfolio posting until a specific date
• Omit Client name or identifying information
• Exclude the work entirely from public portfolios (must be agreed in writing)

Educational Note: Portfolio rights are essential for building your business. This clause balances your professional needs with client confidentiality concerns.`);
  }

  if (subclauses.socialMediaRights) {
    sections.push(`**4. SOCIAL MEDIA & PUBLIC ANNOUNCEMENTS**

Creator may announce the collaboration publicly unless Client requests otherwise. Permitted announcements include:

• Acknowledging the Client relationship (e.g., "Working with ${clientName}")
• Sharing behind-the-scenes content that doesn't reveal confidential information
• Posting final deliverables ${portfolioDelay} (unless restricted by Client)

Client may also share and promote the Creator's work publicly once delivered.

Educational Note: Social media visibility helps grow your business. This clause ensures you can announce collaborations while respecting any client privacy needs.`);
  }

  if (subclauses.teamDisclosure) {
    sections.push(`**5. PERMITTED DISCLOSURES TO TEAM MEMBERS**

Both parties may disclose confidential information to:

• Employees, contractors, or subcontractors who need the information to complete the project
• Legal and financial advisors bound by professional confidentiality
• Any person with prior written consent from the other party

The disclosing party must ensure all recipients are informed of the confidential nature and agree to maintain confidentiality.

Educational Note: You often need to involve assistants, editors, or specialists. This clause allows necessary collaboration while maintaining overall confidentiality.`);
  }

  if (subclauses.duration) {
    sections.push(`**6. DURATION OF CONFIDENTIALITY**

The confidentiality obligations in this agreement continue for ${duration} after the completion or termination of ${projectName}.

Exceptions:
• Trade secrets remain confidential indefinitely
• Portfolio rights begin ${portfolioDelay}
• Public announcements permitted as outlined in Section 4

Educational Note: Confidentiality doesn't last forever for most information. This defines clear timeframes so you know when restrictions end.`);
  }

  if (subclauses.returnMaterials) {
    sections.push(`**7. RETURN OR DESTRUCTION OF MATERIALS**

Upon completion or termination of this agreement:

• Client materials provided for the project should be returned or securely deleted
• The Creator may retain one copy of deliverables for portfolio purposes (as outlined in Section 3)
• Both parties should delete or return documents explicitly marked "Return After Use"
• Digital files containing confidential information should be permanently deleted from unsecured locations

Educational Note: This protects both parties from data breaches. Keep secure backups for your portfolio rights, but remove unnecessary confidential files.`);
  }

  if (subclauses.breachRemedies) {
    sections.push(`**8. BREACH AND REMEDIES**

Both parties acknowledge that breach of this confidentiality agreement could cause irreparable harm. 

In the event of a breach:
• The non-breaching party may seek injunctive relief (court order to stop the breach)
• The breaching party may be liable for actual damages caused by the breach
• The non-breaching party may pursue any other remedies available under law

Minor inadvertent disclosures should be promptly reported and corrected in good faith.

Educational Note: This isn't meant to be scary - it's standard legal protection. Most confidentiality issues are honest mistakes that can be resolved through communication.`);
  }

  return sections.length > 0 
    ? sections.join('\n\n---\n\n')
    : `Both parties agree to keep confidential any proprietary information shared during ${projectName}. This obligation extends for ${duration} beyond the completion of this agreement.`;
};

const DEFAULT_CONTRACT_DATA: ContractData = {
  contractType: "digital",
  clientName: "",
  projectName: "",
  startDate: "",
  endDate: "",
  creatorName: "",
  creatorAddress: "",
  creatorCity: "",
  creatorState: "",
  creatorZip: "",
  creatorCountry: "",
  creatorEmail: "",
  creatorPhone: "",
  clientAddress: "",
  clientCity: "",
  clientState: "",
  clientZip: "",
  clientCountry: "",
  clientEmail: "",
  clientPhone: "",
  sections: {
    scopeOfWork: true,
    deliverables: false,
    timeline: false,
    payment: false,
    rights: false,
    revisions: false,
    cancellation: false,
    confidentiality: false,
    jurisdiction: false,
    liability: false,
    disputeResolution: false,
  },
  scopeOfWork: "",
  deliverables: "",
  timeline: "",
  paymentTerms: "",
  paymentAmount: "",
  paymentSchedule: "",
  currency: "USD",
  paymentMethod: "",
  paymentDetails: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    swiftBic: "",
    paypalEmail: "",
    venmoHandle: "",
    zelleInfo: "",
    cryptoWallet: "",
    cryptoNetwork: "",
    otherDetails: "",
  },
  rightsUsage: "",
  revisionsLimit: "2 rounds",
  revisionsTimeline: "5 business days",
  revisionsDefinition: "",
  revisionsOverflow: "",
  revisionsAdditional: "",
  cancellationNotice: "",
  cancellationFee: "",
  cancellationAdditional: "",
  confidentialityTerms: "",
  governingLaw: "",
  jurisdictionVenue: "",
  independentContractorTerms: "",
  liabilityLimit: "",
  indemnificationTerms: "",
  warrantyTerms: "",
  disputeResolutionTerms: "",
  forceMajeureTerms: "",
  confidentialitySubclauses: {
    defineConfidential: true,
    exclusions: true,
    portfolioRights: true,
    socialMediaRights: false,
    teamDisclosure: false,
    duration: true,
    returnMaterials: false,
    breachRemedies: false,
  },
  confidentialityDuration: "3 years",
  portfolioUsageDelay: "upon project completion",
  customClauses: [],
  exportDate: "",
  version: "1.0",
};

const STORAGE_KEY = "creatorContractData";

// Custom Dropdown Component with glassmorphism aesthetic
interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

function CustomDropdown({ value, onChange, options, placeholder = "Select...", className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-sm border rounded-lg bg-white text-left flex items-center justify-between transition-all ${
          isOpen
            ? "border-[#131718]"
            : "border-[#131718]/20"
        } focus:outline-none focus:border-[#131718] hover:border-[#131718]/40`}
      >
        <span className={value ? "text-[#131718]" : "text-[#131718]/50"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#131718] transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-xl border border-[#131718] rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-sm text-left transition-colors ${
                  option.value === value
                    ? "bg-[#FEE6EA] text-[#131718] font-medium"
                    : "text-[#131718] hover:bg-[#FEE6EA]/50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContractBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contractData, setContractData] = useState<ContractData>(DEFAULT_CONTRACT_DATA);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [creatorInfoExpanded, setCreatorInfoExpanded] = useState(true);
  const [clientInfoExpanded, setClientInfoExpanded] = useState(true);
  const [projectDetailsExpanded, setProjectDetailsExpanded] = useState(true);
  const [customClausesExpanded, setCustomClausesExpanded] = useState(true);
  const [sectionCardExpanded, setSectionCardExpanded] = useState<Record<string, boolean>>({
    scopeOfWork: true,
    deliverables: true,
    timeline: true,
    payment: true,
    rights: true,
    revisions: true,
    cancellation: true,
    confidentiality: true,
    jurisdiction: true,
    liability: true,
    disputeResolution: true,
  });
  const downloadMenuRef = useRef<HTMLDivElement>(null);
  const mobileDownloadMenuRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Entrance animation — picks up from intro's liquid glass dissolve exit
  useEffect(() => {
    const isTransitioning = sessionStorage.getItem('intro-transitioning') === 'true';
    if (!isTransitioning || !pageRef.current) return;

    sessionStorage.removeItem('intro-transitioning');

    gsap.fromTo(
      pageRef.current,
      { opacity: 0, filter: 'blur(30px)', scale: 1.04 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1, ease: 'power2.out',
        onComplete() {
          // Clear inline transform/filter so fixed positioning works for children
          if (pageRef.current) {
            pageRef.current.style.transform = '';
            pageRef.current.style.filter = '';
          }
        }
      }
    );
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setContractData({ ...DEFAULT_CONTRACT_DATA, ...parsed });
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contractData));
  }, [contractData]);

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDesktop = downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node);
      const isOutsideMobile = mobileDownloadMenuRef.current && !mobileDownloadMenuRef.current.contains(event.target as Node);
      
      if (isOutsideDesktop && isOutsideMobile) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-update payment terms when currency changes
  const prevCurrencyRef = useRef(contractData.currency);
  useEffect(() => {
    const prevCurrency = prevCurrencyRef.current;
    const currentCurrency = contractData.currency;
    
    if (prevCurrency !== currentCurrency && contractData.paymentTerms) {
      const oldSymbol = getCurrencySymbol(prevCurrency);
      const newSymbol = getCurrencySymbol(currentCurrency);
      
      // Replace currency symbols in payment terms text
      // Handles patterns like "Total project fee: $5000" or "Total cost: €2000"
      const updatedPaymentTerms = contractData.paymentTerms.replace(
        new RegExp(`(Total project fee:|Total cost:)\\s*${oldSymbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
        `$1 ${newSymbol}`
      );
      
      if (updatedPaymentTerms !== contractData.paymentTerms) {
        setContractData(prev => ({ ...prev, paymentTerms: updatedPaymentTerms }));
      }
    }
    
    prevCurrencyRef.current = currentCurrency;
  }, [contractData.currency, contractData.paymentTerms]);

  // Update contract data helper
  const updateData = <K extends keyof ContractData>(
    key: K,
    value: ContractData[K]
  ) => {
    setContractData((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle section helper
  const toggleSection = (section: keyof ContractData["sections"]) => {
    setContractData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section],
      },
    }));
  };

  // Toggle section card expand/collapse
  const toggleSectionCardExpanded = (key: string) => {
    setSectionCardExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Add custom clause
  const addCustomClause = () => {
    const newClause = {
      id: crypto.randomUUID(),
      title: "",
      content: "",
    };
    setContractData((prev) => ({
      ...prev,
      customClauses: [...prev.customClauses, newClause],
    }));
  };

  // Update custom clause
  const updateCustomClause = (
    id: string,
    field: "title" | "content",
    value: string
  ) => {
    setContractData((prev) => ({
      ...prev,
      customClauses: prev.customClauses.map((clause) =>
        clause.id === id ? { ...clause, [field]: value } : clause
      ),
    }));
  };

  // Delete custom clause
  const deleteCustomClause = (id: string) => {
    setContractData((prev) => ({
      ...prev,
      customClauses: prev.customClauses.filter((clause) => clause.id !== id),
    }));
  };

  // Load template for a specific field
  const loadTemplate = (field: keyof ContractData) => {
    const templateText = getTemplateText(field, contractData.contractType, contractData);
    if (templateText) {
      updateData(field, templateText);
    }
  };

  // Export as JSON
  const exportJSON = () => {
    const data = {
      ...contractData,
      exportDate: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contract-${contractData.projectName || "untitled"}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as Markdown
  const exportMarkdown = () => {
    let markdown = `# Service Agreement\n\n`;
    markdown += `**Project:** ${contractData.projectName}\n**Start Date:** ${contractData.startDate}\n**End Date:** ${contractData.endDate}\n\n`;

    // Creator Info
    markdown += `**CREATOR**\n\n`;
    markdown += `${contractData.creatorName || "[YOUR_NAME]"}\n`;
    if (contractData.creatorAddress) markdown += `${contractData.creatorAddress}\n`;
    const creatorCityLine = [contractData.creatorCity, contractData.creatorState, contractData.creatorZip].filter(Boolean).join(contractData.creatorState && contractData.creatorCity ? ", " : " ").replace(/, (\d)/, " $1");
    if (creatorCityLine) markdown += `${contractData.creatorCity}${contractData.creatorCity && contractData.creatorState ? ", " : ""}${contractData.creatorState}${contractData.creatorState && contractData.creatorZip ? " " : ""}${contractData.creatorZip}\n`;
    if (contractData.creatorCountry) markdown += `${contractData.creatorCountry}\n`;
    if (contractData.creatorEmail) markdown += `${contractData.creatorEmail}\n`;
    if (contractData.creatorPhone) markdown += `${contractData.creatorPhone}\n`;
    markdown += `\n`;

    // Client Info
    markdown += `**CLIENT**\n\n`;
    markdown += `${contractData.clientName || "[CLIENT_NAME]"}\n`;
    if (contractData.clientAddress) markdown += `${contractData.clientAddress}\n`;
    if (contractData.clientCity || contractData.clientState || contractData.clientZip) markdown += `${contractData.clientCity}${contractData.clientCity && contractData.clientState ? ", " : ""}${contractData.clientState}${contractData.clientState && contractData.clientZip ? " " : ""}${contractData.clientZip}\n`;
    if (contractData.clientCountry) markdown += `${contractData.clientCountry}\n`;
    if (contractData.clientEmail) markdown += `${contractData.clientEmail}\n`;
    if (contractData.clientPhone) markdown += `${contractData.clientPhone}\n`;
    markdown += `\n`;

    if (contractData.sections.scopeOfWork && contractData.scopeOfWork) {
      markdown += `## Scope of Work\n\n${contractData.scopeOfWork}\n\n`;
    }

    if (contractData.sections.deliverables && contractData.deliverables) {
      markdown += `## Deliverables\n\n${contractData.deliverables}\n\n`;
    }

    if (contractData.sections.timeline && contractData.timeline) {
      markdown += `## Timeline & Milestones\n\n${contractData.timeline}\n\n`;
    }

    if (contractData.sections.payment) {
      markdown += `## Payment & Terms\n\n`;
      if (contractData.paymentAmount) markdown += `**Amount:** ${getCurrencySymbol(contractData.currency)} ${contractData.paymentAmount}\n\n`;
      if (contractData.paymentSchedule) markdown += `**Schedule:** ${contractData.paymentSchedule}\n\n`;
      if (contractData.paymentMethod) {
        markdown += `**Payment Details:**\n\n${getPaymentDetailsText(contractData.paymentMethod, contractData.paymentDetails)}\n\n`;
      }
      if (contractData.paymentTerms) markdown += `${contractData.paymentTerms}\n\n`;
    }

    if (contractData.sections.rights && contractData.rightsUsage) {
      markdown += `## Rights & Usage\n\n${contractData.rightsUsage}\n\n`;
    }

    if (contractData.sections.revisions) {
      markdown += `## Revisions Policy\n\n`;
      if (contractData.revisionsLimit) markdown += `**Limit:** ${contractData.revisionsLimit}\n\n`;
      if (contractData.revisionsTimeline) markdown += `**Timeline:** ${contractData.revisionsTimeline}\n\n`;
      if (contractData.revisionsDefinition) markdown += `**What Counts as a Revision:** ${contractData.revisionsDefinition}\n\n`;
      if (contractData.revisionsOverflow) markdown += `**Additional Revisions:** ${contractData.revisionsOverflow}\n\n`;
      if (contractData.revisionsAdditional) markdown += `**Additional Terms:** ${contractData.revisionsAdditional}\n\n`;
    }

    if (contractData.sections.cancellation) {
      markdown += `## Cancellation Policy\n\n`;
      if (contractData.cancellationNotice) markdown += `**Notice Period:** ${contractData.cancellationNotice}\n\n`;
      if (contractData.cancellationFee) markdown += `**Fee:** ${contractData.cancellationFee}\n\n`;
      if (contractData.cancellationAdditional) markdown += `**Additional Terms:** ${contractData.cancellationAdditional}\n\n`;
    }

    if (contractData.sections.confidentiality && contractData.confidentialityTerms) {
      markdown += `## Confidentiality\n\n${contractData.confidentialityTerms}\n\n`;
    }

    if (contractData.sections.jurisdiction) {
      markdown += `## Governing Law & Jurisdiction\n\n`;
      if (contractData.governingLaw) markdown += `**Governing Law:** This agreement shall be governed by and construed in accordance with the laws of the ${contractData.governingLaw}.\n\n`;
      if (contractData.jurisdictionVenue) markdown += `**Jurisdiction:** Any legal action or proceeding arising under this agreement will be brought exclusively in the ${contractData.jurisdictionVenue}.\n\n`;
    }

    if (contractData.sections.liability) {
      markdown += `## Liability & Warranties\n\n`;
      const icText = contractData.independentContractorTerms || getTemplateText('independentContractorTerms', contractData.contractType, contractData);
      if (icText) markdown += `### Independent Contractor\n\n${icText}\n\n`;
      const llText = contractData.liabilityLimit || getTemplateText('liabilityLimit', contractData.contractType, contractData);
      if (llText) markdown += `### Limitation of Liability\n\n${llText}\n\n`;
      const inText = contractData.indemnificationTerms || getTemplateText('indemnificationTerms', contractData.contractType, contractData);
      if (inText) markdown += `### Indemnification\n\n${inText}\n\n`;
      const wText = contractData.warrantyTerms || getTemplateText('warrantyTerms', contractData.contractType, contractData);
      if (wText) markdown += `### Warranties & Representations\n\n${wText}\n\n`;
    }

    if (contractData.sections.disputeResolution) {
      markdown += `## Dispute Resolution\n\n`;
      const drText = contractData.disputeResolutionTerms || getTemplateText('disputeResolutionTerms', contractData.contractType, contractData);
      if (drText) markdown += `### Dispute Resolution Process\n\n${drText}\n\n`;
      const fmText = contractData.forceMajeureTerms || getTemplateText('forceMajeureTerms', contractData.contractType, contractData);
      if (fmText) markdown += `### Force Majeure\n\n${fmText}\n\n`;
    }

    // General Provisions (always included)
    markdown += `## General Provisions\n\n`;
    markdown += `**Entire Agreement**\n\nThis agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, warranties, commitments, offers, contracts, and writings, whether written or oral, relating to its subject matter. No prior drafts, correspondence, or verbal discussions shall be used to interpret or modify this agreement.\n\n`;
    markdown += `**Severability**\n\nIf any provision of this agreement is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the original intent of the parties.\n\n`;
    markdown += `**Amendments & Modifications**\n\nNo amendment, modification, or waiver of any provision of this agreement shall be effective unless made in writing and signed by both parties. Verbal agreements or informal written communications (including emails, text messages, and direct messages) do not constitute valid amendments to this agreement.\n\n`;
    markdown += `**Waiver**\n\nThe failure of either party to enforce any provision of this agreement shall not be construed as a waiver of such provision or the right to enforce it at a later time. A waiver of any breach of this agreement shall not constitute a waiver of any subsequent breach.\n\n`;
    markdown += `**Assignment**\n\nNeither party may assign, transfer, or delegate their rights or obligations under this agreement without the prior written consent of the other party. Any attempted assignment without such consent shall be void. This agreement shall be binding upon and inure to the benefit of the parties and their permitted successors and assigns.\n\n`;
    markdown += `**Notices**\n\nAll notices, requests, and other communications under this agreement shall be in writing and delivered via email to the addresses provided in this agreement${contractData.creatorEmail && contractData.clientEmail ? ` (Creator: ${contractData.creatorEmail}, Client: ${contractData.clientEmail})` : ''}. Notices shall be deemed received on the date of confirmed delivery. Either party may change their notice address by providing written notice to the other party.\n\n`;

    if (contractData.customClauses.length > 0) {
      contractData.customClauses.forEach((clause) => {
        if (clause.title && clause.content) {
          markdown += `## ${clause.title}\n\n${clause.content}\n\n`;
        }
      });
    }

    markdown += `## Signatures\n\nBy signing below, both parties acknowledge they have read, understood, and agree to be bound by the terms and conditions outlined in this agreement.\n\n`;
    markdown += `**Creator:**\n\nSignature: ____________________________\n\nName: ${contractData.creatorName || "[YOUR_NAME]"}\n\nDate: ____________________________\n\n`;
    markdown += `**Client:**\n\nSignature: ____________________________\n\nName: ${contractData.clientName || "[CLIENT_NAME]"}\n\nDate: ____________________________\n\n`;

    markdown += `*Generated on ${new Date().toLocaleDateString()}*\n`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contract-${contractData.projectName || "untitled"}-${
      new Date().toISOString().split("T")[0]
    }.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as PDF
  const exportPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    // Helper to add text with word wrap
    const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      if (isBold) pdf.setFont("helvetica", "bold");
      else pdf.setFont("helvetica", "normal");
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 5;
    };

    // Title
    addText("SERVICE AGREEMENT", 18, true);
    yPosition += 5;

    // Basic Info
    addText(`Project: ${contractData.projectName}`, 12, true);
    addText(`Start Date: ${contractData.startDate}`);
    addText(`End Date: ${contractData.endDate}`);
    yPosition += 5;

    // Creator Info
    addText("CREATOR", 11, true);
    addText(contractData.creatorName || "[YOUR_NAME]");
    if (contractData.creatorAddress) addText(contractData.creatorAddress);
    if (contractData.creatorCity || contractData.creatorState || contractData.creatorZip) {
      addText(`${contractData.creatorCity}${contractData.creatorCity && contractData.creatorState ? ", " : ""}${contractData.creatorState}${contractData.creatorState && contractData.creatorZip ? " " : ""}${contractData.creatorZip}`);
    }
    if (contractData.creatorCountry) addText(contractData.creatorCountry);
    if (contractData.creatorEmail) addText(contractData.creatorEmail);
    if (contractData.creatorPhone) addText(contractData.creatorPhone);
    yPosition += 3;

    // Client Info
    addText("CLIENT", 11, true);
    addText(contractData.clientName || "[CLIENT_NAME]");
    if (contractData.clientAddress) addText(contractData.clientAddress);
    if (contractData.clientCity || contractData.clientState || contractData.clientZip) {
      addText(`${contractData.clientCity}${contractData.clientCity && contractData.clientState ? ", " : ""}${contractData.clientState}${contractData.clientState && contractData.clientZip ? " " : ""}${contractData.clientZip}`);
    }
    if (contractData.clientCountry) addText(contractData.clientCountry);
    if (contractData.clientEmail) addText(contractData.clientEmail);
    if (contractData.clientPhone) addText(contractData.clientPhone);
    yPosition += 10;

    // Sections
    if (contractData.sections.scopeOfWork && contractData.scopeOfWork) {
      addText("SCOPE OF WORK", 14, true);
      addText(contractData.scopeOfWork);
    }

    if (contractData.sections.deliverables && contractData.deliverables) {
      addText("DELIVERABLES", 14, true);
      addText(contractData.deliverables);
    }

    if (contractData.sections.timeline && contractData.timeline) {
      addText("TIMELINE & MILESTONES", 14, true);
      addText(contractData.timeline);
    }

    if (contractData.sections.payment) {
      addText("PAYMENT & TERMS", 14, true);
      if (contractData.paymentAmount) addText(`Amount: ${getCurrencySymbol(contractData.currency)} ${contractData.paymentAmount}`);
      if (contractData.paymentSchedule) addText(`Schedule: ${contractData.paymentSchedule}`);
      if (contractData.paymentMethod) {
        addText("Payment Details:");
        addText(getPaymentDetailsText(contractData.paymentMethod, contractData.paymentDetails));
      }
      if (contractData.paymentTerms) addText(contractData.paymentTerms);
    }

    if (contractData.sections.rights && contractData.rightsUsage) {
      addText("RIGHTS & USAGE", 14, true);
      addText(contractData.rightsUsage);
    }

    if (contractData.sections.revisions) {
      addText("REVISIONS POLICY", 14, true);
      if (contractData.revisionsLimit) addText(`Limit: ${contractData.revisionsLimit}`);
      if (contractData.revisionsTimeline) addText(`Timeline: ${contractData.revisionsTimeline}`);
      if (contractData.revisionsDefinition) addText(`What Counts as a Revision: ${contractData.revisionsDefinition}`);
      if (contractData.revisionsOverflow) addText(`Additional Revisions: ${contractData.revisionsOverflow}`);
      if (contractData.revisionsAdditional) addText(`Additional Terms: ${contractData.revisionsAdditional}`);
    }

    if (contractData.sections.cancellation) {
      addText("CANCELLATION POLICY", 14, true);
      if (contractData.cancellationNotice) addText(`Notice Period: ${contractData.cancellationNotice}`);
      if (contractData.cancellationFee) addText(`Fee: ${contractData.cancellationFee}`);
      if (contractData.cancellationAdditional) addText(`Additional Terms: ${contractData.cancellationAdditional}`);
    }

    if (contractData.sections.confidentiality && contractData.confidentialityTerms) {
      addText("CONFIDENTIALITY", 14, true);
      addText(contractData.confidentialityTerms);
    }

    if (contractData.sections.jurisdiction) {
      addText("GOVERNING LAW & JURISDICTION", 14, true);
      if (contractData.governingLaw) addText(`Governing Law: This agreement shall be governed by and construed in accordance with the laws of the ${contractData.governingLaw}.`);
      if (contractData.jurisdictionVenue) addText(`Jurisdiction: Any legal action or proceeding arising under this agreement will be brought exclusively in the ${contractData.jurisdictionVenue}.`);
    }

    if (contractData.sections.liability) {
      addText("LIABILITY & WARRANTIES", 14, true);
      const icText = contractData.independentContractorTerms || getTemplateText('independentContractorTerms', contractData.contractType, contractData);
      if (icText) { addText("Independent Contractor", 11, true); addText(icText); }
      const llText = contractData.liabilityLimit || getTemplateText('liabilityLimit', contractData.contractType, contractData);
      if (llText) { addText("Limitation of Liability", 11, true); addText(llText); }
      const inText = contractData.indemnificationTerms || getTemplateText('indemnificationTerms', contractData.contractType, contractData);
      if (inText) { addText("Indemnification", 11, true); addText(inText); }
      const wText = contractData.warrantyTerms || getTemplateText('warrantyTerms', contractData.contractType, contractData);
      if (wText) { addText("Warranties & Representations", 11, true); addText(wText); }
    }

    if (contractData.sections.disputeResolution) {
      addText("DISPUTE RESOLUTION", 14, true);
      const drText = contractData.disputeResolutionTerms || getTemplateText('disputeResolutionTerms', contractData.contractType, contractData);
      if (drText) { addText("Dispute Resolution Process", 11, true); addText(drText); }
      const fmText = contractData.forceMajeureTerms || getTemplateText('forceMajeureTerms', contractData.contractType, contractData);
      if (fmText) { addText("Force Majeure", 11, true); addText(fmText); }
    }

    // General Provisions (always included)
    addText("GENERAL PROVISIONS", 14, true);
    addText("Entire Agreement", 11, true);
    addText("This agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, warranties, commitments, offers, contracts, and writings, whether written or oral, relating to its subject matter. No prior drafts, correspondence, or verbal discussions shall be used to interpret or modify this agreement.");
    addText("Severability", 11, true);
    addText("If any provision of this agreement is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the original intent of the parties.");
    addText("Amendments & Modifications", 11, true);
    addText("No amendment, modification, or waiver of any provision of this agreement shall be effective unless made in writing and signed by both parties. Verbal agreements or informal written communications (including emails, text messages, and direct messages) do not constitute valid amendments to this agreement.");
    addText("Waiver", 11, true);
    addText("The failure of either party to enforce any provision of this agreement shall not be construed as a waiver of such provision or the right to enforce it at a later time. A waiver of any breach of this agreement shall not constitute a waiver of any subsequent breach.");
    addText("Assignment", 11, true);
    addText("Neither party may assign, transfer, or delegate their rights or obligations under this agreement without the prior written consent of the other party. Any attempted assignment without such consent shall be void. This agreement shall be binding upon and inure to the benefit of the parties and their permitted successors and assigns.");
    addText("Notices", 11, true);
    addText(`All notices, requests, and other communications under this agreement shall be in writing and delivered via email to the addresses provided in this agreement${contractData.creatorEmail && contractData.clientEmail ? ` (Creator: ${contractData.creatorEmail}, Client: ${contractData.clientEmail})` : ''}. Notices shall be deemed received on the date of confirmed delivery. Either party may change their notice address by providing written notice to the other party.`);

    if (contractData.customClauses.length > 0) {
      contractData.customClauses.forEach((clause) => {
        if (clause.title && clause.content) {
          addText(clause.title.toUpperCase(), 14, true);
          addText(clause.content);
        }
      });
    }

    addText("SIGNATURES", 14, true);
    addText("By signing below, both parties acknowledge they have read, understood, and agree to be bound by the terms and conditions outlined in this agreement.");
    yPosition += 5;
    addText("Creator:");
    yPosition += 12;
    pdf.setDrawColor(19, 23, 24);
    pdf.line(margin, yPosition, margin + 80, yPosition);
    yPosition += 4;
    addText(contractData.creatorName || "[YOUR_NAME]");
    addText("Date: ____________________________");
    yPosition += 8;
    addText("Client:");
    yPosition += 12;
    pdf.line(margin, yPosition, margin + 80, yPosition);
    yPosition += 4;
    addText(contractData.clientName || "[CLIENT_NAME]");
    addText("Date: ____________________________");

    yPosition += 10;
    addText(`Generated on ${new Date().toLocaleDateString()}`, 9);

    pdf.save(
      `contract-${contractData.projectName || "untitled"}-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  };

  // Import data from JSON
  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data: ContractData = JSON.parse(content);

        if (!data.contractType) {
          alert("Invalid file format. Please upload a valid Contract Builder data file.");
          return;
        }

        setContractData({ ...DEFAULT_CONTRACT_DATA, ...data });
        alert("Contract data imported successfully!");
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Error reading file. Please ensure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
  };



  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
    }
  };

  const contractTypes = [
    {
      value: "digital",
      label: "Digital Creator Services",
      icon: Briefcase,
      description: "Digital products & services: social media management, graphic design, UGC, branding, consulting, and other deliverables that exist online or are delivered electronically",
    },
    {
      value: "physical",
      label: "Physical Product Creation",
      icon: Package,
      description: "Tangible products: handmade goods, custom artwork, merchandise, crafts, prints, or any physical items you create and ship to clients",
    },
    {
      value: "content",
      label: "Content Creation",
      icon: Video,
      description: "Media & storytelling: video production, photography, writing, podcasting, blog posts, or any content meant for consumption or publication",
    },
  ];

  const sections = [
    { key: "scopeOfWork" as const, label: "Scope of Work", icon: FileCheck, checkboxLabel: "Include scope of work", explainer: "Defines the work you'll deliver and sets clear boundaries for the project." },
    { key: "deliverables" as const, label: "Deliverables", icon: Package, checkboxLabel: "Include deliverables", explainer: "Lists exactly what the client will receive upon project completion." },
    { key: "timeline" as const, label: "Timeline & Milestones", icon: Clock, checkboxLabel: "Include timeline & milestones", explainer: "Establishes deadlines and key project milestones to keep everyone on track." },
    { key: "payment" as const, label: "Payment & Terms", icon: DollarSign, checkboxLabel: "Include payment terms", explainer: "Protects your income by specifying amounts, schedules, and late payment policies." },
    { key: "rights" as const, label: "Rights & Usage", icon: Shield, checkboxLabel: "Include rights & usage terms", explainer: "Controls how the client can use your work and protects your copyright." },
    { key: "revisions" as const, label: "Revisions Policy", icon: RefreshCw, checkboxLabel: "Include revision policy", explainer: "Prevents scope creep by limiting the number and timeline for revisions." },
    { key: "cancellation" as const, label: "Cancellation Policy", icon: XCircle, checkboxLabel: "Include cancellation policy", explainer: "Sets rules for how either party can exit the agreement, including kill fees and payment protection." },
    { key: "confidentiality" as const, label: "Confidentiality", icon: Lock, checkboxLabel: "Include confidentiality terms", explainer: "Protects sensitive information shared during the project." },
    { key: "jurisdiction" as const, label: "Governing Law & Jurisdiction", icon: Scale, checkboxLabel: "Include governing law & jurisdiction", explainer: "Determines which state's laws apply and where legal disputes must be handled." },
    { key: "liability" as const, label: "Liability & Warranties", icon: ShieldAlert, checkboxLabel: "Include liability & warranties", explainer: "Limits your financial exposure, clarifies the working relationship, and sets expectations for originality and quality." },
    { key: "disputeResolution" as const, label: "Dispute Resolution", icon: Gavel, checkboxLabel: "Include dispute resolution", explainer: "Establishes how disagreements are resolved (negotiation, mediation, arbitration) and protects both parties from events beyond their control." },
  ];

  // Generate preview JSX
  const generatePreview = () => {
    const sections_jsx = [];
    
    // Helper to get content - uses actual data or falls back to template
    const getContent = (field: string) => {
      const dataField = contractData[field as keyof ContractData];
      if (typeof dataField === 'string' && dataField.trim()) {
        return dataField;
      }
      // Fall back to template if no content but section is enabled
      return getTemplateText(field, contractData.contractType, contractData);
    };
    
    sections_jsx.push(
      <div key="header" className="mb-8">
        <h1 className="text-3xl mb-6 text-[#131718]">SERVICE AGREEMENT</h1>
        
        {/* Project Info */}
        <div className="mb-6">
          <p className="text-base"><span className="font-semibold">Project:</span> {contractData.projectName || "[PROJECT_NAME]"}</p>
          <p className="text-base"><span className="font-semibold">Start Date:</span> {contractData.startDate || "[START_DATE]"}</p>
          <p className="text-base"><span className="font-semibold">End Date:</span> {contractData.endDate || "[END_DATE]"}</p>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Creator Info */}
          <div>
            <h3 className="font-semibold text-base mb-2">CREATOR</h3>
            <div className="text-base space-y-0.5">
              <p>{contractData.creatorName || "[YOUR_NAME]"}</p>
              {contractData.creatorAddress && <p>{contractData.creatorAddress}</p>}
              {(contractData.creatorCity || contractData.creatorState || contractData.creatorZip) && (
                <p>
                  {contractData.creatorCity && contractData.creatorCity}
                  {contractData.creatorCity && contractData.creatorState && ", "}
                  {contractData.creatorState && contractData.creatorState}
                  {contractData.creatorState && contractData.creatorZip && " "}
                  {contractData.creatorZip && contractData.creatorZip}
                </p>
              )}
              {contractData.creatorCountry && <p>{contractData.creatorCountry}</p>}
              {contractData.creatorEmail && <p>{contractData.creatorEmail}</p>}
              {contractData.creatorPhone && <p>{contractData.creatorPhone}</p>}
            </div>
          </div>
          
          {/* Client Info */}
          <div>
            <h3 className="font-semibold text-base mb-2">CLIENT</h3>
            <div className="text-base space-y-0.5">
              <p>{contractData.clientName || "[CLIENT_NAME]"}</p>
              {contractData.clientAddress && <p>{contractData.clientAddress}</p>}
              {(contractData.clientCity || contractData.clientState || contractData.clientZip) && (
                <p>
                  {contractData.clientCity && contractData.clientCity}
                  {contractData.clientCity && contractData.clientState && ", "}
                  {contractData.clientState && contractData.clientState}
                  {contractData.clientState && contractData.clientZip && " "}
                  {contractData.clientZip && contractData.clientZip}
                </p>
              )}
              {contractData.clientCountry && <p>{contractData.clientCountry}</p>}
              {contractData.clientEmail && <p>{contractData.clientEmail}</p>}
              {contractData.clientPhone && <p>{contractData.clientPhone}</p>}
            </div>
          </div>
        </div>
      </div>
    );

    if (contractData.sections.scopeOfWork) {
      const content = getContent('scopeOfWork');
      if (content) {
        sections_jsx.push(
          <div key="scope" className="mb-8">
            <h2 className="text-[20px] mb-4 text-[#131718]">SCOPE OF WORK</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>
          </div>
        );
      }
    }

    if (contractData.sections.deliverables) {
      const content = getContent('deliverables');
      if (content) {
        sections_jsx.push(
          <div key="deliverables" className="mb-8">
            <h2 className="text-[20px] mb-4 text-[#131718]">DELIVERABLES</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>
          </div>
        );
      }
    }

    if (contractData.sections.timeline) {
      const content = getContent('timeline');
      if (content) {
        sections_jsx.push(
          <div key="timeline" className="mb-8">
            <h2 className="text-[20px] mb-4 text-[#131718]">TIMELINE & MILESTONES</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>
          </div>
        );
      }
    }

    if (contractData.sections.payment) {
      sections_jsx.push(
        <div key="payment" className="mb-8">
          <h2 className="text-[20px] mb-4 text-[#131718]">PAYMENT & TERMS</h2>
          <div className="space-y-3 text-base leading-relaxed">
            {contractData.paymentAmount && <p><span className="font-semibold">Amount:</span> {getCurrencySymbol(contractData.currency)} {contractData.paymentAmount}</p>}
            {contractData.paymentSchedule && <p><span className="font-semibold">Schedule:</span> {contractData.paymentSchedule}</p>}
            {contractData.paymentMethod && (
              <div>
                <p className="font-semibold mb-1">Payment Details:</p>
                <div className="whitespace-pre-wrap">
                  {getPaymentDetailsText(contractData.paymentMethod, contractData.paymentDetails)}
                </div>
              </div>
            )}
            {(contractData.paymentTerms || getTemplateText('paymentTerms', contractData.contractType, contractData)) && (
              <div className="whitespace-pre-wrap">
                {contractData.paymentTerms || getTemplateText('paymentTerms', contractData.contractType, contractData)}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (contractData.sections.rights) {
      const content = getContent('rightsUsage');
      if (content) {
        sections_jsx.push(
          <div key="rights" className="mb-8">
            <h2 className="text-[20px] mb-4 text-[#131718]">RIGHTS & USAGE</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>
          </div>
        );
      }
    }

    if (contractData.sections.revisions) {
      sections_jsx.push(
        <div key="revisions" className="mb-8">
          <h2 className="text-[20px] mb-4 text-[#131718]">REVISIONS POLICY</h2>
          <div className="space-y-2 text-base leading-relaxed">
            {contractData.revisionsLimit && <p><span className="font-semibold">Limit:</span> {contractData.revisionsLimit}</p>}
            {contractData.revisionsTimeline && <p><span className="font-semibold">Timeline:</span> {contractData.revisionsTimeline}</p>}
            {contractData.revisionsDefinition && <p><span className="font-semibold">What Counts as a Revision:</span> {contractData.revisionsDefinition}</p>}
            {contractData.revisionsOverflow && <p><span className="font-semibold">Additional Revisions:</span> {contractData.revisionsOverflow}</p>}
            {contractData.revisionsAdditional && (
              <p><span className="font-semibold">Additional Terms:</span> {contractData.revisionsAdditional}</p>
            )}
          </div>
        </div>
      );
    }

    if (contractData.sections.cancellation) {
      sections_jsx.push(
        <div key="cancellation" className="mb-8">
          <h2 className="text-[20px] mb-4 text-[#131718]">CANCELLATION POLICY</h2>
          <div className="space-y-2 text-base leading-relaxed">
            {(contractData.cancellationNotice || getTemplateText('cancellationNotice', contractData.contractType, contractData)) && (
              <p><span className="font-semibold">Notice Period:</span> {contractData.cancellationNotice || getTemplateText('cancellationNotice', contractData.contractType, contractData)}</p>
            )}
            {(contractData.cancellationFee || getTemplateText('cancellationFee', contractData.contractType, contractData)) && (
              <p><span className="font-semibold">Fee:</span> {contractData.cancellationFee || getTemplateText('cancellationFee', contractData.contractType, contractData)}</p>
            )}
            {contractData.cancellationAdditional && (
              <p><span className="font-semibold">Additional Terms:</span> {contractData.cancellationAdditional}</p>
            )}
          </div>
        </div>
      );
    }

    if (contractData.sections.confidentiality) {
      const content = getContent('confidentialityTerms');
      if (content) {
        sections_jsx.push(
          <div key="confidentiality" className="mb-8">
            <h2 className="text-[20px] mb-4 text-[#131718]">CONFIDENTIALITY</h2>
            <div className="text-base leading-relaxed whitespace-pre-wrap">{content}</div>
          </div>
        );
      }
    }

    if (contractData.sections.jurisdiction) {
      sections_jsx.push(
        <div key="jurisdiction" className="mb-8">
          <h2 className="text-[20px] mb-4 text-[#131718]">GOVERNING LAW & JURISDICTION</h2>
          <div className="space-y-2 text-base leading-relaxed">
            {(contractData.governingLaw || getTemplateText('governingLaw', contractData.contractType, contractData)) && (
              <p><span className="font-semibold">Governing Law:</span> This agreement shall be governed by and construed in accordance with the laws of the {contractData.governingLaw || getTemplateText('governingLaw', contractData.contractType, contractData)}.</p>
            )}
            {(contractData.jurisdictionVenue || getTemplateText('jurisdictionVenue', contractData.contractType, contractData)) && (
              <p><span className="font-semibold">Jurisdiction:</span> Any legal action or proceeding arising under this agreement will be brought exclusively in the {contractData.jurisdictionVenue || getTemplateText('jurisdictionVenue', contractData.contractType, contractData)}.</p>
            )}
          </div>
        </div>
      );
    }

    if (contractData.sections.liability) {
      sections_jsx.push(
        <div key="liability" className="mb-8">
          <h2 className="text-[20px] mb-4 text-[#131718]">LIABILITY & WARRANTIES</h2>
          <div className="space-y-6 text-base leading-relaxed">
            {(contractData.independentContractorTerms || getTemplateText('independentContractorTerms', contractData.contractType, contractData)) && (
              <div>
                <h3 className="font-semibold mb-2">Independent Contractor</h3>
                <div className="whitespace-pre-wrap">{contractData.independentContractorTerms || getTemplateText('independentContractorTerms', contractData.contractType, contractData)}</div>
              </div>
            )}
            {(contractData.liabilityLimit || getTemplateText('liabilityLimit', contractData.contractType, contractData)) && (
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <div className="whitespace-pre-wrap">{contractData.liabilityLimit || getTemplateText('liabilityLimit', contractData.contractType, contractData)}</div>
              </div>
            )}
            {(contractData.indemnificationTerms || getTemplateText('indemnificationTerms', contractData.contractType, contractData)) && (
              <div>
                <h3 className="font-semibold mb-2">Indemnification</h3>
                <div className="whitespace-pre-wrap">{contractData.indemnificationTerms || getTemplateText('indemnificationTerms', contractData.contractType, contractData)}</div>
              </div>
            )}
            {(contractData.warrantyTerms || getTemplateText('warrantyTerms', contractData.contractType, contractData)) && (
              <div>
                <h3 className="font-semibold mb-2">Warranties & Representations</h3>
                <div className="whitespace-pre-wrap">{contractData.warrantyTerms || getTemplateText('warrantyTerms', contractData.contractType, contractData)}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (contractData.sections.disputeResolution) {
      sections_jsx.push(
        <div key="disputeResolution" className="mb-8">
          <h2 className="text-[20px] mb-4 text-[#131718]">DISPUTE RESOLUTION</h2>
          <div className="space-y-6 text-base leading-relaxed">
            {(contractData.disputeResolutionTerms || getTemplateText('disputeResolutionTerms', contractData.contractType, contractData)) && (
              <div>
                <h3 className="font-semibold mb-2">Dispute Resolution Process</h3>
                <div className="whitespace-pre-wrap">{contractData.disputeResolutionTerms || getTemplateText('disputeResolutionTerms', contractData.contractType, contractData)}</div>
              </div>
            )}
            {(contractData.forceMajeureTerms || getTemplateText('forceMajeureTerms', contractData.contractType, contractData)) && (
              <div>
                <h3 className="font-semibold mb-2">Force Majeure</h3>
                <div className="whitespace-pre-wrap">{contractData.forceMajeureTerms || getTemplateText('forceMajeureTerms', contractData.contractType, contractData)}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // General Provisions (standard boilerplate - always included)
    sections_jsx.push(
      <div key="general-provisions" className="mb-8">
        <h2 className="text-[20px] mb-4 text-[#131718]">GENERAL PROVISIONS</h2>
        <div className="space-y-4 text-base leading-relaxed">
          <div>
            <h3 className="font-semibold mb-1">Entire Agreement</h3>
            <p>This agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, warranties, commitments, offers, contracts, and writings, whether written or oral, relating to its subject matter. No prior drafts, correspondence, or verbal discussions shall be used to interpret or modify this agreement.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Severability</h3>
            <p>If any provision of this agreement is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the original intent of the parties.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Amendments & Modifications</h3>
            <p>No amendment, modification, or waiver of any provision of this agreement shall be effective unless made in writing and signed by both parties. Verbal agreements or informal written communications (including emails, text messages, and direct messages) do not constitute valid amendments to this agreement.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Waiver</h3>
            <p>The failure of either party to enforce any provision of this agreement shall not be construed as a waiver of such provision or the right to enforce it at a later time. A waiver of any breach of this agreement shall not constitute a waiver of any subsequent breach.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Assignment</h3>
            <p>Neither party may assign, transfer, or delegate their rights or obligations under this agreement without the prior written consent of the other party. Any attempted assignment without such consent shall be void. This agreement shall be binding upon and inure to the benefit of the parties and their permitted successors and assigns.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Notices</h3>
            <p>All notices, requests, and other communications under this agreement shall be in writing and delivered via email to the addresses provided in this agreement{contractData.creatorEmail && contractData.clientEmail ? ` (Creator: ${contractData.creatorEmail}, Client: ${contractData.clientEmail})` : ''}. Notices shall be deemed received on the date of confirmed delivery. Either party may change their notice address by providing written notice to the other party.</p>
          </div>
        </div>
      </div>
    );

    if (contractData.customClauses.length > 0) {
      contractData.customClauses.forEach((clause, index) => {
        if (clause.title && clause.content) {
          sections_jsx.push(
            <div key={`custom-${index}`} className="mb-8">
              <h2 className="text-[20px] mb-4 text-[#131718]">{clause.title.toUpperCase()}</h2>
              <div className="text-base leading-relaxed whitespace-pre-wrap">{clause.content}</div>
            </div>
          );
        }
      });
    }

    sections_jsx.push(
      <div key="signatures" className="mt-12">
        <h2 className="text-[20px] mb-6 text-[#131718]">SIGNATURES</h2>
        <p className="text-base mb-8 leading-relaxed">
          By signing below, both parties acknowledge they have read, understood, and agree to be bound by the terms and conditions outlined in this agreement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Creator Signature */}
          <div>
            <div className="mb-6">
              <div className="border-b border-[#131718] pb-2 mb-2 h-16"></div>
              <p className="text-base font-semibold">{contractData.creatorName || "[YOUR_NAME]"}</p>
              <p className="text-base text-muted-foreground">Creator Signature</p>
            </div>
            <div>
              <div className="border-b border-[#131718] pb-2 mb-2 h-12"></div>
              <p className="text-base text-muted-foreground">Date</p>
            </div>
          </div>
          
          {/* Client Signature */}
          <div>
            <div className="mb-6">
              <div className="border-b border-[#131718] pb-2 mb-2 h-16"></div>
              <p className="text-base font-semibold">{contractData.clientName || "[CLIENT_NAME]"}</p>
              <p className="text-base text-muted-foreground">Client Signature</p>
            </div>
            <div>
              <div className="border-b border-[#131718] pb-2 mb-2 h-12"></div>
              <p className="text-base text-muted-foreground">Date</p>
            </div>
          </div>
        </div>
      </div>
    );

    sections_jsx.push(
      <div key="footer" className="mt-12 text-sm text-muted-foreground">
        Generated on {new Date().toLocaleDateString()}
      </div>
    );

    return <div className="font-['Work_Sans']">{sections_jsx}</div>;
  };

  return (
    <>
    <div ref={pageRef} className="min-h-screen bg-background text-foreground">
      {/* SVG Filter for Glass Distortion */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="glass-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="2" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </defs>
      </svg>

      {/* Desktop Toolbar - Hidden on Mobile */}
      <div className="hidden lg:flex fixed top-40 left-6 z-20 flex-col gap-3" data-zoom-control="true">
        {/* Home Button */}
        <button
          className="w-12 h-12 flex items-center justify-center bg-[#131718] text-[#FEE6EA] rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:scale-105 hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]"
          onClick={() => navigate('/builder')}
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Upload Button */}
        <button
          className="w-12 h-12 flex items-center justify-center bg-[#131718] text-[#FEE6EA] rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:scale-105 hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]"
          onClick={() => {
            document.getElementById('file-upload')?.click();
          }}
          title="Import JSON"
        >
          <Upload className="w-5 h-5" />
        </button>

        {/* Download Button with Dropdown */}
        <div className="relative" ref={downloadMenuRef}>
          <button
            className="w-12 h-12 flex items-center justify-center bg-[#131718] text-[#FEE6EA] rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:scale-105 hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]"
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            title="Download"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Dropdown Menu */}
          {showDownloadMenu && (
            <div className="absolute top-0 left-14 md:left-14 right-auto md:right-auto z-30">
              <div className="bg-[#131718] rounded-2xl shadow-lg min-w-[200px] p-2 space-y-1">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 rounded-xl transition-all duration-100 text-left"
                  onClick={() => {
                    exportJSON();
                    setShowDownloadMenu(false);
                  }}
                >
                  <FileText className="w-4 h-4" />
                  <span>Save Data (JSON)</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 rounded-xl transition-all duration-100 text-left"
                  onClick={() => {
                    exportPDF();
                    setShowDownloadMenu(false);
                  }}
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 rounded-xl transition-all duration-100 text-left"
                  onClick={() => {
                    exportMarkdown();
                    setShowDownloadMenu(false);
                  }}
                >
                  <FileText className="w-4 h-4" />
                  <span>Export Markdown</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preview Toggle Button */}
        <button
          className="w-12 h-12 flex items-center justify-center bg-[#131718] text-[#FEE6EA] rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:scale-105 hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]"
          onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
          title={viewMode === "edit" ? "Preview" : "Edit"}
        >
          {viewMode === "edit" ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
        </button>

        {/* Resources Button */}
        <button
          className="w-12 h-12 flex items-center justify-center bg-[#131718] text-[#FEE6EA] rounded-full shadow-[0_6px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(0,0,0,0.1)] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,2.2)] hover:scale-105 hover:shadow-[0_8px_8px_rgba(0,0,0,0.25),0_0_24px_rgba(0,0,0,0.15)]"
          onClick={() => navigate('/resources')}
          title="Resources"
        >
          <BookOpen className="w-5 h-5" />
        </button>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-primary/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] py-6 sm:py-6">
        <div className="pl-4 pr-4 sm:pl-6 sm:pr-6">
          <div className="flex items-center justify-between">
            {/* Left Side: Title & Tagline */}
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-semibold text-primary-foreground">
                Creator Contract Builder
              </h1>
              <p className="text-sm sm:text-sm text-[#fee6ea] mt-1">
                Professional and modular contracts for creators
              </p>
            </div>

            {/* Right Side: Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 max-w-4xl pb-24 md:pb-6 mt-3 sm:mt-0">
          {/* Hidden file input for upload button */}
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Contract Type Selection */}
          <Card className="mb-6 backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8 bg-[#131718] rounded-lg">
              <h2 className="mb-4 text-[20px] text-[#FEE6EA]">Choose Your Contract Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {contractTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => updateData("contractType", type.value as ContractData["contractType"])}
                      className={`
                        p-4 rounded-lg border transition-all duration-300 text-left
                        ${
                          contractData.contractType === type.value
                            ? "bg-[#FEE6EA] border-[#131718]"
                            : "bg-[#131718]/30 border-[#131718]/30 hover:border-[#131718] hover:bg-[#FEE6EA]/20"
                        }
                      `}
                    >
                      
                      <h3 className={`font-semibold mb-1 text-[16px] ${
                        contractData.contractType === type.value ? "text-[#131718]" : "text-[#FEE6EA]"
                      }`}>{type.label}</h3>
                      <p className={`text-xs ${
                        contractData.contractType === type.value ? "text-[#131718]/70" : "text-[#FEE6EA]/70"
                      }`}>{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="mb-6 backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              
              
              {/* Creator Information */}
              <div className="mb-6">
                <button
                  onClick={() => setCreatorInfoExpanded(!creatorInfoExpanded)}
                  className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
                >
                  <h3 className="font-semibold text-[20px]">Creator Information</h3>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${creatorInfoExpanded ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 overflow-hidden ${creatorInfoExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}`}>
                  <div>
                    <Label htmlFor="creatorName">Your Name</Label>
                    <Input
                      id="creatorName"
                      value={contractData.creatorName}
                      onChange={(e) => updateData("creatorName", e.target.value)}
                      placeholder="Your full name"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorEmail">Email</Label>
                    <Input
                      id="creatorEmail"
                      type="email"
                      value={contractData.creatorEmail}
                      onChange={(e) => updateData("creatorEmail", e.target.value)}
                      placeholder="your@email.com"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorPhone">Phone (Optional)</Label>
                    <Input
                      id="creatorPhone"
                      type="tel"
                      value={contractData.creatorPhone}
                      onChange={(e) => updateData("creatorPhone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorAddress">Street Address</Label>
                    <Input
                      id="creatorAddress"
                      value={contractData.creatorAddress}
                      onChange={(e) => updateData("creatorAddress", e.target.value)}
                      placeholder="123 Main St"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorCity">City</Label>
                    <Input
                      id="creatorCity"
                      value={contractData.creatorCity}
                      onChange={(e) => updateData("creatorCity", e.target.value)}
                      placeholder="New York"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorState">State/Province</Label>
                    <Input
                      id="creatorState"
                      value={contractData.creatorState}
                      onChange={(e) => updateData("creatorState", e.target.value)}
                      placeholder="NY"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorZip">Zip/Postal Code</Label>
                    <Input
                      id="creatorZip"
                      value={contractData.creatorZip}
                      onChange={(e) => updateData("creatorZip", e.target.value)}
                      placeholder="10001"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="creatorCountry">Country</Label>
                    <Input
                      id="creatorCountry"
                      value={contractData.creatorCountry}
                      onChange={(e) => updateData("creatorCountry", e.target.value)}
                      placeholder="United States"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="mb-6">
                <button
                  onClick={() => setClientInfoExpanded(!clientInfoExpanded)}
                  className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
                >
                  <h3 className="font-semibold text-[20px]">Client Information</h3>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${clientInfoExpanded ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 overflow-hidden ${clientInfoExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}`}>
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={contractData.clientName}
                      onChange={(e) => updateData("clientName", e.target.value)}
                      placeholder="Client or company name"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={contractData.clientEmail}
                      onChange={(e) => updateData("clientEmail", e.target.value)}
                      placeholder="client@email.com"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Phone (Optional)</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={contractData.clientPhone}
                      onChange={(e) => updateData("clientPhone", e.target.value)}
                      placeholder="+1 (555) 987-6543"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientAddress">Street Address</Label>
                    <Input
                      id="clientAddress"
                      value={contractData.clientAddress}
                      onChange={(e) => updateData("clientAddress", e.target.value)}
                      placeholder="456 Business Ave"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientCity">City</Label>
                    <Input
                      id="clientCity"
                      value={contractData.clientCity}
                      onChange={(e) => updateData("clientCity", e.target.value)}
                      placeholder="Los Angeles"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientState">State/Province</Label>
                    <Input
                      id="clientState"
                      value={contractData.clientState}
                      onChange={(e) => updateData("clientState", e.target.value)}
                      placeholder="CA"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientZip">Zip/Postal Code</Label>
                    <Input
                      id="clientZip"
                      value={contractData.clientZip}
                      onChange={(e) => updateData("clientZip", e.target.value)}
                      placeholder="90001"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientCountry">Country</Label>
                    <Input
                      id="clientCountry"
                      value={contractData.clientCountry}
                      onChange={(e) => updateData("clientCountry", e.target.value)}
                      placeholder="United States"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <button
                  onClick={() => setProjectDetailsExpanded(!projectDetailsExpanded)}
                  className="w-full flex items-center justify-between mb-3 hover:opacity-70 transition-opacity"
                >
                  <h3 className="font-semibold text-[20px]">Project Details</h3>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${projectDetailsExpanded ? 'rotate-180' : ''}`} />
                </button>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 overflow-hidden ${projectDetailsExpanded ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'}`}>
                  <div className="sm:col-span-2">
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={contractData.projectName}
                      onChange={(e) => updateData("projectName", e.target.value)}
                      placeholder="What's this project called?"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={contractData.startDate}
                      onChange={(e) => updateData("startDate", e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={contractData.endDate}
                      onChange={(e) => updateData("endDate", e.target.value)}
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Switcher with Header */}
          <Card className="mb-6 backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 bg-[#131718] rounded-lg">
              {/* Section Title & Description */}
              <div className="mb-4">
                <h2 className="mb-2 text-[20px] text-[#FEE6EA]">Contract Sections</h2>
                <p className="text-[#FEE6EA]/70 text-[16px]">
                  Each section comes pre-filled with professional contract language. Customize it to fit your needs and don't forget to delete guidelines before exporting the contract.
                </p>
              </div>

              {/* Edit/Preview Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("edit")}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
                    viewMode === "edit"
                      ? "bg-[#FEE6EA] text-[#131718] shadow-sm"
                      : "bg-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20"
                  }`}
                >
                  <span className="font-medium">Edit</span>
                </button>
                <button
                  onClick={() => setViewMode("preview")}
                  className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-300 ${
                    viewMode === "preview"
                      ? "bg-[#FEE6EA] text-[#131718] shadow-sm"
                      : "bg-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20"
                  }`}
                >
                  <span className="font-medium">Preview</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Mode */}
          {viewMode === "preview" && (
            <div className="mb-6 bg-white border border-border rounded-lg p-6 sm:p-8 md:p-10">
              {generatePreview()}
            </div>
          )}

          {/* Edit Mode - Contract Sections */}
          {viewMode === "edit" && (
            <>
          {/* Individual Section Cards */}
          <div className="space-y-4 mb-6">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card key={section.key} className="backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
                  <CardContent className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleSectionCardExpanded(section.key)}
                      aria-expanded={sectionCardExpanded[section.key] !== false}
                      className="w-full flex items-center justify-between hover:opacity-70 transition-opacity"
                    >
                      <span className="flex items-center gap-2 text-[18px] font-semibold">
                        {section.label}
                        {sectionCardExpanded[section.key] === false && contractData.sections[section.key] && (
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-[#131718] text-[#FEE6EA] flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </span>
                      <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${sectionCardExpanded[section.key] !== false ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`transition-all duration-300 overflow-hidden ${sectionCardExpanded[section.key] !== false ? 'opacity-100 max-h-[5000px] mt-3' : 'opacity-0 max-h-0'}`}>
                    <div className="flex items-start gap-3">
                        <Checkbox
                          id={section.key}
                          checked={contractData.sections[section.key]}
                          onCheckedChange={() => toggleSection(section.key)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={section.key} className="text-[16px] cursor-pointer">
                            {section.checkboxLabel}
                          </Label>
                          <p className="text-muted-foreground mt-1 text-[14px]">{section.explainer}</p>

                          {contractData.sections[section.key] && (
                            <div className="mt-3 space-y-3 animate-in slide-in-from-top-2 duration-300">
                              {section.key === "scopeOfWork" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Edit the template below or start fresh</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => loadTemplate("scopeOfWork")}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  <Textarea
                                    placeholder="Describe the work to be completed, specific tasks, and boundaries of the project..."
                                    value={contractData.scopeOfWork || getTemplateText("scopeOfWork", contractData.contractType, contractData)}
                                    onChange={(e) => updateData("scopeOfWork", e.target.value)}
                                    rows={8}
                                    className="text-sm"
                                  />
                                </>
                              )}

                              {section.key === "deliverables" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Edit the template below or start fresh</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => loadTemplate("deliverables")}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  <Textarea
                                    placeholder="List all deliverables (e.g., 3 Instagram posts, 1 YouTube video, source files)..."
                                    value={contractData.deliverables || getTemplateText("deliverables", contractData.contractType, contractData)}
                                    onChange={(e) => updateData("deliverables", e.target.value)}
                                    rows={8}
                                    className="text-sm"
                                  />
                                </>
                              )}

                              {section.key === "timeline" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Edit the template below or start fresh</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => loadTemplate("timeline")}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  <Textarea
                                    placeholder="Define milestones, deadlines, and delivery schedule..."
                                    value={contractData.timeline || getTemplateText("timeline", contractData.contractType, contractData)}
                                    onChange={(e) => updateData("timeline", e.target.value)}
                                    rows={8}
                                    className="text-sm"
                                  />
                                </>
                              )}

                              {section.key === "payment" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Choose a preset or customize</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => loadTemplate("paymentTerms")}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  
                                  {/* Payment Presets */}
                                  <div className="grid grid-cols-3 gap-2 mb-3">
                                    <button
                                      onClick={() => {
                                        const newSchedule = "100% upfront";
                                        setContractData((prev) => ({
                                          ...prev,
                                          paymentSchedule: newSchedule,
                                          paymentTerms: getTemplateText("paymentTerms", prev.contractType, { ...prev, paymentSchedule: newSchedule }),
                                        }));
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.paymentSchedule === "100% upfront"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Protective</div>
                                      <div className={`transition-colors ${contractData.paymentSchedule === "100% upfront" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>100% upfront</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const newSchedule = "50% upfront, 50% on delivery";
                                        setContractData((prev) => ({
                                          ...prev,
                                          paymentSchedule: newSchedule,
                                          paymentTerms: getTemplateText("paymentTerms", prev.contractType, { ...prev, paymentSchedule: newSchedule }),
                                        }));
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.paymentSchedule === "50% upfront, 50% on delivery"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Standard</div>
                                      <div className={`transition-colors ${contractData.paymentSchedule === "50% upfront, 50% on delivery" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>50/50 split</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const newSchedule = "Net 30 payment terms";
                                        setContractData((prev) => ({
                                          ...prev,
                                          paymentSchedule: newSchedule,
                                          paymentTerms: getTemplateText("paymentTerms", prev.contractType, { ...prev, paymentSchedule: newSchedule }),
                                        }));
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.paymentSchedule === "Net 30 payment terms"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Flexible</div>
                                      <div className={`transition-colors ${contractData.paymentSchedule === "Net 30 payment terms" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>Net 30 terms</div>
                                    </button>
                                  </div>
                                  
                                  {/* Pricing Help Link */}
                                  <div className="mb-3 p-2 bg-[#FEE6EA] rounded-lg">
                                    <p className="text-[10px] text-[#131718] font-bold">
                                      Not sure how to price your work?{" "}
                                      <a 
                                        href="http://creatorpricing.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#131718] underline hover:text-[#131718]/80 transition-colors"
                                      >
                                        Check out CreatorPricing.com
                                      </a>
                                      {" "}for rate guidance
                                    </p>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex gap-2">
                                      <CustomDropdown
                                        value={contractData.currency}
                                        onChange={(value) => updateData("currency", value)}
                                        options={[
                                          { value: "USD", label: "USD $" },
                                          { value: "EUR", label: "EUR €" },
                                          { value: "GBP", label: "GBP £" },
                                          { value: "CAD", label: "CAD $" },
                                          { value: "AUD", label: "AUD $" },
                                          { value: "JPY", label: "JPY ¥" },
                                          { value: "CNY", label: "CNY ¥" },
                                          { value: "INR", label: "INR ₹" },
                                          { value: "BRL", label: "BRL R$" },
                                          { value: "MXN", label: "MXN $" },
                                          { value: "USDT", label: "USDT" },
                                          { value: "USDC", label: "USDC" },
                                          { value: "DAI", label: "DAI" },
                                          { value: "BUSD", label: "BUSD" },
                                          { value: "EURC", label: "EURC" },
                                          { value: "USDGLO", label: "USDGLO" },
                                        ]}
                                        className="w-32"
                                      />
                                      <Textarea
                                        placeholder="Total amount for the project (e.g., &quot;5000&quot;)"
                                        value={contractData.paymentAmount}
                                        onChange={(e) => updateData("paymentAmount", e.target.value)}
                                        rows={1}
                                        className="flex-1 text-sm min-h-0"
                                      />
                                    </div>
                                    <Textarea
                                      placeholder="Payment schedule and milestone breakdown (e.g., &quot;50% upfront, 50% on delivery&quot;)"
                                      value={contractData.paymentSchedule}
                                      onChange={(e) => updateData("paymentSchedule", e.target.value)}
                                      rows={1}
                                      className="text-sm min-h-0"
                                    />
                                  </div>

                                  {/* Payment Method Section */}
                                  <div className="mt-4 space-y-3">
                                    <Label className="text-sm font-semibold">Payment Method Details</Label>
                                    <CustomDropdown
                                      value={contractData.paymentMethod}
                                      onChange={(value) => updateData("paymentMethod", value)}
                                      options={[
                                        { value: "", label: "Select payment method..." },
                                        { value: "bank", label: "Bank Transfer" },
                                        { value: "paypal", label: "PayPal" },
                                        { value: "venmo", label: "Venmo" },
                                        { value: "zelle", label: "Zelle" },
                                        { value: "crypto", label: "Cryptocurrency" },
                                      ]}
                                      placeholder="Select payment method..."
                                    />

                                    {contractData.paymentMethod === "bank" && (
                                      <>
                                        <Input
                                          placeholder="Bank Name"
                                          value={contractData.paymentDetails.bankName}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, bankName: e.target.value })}
                                          className="text-sm"
                                        />
                                        <Input
                                          placeholder="Account Name"
                                          value={contractData.paymentDetails.accountName}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, accountName: e.target.value })}
                                          className="text-sm"
                                        />
                                        <Input
                                          placeholder="Account Number"
                                          value={contractData.paymentDetails.accountNumber}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, accountNumber: e.target.value })}
                                          className="text-sm"
                                        />
                                        <Input
                                          placeholder="Routing Number"
                                          value={contractData.paymentDetails.routingNumber}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, routingNumber: e.target.value })}
                                          className="text-sm"
                                        />
                                        <Input
                                          placeholder="SWIFT/BIC (for international transfers, optional)"
                                          value={contractData.paymentDetails.swiftBic}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, swiftBic: e.target.value })}
                                          className="text-sm"
                                        />
                                      </>
                                    )}

                                    {contractData.paymentMethod === "paypal" && (
                                      <Input
                                        placeholder="PayPal Email Address"
                                        type="email"
                                        value={contractData.paymentDetails.paypalEmail}
                                        onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, paypalEmail: e.target.value })}
                                        className="text-sm"
                                      />
                                    )}

                                    {contractData.paymentMethod === "venmo" && (
                                      <Input
                                        placeholder="Venmo Username or Phone Number"
                                        value={contractData.paymentDetails.venmoHandle}
                                        onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, venmoHandle: e.target.value })}
                                        className="text-sm"
                                      />
                                    )}

                                    {contractData.paymentMethod === "zelle" && (
                                      <Input
                                        placeholder="Zelle Email or Phone Number"
                                        value={contractData.paymentDetails.zelleInfo}
                                        onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, zelleInfo: e.target.value })}
                                        className="text-sm"
                                      />
                                    )}

                                    {contractData.paymentMethod === "crypto" && (
                                      <>
                                        <Input
                                          placeholder="Wallet Address"
                                          value={contractData.paymentDetails.cryptoWallet}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, cryptoWallet: e.target.value })}
                                          className="text-sm"
                                        />
                                        <Input
                                          placeholder="Network (e.g., Ethereum, Bitcoin, Solana)"
                                          value={contractData.paymentDetails.cryptoNetwork}
                                          onChange={(e) => updateData("paymentDetails", { ...contractData.paymentDetails, cryptoNetwork: e.target.value })}
                                          className="text-sm"
                                        />
                                      </>
                                    )}
                                  </div>

                                  <Textarea
                                    placeholder="Additional payment terms (payment method, late fees, etc.)..."
                                    value={contractData.paymentTerms || getTemplateText("paymentTerms", contractData.contractType, contractData)}
                                    onChange={(e) => updateData("paymentTerms", e.target.value)}
                                    rows={8}
                                    className="text-sm"
                                  />
                                </>
                              )}

                              {section.key === "rights" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Choose your tier - this determines what the client can do with your work</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => loadTemplate("rightsUsage")}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  
                                  {/* Rights Presets */}
                                  <div className="mb-2">
                                    
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 mb-3">
                                    <button
                                      onClick={() => {
                                        updateData("rightsUsage", `Upon full payment, ${contractData.creatorName || "[YOUR_NAME]"} retains full copyright ownership. ${contractData.clientName || "[CLIENT_NAME]"} receives a limited, non-exclusive license to use the work for the agreed purpose only. [NON-EXCLUSIVE means you keep the right to sell or license this same work to other clients. Delete this explanation before sending.]\n\nUsage restrictions:\n• Work may not be modified without permission\n• Work may not be resold or sublicensed\n• Attribution required in all uses\n• License expires after 1 year\n\nCreator retains:\n• Full copyright and moral rights\n• Right to sell to other clients\n• Right to display in portfolio\n• Right to create derivatives`);
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.rightsUsage?.includes("limited, non-exclusive license")
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Protective</div>
                                      <div className={`transition-colors ${contractData.rightsUsage?.includes("limited, non-exclusive license") ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>You keep ownership</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateData("rightsUsage", getTemplateText("rightsUsage", contractData.contractType, contractData));
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        !contractData.rightsUsage?.includes("limited, non-exclusive license") && 
                                        !contractData.rightsUsage?.includes("full, exclusive, unlimited rights") &&
                                        contractData.rightsUsage
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Standard</div>
                                      <div className={`transition-colors ${
                                        !contractData.rightsUsage?.includes("limited, non-exclusive license") && 
                                        !contractData.rightsUsage?.includes("full, exclusive, unlimited rights") &&
                                        contractData.rightsUsage
                                          ? "text-[#131718]/70" 
                                          : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"
                                      }`}>Most client projects</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateData("rightsUsage", `Upon full payment, ${contractData.clientName || "[CLIENT_NAME]"} receives full, exclusive, unlimited rights to the work including copyright ownership. [FULL TRANSFER / BUYOUT means the client owns everything - you cannot use, display, or sell this work again. Only choose this for premium pricing. Delete this explanation before sending.]\n\nRights transferred:\n• Complete copyright ownership\n• Worldwide, perpetual usage\n• Right to modify without permission\n• Right to resell or sublicense\n• No attribution required\n\nCreator retains:\n• Right to display work in portfolio (with credit)\n• Cannot create similar work for competitors for 1 year`);
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.rightsUsage?.includes("full, exclusive, unlimited rights")
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Full Transfer</div>
                                      <div className={`transition-colors ${contractData.rightsUsage?.includes("full, exclusive, unlimited rights") ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>Client owns everything</div>
                                    </button>
                                  </div>

                                  {/* Educational footnote */}
                                  

                                  {/* Supplementary Rights Clause Options */}
                                  <div className="mb-3 pt-3 border-t border-[#131718]" style={{ borderTopWidth: '1px' }}>
                                    <div className="mb-2 text-[12px] text-[#4A4A4A]">Optional add-ons for cross-category projects:</div>
                                    
                                    <div className="flex flex-wrap gap-1.5">
                                      {/* Only show UGC/Influencer for Digital and Physical contracts (Content already covers this) */}
                                      {(contractData.contractType === "digital" || contractData.contractType === "physical") && (
                                        <button
                                          onClick={() => {
                                            if (contractData.rightsUsage?.includes("UGC & INFLUENCER USAGE RIGHTS")) {
                                              const currentText = contractData.rightsUsage || "";
                                              const updatedText = currentText.replace(/\n\nUGC & INFLUENCER USAGE RIGHTS:[\s\S]*?(?=\n\n[A-Z]|\n\n$|$)/g, "");
                                              updateData("rightsUsage", updatedText.trim());
                                            } else {
                                              updateData("rightsUsage", `${contractData.rightsUsage || getTemplateText("rightsUsage", contractData.contractType, contractData)}\n\nUGC & INFLUENCER USAGE RIGHTS:\n• Content may be used for organic social media posts on agreed platforms\n• Paid advertising/whitelisting requires additional $[AMOUNT] licensing fee\n• Usage period: [DURATION, e.g., "6 months from posting date"]\n• Content may not be edited without creator approval\n• Creator must be tagged in all uses (@[HANDLE])\n• Client may repurpose content across owned channels\n• Usage on new platforms requires written approval`);
                                            }
                                          }}
                                          className={`text-[10px] px-2 py-1 border rounded transition-all ${
                                            contractData.rightsUsage?.includes("UGC & INFLUENCER USAGE RIGHTS")
                                              ? "bg-[#131718] border-[#131718] text-[#FEE6EA]"
                                              : "bg-transparent border-[#131718] text-[#131718]"
                                          }`}
                                        >
                                          + UGC / Influencer
                                        </button>
                                      )}
                                      
                                      {/* Only show Physical for Digital and Content contracts (Physical already covers this) */}
                                      {(contractData.contractType === "digital" || contractData.contractType === "content") && (
                                        <button
                                          onClick={() => {
                                            if (contractData.rightsUsage?.includes("PHYSICAL PRODUCT RIGHTS")) {
                                              const currentText = contractData.rightsUsage || "";
                                              const updatedText = currentText.replace(/\n\nPHYSICAL PRODUCT RIGHTS:[\s\S]*?(?=\n\n[A-Z]|\n\n$|$)/g, "");
                                              updateData("rightsUsage", updatedText.trim());
                                            } else {
                                              updateData("rightsUsage", `${contractData.rightsUsage || getTemplateText("rightsUsage", contractData.contractType, contractData)}\n\nPHYSICAL PRODUCT RIGHTS:\n• Client owns the physical item(s) created\n• Creator retains copyright to the design and concept\n• Client may photograph and display items freely\n• Mass production (>10 units) requires additional licensing agreement\n• Creator retains right to create similar designs for other clients\n• Client must credit creator if items are displayed publicly or in media\n• Designs may not be reverse-engineered or replicated`);
                                            }
                                          }}
                                          className={`text-[10px] px-2 py-1 border rounded transition-all ${
                                            contractData.rightsUsage?.includes("PHYSICAL PRODUCT RIGHTS")
                                              ? "bg-[#131718] border-[#131718] text-[#FEE6EA]"
                                              : "bg-transparent border-[#131718] text-[#131718]"
                                          }`}
                                        >
                                          + Physical Product
                                        </button>
                                      )}
                                      
                                      {/* Show Web3/NFT for all contract types as supplementary */}
                                      <button
                                        onClick={() => {
                                          if (contractData.rightsUsage?.includes("WEB3 / NFT RIGHTS")) {
                                            const currentText = contractData.rightsUsage || "";
                                            const updatedText = currentText.replace(/\n\nWEB3 \/ NFT RIGHTS:[\s\S]*?(?=\n\n[A-Z]|\n\n$|$)/g, "");
                                            updateData("rightsUsage", updatedText.trim());
                                          } else {
                                            updateData("rightsUsage", `${contractData.rightsUsage || getTemplateText("rightsUsage", contractData.contractType, contractData)}\n\nWEB3 / NFT RIGHTS:\n• Smart contract address: [WALLET_ADDRESS]\n• Creator retains copyright to artwork/design\n• Client receives token ownership and display rights\n• Secondary sales: [PERCENTAGE]% royalty to creator on-chain\n• Commercial usage: [Allowed/Not Allowed without additional licensing]\n• Creator may create similar work but not identical mints\n• Intellectual property rights separate from token ownership\n• If project includes on-chain deliverables, completed work will be transferred to client wallet: [ADDRESS]`);
                                          }
                                        }}
                                        className={`text-[10px] px-2 py-1 border rounded transition-all ${
                                          contractData.rightsUsage?.includes("WEB3 / NFT RIGHTS")
                                            ? "bg-[#131718] border-[#131718] text-[#FEE6EA]"
                                            : "bg-transparent border-[#131718] text-[#131718]"
                                        }`}
                                      >
                                        + Web3 / NFT
                                      </button>
                                      
                                      {/* Show Royalty-Based Licensing for all contract types as supplementary */}
                                      <button
                                        onClick={() => {
                                          if (contractData.rightsUsage?.includes("ROYALTY-BASED LICENSING")) {
                                            const currentText = contractData.rightsUsage || "";
                                            const updatedText = currentText.replace(/\n\nROYALTY-BASED LICENSING:[\s\S]*?(?=\n\n[A-Z]|\n\n$|$)/g, "");
                                            updateData("rightsUsage", updatedText.trim());
                                          } else {
                                            updateData("rightsUsage", `${contractData.rightsUsage || getTemplateText("rightsUsage", contractData.contractType, contractData)}\n\nROYALTY-BASED LICENSING:\n• Base license fee: $[AMOUNT] [Typical range: $500-$5,000 depending on scope. This covers your design/creation time upfront.]\n• Royalty rate: [PERCENTAGE]% of wholesale price OR $[AMOUNT] per unit sold [Standard rates: 5-8% for mass market products, 10-15% for premium/niche products, 15-20% for luxury. Per-unit rates: $0.50-$2 for affordable items like stickers/prints, $2-$10 for apparel/home goods, $10+ for high-end products. Always base percentage on wholesale price, NOT retail, to avoid disputes.]\n• Royalty applies to: [Specify exactly which products, e.g., "Each t-shirt, tote bag, and mug sold featuring this design" - be specific to avoid scope creep]\n• Minimum guarantee: $[AMOUNT] per [year/quarter] [Typical: 2-4x your base fee annually, or $1,000-$10,000 depending on client size. This protects you if sales are low.]\n• Payment schedule: Royalties paid [monthly/quarterly] within [15/30] days of period end, with detailed sales report\n• Audit rights: Creator may request sales documentation and inventory records once per year with 30 days notice\n• Royalty period: [In perpetuity / 2-5 years from first sale] [Perpetual is standard for merchandise. Time-limited (2-5 years) works for trending/seasonal designs.]\n• Definition of net/wholesale price: [Wholesale price means the amount Client charges retailers, NOT the final retail price. Exclude taxes, shipping, and returns from royalty calculation.]\n• Client must provide detailed sales reports within [15] days of period end showing units sold, wholesale price, and royalty calculation\n\n[MARKET GUIDANCE - Delete before sending: Royalty licensing works best when the client is established and will actually sell volume. For small/new brands, consider flat fee instead. Always get a minimum guarantee that covers at least your opportunity cost. If client refuses audit rights or minimum guarantee, that's a red flag. Mass-market products (Walmart, Target) typically pay lower % but higher volume. Boutique/luxury pays higher % but lower volume. Never accept royalties on "net profit" - it's too easy to manipulate. Always use wholesale/gross price.]`);
                                          }
                                        }}
                                        className={`text-[10px] px-2 py-1 border rounded transition-all ${
                                          contractData.rightsUsage?.includes("ROYALTY-BASED LICENSING")
                                            ? "bg-[#131718] border-[#131718] text-[#FEE6EA]"
                                            : "bg-transparent border-[#131718] text-[#131718]"
                                        }`}
                                      >
                                        + Royalty Licensing
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <Textarea
                                    placeholder="Specify usage rights, licensing terms, and intellectual property ownership..."
                                    value={contractData.rightsUsage || getTemplateText("rightsUsage", contractData.contractType, contractData)}
                                    onChange={(e) => updateData("rightsUsage", e.target.value)}
                                    rows={8}
                                    className="text-sm"
                                  />
                                </>
                              )}

                              {section.key === "revisions" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Choose a preset or customize</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        loadTemplate("revisionsLimit");
                                        loadTemplate("revisionsTimeline");
                                        updateData("revisionsDefinition", "");
                                        updateData("revisionsOverflow", "");
                                        updateData("revisionsAdditional", "");
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>

                                  {/* Revision Presets */}
                                  <div className="grid grid-cols-3 gap-2 mb-3">
                                    <button
                                      onClick={() => {
                                        updateData("revisionsLimit", "1 round of revisions");
                                        updateData("revisionsTimeline", "3 business days");
                                        updateData("revisionsDefinition", "A revision is a single set of changes submitted together as one batch. New concepts, scope changes, or style direction changes do not count as revisions and require a new agreement.");
                                        updateData("revisionsOverflow", `Additional revisions available at ${getCurrencySymbol(contractData.currency)}[AMOUNT] per round. Each additional round follows the same scope rules.`);
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.revisionsLimit === "1 round of revisions"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Protective</div>
                                      <div className={`transition-colors ${contractData.revisionsLimit === "1 round of revisions" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>1 round, tight scope</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateData("revisionsLimit", "2 rounds of revisions");
                                        updateData("revisionsTimeline", "5 business days");
                                        updateData("revisionsDefinition", "A revision is a consolidated set of feedback and requested changes delivered as one batch. Each round allows reasonable modifications to the existing deliverables. Requests that significantly alter the project direction, concept, or scope are considered new work.");
                                        updateData("revisionsOverflow", `Additional revisions available at ${getCurrencySymbol(contractData.currency)}[AMOUNT] per round, subject to Creator availability.`);
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.revisionsLimit === "2 rounds of revisions"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Standard</div>
                                      <div className={`transition-colors ${contractData.revisionsLimit === "2 rounds of revisions" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>2 rounds, balanced</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateData("revisionsLimit", "3 rounds of revisions");
                                        updateData("revisionsTimeline", "7 business days");
                                        updateData("revisionsDefinition", "A revision is any set of requested changes to existing deliverables. Each round may include multiple items of feedback. Feedback should be consolidated into a single document or message per round.");
                                        updateData("revisionsOverflow", `Additional revisions available at ${getCurrencySymbol(contractData.currency)}[AMOUNT] per round or on a case-by-case basis.`);
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.revisionsLimit === "3 rounds of revisions"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Flexible</div>
                                      <div className={`transition-colors ${contractData.revisionsLimit === "3 rounds of revisions" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>3 rounds, generous</div>
                                    </button>
                                  </div>

                                  {/* Educational Note */}
                                  <div className="mb-3 p-2 bg-[#FEE6EA] rounded-lg">
                                    <p className="text-[10px] text-[#131718]">
                                      <span className="font-bold">Why this matters:</span> Without a clear revisions policy, clients can request unlimited changes and turn a small project into weeks of unpaid work. Always define what counts as a "revision" versus "new work" so you're protected from scope creep.
                                    </p>
                                  </div>

                                  {/* Core Fields */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Revision Limit</Label>
                                      <Textarea
                                        placeholder="Maximum number of revision rounds included in this contract (e.g., '2 rounds of revisions')"
                                        value={contractData.revisionsLimit}
                                        onChange={(e) => updateData("revisionsLimit", e.target.value)}
                                        rows={1}
                                        className="text-sm min-h-0"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Request Window</Label>
                                      <Textarea
                                        placeholder="Time window for submitting revision requests (e.g., 'within 5 business days of delivery')"
                                        value={contractData.revisionsTimeline}
                                        onChange={(e) => updateData("revisionsTimeline", e.target.value)}
                                        rows={1}
                                        className="text-sm min-h-0"
                                      />
                                    </div>
                                  </div>

                                  {/* What Counts as a Revision */}
                                  <div className="mb-3">
                                    <Label className="text-xs text-muted-foreground mb-2 block">What Counts as a Revision</Label>
                                    <Textarea
                                      placeholder="Define what qualifies as a revision vs. new work (e.g., 'A revision is a single batch of changes to existing deliverables. New concepts or direction changes are new work.')"
                                      value={contractData.revisionsDefinition}
                                      onChange={(e) => updateData("revisionsDefinition", e.target.value)}
                                      rows={3}
                                      className="text-sm"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      This is the single most important part of your revisions policy. Clients often don't realize they're asking for entirely new work.
                                    </p>
                                  </div>

                                  {/* Overflow / Additional Revisions */}
                                  <div className="mb-3">
                                    <Label className="text-xs text-muted-foreground mb-2 block">Additional Revisions Policy</Label>
                                    <Textarea
                                      placeholder="Additional revision cost (e.g., 150 per extra round)"
                                      value={contractData.revisionsOverflow}
                                      onChange={(e) => updateData("revisionsOverflow", e.target.value)}
                                      rows={2}
                                      className="text-sm"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      What happens when included revisions are used up? Setting a per-round fee discourages endless back-and-forth.
                                    </p>
                                  </div>

                                  {/* Additional Terms */}
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-2 block">Additional Terms (optional)</Label>
                                    <Textarea
                                      placeholder="e.g., All feedback must be sent in one consolidated message per round..."
                                      value={contractData.revisionsAdditional}
                                      onChange={(e) => updateData("revisionsAdditional", e.target.value)}
                                      rows={3}
                                      className="text-sm"
                                    />
                                  </div>
                                </>
                              )}

                              {section.key === "cancellation" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Choose a preset or customize</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        loadTemplate("cancellationNotice");
                                        loadTemplate("cancellationFee");
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  
                                  {/* Cancellation Presets */}
                                  <div className="grid grid-cols-3 gap-2 mb-3">
                                    <button
                                      onClick={() => {
                                        updateData("cancellationNotice", "14 days written notice required");
                                        updateData("cancellationFee", "100% of project fee if work has started. 50% deposit non-refundable under all circumstances.");
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.cancellationNotice === "14 days written notice required"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Protective</div>
                                      <div className={`transition-colors ${contractData.cancellationNotice === "14 days written notice required" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>Strict terms</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateData("cancellationNotice", getTemplateText("cancellationNotice", contractData.contractType, contractData));
                                        updateData("cancellationFee", getTemplateText("cancellationFee", contractData.contractType, contractData));
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.cancellationNotice === getTemplateText("cancellationNotice", contractData.contractType, contractData)
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Standard</div>
                                      <div className={`transition-colors ${contractData.cancellationNotice === getTemplateText("cancellationNotice", contractData.contractType, contractData) ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>Balanced</div>
                                    </button>
                                    <button
                                      onClick={() => {
                                        updateData("cancellationNotice", "3 business days notice");
                                        updateData("cancellationFee", "Deposit refundable minus 10% processing fee if cancelled before work begins. Pro-rated fee based on work completed if cancelled mid-project.");
                                      }}
                                      className={`group p-3 text-xs border rounded-lg transition-all text-left ${
                                        contractData.cancellationNotice === "3 business days notice"
                                          ? "bg-[#FEE6EA] border-[#131718] text-[#131718]"
                                          : "bg-[#131718] border-[#131718]/30 text-[#FEE6EA] hover:bg-[#FEE6EA]/20 hover:border-[#131718] hover:text-[#131718]"
                                      }`}
                                    >
                                      <div className="font-semibold mb-1">Flexible</div>
                                      <div className={`transition-colors ${contractData.cancellationNotice === "3 business days notice" ? "text-[#131718]/70" : "text-[#FEE6EA]/70 group-hover:text-[#131718]/70"}`}>Client-friendly</div>
                                    </button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                    <Input
                                      placeholder="Notice period (e.g., 7 days)"
                                      value={contractData.cancellationNotice || getTemplateText("cancellationNotice", contractData.contractType, contractData)}
                                      onChange={(e) => updateData("cancellationNotice", e.target.value)}
                                      className="text-sm"
                                    />
                                    <Input
                                      placeholder="Cancellation fee (e.g., 25% of total)"
                                      value={contractData.cancellationFee || getTemplateText("cancellationFee", contractData.contractType, contractData)}
                                      onChange={(e) => updateData("cancellationFee", e.target.value)}
                                      className="text-sm"
                                    />
                                  </div>
                                  
                                  {/* Additional Terms */}
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-2 block">Additional Terms (optional)</Label>
                                    <Textarea
                                      placeholder="Add kill fees, payment protection, or other specific cancellation terms..."
                                      value={contractData.cancellationAdditional}
                                      onChange={(e) => updateData("cancellationAdditional", e.target.value)}
                                      rows={3}
                                      className="text-sm"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      Use this for kill fees (e.g., "50% fee if cancelled mid-project"), payment protection, or any other specific terms.
                                    </p>
                                  </div>
                                </>
                              )}

                              {section.key === "confidentiality" && (
                                <>
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-muted-foreground">Select the provisions you want to include</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        const generatedText = generateConfidentialityText(
                                          contractData.contractType,
                                          contractData,
                                          contractData.confidentialitySubclauses
                                        );
                                        updateData("confidentialityTerms", generatedText);
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Regenerate Text
                                    </Button>
                                  </div>
                                  
                                  {/* Confidentiality Subclauses */}
                                  <div className="space-y-2 mb-4 p-3 bg-[#FEE6EA] rounded-lg border border-[#131718]">
                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="defineConfidential"
                                        checked={contractData.confidentialitySubclauses.defineConfidential}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, defineConfidential: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="defineConfidential" className="text-xs font-semibold cursor-pointer">
                                          Define Confidential Information
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          Clearly specify what information must be kept private
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="exclusions"
                                        checked={contractData.confidentialitySubclauses.exclusions}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, exclusions: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="exclusions" className="text-xs font-semibold cursor-pointer">
                                          Exclusions from Confidentiality
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          Public info, independently developed work, legally required disclosures
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="portfolioRights"
                                        checked={contractData.confidentialitySubclauses.portfolioRights}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, portfolioRights: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="portfolioRights" className="text-xs font-semibold cursor-pointer">
                                          Portfolio & Case Study Rights
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          Permission to showcase work in your portfolio
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="socialMediaRights"
                                        checked={contractData.confidentialitySubclauses.socialMediaRights}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, socialMediaRights: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="socialMediaRights" className="text-xs font-semibold cursor-pointer">
                                          Social Media & Public Announcements
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          Rules for announcing and sharing the collaboration
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="teamDisclosure"
                                        checked={contractData.confidentialitySubclauses.teamDisclosure}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, teamDisclosure: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="teamDisclosure" className="text-xs font-semibold cursor-pointer">
                                          Team Member Disclosures
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          Permission to share info with assistants, contractors, advisors
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="duration"
                                        checked={contractData.confidentialitySubclauses.duration}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, duration: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="duration" className="text-xs font-semibold cursor-pointer">
                                          Duration of Confidentiality
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          How long confidentiality obligations last
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="returnMaterials"
                                        checked={contractData.confidentialitySubclauses.returnMaterials}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, returnMaterials: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="returnMaterials" className="text-xs font-semibold cursor-pointer">
                                          Return or Destruction of Materials
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          What happens to confidential materials after project ends
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex items-start space-x-2">
                                      <Checkbox
                                        id="breachRemedies"
                                        checked={contractData.confidentialitySubclauses.breachRemedies}
                                        onCheckedChange={(checked) => {
                                          const updated = { ...contractData.confidentialitySubclauses, breachRemedies: checked as boolean };
                                          updateData("confidentialitySubclauses", updated);
                                          const generatedText = generateConfidentialityText(contractData.contractType, contractData, updated);
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                      />
                                      <div className="flex-1">
                                        <Label htmlFor="breachRemedies" className="text-xs font-semibold cursor-pointer">
                                          Breach and Remedies
                                        </Label>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                          Legal consequences for violating confidentiality
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Duration and Timing Settings */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Confidentiality Duration</Label>
                                      <Input
                                        placeholder="e.g., 3 years"
                                        value={contractData.confidentialityDuration}
                                        onChange={(e) => {
                                          updateData("confidentialityDuration", e.target.value);
                                          const generatedText = generateConfidentialityText(
                                            contractData.contractType,
                                            { ...contractData, confidentialityDuration: e.target.value },
                                            contractData.confidentialitySubclauses
                                          );
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                        className="text-sm"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Portfolio Usage Timing</Label>
                                      <Input
                                        placeholder="e.g., upon project completion"
                                        value={contractData.portfolioUsageDelay}
                                        onChange={(e) => {
                                          updateData("portfolioUsageDelay", e.target.value);
                                          const generatedText = generateConfidentialityText(
                                            contractData.contractType,
                                            { ...contractData, portfolioUsageDelay: e.target.value },
                                            contractData.confidentialitySubclauses
                                          );
                                          updateData("confidentialityTerms", generatedText);
                                        }}
                                        className="text-sm"
                                      />
                                    </div>
                                  </div>

                                  {/* Preview/Edit Area */}
                                  <div>
                                    <Label className="text-xs text-muted-foreground mb-2 block">Generated Confidentiality Agreement (editable)</Label>
                                    <Textarea
                                      placeholder="Define confidentiality requirements and NDA terms..."
                                      value={contractData.confidentialityTerms || generateConfidentialityText(contractData.contractType, contractData, contractData.confidentialitySubclauses)}
                                      onChange={(e) => updateData("confidentialityTerms", e.target.value)}
                                      rows={12}
                                      className="font-mono text-sm"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      The text above is automatically generated based on your selections. You can edit it directly if needed.
                                    </p>
                                  </div>
                                </>
                              )}

                              {section.key === "jurisdiction" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Auto-filled from your contact info (customize as needed)</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        loadTemplate("governingLaw");
                                        loadTemplate("jurisdictionVenue");
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 gap-3">
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Governing Law</Label>
                                      <Input
                                        placeholder="State or country (e.g., State of California)"
                                        value={contractData.governingLaw || getTemplateText("governingLaw", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("governingLaw", e.target.value)}
                                        className="text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Auto-filled from your state/country. Customize if needed.
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Jurisdiction (Venue)</Label>
                                      <Input
                                        placeholder="Court location (e.g., Courts of Los Angeles, California)"
                                        value={contractData.jurisdictionVenue || getTemplateText("jurisdictionVenue", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("jurisdictionVenue", e.target.value)}
                                        className="text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Auto-filled from your city/state. Customize if needed.
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}

                              {section.key === "liability" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Protects both parties with clear legal boundaries</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        loadTemplate("independentContractorTerms");
                                        loadTemplate("liabilityLimit");
                                        loadTemplate("indemnificationTerms");
                                        loadTemplate("warrantyTerms");
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Independent Contractor Clause</Label>
                                      <Textarea
                                        placeholder="Clarifies the working relationship is not employer-employee..."
                                        value={contractData.independentContractorTerms || getTemplateText("independentContractorTerms", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("independentContractorTerms", e.target.value)}
                                        rows={6}
                                        className="font-mono text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Critical for tax purposes. Establishes you are not an employee of the client.
                                      </p>
                                    </div>

                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Limitation of Liability</Label>
                                      <Textarea
                                        placeholder="Caps your financial exposure to the contract value..."
                                        value={contractData.liabilityLimit || getTemplateText("liabilityLimit", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("liabilityLimit", e.target.value)}
                                        rows={6}
                                        className="font-mono text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Caps your maximum liability so a client cannot sue for damages exceeding what they paid you.
                                      </p>
                                    </div>

                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Indemnification</Label>
                                      <Textarea
                                        placeholder="Specifies who holds who harmless for third-party claims..."
                                        value={contractData.indemnificationTerms || getTemplateText("indemnificationTerms", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("indemnificationTerms", e.target.value)}
                                        rows={6}
                                        className="font-mono text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Protects you if a client uses your work in a way that gets them sued by a third party.
                                      </p>
                                    </div>

                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Warranties & Representations</Label>
                                      <Textarea
                                        placeholder="Both parties warrant they have authority and work is original..."
                                        value={contractData.warrantyTerms || getTemplateText("warrantyTerms", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("warrantyTerms", e.target.value)}
                                        rows={6}
                                        className="font-mono text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Provides baseline assurance that your work is original and doesn't infringe on anyone's rights.
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}

                              {section.key === "disputeResolution" && (
                                <>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">How disagreements are handled before going to court</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        loadTemplate("disputeResolutionTerms");
                                        loadTemplate("forceMajeureTerms");
                                      }}
                                      className="h-7 text-xs"
                                    >
                                      Reset Template
                                    </Button>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Dispute Resolution Process</Label>
                                      <Textarea
                                        placeholder="Establishes negotiation, mediation, then arbitration/litigation steps..."
                                        value={contractData.disputeResolutionTerms || getTemplateText("disputeResolutionTerms", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("disputeResolutionTerms", e.target.value)}
                                        rows={8}
                                        className="font-mono text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Establishes a step-by-step process (negotiate, mediate, then litigate) which saves both parties significant legal fees.
                                      </p>
                                    </div>

                                    <div>
                                      <Label className="text-xs text-muted-foreground mb-2 block">Force Majeure</Label>
                                      <Textarea
                                        placeholder="Protects both parties from events beyond their control..."
                                        value={contractData.forceMajeureTerms || getTemplateText("forceMajeureTerms", contractData.contractType, contractData)}
                                        onChange={(e) => updateData("forceMajeureTerms", e.target.value)}
                                        rows={8}
                                        className="font-mono text-sm"
                                      />
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        Protects both parties from liability when events outside anyone's control (natural disasters, pandemics, platform outages) prevent contract fulfillment.
                                      </p>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

          {/* Custom Clauses */}
          <Card className="mb-6 backdrop-blur-2xl bg-card/80 border-border shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <button
                onClick={() => setCustomClausesExpanded(!customClausesExpanded)}
                className="w-full flex items-center justify-between mb-4 hover:opacity-70 transition-opacity"
              >
                <h2 className="text-[20px]">Custom Clauses</h2>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${customClausesExpanded ? 'rotate-180' : ''}`} />
              </button>
              <div className={`transition-all duration-300 overflow-hidden ${customClausesExpanded ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0'}`}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-muted-foreground text-[16px]">
                  Add custom terms specific to your project
                </p>
                <Button onClick={addCustomClause} size="sm">
                  Add Clause
                </Button>
              </div>

              {contractData.customClauses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No custom clauses yet. Click "Add Clause" to create one!</p>
                </div>
              )}

              <div className="space-y-4">
                {contractData.customClauses.map((clause) => (
                  <div key={clause.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Input
                          placeholder="Clause title (e.g., Social Media Promotion)"
                          value={clause.title}
                          onChange={(e) => updateCustomClause(clause.id, "title", e.target.value)}
                          className="text-sm"
                        />
                        <Textarea
                          placeholder="Clause details..."
                          value={clause.content}
                          onChange={(e) => updateCustomClause(clause.id, "content", e.target.value)}
                          rows={3}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        onClick={() => deleteCustomClause(clause.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </CardContent>
          </Card>
            </>
          )}

          {/* Download Section */}
          <div className="mb-6 bg-[#FEE6EA] border border-[#131718] rounded-lg shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] p-4 sm:p-6">
            <h3 className="mb-3 text-[20px]">Download Your Contract</h3>
            <p className="text-muted-foreground mb-4 text-[14px]">
              Save as JSON to reload later, or export as PDF/Markdown to send to your client
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportJSON} variant="default" className="w-full sm:flex-1 gap-2">
                <Download className="h-4 w-4" />
                Save Data (JSON)
              </Button>
              <Button onClick={exportPDF} variant="outline" className="border-border w-full sm:flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={exportMarkdown} variant="outline" className="border-border w-full sm:flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Download Markdown
              </Button>
            </div>
          </div>
        </main>

        {/* Divider */}
        <div className="border-t border-[#131718]" />

        {/* Footer */}
        <footer className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-muted-foreground px-[16px] pt-[0px] pb-[80px] md:pb-[16px]">
          <p>
            Share this tool, use it, and consider{" "}
            <a
              href="https://ko-fi.com/stellaachenbach"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold"
            >
              donating
            </a>
            {" "}if you found it helpful.
          </p>
          <p className="mt-2">
            Made with 💜 by{" "}
            <a
              href="https://www.linkedin.com/in/stella-achenbach/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @stellaachenbach
            </a>
          </p>
        </footer>

    </div>

      {/* Mobile Bottom Navigation - Outside pageRef so fixed positioning is never broken by transforms */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#131718] border-t border-[#131718] pb-safe">
          <div className="flex items-center justify-around py-3 px-4">
            {/* Home */}
            <button
              className="flex flex-col items-center gap-1 text-[#FEE6EA] active:scale-95 transition-transform"
              onClick={() => navigate('/builder')}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            {/* Upload */}
            <button
              className="flex flex-col items-center gap-1 text-[#FEE6EA] active:scale-95 transition-transform"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="w-5 h-5" />
              <span className="text-[10px]">Import</span>
            </button>

            {/* Download */}
            <div className="relative" ref={mobileDownloadMenuRef}>
              <button
                className="flex flex-col items-center gap-1 text-[#FEE6EA] active:scale-95 transition-transform"
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              >
                <Download className="w-5 h-5" />
                <span className="text-[10px]">Export</span>
              </button>
              
              {/* Mobile Download Menu */}
              {showDownloadMenu && (
                <div className="absolute bottom-full mb-2 right-0 min-w-[180px]">
                  <div className="bg-[#131718] rounded-2xl shadow-lg p-2 space-y-1 border border-[#FEE6EA]/20">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 rounded-xl transition-all duration-100 text-left"
                      onClick={() => {
                        exportJSON();
                        setShowDownloadMenu(false);
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>JSON</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 rounded-xl transition-all duration-100 text-left"
                      onClick={() => {
                        exportPDF();
                        setShowDownloadMenu(false);
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>PDF</span>
                    </button>
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#FEE6EA]/90 hover:text-[#FEE6EA] hover:bg-[#FEE6EA]/10 rounded-xl transition-all duration-100 text-left"
                      onClick={() => {
                        exportMarkdown();
                        setShowDownloadMenu(false);
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      <span>Markdown</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Toggle */}
            <button
              className="flex flex-col items-center gap-1 text-[#FEE6EA] active:scale-95 transition-transform"
              onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
            >
              {viewMode === "edit" ? <Eye className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              <span className="text-[10px]">{viewMode === "edit" ? "Preview" : "Edit"}</span>
            </button>

            {/* Resources */}
            <button
              className="flex flex-col items-center gap-1 text-[#FEE6EA] active:scale-95 transition-transform"
              onClick={() => navigate('/resources')}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px]">Resources</span>
            </button>
          </div>
        </div>
    </>
  );
}