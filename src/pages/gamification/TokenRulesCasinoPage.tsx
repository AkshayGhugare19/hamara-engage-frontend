import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const TokenRulesCasinoPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['token-rules-casino']} />
);

export default TokenRulesCasinoPage;
