import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pin: string;
}

const ShareDialog = ({ open, onOpenChange, pin }: ShareDialogProps) => {
  const shareUrl = `${window.location.origin}/shared/${pin}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Share Your Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Your PIN</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={pin}
                readOnly
                className="bg-background text-center text-2xl tracking-widest"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(pin)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Share Link</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={shareUrl}
                readOnly
                className="bg-background"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(shareUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Anyone with your PIN or link can view all your notes.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
