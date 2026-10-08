const PLACEHOLDER = /\{\{\s*([\w-]+)\s*\}\}/g;

/**
 * Substitutes `{{name}}` placeholders. Strict on purpose: a placeholder without a value
 * throws, so a typo in a prompt file fails loudly instead of leaking into the output.
 */
export const renderTemplate = (template: string, values: Record<string, string>): string =>
    template.replace(PLACEHOLDER, (_, key: string) => {
        if (!Object.hasOwn(values, key)) {
            throw new Error(`Template placeholder "{{${key}}}" has no value`);
        }
        return values[key]!;
    });
