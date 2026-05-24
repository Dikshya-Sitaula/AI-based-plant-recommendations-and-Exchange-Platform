const PLANT_DETAILS = {
  1: {
    name: 'African Violet',
    scientificName: 'Saintpaulia ionantha',
    suitableLocation: 'Indoors, East or North facing windows',
    minTemp: '18°C',
    maxTemp: '24°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.5,
    description: 'A classic indoor plant known for its beautiful velvety leaves and clusters of purple, pink, or white flowers.'
  },
  2: {
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    suitableLocation: 'Sunny windowsills, Kitchens',
    minTemp: '13°C',
    maxTemp: '27°C',
    sunlight: 'Bright direct light',
    airQualityScore: 8.2,
    description: 'A succulent plant species of the genus Aloe. It is widely used in traditional herbal medicine for its soothing properties.'
  },
  3: {
    name: 'Anthurium',
    scientificName: 'Anthurium andraeanum',
    suitableLocation: 'Living rooms, humid environments',
    minTemp: '16°C',
    maxTemp: '32°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 8.8,
    description: 'Known for its bright heart-shaped flowers and glossy green leaves, Anthuriums bring a tropical feel to any room.'
  },
  4: {
    name: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    suitableLocation: 'Bright corners, spacious rooms',
    minTemp: '15°C',
    maxTemp: '25°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 9.4,
    description: 'One of the best air-purifying plants, the Areca Palm adds a lush, tropical look with its feathery fronds.'
  },
  5: {
    name: 'Asparagus Fern',
    scientificName: 'Asparagus setaceus',
    suitableLocation: 'Shelves, hanging baskets',
    minTemp: '10°C',
    maxTemp: '22°C',
    sunlight: 'Partial shade',
    airQualityScore: 6.5,
    description: 'Despite its name, it is not a true fern but a member of the lily family, valued for its delicate, feathery foliage.'
  },
  6: {
    name: 'Begonia',
    scientificName: 'Begonia spp.',
    suitableLocation: 'Patios, bright indoor spots',
    minTemp: '15°C',
    maxTemp: '24°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.2,
    description: 'Vibrant plants with unique leaf patterns and beautiful blooms, perfect for adding color to your collection.'
  },
  7: {
    name: 'Bird of Paradise',
    scientificName: 'Strelitzia reginae',
    suitableLocation: 'Large sunny windows, sunrooms',
    minTemp: '18°C',
    maxTemp: '30°C',
    sunlight: 'Direct sunlight',
    airQualityScore: 8.0,
    description: 'A striking tropical plant famous for its orange and blue flowers that resemble a bird in flight.'
  },
  8: {
    name: 'Birds Nest Fern',
    scientificName: 'Asplenium nidus',
    suitableLocation: 'Bathrooms, kitchens with indirect light',
    minTemp: '16°C',
    maxTemp: '27°C',
    sunlight: 'Low to medium indirect light',
    airQualityScore: 8.5,
    description: 'An epiphytic fern characterized by its ripple-edged fronds that grow from a central rosette.'
  },
  9: {
    name: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    suitableLocation: 'Hanging baskets, humid rooms',
    minTemp: '15°C',
    maxTemp: '24°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 9.1,
    description: 'A classic fern with graceful, arching fronds. It is highly effective at removing indoor air pollutants.'
  },
  10: {
    name: 'Calathea',
    scientificName: 'Calathea spp.',
    suitableLocation: 'Shady corners, low light rooms',
    minTemp: '18°C',
    maxTemp: '24°C',
    sunlight: 'Low to medium indirect light',
    airQualityScore: 7.8,
    description: 'Known as "Prayer Plants" because their leaves fold up at night. They feature stunning variegated patterns.'
  },
  11: {
    name: 'Cast Iron Plant',
    scientificName: 'Aspidistra elatior',
    suitableLocation: 'Hallways, dark corners',
    minTemp: '10°C',
    maxTemp: '29°C',
    sunlight: 'Low light',
    airQualityScore: 6.8,
    description: 'Practically indestructible, this plant thrives in low light and neglect, making it ideal for beginners.'
  },
  12: {
    name: 'Chinese Evergreen',
    scientificName: 'Aglaonema',
    suitableLocation: 'Offices, low light indoor spaces',
    minTemp: '16°C',
    maxTemp: '27°C',
    sunlight: 'Low to medium indirect light',
    airQualityScore: 8.6,
    description: 'One of the most durable houseplants, available in many varieties with silver or red variegation.'
  },
  13: {
    name: 'Chinese Money Plant',
    scientificName: 'Pilea peperomioides',
    suitableLocation: 'Bright windowsills',
    minTemp: '13°C',
    maxTemp: '24°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.0,
    description: 'A trendy plant with distinctive pancake-shaped leaves. It is often called the "Friendship Plant" because it is easy to propagate.'
  },
  14: {
    name: 'Christmas Cactus',
    scientificName: 'Schlumbergera bridgesii',
    suitableLocation: 'Indoors with filtered light',
    minTemp: '15°C',
    maxTemp: '21°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.4,
    description: 'A beautiful winter-blooming succulent that produces colorful flowers in late fall and winter.'
  },
  15: {
    name: 'Chrysanthemum',
    scientificName: 'Chrysanthemum morifolium',
    suitableLocation: 'Sun-drenched rooms, balconies',
    minTemp: '10°C',
    maxTemp: '21°C',
    sunlight: 'Direct sun',
    airQualityScore: 9.5,
    description: 'Exceptional air purifiers, these popular flowering plants can remove ammonia, benzene, and formaldehyde from the air.'
  },
  16: {
    name: 'Ctenanthe',
    scientificName: 'Ctenanthe spp.',
    suitableLocation: 'Humid, medium light spots',
    minTemp: '18°C',
    maxTemp: '27°C',
    sunlight: 'Medium indirect light',
    airQualityScore: 7.9,
    description: 'Closely related to Calatheas, these plants feature striking geometric patterns on their leaves.'
  },
  17: {
    name: 'Daffodils',
    scientificName: 'Narcissus spp.',
    suitableLocation: 'Outdoor gardens, sunny windowsills',
    minTemp: '5°C',
    maxTemp: '18°C',
    sunlight: 'Full sun to partial shade',
    airQualityScore: 5.0,
    description: 'Cheerful spring bulbs that symbolize rebirth and new beginnings with their bright yellow or white blooms.'
  },
  18: {
    name: 'Dracaena',
    scientificName: 'Dracaena fragrans',
    suitableLocation: 'Living rooms, offices',
    minTemp: '15°C',
    maxTemp: '24°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 8.9,
    description: 'A popular houseplant with sword-like leaves. It is effective at filtering toxins like xylene and trichloroethylene.'
  },
  19: {
    name: 'Dumb Cane',
    scientificName: 'Dieffenbachia spp.',
    suitableLocation: 'Warm, humid rooms with filtered light',
    minTemp: '18°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 8.4,
    description: 'A large, fast-growing plant with beautiful broad leaves. Note: its sap is toxic if ingested.'
  },
  20: {
    name: 'Elephant Ear',
    scientificName: 'Alocasia spp.',
    suitableLocation: 'Large containers in humid spots',
    minTemp: '18°C',
    maxTemp: '29°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.6,
    description: 'Stunning statement plants with massive, heart-shaped leaves that resemble the ears of an elephant.'
  },
  21: {
    name: 'English Ivy',
    scientificName: 'Hedera helix',
    suitableLocation: 'Hanging pots, bookshelves',
    minTemp: '7°C',
    maxTemp: '21°C',
    sunlight: 'Bright indirect light to partial shade',
    airQualityScore: 9.2,
    description: 'A versatile climbing vine that is particularly good at reducing airborne fecal particles and mold.'
  },
  22: {
    name: 'Hyacinth',
    scientificName: 'Hyacinthus orientalis',
    suitableLocation: 'Cooler bright spots',
    minTemp: '5°C',
    maxTemp: '16°C',
    sunlight: 'Full sun to partial shade',
    airQualityScore: 5.5,
    description: 'Highly fragrant spring bulbs that bloom in dense clusters of colorful flowers.'
  },
  23: {
    name: 'Iron Cross Begonia',
    scientificName: 'Begonia masoniana',
    suitableLocation: 'Shady, humid indoor spots',
    minTemp: '16°C',
    maxTemp: '24°C',
    sunlight: 'Medium indirect light',
    airQualityScore: 7.3,
    description: 'A unique begonia variety named for the dark, cross-like patterns in the center of its pebbly leaves.'
  },
  24: {
    name: 'Jade Plant',
    scientificName: 'Crassula ovata',
    suitableLocation: 'Sunny windowsills',
    minTemp: '10°C',
    maxTemp: '24°C',
    sunlight: 'Direct sunlight',
    airQualityScore: 6.2,
    description: 'A succulent that is considered a symbol of good luck and prosperity, known for its thick woody stems and oval leaves.'
  },
  25: {
    name: 'Kalanchoe',
    scientificName: 'Kalanchoe blossfeldiana',
    suitableLocation: 'Bright, dry spots',
    minTemp: '15°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 6.9,
    description: 'A low-maintenance succulent that rewards you with long-lasting clusters of tiny, vibrant flowers.'
  },
  26: {
    name: 'Lilium',
    scientificName: 'Hemerocallis',
    suitableLocation: 'Full sun gardens or balconies',
    minTemp: '10°C',
    maxTemp: '27°C',
    sunlight: 'Direct sunlight',
    airQualityScore: 5.8,
    description: 'Elegant flowering plants with large, trumpet-shaped blooms. Perfect for adding a touch of class to any space.'
  },
  27: {
    name: 'Lily of the Valley',
    scientificName: 'Convallaria majalis',
    suitableLocation: 'Cool, shady garden spots',
    minTemp: '0°C',
    maxTemp: '21°C',
    sunlight: 'Partial to full shade',
    airQualityScore: 5.2,
    description: 'Sweetly scented woodland plants with small, bell-shaped white flowers.'
  },
  28: {
    name: 'Money Tree',
    scientificName: 'Pachira aquatica',
    suitableLocation: 'Bright, humid rooms',
    minTemp: '15°C',
    maxTemp: '30°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 8.3,
    description: 'Features a distinctive braided trunk and palm-like leaves. Often associated with financial success.'
  },
  29: {
    name: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    suitableLocation: 'Living rooms with indirect light',
    minTemp: '18°C',
    maxTemp: '30°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 8.7,
    description: 'The iconic "Swiss Cheese Plant" known for its large leaves with natural holes (fenestrations).'
  },
  30: {
    name: 'Orchid',
    scientificName: 'Orchidaceae',
    suitableLocation: 'Filtered light near windows',
    minTemp: '18°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.1,
    description: 'Exotic and elegant, orchids are known for their intricate flowers and unique growth habits.'
  },
  31: {
    name: 'Parlor Palm',
    scientificName: 'Chamaedorea elegans',
    suitableLocation: 'Low light rooms, bedrooms',
    minTemp: '15°C',
    maxTemp: '24°C',
    sunlight: 'Low to medium indirect light',
    airQualityScore: 9.0,
    description: 'A slow-growing palm that thrives in lower light, making it a favorite for indoor environments.'
  },
  32: {
    name: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    suitableLocation: 'Bedrooms, living rooms with moderate light',
    minTemp: '18°C',
    maxTemp: '27°C',
    sunlight: 'Low to medium indirect light',
    airQualityScore: 9.7,
    description: 'Excellent at filtering indoor air, the Peace Lily produces elegant white spathes that resemble flowers.'
  },
  33: {
    name: 'Poinsettia',
    scientificName: 'Euphorbia pulcherrima',
    suitableLocation: 'Bright, indirect light during winter',
    minTemp: '15°C',
    maxTemp: '21°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 6.4,
    description: 'The quintessential holiday plant, known for its vibrant red and green foliage.'
  },
  34: {
    name: 'Polka Dot Plant',
    scientificName: 'Hypoestes phyllostachya',
    suitableLocation: 'Bright indoor spots, terrariums',
    minTemp: '18°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.0,
    description: 'Small, charming plants with colorful spotted leaves in shades of pink, red, and white.'
  },
  35: {
    name: 'Ponytail Palm',
    scientificName: 'Beaucarnea recurvata',
    suitableLocation: 'Sunny, dry spots',
    minTemp: '10°C',
    maxTemp: '30°C',
    sunlight: 'Bright direct light',
    airQualityScore: 6.7,
    description: 'Neither a palm nor a tree, this succulent stores water in its bulbous trunk and has long, curly leaves.'
  },
  36: {
    name: 'Pothos',
    scientificName: 'Epipremnum aureum',
    suitableLocation: 'Almost anywhere, hanging baskets',
    minTemp: '15°C',
    maxTemp: '30°C',
    sunlight: 'Low to bright indirect light',
    airQualityScore: 9.3,
    description: 'One of the easiest plants to grow, with heart-shaped leaves that can trail or climb.'
  },
  37: {
    name: 'Prayer Plant',
    scientificName: 'Maranta leuconeura',
    suitableLocation: 'Warm, humid spots with filtered light',
    minTemp: '18°C',
    maxTemp: '27°C',
    sunlight: 'Medium indirect light',
    airQualityScore: 8.1,
    description: 'A beautiful plant with intricate leaf patterns that fold up as if in prayer at night.'
  },
  38: {
    name: 'Rattlesnake Plant',
    scientificName: 'Calathea lancifolia',
    suitableLocation: 'Indoors with filtered light',
    minTemp: '18°C',
    maxTemp: '24°C',
    sunlight: 'Low to medium indirect light',
    airQualityScore: 7.7,
    description: 'Features long, wavy leaves with a pattern resembling a rattlesnake\'s skin.'
  },
  39: {
    name: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    suitableLocation: 'Bright rooms with space to grow',
    minTemp: '15°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 9.0,
    description: 'A popular houseplant with thick, glossy leaves that come in shades of green, burgundy, and variegated.'
  },
  40: {
    name: 'Sago Palm',
    scientificName: 'Cycas revoluta',
    suitableLocation: 'Bright, airy spots',
    minTemp: '10°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light to full sun',
    airQualityScore: 6.0,
    description: 'A slow-growing cycad that adds a prehistoric, tropical touch to the landscape or home.'
  },
  41: {
    name: 'Schefflera',
    scientificName: 'Schefflera arboricola',
    suitableLocation: 'Bright, spacious rooms',
    minTemp: '15°C',
    maxTemp: '24°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 8.2,
    description: 'Known as the "Umbrella Tree" due to its clusters of leaves that radiate from a central stem.'
  },
  42: {
    name: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    suitableLocation: 'Anywhere from low to bright light',
    minTemp: '13°C',
    maxTemp: '30°C',
    sunlight: 'Any light condition',
    airQualityScore: 9.8,
    description: 'One of the best air purifiers, unique for its ability to convert CO2 into oxygen at night.'
  },
  43: {
    name: 'Tradescantia',
    scientificName: 'Tradescantia zebrina',
    suitableLocation: 'Hanging baskets, bright spots',
    minTemp: '15°C',
    maxTemp: '27°C',
    sunlight: 'Bright indirect light',
    airQualityScore: 7.5,
    description: 'A fast-growing trailing plant with striking purple and silver striped leaves.'
  },
  44: {
    name: 'Tulip',
    scientificName: 'Tulipa spp.',
    suitableLocation: 'Sunny gardens or bright windows',
    minTemp: '5°C',
    maxTemp: '18°C',
    sunlight: 'Direct sunlight',
    airQualityScore: 5.4,
    description: 'Classic spring-blooming bulbs available in a vast array of colors and shapes.'
  },
  45: {
    name: 'Venus Flytrap',
    scientificName: 'Dionaea muscipula',
    suitableLocation: 'Sunny sills with high humidity',
    minTemp: '0°C',
    maxTemp: '35°C',
    sunlight: 'Full sun',
    airQualityScore: 4.5,
    description: 'A fascinating carnivorous plant that captures and digests insects using specialized trap leaves.'
  },
  46: {
    name: 'Yucca',
    scientificName: 'Yucca elephantipes',
    suitableLocation: 'Bright, sunny spots',
    minTemp: '7°C',
    maxTemp: '30°C',
    sunlight: 'Direct sunlight',
    airQualityScore: 6.5,
    description: 'A tough, drought-tolerant plant with sword-like leaves and thick woody trunks.'
  },
  47: {
    name: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    suitableLocation: 'Low light offices, hallways',
    minTemp: '15°C',
    maxTemp: '24°C',
    sunlight: 'Low to bright indirect light',
    airQualityScore: 8.5,
    description: 'Known for its waxy, deep green leaves and extreme durability, it thrives on neglect.'
  }
};

export default PLANT_DETAILS;
