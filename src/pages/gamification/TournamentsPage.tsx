import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const TournamentsPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['tournaments']} />
);

export default TournamentsPage;
