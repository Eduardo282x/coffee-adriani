export const formatDate = (dateToFormat: string | Date | number): string => {
    const date = new Date(dateToFormat);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}
export const formatNumberWithDots = (number: number | string, prefix?: string, suffix?: string): string => {
    return `${prefix}${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${suffix}`;
}