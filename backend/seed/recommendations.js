// backend/seed/recommendations.js
const recommendations = [
    {
      name: 'First Aid Kit',
      category: 'Medical',
      description: 'Basic kit with bandages, antiseptic wipes, gauze, and medical tape.',
      averageWeight: 250,
      weightUnit: 'g',
      isEssential: true,
      popularity: 10
    },
    {
      name: 'Water Bottle',
      category: 'Water',
      description: 'Reusable water bottle, preferably with filter.',
      averageWeight: 500,
      weightUnit: 'g',
      isEssential: true,
      popularity: 10
    },
    {
      name: 'Emergency Blanket',
      category: 'Other',
      description: 'Compact thermal blanket for warmth in emergencies.',
      averageWeight: 60,
      weightUnit: 'g',
      isEssential: true,
      popularity: 9
    },
    {
      name: 'Flashlight',
      category: 'Tools',
      description: 'Compact, durable flashlight with extra batteries.',
      averageWeight: 150,
      weightUnit: 'g',
      isEssential: true,
      popularity: 9
    },
    {
      name: 'Multi-tool',
      category: 'Tools',
      description: 'Compact tool with knife, pliers, screwdrivers, etc.',
      averageWeight: 250,
      weightUnit: 'g',
      isEssential: true,
      popularity: 8
    },
    {
      name: 'Energy Bars',
      category: 'Food',
      description: 'High-calorie, non-perishable food source.',
      averageWeight: 50,
      weightUnit: 'g',
      isEssential: true,
      popularity: 8
    },
    {
      name: 'Portable Phone Charger',
      category: 'Electronics',
      description: 'Rechargeable battery pack for mobile devices.',
      averageWeight: 200,
      weightUnit: 'g',
      isEssential: false,
      popularity: 7
    },
    {
      name: 'Emergency Whistle',
      category: 'Tools',
      description: 'Loud whistle for signaling during emergencies.',
      averageWeight: 10,
      weightUnit: 'g',
      isEssential: true,
      popularity: 7
    },
    {
      name: 'Matches/Lighter',
      category: 'Tools',
      description: 'Waterproof matches or reliable lighter.',
      averageWeight: 20,
      weightUnit: 'g',
      isEssential: true,
      popularity: 8
    },
    {
      name: 'Personal Medications',
      category: 'Medical',
      description: 'Any prescription medications you regularly take.',
      averageWeight: 100,
      weightUnit: 'g',
      isEssential: true,
      popularity: 9
    },
    {
      name: 'Hand Sanitizer',
      category: 'Medical',
      description: 'Small bottle of alcohol-based hand sanitizer.',
      averageWeight: 60,
      weightUnit: 'g',
      isEssential: false,
      popularity: 6
    },
    {
      name: 'Rain Poncho',
      category: 'Clothing',
      description: 'Compact, disposable rain poncho for weather protection.',
      averageWeight: 90,
      weightUnit: 'g',
      isEssential: false,
      popularity: 6
    },
    {
      name: 'N95 Mask',
      category: 'Medical',
      description: 'Protective mask for air quality emergencies.',
      averageWeight: 10,
      weightUnit: 'g',
      isEssential: false,
      popularity: 7
    },
    {
      name: 'Emergency Contact List',
      category: 'Documents',
      description: 'List of important phone numbers and contacts.',
      averageWeight: 5,
      weightUnit: 'g',
      isEssential: true,
      popularity: 8
    },
    {
      name: 'Cash',
      category: 'Other',
      description: 'Small amount of cash in small denominations.',
      averageWeight: 20,
      weightUnit: 'g',
      isEssential: true,
      popularity: 8
    }
  ];
  
  module.exports = recommendations;