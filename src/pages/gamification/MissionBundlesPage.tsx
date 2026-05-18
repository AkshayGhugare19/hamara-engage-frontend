import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const MissionBundlesPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['mission-bundles']} />
);

export default MissionBundlesPage;
