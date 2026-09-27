import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: Props) {
  return (
    <Button
      size="icon-lg"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-elev-3 transition-[transform,box-shadow] hover:scale-110 hover:shadow-elev-3 active:scale-95 md:hidden"
      aria-label="Add application"
    >
      <Plus className="size-6" />
    </Button>
  );
}
