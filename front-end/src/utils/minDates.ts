const getMinEndDate = (startDateString: string): string => {
    const startDate = new Date(startDateString);
    const minEndDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
    return minEndDate.toISOString().split("T")[0];
};

export default getMinEndDate;
