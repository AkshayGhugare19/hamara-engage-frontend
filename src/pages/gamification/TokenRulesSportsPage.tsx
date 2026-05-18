import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const TokenRulesSportsPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['token-rules-sports']} />
);

export default TokenRulesSportsPage;
