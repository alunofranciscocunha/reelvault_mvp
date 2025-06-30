import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Search from "./search";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SidebarSheet from "./sidebar-sheet";

const Header = () => {
  return (
    <Card className="xl:px-32 lg:px-12">
      <CardContent className="flex flex-row items-center justify-between p-5">
        {/* Logo */}
        <Link href="/">
          <Image alt="ReelVault" src="/Logo.svg" height={36} width={130} priority />
        </Link>
        {/* Butão de abrir menu em tela mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <MenuIcon />
              </Button>
            </SheetTrigger>

            <SidebarSheet />
          </Sheet>
        </div>
        {/* Barra de pesquisa */}
        <div className="hidden md:flex w-[300px] xl:w-[500px]">
            <Search />
        </div>

        <div className="hidden md:flex">
            <Link href="/">
                <Button variant="ghost" className="hidden md:inline-flex">
                    <Image alt="Voltar para o inicio" src="/icons/home.svg" width={16} height={16} />
                Home
                </Button>
            </Link>
            <Link href="/favorites">
                <Button variant="ghost" className="hidden md:inline-flex">
                    <Image alt="Favoritos" src="/icons/star.svg" width={16} height={16} />
                Favoritos
                </Button>
            </Link>
        </div>


      </CardContent>
    </Card>
  );
};

export default Header;
