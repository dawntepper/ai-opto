import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Player } from '../types';

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Stephen Curry',
    position: 'PG',
    salary: 10200,
    team: 'GSW',
    opponent: 'LAL',
    projectedPoints: 48.5,
    ownership: 25.5,
    status: 'available'
  },
  // Add more mock players here
];

const PlayerPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players] = useState<Player[]>(mockPlayers);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columnTooltips = {
    name: "Player's full name as listed in DraftKings",
    pos: "Player's eligible position(s)",
    salary: "DraftKings salary for this slate",
    team: "Player's team abbreviation",
    opp: "Opposing team abbreviation",
    proj: "Projected fantasy points for this slate",
    own: "Projected ownership percentage for this slate",
    status: "Player availability status (available, questionable, or out)"
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Player Pool</h2>
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs bg-white/5"
        />
      </div>

      <div className="rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/30">
              <TableHead>
                <div className="flex items-center gap-1">
                  Name
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Pos
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.pos}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Salary
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.salary}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Team
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.team}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Opp
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.opp}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Proj
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.proj}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Own%
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.own}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Status
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        <p>{columnTooltips.status}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id} className="hover:bg-white/5">
                <TableCell>{player.name}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>${player.salary.toLocaleString()}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.opponent}</TableCell>
                <TableCell>{player.projectedPoints}</TableCell>
                <TableCell>{player.ownership}%</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${
                    player.status === 'available' ? 'bg-green-500/20' :
                    player.status === 'questionable' ? 'bg-yellow-500/20' :
                    'bg-red-500/20'
                  }`}>
                    {player.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerPool;