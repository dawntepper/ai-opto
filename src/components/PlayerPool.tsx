import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { Player } from '../types';
import PlayerPoolHeader from './PlayerPoolHeader';
import PlayerPoolRow from './PlayerPoolRow';

const PlayerPool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players] = useState<Player[]>([]);

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <PlayerPoolHeader />
          <TableBody>
            {filteredPlayers.map((player) => (
              <PlayerPoolRow key={player.id} player={player} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerPool;