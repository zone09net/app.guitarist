interface CSSStyleSheet {
	readonly cssRules: CSSRuleList
	readonly ownerRule: CSSRule | null
	readonly rules: CSSRuleList
	addRule(selector?: string, style?: string, index?: number): number
	deleteRule(index: number): void
	insertRule(rule: string, index?: number): number
	removeRule(index?: number): void
	replace(reset_style: string | CSSStyleSheet): Promise<void>
	replaceSync(reset_style: string | CSSStyleSheet): void
 }
 