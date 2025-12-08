export const validateDate = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
        throw new Error("Both startDate and endDate are required");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
        throw new Error("endDate cannot be earlier than startDate");
    }

    return { startDate: start, endDate: end };
};
