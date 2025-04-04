export function convertISO8601ToHHMM(dateString: string, use24Hour: boolean = false) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (use24Hour) {
        return `${hours}:${minutes}`;
    } else {
        const amPm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        if (hours === 0) hours = 12;

        return `${hours}:${minutes}${amPm}`;
    }
}
