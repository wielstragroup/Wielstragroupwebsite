import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Lees hoe Wielstra Group omgaat met persoonsgegevens.",
  alternates: { canonical: "/privacybeleid" },
};

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const contactEmail = settings.email || "[e-mailadres invullen]";

  return (
    <LegalPage
      title="Privacybeleid"
      updated="29 augustus 2026"
      intro={`${settings.companyName} respecteert je privacy en gaat zorgvuldig om met persoonsgegevens, in lijn met de Algemene Verordening Gegevensbescherming (AVG/GDPR).`}
    >
      <div>
        <h2>1. Wie is verantwoordelijk voor je gegevens?</h2>
        <p>
          {settings.companyName} is de verwerkingsverantwoordelijke voor de persoonsgegevens die via
          deze website worden verzameld.
        </p>
        <ul>
          <li>Bedrijfsnaam: {settings.companyName}</li>
          {settings.address ? <li>Adres: {settings.address}</li> : null}
          <li>
            E-mail: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </li>
          {settings.phone ? <li>Telefoon: {settings.phone}</li> : null}
        </ul>
      </div>

      <div>
        <h2>2. Welke gegevens verzamelen we en waarom?</h2>

        <h3>Contactformulier</h3>
        <p>
          Wanneer je het contactformulier invult, verwerken we je naam, (optioneel) bedrijfsnaam,
          e-mailadres en bericht. We gebruiken deze gegevens uitsluitend om te reageren op je
          aanvraag. De grondslag hiervoor is ons gerechtvaardigd belang om vragen van (potentiële)
          klanten te beantwoorden, en waar van toepassing de uitvoering van (voor)overeenkomsten.
        </p>

        <h3>Bezoekstatistieken (analytics)</h3>
        <p>
          We houden geanonimiseerde bezoekstatistieken bij (welke pagina&apos;s worden bezocht en
          hoe vaak). Hiervoor gebruiken we geen trackingcookies en slaan we geen IP-adressen op:
          bezoekers worden herkend via een dagelijks roterende, onomkeerbare hash die na 24 uur niet
          meer herleidbaar is naar eerdere bezoeken. Omdat deze methode geen of nauwelijks impact
          heeft op je privacy, is hiervoor geen toestemming vereist. Zie ons{" "}
          <a href="/cookiebeleid">cookiebeleid</a> voor meer details.
        </p>
      </div>

      <div>
        <h2>3. Hoe lang bewaren we gegevens?</h2>
        <ul>
          <li>
            Berichten via het contactformulier bewaren we zolang dat nodig is om je aanvraag af te
            handelen, en daarna maximaal 2 jaar, tenzij je eerder om verwijdering vraagt.
          </li>
          <li>Geanonimiseerde bezoekstatistieken bewaren we maximaal 14 maanden.</li>
        </ul>
      </div>

      <div>
        <h2>4. Delen we gegevens met derden?</h2>
        <p>
          We delen je gegevens niet met derden voor commerciële doeleinden. We maken wel gebruik van
          de volgende verwerkers, die uitsluitend in onze opdracht en volgens onze instructies
          gegevens verwerken:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — voor het opslaan van gegevens (database en hosting).
          </li>
          <li>
            <strong>Resend</strong> — voor het versturen van e-mailnotificaties bij een nieuw
            contactformulier.
          </li>
        </ul>
        <p>Met deze partijen zijn passende afspraken gemaakt over de bescherming van je gegevens.</p>
      </div>

      <div>
        <h2>5. Beveiliging</h2>
        <p>
          We nemen passende technische en organisatorische maatregelen om je gegevens te beveiligen
          tegen verlies of onrechtmatig gebruik, waaronder versleutelde verbindingen (HTTPS) en
          toegangsbeveiliging voor ons beheerderspaneel.
        </p>
      </div>

      <div>
        <h2>6. Jouw rechten</h2>
        <p>Op grond van de AVG heb je de volgende rechten:</p>
        <ul>
          <li>Recht op inzage in de gegevens die we van je verwerken.</li>
          <li>Recht op rectificatie van onjuiste gegevens.</li>
          <li>Recht op verwijdering van je gegevens.</li>
          <li>Recht op beperking van de verwerking.</li>
          <li>Recht op bezwaar tegen de verwerking.</li>
          <li>Recht op overdraagbaarheid van je gegevens.</li>
        </ul>
        <p>
          Wil je een van deze rechten uitoefenen? Neem contact op via{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. Je hebt ook het recht om een klacht
          in te dienen bij de Autoriteit Persoonsgegevens.
        </p>
      </div>

      <div>
        <h2>7. Wijzigingen</h2>
        <p>
          We kunnen dit privacybeleid van tijd tot tijd aanpassen. De meest actuele versie staat
          altijd op deze pagina.
        </p>
      </div>

      <div>
        <h2>8. Contact</h2>
        <p>
          Heb je vragen over dit privacybeleid? Neem contact op via{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </div>
    </LegalPage>
  );
}
