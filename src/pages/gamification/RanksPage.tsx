import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const RanksPage = () => <GamificationModulePage config={GAMIFICATION_MODULES['ranks']} />;

export default RanksPage;
