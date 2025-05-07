// frontend/src/utils/weightSafety.js
// Calculate if total bag weight is safe based on user's body weight
export const calculateWeightSafety = (totalBagWeight, userWeight) => {
    // Recommended maximum weight is 20% of body weight
    if (!userWeight || userWeight <= 0) return null;
    
    const maxSafeWeight = userWeight * 0.2;
    
    if (totalBagWeight <= maxSafeWeight * 0.5) {
      return { status: 'safe', message: 'The bag weight is well within the safe range.', percentage: (totalBagWeight / maxSafeWeight) * 100 };
    } else if (totalBagWeight <= maxSafeWeight * 0.8) {
      return { status: 'moderate', message: 'The bag weight is moderate but safe.', percentage: (totalBagWeight / maxSafeWeight) * 100 };
    } else if (totalBagWeight <= maxSafeWeight) {
      return { status: 'caution', message: 'The bag weight is approaching your recommended maximum.', percentage: (totalBagWeight / maxSafeWeight) * 100 };
    } else {
      return { status: 'unsafe', message: 'The bag weight exceeds the recommended maximum for your body weight.', percentage: (totalBagWeight / maxSafeWeight) * 100 };
    }
  };