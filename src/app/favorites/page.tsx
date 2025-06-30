"use client";
import CardMovie from "@/_components/card-movie";
import { MoviesProps } from "@/_components/cards-row";
import Header from "@/_components/header";
import Search from "@/_components/search";
import { Button } from "@/_components/ui/button";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Favorites = () => {
  const [favMovies, setFavMovies] = useState<MoviesProps[] | null>([]);
  //Pega os filmes favoritos do local storage quando o componente for renderizado
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const favorites = JSON.parse(stored);
      setFavMovies(favorites);
    }
  }, []);
  //Funcao que remove o filme dos favoritos e atualiza o state dos filmes
  const handleRemoveFromFavorites = (id: number) => {
    if (!favMovies) return;

    const stored = localStorage.getItem("favorites");
    const favorites = stored ? JSON.parse(stored) : [];

    const updated = favorites.filter((fav: MoviesProps) => fav.id !== id);
    setFavMovies(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    toast.success("Filme removido dos favoritos!");
  };

  return (
    <div>
      <Header />
      <div className="my-6 px-5 md:hidden md:px-62">
        <Search />
      </div>
      <div className="px-5 mt-6 md:px-32">
        <h2 className="mb-3 md:mb-5 text-xs md:text-base md:text-white font-bold uppercase w-full truncate">
          Favoritos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favMovies?.map((fv) => (
            <div key={fv.id} className="relative">
              <CardMovie
                movieId={fv.id}
                imageSrc={`https://image.tmdb.org/t/p/original/${fv.poster_path}`}
                title={fv.title}
              />
              <Button
                variant="destructive"
                size={"sm"}
                className="absolute top-0 bg-gray-500"
                onClick={() => handleRemoveFromFavorites(fv.id)}
              >
                <TrashIcon />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
