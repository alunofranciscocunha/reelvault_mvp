"use client";
import { useRef, useEffect, useState } from "react";
import CommentCard from "./comment-card";
import { CommentData } from "@/app/movies/[id]/page";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CommentsRowProps {
  comments: CommentData[];
}

const CommentsRow = ({ comments }: CommentsRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateScrollVisibility = () => {
    const el = rowRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setShowLeft(el.scrollLeft > 0);
      setShowRight(hasOverflow && el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  };

  const handleScroll = () => {
    const el = rowRef.current;
    if (el) {
      setShowLeft(el.scrollLeft > 0);
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    }
  };

  const handleScrollRight = () => {
    rowRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    rowRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  useEffect(() => {
    const ref = rowRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }
    window.addEventListener("resize", updateScrollVisibility);

    // Força atualização quando comentários mudam
    updateScrollVisibility();

    return () => {
      if (ref) ref.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScrollVisibility);
    };
  }, [comments]); // <- Recalcula sempre que comments mudar

  return (
    <div className="relative">
      {showLeft && (
        <div className="hidden md:block">
          <Button
            type="button"
            className="md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10"
            onClick={handleScrollLeft}
            aria-label="Scroll para esquerda"
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
      )}
      <div
        ref={rowRef}
        className="flex w-full gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden md:max-h-[280px] md:p-2 scroll-smooth"
      >
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))
        ) : (
          <p className="text-sm text-gray-400">Nenhum comentário ainda.</p>
        )}
      </div>
      {showRight && (
        <div className="hidden md:block">
          <Button
            type="button"
            className="md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 z-10"
            onClick={handleScrollRight}
            aria-label="Scroll para direita"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsRow;