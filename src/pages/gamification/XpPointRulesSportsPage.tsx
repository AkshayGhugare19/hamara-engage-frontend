import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const XpPointRulesSportsPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['xp-point-rules-sports']} />
);

export default XpPointRulesSportsPage;
