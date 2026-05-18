import GamificationModulePage from '@/components/gamification/GamificationModulePage';
import { GAMIFICATION_MODULES } from '@/config/gamificationModules';

const PrizesharkCatalogPage = () => (
  <GamificationModulePage config={GAMIFICATION_MODULES['prizeshark-catalog']} />
);

export default PrizesharkCatalogPage;
