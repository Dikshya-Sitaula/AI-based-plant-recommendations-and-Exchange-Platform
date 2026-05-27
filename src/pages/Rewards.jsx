import {
  Bell,
  Star,
  Trophy,
  Flame,
  Crown,
  Calendar,
  ArrowLeftRight,
  ImagePlus,
  LayoutGrid,
  Users,
  ChevronRight,
  Cloud,
  ThermometerSun,
  Recycle,
  Gift,
  Ticket,
  Award,
  Package,
  BadgeCheck,
  Medal,
  Coins,
  Sprout,
  ScanLine,
  HelpCircle,
  Target,
  Gem,
} from 'lucide-react';
import './Rewards.css';

const LEADERBOARD = [
  { id: 1, name: 'EcoWarrior', label: 'You', points: 2450, initial: 'EW', tone: 'gold', isYou: true },
  { id: 2, name: 'PlantMom99', points: 2100, initial: 'PM', tone: 'rose' },
  { id: 3, name: 'GreenThumb', points: 1950, initial: 'GT', tone: 'green' },
  { id: 4, name: 'CactusJack', points: 1800, initial: 'CJ', tone: 'teal' },
  { id: 5, name: 'FernLover', points: 1650, initial: 'FL', tone: 'sage' },
];

const EARN_TASKS = [
  { icon: ScanLine, label: 'Scan a new plant', pts: 50, tone: 'green' },
  { icon: ArrowLeftRight, label: 'Swap a plant', pts: 200, tone: 'orange' },
  { icon: ImagePlus, label: 'Upload green progress', pts: 75, tone: 'blue' },
  { icon: LayoutGrid, label: 'Complete green space', pts: 100, tone: 'teal' },
  { icon: Users, label: 'Join an eco event', pts: 150, tone: 'purple' },
  { icon: Flame, label: '7-day plant care streak', pts: 300, tone: 'red' },
];

const IMPACT_STATS = [
  { icon: Sprout, label: 'Plants Added', value: '12', tone: 'green' },
  { icon: Cloud, label: 'CO₂ Reduced', value: '14 kg', tone: 'blue' },
  { icon: ThermometerSun, label: 'Cooling Impact', value: '1.2°C', tone: 'orange' },
  { icon: Recycle, label: 'Sustainable Actions', value: '8', tone: 'teal' },
];

const REWARDS = [
  { icon: Gift, title: 'Free Indoor Plant', pts: 2000, premium: false },
  { icon: Sprout, title: 'Compost Starter Kit', pts: 1500, premium: false },
  { icon: Ticket, title: 'Nursery Voucher', pts: 500, premium: false },
  { icon: Gem, title: '1 Month Premium', pts: 3000, premium: true },
  { icon: Package, title: 'Mystery Rare Plant', pts: 5000, premium: false, mystery: true },
];

const ICON_PROPS = { strokeWidth: 1.75, className: 'rh-icon' };

