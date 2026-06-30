export type EntityType = "invoice" | "amount" | "date" | "name" | "keyword";

export interface ParsedEntity {
  type: EntityType;
  value: string;
  index: number;
}

export interface ParseResult {
  entities: ParsedEntity[];
  byType: Record<EntityType, string[]>;
  confidence: number;
}

export const ENTITY_META: Record<
  EntityType,
  { label: string; color: string; bg: string; border: string }
> = {
  invoice: {
    label: "Invoice #",
    color: "#93c5fd",
    bg: "rgba(37, 99, 235, 0.16)",
    border: "rgba(59, 130, 246, 0.4)",
  },
  amount: {
    label: "Amount",
    color: "#86efac",
    bg: "rgba(34, 197, 94, 0.14)",
    border: "rgba(34, 197, 94, 0.4)",
  },
  date: {
    label: "Date",
    color: "#fde68a",
    bg: "rgba(234, 179, 8, 0.14)",
    border: "rgba(234, 179, 8, 0.4)",
  },
  name: {
    label: "Name / Org",
    color: "#d8b4fe",
    bg: "rgba(168, 85, 247, 0.14)",
    border: "rgba(168, 85, 247, 0.4)",
  },
  keyword: {
    label: "Signal",
    color: "#fca5a5",
    bg: "rgba(239, 68, 68, 0.14)",
    border: "rgba(239, 68, 68, 0.4)",
  },
};

const KEYWORD_PHRASES = [
  "duplicate",
  "double charge",
  "double charged",
  "double billed",
  "double-billed",
  "not received",
  "never received",
  "never arrived",
  "didn't arrive",
  "did not arrive",
  "overcharge",
  "overcharged",
  "over-charge",
  "overbilled",
  "overbilling",
  "short-pay",
  "short pay",
  "short payment",
  "short-paid",
  "underpaid",
  "discrepancy",
  "incorrect amount",
  "billed twice",
  "missing shipment",
  "sla",
  "late delivery",
  "past due",
  "credit memo",
  "chargeback",
];

const NAME_STOPWORDS = new Set(
  [
    "Dear",
    "Hello",
    "Hi",
    "Subject",
    "Re",
    "From",
    "To",
    "Thanks",
    "Thank",
    "Regards",
    "Sincerely",
    "Best",
    "Please",
    "Kindly",
    "Note",
    "Following",
    "Regarding",
    "Invoice",
    "Invoices",
    "Dispute",
    "Disputes",
    "Charge",
    "Charges",
    "Duplicate",
    "Inquiry",
    "Overcharge",
    "Pricing",
    "Contract",
    "Rate",
    "Shipment",
    "Delivery",
    "Order",
    "Reference",
    "Number",
    "Amount",
    "Date",
    "Email",
    "Notice",
    "Original",
    "Updated",
    "New",
    "Section",
    "Team",
    "Department",
    "Accounts",
    "Payable",
    "Receivable",
    "Customer",
    "Vendor",
    "Company",
    "Attached",
    "Per",
    "The",
    "This",
    "That",
    "We",
    "Our",
    "Your",
    "As",
    "Hope",
    "Looking",
    "Let",
    "Could",
    "Would",
    "Can",
    "Will",
    "Appreciate",
    "Resolve",
    "Resolution",
  ].map((w) => w.toLowerCase())
);

function isAllStopwords(words: string[]): boolean {
  return words.some((w) => NAME_STOPWORDS.has(w.toLowerCase()));
}

export function parseEmail(text: string): ParseResult {
  const entities: ParsedEntity[] = [];

  // Invoice numbers e.g. #8821
  const invoiceRe = /#\d{3,8}\b/g;
  let m: RegExpExecArray | null;
  while ((m = invoiceRe.exec(text))) {
    entities.push({ type: "invoice", value: m[0], index: m.index });
  }

  // Dollar amounts e.g. $12,400 or $7,200.50
  const amountRe = /\$\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?/g;
  while ((m = amountRe.exec(text))) {
    entities.push({ type: "amount", value: m[0], index: m.index });
  }

  // ISO dates e.g. 2024-03-14
  const isoDateRe = /\b\d{4}-\d{2}-\d{2}\b/g;
  while ((m = isoDateRe.exec(text))) {
    entities.push({ type: "date", value: m[0], index: m.index });
  }

  // Month name dates e.g. March 14th, 2024 / March 14
  const monthDateRe =
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?\b/gi;
  while ((m = monthDateRe.exec(text))) {
    entities.push({ type: "date", value: m[0], index: m.index });
  }

  // Keywords / dispute signals
  const lowerText = text.toLowerCase();
  for (const phrase of KEYWORD_PHRASES) {
    let fromIndex = 0;
    while (true) {
      const idx = lowerText.indexOf(phrase, fromIndex);
      if (idx === -1) break;
      entities.push({
        type: "keyword",
        value: text.substr(idx, phrase.length),
        index: idx,
      });
      fromIndex = idx + phrase.length;
    }
  }

  // Person / company names: sequences of 2-4 Title-Case words on the same line
  const nameRe = /\b[A-Z][a-z]+(?:[ \t]+[A-Z][a-z]+){1,3}\b/g;
  while ((m = nameRe.exec(text))) {
    const words = m[0].split(/\s+/);
    if (isAllStopwords(words)) continue;
    entities.push({ type: "name", value: m[0], index: m.index });
  }

  entities.sort((a, b) => a.index - b.index);

  const byType: Record<EntityType, string[]> = {
    invoice: [],
    amount: [],
    date: [],
    name: [],
    keyword: [],
  };
  const seen = new Set<string>();
  for (const e of entities) {
    const key = `${e.type}:${e.value.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    byType[e.type].push(e.value);
  }

  const typesFound = (Object.keys(byType) as EntityType[]).filter(
    (t) => byType[t].length > 0
  ).length;
  const totalTypes = 5;
  const confidence = Math.round((typesFound / totalTypes) * 100);

  return { entities, byType, confidence };
}
