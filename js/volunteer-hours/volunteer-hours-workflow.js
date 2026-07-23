//==================================================
// Volunteer Hours Workflow
//==================================================

let pendingHours = [];


//--------------------------------------------------
// Build Pending Hours List
//--------------------------------------------------

export async function buildPendingHours() {

}


//--------------------------------------------------
// Refresh Pending Hours
//--------------------------------------------------

export async function refreshPendingHours() {

    return buildPendingHours();

}


//--------------------------------------------------
// Get Pending Hours
//--------------------------------------------------

export function getPendingHours() {

    return pendingHours;

}


//--------------------------------------------------
// Get Pending Hours Count
//--------------------------------------------------

export function getPendingHoursCount() {

    return pendingHours.length;

}
