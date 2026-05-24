import { useState } from 'react';
import { Search, Filter, Heart, MapPin } from 'lucide-react';
import './Marketplace.css';

// Mock Data using all 47 categories from public/plants
const PLANTS = [
  { id: 1, name: 'African Violet', type: 'buy', price: '$12', location: '1.2 miles away', image: '/plants/African Violet (Saintpaulia ionantha)/1.jpg' },
  { id: 2, name: 'Aloe Vera', type: 'sell', price: '$10', location: 'You', image: '/plants/Aloe Vera/1.jpg' },
  { id: 3, name: 'Anthurium', type: 'buy', price: '$28', location: '3.5 miles away', image: '/plants/Anthurium (Anthurium andraeanum)/1.jpg' },
  { id: 4, name: 'Areca Palm', type: 'buy', price: '$35', location: '5 miles away', image: '/plants/Areca Palm (Dypsis lutescens)/1.jpg' },
  { id: 5, name: 'Asparagus Fern', type: 'thrift', price: '$8', location: '2.1 miles away', image: '/plants/Asparagus Fern (Asparagus setaceus)/1.jpg' },
  { id: 6, name: 'Begonia', type: 'swap', price: 'Trade', location: '0.8 miles away', image: '/plants/Begonia (Begonia spp.)/1.jpg' },
  { id: 7, name: 'Bird of Paradise', type: 'buy', price: '$55', location: '10 miles away', image: '/plants/Bird of Paradise (Strelitzia reginae)/1.jpg' },
  { id: 8, name: 'Birds Nest Fern', type: 'buy', price: '$22', location: '4.2 miles away', image: '/plants/Birds Nest Fern (Asplenium nidus)/1.jpg' },
  { id: 9, name: 'Boston Fern', type: 'thrift', price: '$15', location: '1.5 miles away', image: '/plants/Boston Fern (Nephrolepis exaltata)/1.jpg' },
  { id: 10, name: 'Calathea', type: 'buy', price: '$24', location: '3 miles away', image: '/plants/Calathea/1.jpg' },
  { id: 11, name: 'Cast Iron Plant', type: 'buy', price: '$30', location: '6 miles away', image: '/plants/Cast Iron Plant (Aspidistra elatior)/1.jpg' },
  { id: 12, name: 'Chinese Evergreen', type: 'sell', price: '$18', location: 'You', image: '/plants/Chinese evergreen (Aglaonema)/1.jpg' },
  { id: 13, name: 'Chinese Money Plant', type: 'swap', price: 'Trade', location: '1.2 miles away', image: '/plants/Chinese Money Plant (Pilea peperomioides)/1.jpg' },
  { id: 14, name: 'Christmas Cactus', type: 'buy', price: '$20', location: '4 miles away', image: '/plants/Christmas Cactus (Schlumbergera bridgesii)/1.jpg' },
  { id: 15, name: 'Chrysanthemum', type: 'buy', price: '$15', location: '2.5 miles away', image: '/plants/Chrysanthemum/1.jpg' },
  { id: 16, name: 'Ctenanthe', type: 'buy', price: '$26', location: '3.8 miles away', image: '/plants/Ctenanthe/1.jpg' },
  { id: 17, name: 'Daffodils', type: 'buy', price: '$10', location: '5.5 miles away', image: '/plants/Daffodils (Narcissus spp.)/1.jpg' },
  { id: 18, name: 'Dracaena', type: 'buy', price: '$32', location: '7 miles away', image: '/plants/Dracaena/1.jpg' },
  { id: 19, name: 'Dumb Cane', type: 'thrift', price: '$12', location: '2.8 miles away', image: '/plants/Dumb Cane (Dieffenbachia spp.)/1.jpg' },
  { id: 20, name: 'Elephant Ear', type: 'buy', price: '$40', location: '8 miles away', image: '/plants/Elephant Ear (Alocasia spp.)/1.jpg' },
  { id: 21, name: 'English Ivy', type: 'swap', price: 'Trade', location: '1.1 miles away', image: '/plants/English Ivy (Hedera helix)/1.jpg' },
  { id: 22, name: 'Hyacinth', type: 'buy', price: '$14', location: '4.5 miles away', image: '/plants/Hyacinth (Hyacinthus orientalis)/1.jpg' },
  { id: 23, name: 'Iron Cross Begonia', type: 'buy', price: '$25', location: '3.2 miles away', image: '/plants/Iron Cross begonia (Begonia masoniana)/1.jpg' },
  { id: 24, name: 'Jade Plant', type: 'sell', price: '$12', location: 'You', image: '/plants/Jade plant (Crassula ovata)/1.jpg' },
  { id: 25, name: 'Kalanchoe', type: 'buy', price: '$18', location: '2.2 miles away', image: '/plants/Kalanchoe/1.jpg' },
  { id: 26, name: 'Lilium', type: 'buy', price: '$20', location: '6.5 miles away', image: '/plants/Lilium (Hemerocallis)/1.jpg' },
  { id: 27, name: 'Lily of the Valley', type: 'buy', price: '$16', location: '4.8 miles away', image: '/plants/Lily of the valley (Convallaria majalis)/1.jpg' },
  { id: 28, name: 'Money Tree', type: 'buy', price: '$38', location: '9 miles away', image: '/plants/Money Tree (Pachira aquatica)/1.jpg' },
  { id: 29, name: 'Monstera Deliciosa', type: 'buy', price: '$45', location: '3 miles away', image: '/plants/Monstera Deliciosa (Monstera deliciosa)/1.jpg' },
  { id: 30, name: 'Orchid', type: 'buy', price: '$30', location: '5 miles away', image: '/plants/Orchid/1.jpg' },
  { id: 31, name: 'Parlor Palm', type: 'buy', price: '$28', location: '4.1 miles away', image: '/plants/Parlor Palm (Chamaedorea elegans)/1.jpg' },
  { id: 32, name: 'Peace Lily', type: 'swap', price: 'Trade', location: '2.5 miles away', image: '/plants/Peace lily/1.jpg' },
  { id: 33, name: 'Poinsettia', type: 'buy', price: '$20', location: '3.6 miles away', image: '/plants/Poinsettia (Euphorbia pulcherrima)/1.jpg' },
  { id: 34, name: 'Polka Dot Plant', type: 'buy', price: '$14', location: '1.8 miles away', image: '/plants/Polka Dot Plant (Hypoestes phyllostachya)/1.jpg' },
  { id: 35, name: 'Ponytail Palm', type: 'buy', price: '$35', location: '7.5 miles away', image: '/plants/Ponytail Palm (Beaucarnea recurvata)/1.jpg' },
  { id: 36, name: 'Pothos', type: 'thrift', price: '$10', location: '0.9 miles away', image: '/plants/Pothos (Ivy arum)/1.jpg' },
  { id: 37, name: 'Prayer Plant', type: 'buy', price: '$22', location: '4.4 miles away', image: '/plants/Prayer Plant (Maranta leuconeura)/1.jpg' },
  { id: 38, name: 'Rattlesnake Plant', type: 'buy', price: '$26', location: '3.3 miles away', image: '/plants/Rattlesnake Plant (Calathea lancifolia)/1.jpg' },
  { id: 39, name: 'Rubber Plant', type: 'buy', price: '$40', location: '6.2 miles away', image: '/plants/Rubber Plant (Ficus elastica)/1.jpg' },
  { id: 40, name: 'Sago Palm', type: 'buy', price: '$50', location: '8.5 miles away', image: '/plants/Sago Palm (Cycas revoluta)/1.jpg' },
  { id: 41, name: 'Schefflera', type: 'buy', price: '$30', location: '5.2 miles away', image: '/plants/Schefflera/1.jpg' },
  { id: 42, name: 'Snake Plant', type: 'swap', price: 'Trade', location: '1.4 miles away', image: '/plants/Snake plant (Sanseviera)/1.jpg' },
  { id: 43, name: 'Tradescantia', type: 'buy', price: '$18', location: '2.7 miles away', image: '/plants/Tradescantia/1.jpg' },
  { id: 44, name: 'Tulip', type: 'buy', price: '$12', location: '4.6 miles away', image: '/plants/Tulip/1.jpg' },
  { id: 45, name: 'Venus Flytrap', type: 'buy', price: '$25', location: '9.5 miles away', image: '/plants/Venus Flytrap/1.jpg' },
  { id: 46, name: 'Yucca', type: 'buy', price: '$35', location: '7.8 miles away', image: '/plants/Yucca/1.jpg' },
  { id: 47, name: 'ZZ Plant', type: 'buy', price: '$32', location: '3.1 miles away', image: '/plants/ZZ Plant (Zamioculcas zamiifolia)/1.jpg' },
];

export default function Marketplace() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlants = PLANTS.filter(plant => {
    if (activeTab !== 'all' && plant.type !== activeTab) return false;
    if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="animate-fade-in marketplace-container">
      <div className="marketplace-header">
        <h2 className="title-medium">Marketplace</h2>
        <div className="search-bar">
          <Search size={20} className="icon" />
          <input 
            type="text" 
            placeholder="Search plants..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-icon"><Filter size={20} /></button>
        </div>
      </div>

      <div className="tabs-container">
        {['all', 'swap', 'thrift', 'buy', 'sell'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="plants-grid">
        {filteredPlants.map(plant => (
          <div key={plant.id} className="plant-card">
            <div className="plant-image-wrap">
              <img src={plant.image} alt={plant.name} className="marketplace-img" />
              <div className="badge">{plant.type}</div>
              <button className="like-btn"><Heart size={18} /></button>
            </div>
            <div className="plant-details">
              <h3>{plant.name}</h3>
              <p className="price">{plant.price}</p>
              <div className="location">
                <MapPin size={14} />
                <span>{plant.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredPlants.length === 0 && (
        <div className="empty-state">
          <p className="text-subtle">No plants found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
