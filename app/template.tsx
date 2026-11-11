/**
 * Een template wordt bij iedere navigatie opnieuw gemount; zo krijgt
 * elke pagina een subtiele inkomende overgang.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
