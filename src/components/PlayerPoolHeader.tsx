import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

const columnTooltips = {
  name: "Player's full name as listed in DraftKings",
  pos: "Player's position (QB, RB, WR, TE, DST for NFL)",
  salary: "DraftKings salary for this slate",
  team: "Player's team abbreviation",
  opp: "Opposing team abbreviation",
  proj: "Projected fantasy points for this slate",
  own: "Projected ownership percentage for this slate",
  status: "Player availability status",
  snap: "Percentage of offensive snaps played (NFL)",
  target: "Target share percentage (NFL)",
  rush: "Rush share percentage (NFL)"
};

const PlayerPoolHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-primary/30">
        {Object.entries(columnTooltips).map(([key, tooltip]) => (
          <TableHead key={key}>
            <div className="flex items-center gap-1">
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[250px]">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default PlayerPoolHeader;