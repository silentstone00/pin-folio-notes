import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import NotesList from "@/components/NotesList";

const SharedNotes = () => {
  const { pin } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedNotes();
  }, [pin]);

  const loadSharedNotes = async () => {
    if (!pin) {
      toast.error("Invalid PIN");
      navigate("/");
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("pin", pin)
        .maybeSingle();

      if (profileError || !profile) {
        toast.error("User not found");
        navigate("/");
        return;
      }

      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", profile.user_id)
        .order("updated_at", { ascending: false });

      if (notesError) {
        toast.error("Failed to load notes");
        return;
      }

      setNotes(notesData || []);
      if (notesData && notesData.length > 0) {
        setCurrentNote(notesData[0]);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-64 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Shared Notes</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/")}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <NotesList
          notes={notes}
          currentNote={currentNote}
          onSelectNote={setCurrentNote}
          readOnly
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        {currentNote ? (
          <div className="w-full max-w-3xl h-[80vh] overflow-auto">
            <p className="text-lg whitespace-pre-wrap text-foreground">
              {currentNote.content || "This note is empty."}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">No notes to display</p>
        )}
      </div>
    </div>
  );
};

export default SharedNotes;
