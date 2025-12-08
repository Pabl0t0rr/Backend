export const validateSatus = (status: string) => {
    const validStatuses = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if(validStatuses.includes(status)){
    return status;
    }
    return "PENDING";
};

export const validatePriority = (priority: string) => {
    const validPriorities = ["LOW", "MEDIUM", "HIGH"];
    if(validPriorities.includes(priority)){
    return priority;
    }
    return "LOW";
}