import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const PurchaseFeedPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['purchase-feed']} />
);

export default PurchaseFeedPage;
