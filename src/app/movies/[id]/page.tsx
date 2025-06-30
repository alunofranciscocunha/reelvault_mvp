"use client";
import { MoviesProps } from "@/_components/cards-row";
import CommentsRow from "@/_components/comments-row";
import Header from "@/_components/header";
import { MovieSkeleton } from "@/_components/movie-skeleton";
import RatingStars from "@/_components/rating-stars";
import SecondHeader from "@/_components/second-header";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { Textarea } from "@/_components/ui/textarea";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { format } from "date-fns";
import { MessageSquarePlus, PlayIcon, StarIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Skeleton } from "@/_components/ui/skeleton";

interface Genre {
  id: number;
  name: string;
}

const genreShortMap: Record<string, string> = {
  "Science Fiction": "Sci-Fi",
  Documentário: "Doc",
  Aventura: "Avent.",
  "Ficção científica": "Ficção C.",
};

const shortenGenre = (name: string) => genreShortMap[name] || name;

const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

export type CommentData = {
  userName: string;
  title: string;
  content: string;
  rating: number;
  isRecommended: boolean | null;
  date?: string;
  movieId?: string;
};

const MovieInfo = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<
    (MoviesProps & { genres?: Genre[] }) | null
  >(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: { language: "pt-BR" },
        headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
      })
      .then((res) => setMovie(res.data))
      .catch((err) =>
        toast.error("Erro ao carregar os dados do filme: " + err.message)
      );
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const stored = localStorage.getItem("comments");
    if (stored) {
      const list = JSON.parse(stored);
      const filtered = list.filter((c: CommentData) => c.movieId === id);
      setComments(filtered);
    }
  }, [id]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CommentData>({
    defaultValues: {
      userName: "",
      title: "",
      content: "",
      rating: 1,
      isRecommended: null,
    },
  });

  const onSubmit = (data: CommentData) => {
    const comment: CommentData = {
      ...data,
      movieId: id as string,
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"), // Data no formato completo ISO-like
    };

    const stored = localStorage.getItem("comments");
    const list = stored ? JSON.parse(stored) : [];
    list.push(comment);
    localStorage.setItem("comments", JSON.stringify(list));
    setComments((prev) => [...prev, comment]);

    toast.success("Comentário adicionado com sucesso!");
    reset();
    setTimeout(() => {
      dialogCloseRef.current?.click();
    }, 0);
  };

  //Adiconar Filme aos Favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!movie) return;

    const stored = localStorage.getItem("favorites");
    if (stored) {
      const favorites = JSON.parse(stored);
      const exists = favorites.some((fav: MoviesProps) => fav.id === movie.id);
      setIsFavorite(exists);
    }
  }, [movie]);

  const handleAddToFavorites = () => {
    if (!movie) return;

    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    if (!favorites.some((fav: MoviesProps) => fav.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success("Filme adicionado aos favoritos!");
    }
  };

  const handleRemoveFromFavorites = () => {
    if (!movie) return;

    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    const updated = favorites.filter((fav: MoviesProps) => fav.id !== movie.id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(false);
    toast.success("Filme removido dos favoritos!");
  };

  const recommended = watch("isRecommended");

  return (
    <div>
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="md:hidden">
        <SecondHeader />
      </div>

      {!movie ? <MovieSkeleton /> : (
        <>
          {/* Backdrop */}
          {movie.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
              alt={movie.title}
              width={3840}
              height={2160}
              priority
              className="w-full h-auto md:w-[90%] md:h-[400px] object-cover md:mx-auto md:rounded-xl"
            />
          ) : (
            <Skeleton className="w-full h-[180px] md:w-[90%] md:h-[400px] md:mx-auto md:rounded-xl flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Sem imagem de fundo</span>
            </Skeleton>
          )}

          <div className="flex px-5 w-full h-[100px] gap-2 md:px-32">
            {/* Poster */}
            {movie.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                alt={movie.title}
                width={614}
                height={921}
                className="w-[120px] h-[180px] object-cover rounded-lg -translate-y-22"
              />
            ) : (
              <Skeleton className="w-[120px] h-[180px] rounded-lg flex items-center justify-center -translate-y-22">
                <span className="text-xs text-muted-foreground">Sem poster</span>
              </Skeleton>
            )}
            <div className="flex flex-col items-start justify-center gap-2 p-2 w-full h-[90px]">
              <h2 className="text-sm font-bold md:text-lg">{movie.title}</h2>
              <RatingStars
                ratingValue={Math.max(1, Math.round(movie.vote_average / 2))}
              />
              <div className="flex items-center justify-between md:justify-start md:gap-4 w-full">
                <div className="flex gap-1 flex-wrap max-w-[70%]">
                  {movie.genres?.slice(0, 3).map((g) => (
                    <Badge
                      key={g.id}
                      className="text-[10px] md:text-[12px] h-[16px] md:h-[18px] md:px-2 px-1 max-w-[80px] truncate"
                      variant="secondary"
                      title={g.name}
                    >
                      {shortenGenre(g.name)}
                    </Badge>
                  ))}
                </div>
                <div className="h-full w-[2px] bg-gray-500"></div>
                <p className="text-[12px] font-bold md:text-[14px]">
                  {movie.release_date?.substring(0, 4) || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-3 md:px-32">
            <h3 className="text-lg font-semibold md:font-bold mb-2">Sinopse</h3>
            <p className="text-sm md:text-lg text-gray-300">{movie.overview}</p>

            <div className="md:flex md:gap-3">
              <Button
              className="mt-4 w-full md:flex-1"
              variant="outline"
              onClick={() =>
                window.open(
                  `https://www.themoviedb.org/movie/${movie.id}`,
                  "_blank"
                )
              }
            >
              Visualizar no TMDB
              <PlayIcon />
            </Button>

            <Button
              className="mt-4 w-full md:flex-1"
              variant={"outline"}
              onClick={
                isFavorite ? handleRemoveFromFavorites : handleAddToFavorites
              }
            >
              {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              {isFavorite ? <TrashIcon /> : <StarIcon />}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full md:flex-1" variant="outline">
                  Adicionar Comentário
                  <MessageSquarePlus />
                </Button>
              </DialogTrigger>

              <DialogContent className="w-[90%] flex flex-col">
                <DialogHeader>
                  <DialogTitle>Novo Comentário</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Nome:</Label>
                    <Input
                      id="userName"
                      {...register("userName", {
                        required: "Informe seu nome",
                      })}
                    />
                    {errors.userName && (
                      <p className="text-red-500 text-sm">
                        {errors.userName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Título:</Label>
                    <Input
                      id="title"
                      {...register("title", { required: "Título obrigatório" })}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Comentário:</Label>
                    <Textarea
                      id="content"
                      {...register("content", {
                        required: "Conteúdo obrigatório",
                      })}
                      placeholder="Escreva seu comentário"
                      className="w-full resize-y break-words"
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm">
                        {errors.content.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Label>Recomenda:</Label>
                    <Button
                      type="button"
                      variant={recommended === true ? "default" : "outline"}
                      onClick={() => setValue("isRecommended", true)}
                    >
                      <Image
                        src="/icons/Like.svg"
                        width={32}
                        height={32}
                        alt="Like"
                      />
                    </Button>
                    <Button
                      type="button"
                      variant={recommended === false ? "default" : "outline"}
                      onClick={() => setValue("isRecommended", false)}
                    >
                      <Image
                        src="/icons/Dislike.svg"
                        width={32}
                        height={32}
                        alt="Dislike"
                      />
                    </Button>
                    {errors.isRecommended && (
                      <p className="text-red-500 text-sm">
                        Selecione uma opção
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Label>Estrelas:</Label>
                    <Controller
                      name="rating"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Rating
                          {...field}
                          precision={0.5}
                          sx={{
                            color: "#34D399",
                            "& .MuiRating-iconEmpty": { color: "#B0B0B0" },
                          }}
                        />
                      )}
                    />
                    {errors.rating && (
                      <p className="text-red-500 text-sm">Informe a nota</p>
                    )}
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        ref={dialogCloseRef}
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button type="submit">Confirmar</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            </div>

          </div>

          <div className="px-5 py-3 md:px-32">
            <h2 className="mb-3 text-xs md:text-base font-bold text-gray-400 md:text-white">
              Comentários
            </h2>

            <CommentsRow comments={comments} />
          </div>
        </>
      )}
    </div>
  );
};

export default MovieInfo;
