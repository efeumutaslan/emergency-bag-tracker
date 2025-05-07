// frontend/src/utils/weightConverter.js
export const convertWeight = (weight, fromUnit, toUnit) => {
    // Convert to grams first
    let grams;
    switch (fromUnit) {
      case 'g':
        grams = weight;
        break;
      case 'kg':
        grams = weight * 1000;
        break;
      case 'oz':
        grams = weight * 28.3495;
        break;
      case 'lb':
        grams = weight * 453.592;
        break;
      default:
        return weight;
    }
    
    // Convert from grams to target unit
    switch (toUnit) {
      case 'g':
        return grams;
      case 'kg':
        return grams / 1000;
      case 'oz':
        return grams / 28.3495;
      case 'lb':
        return grams / 453.592;
      default:
        return grams;
    }
  };
  
  export const calculateTotalWeight = (items, targetUnit = 'kg') => {
    return items.reduce((total, item) => {
      const itemWeight = convertWeight(
        item.weight * item.quantity, 
        item.weightUnit, 
        targetUnit
      );
      return total + itemWeight;
    }, 0);
  };
  
  export const formatWeight = (weight, unit) => {
    return `${weight.toFixed(2)} ${unit}`;
  };