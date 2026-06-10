import RecommendationForm from '../components/RecommendationForm';
import './Recommendation.css';

export default function Recommendation() {
  return (
    <div className="rec-page">
      <div className="rec-blob rec-blob1" />
      <div className="rec-blob rec-blob2" />

      <div className="rec-container">
        <RecommendationForm showHeader />
      </div>
    </div>
  );
}
  