export default function Rewards() {
  const fullName = localStorage.getItem('leafLifeUserName') || 'Alex';
  const firstName = fullName.split(' ')[0];

  return (
    <div className="rh-page animate-fade-in">
      {/* Page header */}
      <header className="rh-header">
        <div className="rh-header-copy">
          <h1 className="rh-title">
            <Trophy size={26} className="rh-title-icon" strokeWidth={2} />
            Rewards Hub
          </h1>
          <p className="rh-subtitle">Grow Green. Earn Impact. Unlock Nature.</p>
        </div>
        <div className="rh-header-actions">
          <button type="button" className="rh-notify-btn" aria-label="Notifications">
            <Bell size={20} {...ICON_PROPS} />
            <span className="rh-notify-badge">3</span>
          </button>
          <div className="rh-profile">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E2E8CE&color=2D5A27`} 
              alt={firstName} 
              className="rh-profile-img" 
            />
            <div className="rh-profile-meta">
              <span className="rh-profile-name">{firstName}</span>
              <span className="rh-profile-badge">
                <BadgeCheck size={14} strokeWidth={2.25} />
                Eco Warrior
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats row */}
      <div className="rh-stats-grid">
        <div className="rh-stat-card">
          <div className="rh-stat-icon rh-stat-icon--green">
            <Coins size={22} {...ICON_PROPS} />
          </div>
          <div className="rh-stat-body">
            <span className="rh-stat-label">Total Points</span>
            <span className="rh-stat-value">1,240</span>
          </div>
        </div>
        <div className="rh-stat-card">
          <div className="rh-stat-icon rh-stat-icon--purple">
            <Trophy size={22} {...ICON_PROPS} />
          </div>
          <div className="rh-stat-body">
            <span className="rh-stat-label">Current Rank</span>
            <span className="rh-stat-value">#42</span>
          </div>
        </div>
        <div className="rh-stat-card rh-stat-card--wide">
          <div className="rh-stat-icon rh-stat-icon--green">
            <Medal size={22} {...ICON_PROPS} />
          </div>
          <div className="rh-stat-body rh-stat-body--grow">
            <span className="rh-stat-label">Your Level</span>
            <span className="rh-stat-value rh-stat-value--sm">Eco Warrior</span>
            <div className="rh-level-bar">
              <div className="rh-level-fill" style={{ width: '41%' }} />
            </div>
            <span className="rh-level-hint">1,760 pts to next level</span>
          </div>
        </div>
        <div className="rh-stat-card">
          <div className="rh-stat-icon rh-stat-icon--orange">
            <Flame size={22} {...ICON_PROPS} />
          </div>
          <div className="rh-stat-body">
            <span className="rh-stat-label">Day Streak</span>
            <span className="rh-stat-value">7</span>
          </div>
        </div>
      </div>

      {/* Monthly prize */}
      <section className="rh-prize-banner">
        <div className="rh-prize-copy">
          <div className="rh-prize-badge">
            <Crown size={18} className="rh-crown" strokeWidth={2} />
            Monthly Top Prize
            <Award size={14} className="rh-icon" strokeWidth={2} />
          </div>
          <h2 className="rh-prize-title">Pink Princess Philodendron!</h2>
          <p className="rh-prize-desc">
            Complete missions this month to enter the draw for this rare beauty.
          </p>
          <div className="rh-prize-meta">
            <span className="rh-prize-timer">
              <Calendar size={14} {...ICON_PROPS} />
              14 days left
            </span>
            <button type="button" className="rh-prize-cta">
              View Details
              <ChevronRight size={16} strokeWidth={2.25} />
            </button>
          </div>
        </div>
        <div className="rh-prize-visual">
          <img
            src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80"
            alt="Pink Princess Philodendron"
            className="rh-prize-img"
          />
        </div>
      </section>

      {/* How to earn */}
      <section className="rh-section">
        <h3 className="rh-section-title">How to earn</h3>
        <div className="rh-earn-grid">
          {EARN_TASKS.map((task) => {
            const Icon = task.icon;
            return (
              <div key={task.label} className="rh-earn-card">
                <div className={`rh-earn-icon rh-earn-icon--${task.tone}`}>
                  <Icon size={22} {...ICON_PROPS} />
                </div>
                <span className="rh-earn-label">{task.label}</span>
                <span className="rh-earn-pts">+{task.pts} pts</span>
                <button type="button" className="rh-earn-go" aria-label={`Start ${task.label}`}>
                  <ChevronRight size={16} strokeWidth={2.25} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Environmental impact */}
      <section className="rh-impact">
        <h3 className="rh-impact-title">Your Environmental Impact</h3>
        <div className="rh-impact-grid">
          {IMPACT_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rh-impact-item">
                <div className={`rh-impact-icon rh-impact-icon--${stat.tone}`}>
                  <Icon size={20} {...ICON_PROPS} />
                </div>
                <span className="rh-impact-value">{stat.value}</span>
                <span className="rh-impact-label">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leaderboard + Redeem */}
      <div className="rh-split">
        <section className="rh-panel">
          <h3 className="rh-panel-title">Leaderboard</h3>
          <div className="rh-leaderboard">
            {LEADERBOARD.map((user, index) => (
              <div
                key={user.id}
                className={`rh-lb-row${user.isYou ? ' rh-lb-row--you' : ''}${index < 3 && !user.isYou ? ' rh-lb-row--top' : ''}`}
              >
                <span className="rh-lb-rank">{index + 1}</span>
                <span className={`rh-lb-avatar rh-lb-avatar--${user.tone}`}>{user.initial}</span>
                <span className="rh-lb-name">
                  {user.name}
                  {user.label && <em className="rh-lb-you"> — {user.label}</em>}
                </span>
                <span className="rh-lb-pts">{user.points.toLocaleString()} pts</span>
              </div>
            ))}
          </div>
          <button type="button" className="rh-panel-link">
            View Full Leaderboard
            <ChevronRight size={16} strokeWidth={2.25} />
          </button>
        </section>

        <section className="rh-panel">
          <h3 className="rh-panel-title">Redeem Rewards</h3>
          <div className="rh-rewards-grid">
            {REWARDS.map((reward) => {
              const Icon = reward.icon;
              return (
                <div
                  key={reward.title}
                  className={`rh-reward-card${reward.premium ? ' rh-reward-card--premium' : ''}${reward.mystery ? ' rh-reward-card--mystery' : ''}`}
                >
                  {reward.premium && (
                    <span className="rh-reward-premium-tag">
                      <Crown size={12} strokeWidth={2.25} />
                      Premium
                    </span>
                  )}
                  <div className={`rh-reward-icon${reward.mystery ? ' rh-reward-icon--mystery' : ''}${reward.premium ? ' rh-reward-icon--premium' : ''}`}>
                    {reward.mystery ? (
                      <HelpCircle size={26} {...ICON_PROPS} />
                    ) : (
                      <Icon size={24} {...ICON_PROPS} />
                    )}
                  </div>
                  <span className="rh-reward-name">{reward.title}</span>
                  <span className="rh-reward-pts">{reward.pts.toLocaleString()} pts</span>
                </div>
              );
            })}
          </div>
          <button type="button" className="rh-explore-btn">
            Explore All Rewards
            <ChevronRight size={18} strokeWidth={2.25} />
          </button>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="rh-cta-banner">
        <p className="rh-cta-text">Ready to become a Green Legend?</p>
        <button type="button" className="rh-cta-btn">
          Explore New Missions
          <Target size={16} {...ICON_PROPS} />
        </button>
      </section>
    </div>
  );
}
