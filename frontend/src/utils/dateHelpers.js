// frontend/src/utils/dateHelpers.js
import { format, parseISO, isValid, differenceInDays } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
  } catch (error) {
    return 'Invalid date';
  }
};
/* MUI Datepicker will be used
export const formatDateInput = (dateString) => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
  } catch (error) {
    return '';
  }
};
*/
export const getDaysUntilExpiration = (expirationDate) => {
  try {
    const expDate = parseISO(expirationDate);
    if (!isValid(expDate)) return null;
    
    const today = new Date();
    return differenceInDays(expDate, today);
  } catch (error) {
    return null;
  }
};

export const getExpirationStatus = (expirationDate) => {
  const daysLeft = getDaysUntilExpiration(expirationDate);
  
  if (daysLeft === null) return { status: 'unknown', color: 'default' };
  
  if (daysLeft < 0) return { status: 'expired', color: 'error' };
  if (daysLeft <= 7) return { status: 'critical', color: 'error' };
  if (daysLeft <= 30) return { status: 'warning', color: 'warning' };
  return { status: 'ok', color: 'success' };
};