import { NFLStrategy } from "@/types/nfl-strategy";
import { TabsContent } from "./ui/tabs";

interface NFLStrategyContentProps {
  strategy: NFLStrategy;
}

export const NFLStrategyContent = ({ strategy }: NFLStrategyContentProps) => {
  const renderList = (items: string[]) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-secondary mr-2">•</span>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <TabsContent value="principles">
        {renderList(strategy.keyPrinciples)}
      </TabsContent>

      <TabsContent value="ownership">
        {renderList(strategy.ownershipRules)}
      </TabsContent>

      <TabsContent value="stacking">
        {renderList(strategy.stackingRules)}
      </TabsContent>

      <TabsContent value="environment">
        {renderList(strategy.gameEnvironment)}
      </TabsContent>

      <TabsContent value="salary">
        {renderList(strategy.salaryDistribution)}
      </TabsContent>

      <TabsContent value="positions">
        {renderList(strategy.positionRules)}
      </TabsContent>
    </>
  );
};