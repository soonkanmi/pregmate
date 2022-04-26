export const calculateDateConcieved = (date) => {
    date.setDate(date.getDate() + 14);
    return date;
}

export const getFirstTrimester = (date) => {
    date.setDate(date.getDate() + 84);
    return date;
}

export const getSecondTrimester = (date) => {
    date.setDate(date.getDate() + 189);
    return date;
}

export const getEstimatedDueDate = (date) => {
    date.setDate(date.getDate() + 280);
    return date;
}