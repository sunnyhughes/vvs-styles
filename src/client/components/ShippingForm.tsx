import { useState } from "react";
import { Button } from "./Button";
import type { ShippingAddress } from "../lib/checkout";

export interface ShippingFormValue {
  email: string;
  shipping: ShippingAddress;
}

const US_STATES: Array<{ code: string; name: string }> = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const inputClass =
  "mt-1 block w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 font-sans text-base text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 focus-visible:ring-offset-2";

const labelClass = "block font-sans text-sm font-medium text-stone-700";

/**
 * Collects the buyer's email + US shipping address. On submit, calls
 * `onSubmit` with the validated value — the parent uses it to create the
 * Payment Intent before mounting the Stripe widget.
 */
export function ShippingForm({
  onSubmit,
  submitting,
}: {
  onSubmit: (value: ShippingFormValue) => void;
  submitting: boolean;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit({
      email: email.trim(),
      shipping: {
        name: name.trim(),
        addressLine1: line1.trim(),
        addressLine2: line2.trim() ? line2.trim() : null,
        city: city.trim(),
        state,
        postalCode: zip.trim(),
        country: "US",
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="ship-email" className={labelClass}>
          Email
        </label>
        <input
          id="ship-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="ship-name" className={labelClass}>
          Full name
        </label>
        <input
          id="ship-name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="ship-line1" className={labelClass}>
          Address
        </label>
        <input
          id="ship-line1"
          type="text"
          autoComplete="address-line1"
          required
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="ship-line2" className={labelClass}>
          Apartment, suite, etc.{" "}
          <span className="text-stone-500">(optional)</span>
        </label>
        <input
          id="ship-line2"
          type="text"
          autoComplete="address-line2"
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="ship-city" className={labelClass}>
            City
          </label>
          <input
            id="ship-city"
            type="text"
            autoComplete="address-level2"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ship-state" className={labelClass}>
            State
          </label>
          <select
            id="ship-state"
            autoComplete="address-level1"
            required
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select…
            </option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-1/2 pr-2">
        <label htmlFor="ship-zip" className={labelClass}>
          ZIP code
        </label>
        <input
          id="ship-zip"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          required
          pattern="[0-9]{5}(-[0-9]{4})?"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className={inputClass}
        />
      </div>

      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? "Preparing payment…" : "Continue to payment"}
      </Button>
    </form>
  );
}
