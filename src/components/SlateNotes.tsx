import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./ui/use-toast";

const SlateNotes = () => {
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: latestAnalysis } = useQuery({
    queryKey: ['slateAnalysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slate_analysis')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('slate_analysis')
        .insert([{ content }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slateAnalysis'] });
      toast({
        title: "Notes Saved",
        description: "Your slate analysis has been saved successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save slate analysis",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    if (notes.trim()) {
      saveMutation.mutate(notes);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter notes about injuries, weather, or any other relevant slate information..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[100px] bg-white/50"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={!notes.trim() || saveMutation.isPending}
        >
          Save Notes
        </Button>
      </div>
    </div>
  );
};

export default SlateNotes;