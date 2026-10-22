import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuoteCardProps {
  quote: string;
  author: string;
}

export function QuoteCard({ quote, author }: QuoteCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[rgb(37,99,235)] to-[rgb(16,185,129)] border-0 text-white">
      <CardContent className="p-5">
        <Quote className="h-6 w-6 opacity-60 mb-3" />
        <p className="text-sm leading-relaxed font-medium">{quote}</p>
        <p className="text-xs mt-3 opacity-75">— {author}</p>
      </CardContent>
    </Card>
  );
}
