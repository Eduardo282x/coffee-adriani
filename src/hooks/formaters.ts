export const formatDate = (dateToFormat: string | Date | number): string => {
    const date = new Date(dateToFormat);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const formatDateTime = (dateToFormat: string | Date): string => {
    const date = new Date(dateToFormat);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
}

export const formatNumberWithDots = (number: number | string, prefix?: string, suffix?: string, isRif?: boolean): string => {
    const text = isRif ?
        `${number.toString().slice(0,1)}-${number.toString().slice(1).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
        :
        number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return `${prefix}${text}${suffix}`;
}