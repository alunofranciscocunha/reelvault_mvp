"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import Search from "./search"

const SidebarSheet = () => {

  return (
    <SheetContent className="overflow-y-auto">
      <SheetHeader>
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex flex-col gap-2 border-b border-solid p-5">
        <Search />
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        <SheetClose asChild>
          <Button className="justify-start gap-2" variant="ghost" asChild>
            <Link href="/">
              <Image alt="Voltar para o inicio" src="/icons/home.svg" width={16} height={16} />
              Inicio
            </Link>
          </Button>
        </SheetClose>
        <Button className="justify-start gap-2" variant="ghost" asChild>
          <Link href="/favorites">
            <Image alt="Favoritos" src="/icons/star.svg" width={14} height={14}/>
            Favoritos
          </Link>
        </Button>
      </div>
    </SheetContent>
  )
}

export default SidebarSheet
