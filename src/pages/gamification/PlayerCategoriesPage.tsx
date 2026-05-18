import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const PlayerCategoriesPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['player-categories']} />
);

export default PlayerCategoriesPage;
