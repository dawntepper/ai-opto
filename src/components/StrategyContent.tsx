import { Strategy } from "@/types/strategy";
import { TabsContent } from "./ui/tabs";

interface StrategyContentProps {
  strategy: Strategy;
}

export const StrategyContent = ({ strategy }: StrategyContentProps) => {
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
        {strategy.type === 'single' && renderList(strategy.ownershipManagement)}
        {strategy.type === '3-max' && renderList(strategy.ownershipStructure)}
        {strategy.type === '20-max' && renderList(strategy.portfolioManagement)}
      </TabsContent>

      <TabsContent value="builds">
        {strategy.type === 'single' && renderList(strategy.rosterConstruction)}
        {(strategy.type === '3-max' || strategy.type === '20-max') && renderList(strategy.buildTypes)}
      </TabsContent>

      {strategy.type === 'single' && (
        <TabsContent value="checklist">
          {renderList(strategy.checklist)}
        </TabsContent>
      )}

      {strategy.type === '20-max' && (
        <TabsContent value="advanced">
          {renderList(strategy.advancedConcepts)}
        </TabsContent>
      )}
    </>
  );
};