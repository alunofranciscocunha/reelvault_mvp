import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import RatingStars from "./rating-stars";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface CommentCardProps {
  comment: {
    userName: string;
    title: string;
    content: string;
    rating: number;
    isRecommended: boolean | null;
    date?: string;
    movieId?: string;
  };
}

function formatRelativeDate(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isToday(date)) {
    return `hoje às ${format(date, "HH:mm", { locale: ptBR })}`;
  }

  if (isYesterday(date)) {
    return "ontem";
  }

  return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
}

const CommentCard = ({ comment }: CommentCardProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md border border-gray-700 flex-shrink-0 w-[350px]">
      <div className="flex gap-4 items-center">
        <Avatar>
          <AvatarImage src="/icons/Icon.svg" alt="Icone de usuario" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <RatingStars ratingValue={comment.rating} />
          <h3 className="text-sm font-semibold">{comment.userName}</h3>
        </div>
      </div>
      <h2 className="font-bold text-wrap wrap-break-word">{comment.title}</h2>
      <p className="text-sm text-gray-300 wrap-break-word">
        {comment.content}
      </p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">{formatRelativeDate(comment.date)}</p>
        <div className="flex gap-2">
          {comment.isRecommended ? (
            <Button variant="outline">
              Recomenda
              <Image
                src="/icons/Like.svg"
                width={32}
                height={32}
                alt="Icone de like"
              />
            </Button>
          ) : (
            <Button variant="outline">
              Não Recomenda
              <Image
                src="/icons/Dislike.svg"
                width={32}
                height={32}
                alt="Icone de Dislike"
              />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
