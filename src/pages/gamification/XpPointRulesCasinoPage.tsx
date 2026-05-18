import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const XpPointRulesCasinoPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['xp-point-rules-casino']} />
);

export default XpPointRulesCasinoPage;
