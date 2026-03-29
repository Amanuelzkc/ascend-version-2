export interface LexiconTerm {
    term: string
    definition: string
    category: "Finance" | "Strategy" | "Operations" | "Economics"
}

export const lexiconData: LexiconTerm[] = [
    {
        term: "EBITDA",
        definition: "Earnings Before Interest, Taxes, Depreciation, and Amortization. A measure of a company's overall financial performance.",
        category: "Finance"
    },
    {
        term: "CAGR",
        definition: "Compound Annual Growth Rate. The mean annual growth rate of an investment over a specified period of time longer than one year.",
        category: "Economics"
    },
    {
        term: "Liquidity",
        definition: "The efficiency or ease with which an asset or security can be converted into ready cash without affecting its market price.",
        category: "Finance"
    },
    {
        term: "Working Capital",
        definition: "The difference between a company's current assets and its current liabilities. It measures short-term financial health.",
        category: "Finance"
    },
    {
        term: "Due Diligence",
        definition: "An investigation, audit, or review performed to confirm facts or details of a matter under consideration.",
        category: "Strategy"
    },
    {
        term: "ROI",
        definition: "Return on Investment. A performance measure used to evaluate the efficiency or profitability of an investment.",
        category: "Finance"
    },
    {
        term: "Scale",
        definition: "The ability of a business to handle growing demand without proportionally increasing costs.",
        category: "Operations"
    }
]
