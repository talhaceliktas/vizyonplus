"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/shadcn/accordion";

export default function Page() {
  return (
    <div className="w-full max-w-sm pt-44">
      <Accordion type="single" collapsible>
        <AccordionItem value="kategori-1" className="text-primary-50">
          <AccordionTrigger>İçerikler</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <a href="#" className="hover:text-secondary-1-2 block">
                İçerik Ekle
              </a>
              <a href="#" className="hover:text-secondary-1-2 block">
                İçerik Düzenle
              </a>
              <a href="#" className="hover:text-secondary-1-2 block">
                İçerik Sil
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
