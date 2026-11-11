/** Keuzelijsten voor het contactformulier; gedeeld door formulier, validatie en admin. */

export const REQUEST_TYPES = [
  { value: "kennismaking", label: "Kennismakingsgesprek", hint: "Vrijblijvend, ongeveer 30 minuten" },
  { value: "offerte", label: "Offerteaanvraag", hint: "Je hebt een concreet project in gedachten" },
  { value: "vraag", label: "Algemene vraag", hint: "Iets anders, of je weet het nog niet precies" },
] as const;

export const SERVICE_OPTIONS = [
  { value: "software", label: "Maatwerksoftware" },
  { value: "web", label: "Website of webshop" },
  { value: "automation", label: "Automatisering of AI" },
  { value: "data", label: "Koppelingen of data" },
  { value: "support", label: "Onderhoud of doorontwikkeling" },
  { value: "anders", label: "Weet ik nog niet" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "", label: "Geen voorkeur / weet ik nog niet" },
  { value: "<5k", label: "Tot € 5.000" },
  { value: "5-15k", label: "€ 5.000 – € 15.000" },
  { value: "15-40k", label: "€ 15.000 – € 40.000" },
  { value: ">40k", label: "Meer dan € 40.000" },
] as const;

export type RequestType = (typeof REQUEST_TYPES)[number]["value"];
export type ServiceOption = (typeof SERVICE_OPTIONS)[number]["value"];

export const REQUEST_TYPE_VALUES = REQUEST_TYPES.map((item) => item.value) as [RequestType, ...RequestType[]];
export const SERVICE_VALUES = SERVICE_OPTIONS.map((item) => item.value) as [ServiceOption, ...ServiceOption[]];
export const BUDGET_VALUES = BUDGET_OPTIONS.map((item) => item.value) as [string, ...string[]];

export function labelFor(
  options: readonly { value: string; label: string }[],
  value: string | null | undefined,
): string | null {
  if (!value) return null;
  return options.find((option) => option.value === value)?.label ?? null;
}
