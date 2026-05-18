import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const MissionsPage = () => <GamificationModulePage config={GAMIFICATION_MODULES['missions']} />;

export default MissionsPage;
