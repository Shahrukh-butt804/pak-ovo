import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionSection {
  title: string;
  content: string; // HTML string from Jodit
}

interface AccordionProps {
  sections: AccordionSection[];
  defaultOpenIndex?: number | null;
}

function isRichTextEmpty(html?: string): boolean {
  if (!html) return true;
  const stripped = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  return stripped.length === 0;
}

export function Accordion({ sections, defaultOpenIndex = null }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  const visibleSections = sections.filter((s) => !isRichTextEmpty(s.content));

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  if (visibleSections.length === 0) return null;

  return (
    <div className="w-full">
      {visibleSections.map((section, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-base font-semibold text-gray-900">{section.title}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-700 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}