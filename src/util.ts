
export const formatNumber = (value: number) => {
    return new Intl.NumberFormat('de-DE').format(value)
}

export const parseNumber = (formattedValue: string) => {
    const numericValue = formattedValue.replace(/[^0-9,-]+/g, '').replace(',', '.');
    return numericValue ? parseFloat(numericValue) : 0;
};