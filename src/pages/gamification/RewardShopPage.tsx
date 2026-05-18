import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const RewardShopPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['reward-shop']} />
);

export default RewardShopPage;
