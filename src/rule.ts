function convertToRegexp(rule: string): RegExp {
    let regexp = rule
        .replace(/[.]/g, '\\$&')
        .replace(/[*]/g, '(?:.*)')
        .replace(/%/g, '(.+?)');
    regexp = `^(.*)${regexp}$`;
    return new RegExp(regexp);
}

function calcScore(rule: string): number {
    const p = rule.replace(/[^%]+/g, '').length;
    const s = rule.replace(/[^\*]+/g, '').length;
    const c = rule.length - p - s;
    return 10 * c + 5 * p + 1 * s;
}

export class Rule {
    private _rule: string;
    public regexp: RegExp;
    public score: number;

    constructor(rule: string) {
        this._rule = rule;
        this.regexp = convertToRegexp(rule);
        this.score = calcScore(rule);
    }

    public glob(placeholders: string[]): string {
        let placeholderIndex = 0;
        let glob = `%${this._rule}`
            .replace(/%/g, () => placeholders[placeholderIndex++])
            .replace(/\*\//g, '**/');
        return glob;
    }
}
