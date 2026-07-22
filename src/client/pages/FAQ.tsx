import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { faqItems } from "../content/faq";

/** The `/faq` page: an accessible Disclosure accordion. */
export function FAQ() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <header>
        <h1 className="font-display text-5xl leading-tight text-emerald-800">
          Frequently asked questions
        </h1>
        <p className="mt-4 font-sans text-lg text-stone-700">
          Sizing, shipping, returns, and how customization works. Still stuck?
          We&rsquo;re one email away.
        </p>
      </header>

      <dl className="mt-10 divide-y divide-stone-200 border-t border-stone-200">
        {faqItems.map((item) => (
          <Disclosure as="div" key={item.q} className="py-2">
            <dt>
              <DisclosureButton className="group flex w-full items-center justify-between gap-4 rounded-md py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2">
                <span className="font-display text-2xl text-emerald-800">
                  {item.q}
                </span>
                <ChevronDownIcon
                  className="h-6 w-6 flex-none text-stone-500 transition-transform duration-200 group-data-[open]:rotate-180"
                  aria-hidden="true"
                />
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" className="pb-4 pr-10">
              {item.a.map((paragraph, i) => (
                <p
                  key={i}
                  className="mt-2 font-sans text-base leading-relaxed text-stone-700"
                >
                  {paragraph}
                </p>
              ))}
            </DisclosurePanel>
          </Disclosure>
        ))}
      </dl>
    </div>
  );
}
