export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  iconName: string;
  metaDescription: string;
  heroText: string;
  highlights: { title: string; desc: string; stat?: string }[];
  process: { step: string; title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  keyStats: { label: string; value: string }[];
}

export const SERVICES_DETAILED: Record<string, ServiceDetail> = {
  sourcing: {
    id: "sourcing",
    slug: "sourcing",
    title: "Exklusive Produktanfragen & Sourcing",
    shortTitle: "Sourcing & Einkauf",
    subtitle: "Direkte Fabrikverhandlung, Qualitätsprüfung und kompromisslose Einkaufspreise für deinen Shopify Store.",
    badge: "Kernleistung",
    iconName: "Search",
    metaDescription: "Procware Sourcing: Stelle Produktanfragen in unter 60 Sekunden. Deutsches Partner-Team verhandelt direkt mit Fabriken für beste EK-Preise und Qualitätsstandards.",
    heroText: "Verabschiede dich von unzuverlässigen China-Agenten und überteuerten Zwischenhändlern. Mit Procware stellst du Produktanfragen in unter 60 Sekunden direkt über dein Dashboard. Unser deutschsprachiges Team und unsere Sourcing-Experten vor Ort in Asien verhandeln direkt mit zertifizierten Herstellern – mit voller Preistransparenz und ohne versteckte Aufschläge.",
    keyStats: [
      { label: "Durchschnittliche EK-Ersparnis", value: "-28%" },
      { label: "Anfrage-Bearbeitung", value: "< 24 Std." },
      { label: "Fabrik-Audits", value: "100% Vor Ort" },
      { label: "Vorabkosten", value: "0 €" },
    ],
    highlights: [
      {
        title: "Direkte Fabrikkontakte ohne Zwischenhändler",
        desc: "Wir sourcen direkt beim Primärhersteller. Du zahlst nicht die Margen von fünf Zwischenstationen, sondern den echten Fabrikabgabepreis.",
        stat: "100% Transparent",
      },
      {
        title: "Muster-Prüfung & Freigabe vor Serienstart",
        desc: "Jedes Produkt wird anhand deiner Kriterien bemustert, fotografiert und bei Bedarf physisch nach Deutschland zur finalen Freigabe gesendet.",
        stat: "Qualitätsgarantie",
      },
      {
        title: "Preisverhandlung mit lokalem Know-how",
        desc: "Unsere Einkäufer sprechen die Sprache der Fabriken und kennen reale Materialpreise. So erzielen wir Konditionen, an die man aus Europa allein nicht herankommt.",
        stat: "Beste Konditionen",
      },
      {
        title: "Deutschsprachiger Support & Ansprechpartner",
        desc: "Kein mühsames Übersetzen im WeChat-Chat: Du kommunizierst auf Deutsch mit deinem persönlichen Procware-Sourcing-Manager.",
        stat: "Deutsches Team",
      },
    ],
    process: [
      {
        step: "01",
        title: "Produktanfrage einreichen",
        desc: "Trage Produktlink (z.B. AliExpress, 1688, Amazon oder Foto), Zielpreis und geschätzte Stückzahl in unter 60 Sekunden in der Procware Plattform ein.",
      },
      {
        step: "02",
        title: "Angebote vergleichen",
        desc: "Innerhalb von 24 bis 48 Stunden erhältst du ein transparentes Angebot mit Stückpreis, Versandoptionen, Lieferzeit und MOQ.",
      },
      {
        step: "03",
        title: "Musterprüfung & Freigabe",
        desc: "Wir prüfen hochauflösende Fotos, Videos und Materialeigenschaften. Nach deiner Freigabe wird die Produktion oder Bemusterung gestartet.",
      },
      {
        step: "04",
        title: "Automatisierte Einbindung",
        desc: "Das Produkt wird per 1-Click mit deinem Shopify-Shop verknüpft – Bestellungen fließen ab sofort vollautomatisiert durchs System.",
      },
    ],
    faqs: [
      {
        q: "Kostet die Produktanfrage bei Procware etwas?",
        a: "Nein. Produktanfragen und Angebote über Procware sind zu 100% kostenlos und unverbindlich. Es fallen keine Einrichtungsgebühren oder monatlichen Grundkosten an.",
      },
      {
        q: "Wie lange dauert es, bis ich ein Angebot erhalte?",
        a: "In der Regel liegt dein vollständiges Angebot mit Staffelpreisen und Versandoptionen innerhalb von 24 bis maximal 48 Stunden vor.",
      },
      {
        q: "Können auch bestehende Produkte übernommen werden?",
        a: "Ja, absolut. Wenn du bereits Produkte verkaufst und deine Marge oder Lieferzeit verbessern willst, prüfen wir deine bestehenden Lieferketten und optimieren diese sofort.",
      },
    ],
  },

  packaging: {
    id: "packaging",
    slug: "packaging",
    title: "Individuelles Branding & Packaging",
    shortTitle: "Packaging & Branding",
    subtitle: "Mache aus Standardware deine unverwechselbare E-Commerce-Marke ab der ersten Bestellung.",
    badge: "Ab 1. Order",
    iconName: "Package",
    metaDescription: "Eigenes Packaging & Branding ab 1. Order mit Procware: Bedruckte Kartons, Hangtags, Dankeskarten und Custom Polybags für maximale Wiederkaufsraten.",
    heroText: "Der erste Eindruck entscheidet über Wiederkauf und Markenwert. Mit Procware verwandelst du White-Label-Produkte in ein unverwechselbares Produkterlebnis: Individuell bedruckte Versandkartons, personalisierte Dankeskarten mit QR-Codes, gravierte Hangtags und Marken-Klebebänder – flexibel abrufbar und ohne riesige Vorfinanzierung.",
    keyStats: [
      { label: "Mindestbestellmenge", value: "Ab 1. Order" },
      { label: "Wiederkaufsrate steigern", value: "+35%" },
      { label: "Karten & Beilagen", value: "Individuell" },
      { label: "Custom Boxen", value: "Vollflächig 4C" },
    ],
    highlights: [
      {
        title: "Custom Polybags & Kartonagen",
        desc: "Hochwertige, passgenaue Versandkartons und Zipper-Bags mit deinem Logo und deinen Brand-Farben.",
      },
      {
        title: "Dankeskarten & Flyer-Beilagen",
        desc: "Lege jeder Sendung personalisierte Dankeskarten mit Rabattcodes für die nächste Bestellung oder Social-Media-Einladungen bei.",
      },
      {
        title: "Hangtags, Sticker & Siegel",
        desc: "Veredle deine Artikel mit gewebten Labels, gravierten Tags oder Markensiegeln für maximalen Unboxing-Effekt.",
      },
      {
        title: "Nachhaltige Verpackungsmaterialien",
        desc: "Recycelbare Kartons, biologisch abbaubare Beutel und FSC-zertifizierte Papiere für umweltbewusste Zielgruppen.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Design & Anforderungen übermitteln",
        desc: "Lade deine Druckdaten (Logo, Stanzvorlage oder Flyer-Layout) direkt im Dashboard hoch oder nutze unsere Vorlagen.",
      },
      {
        step: "02",
        title: "Muster-Produktion & Fotoabnahme",
        desc: "Wir drucken ein Freigabemuster deines Packagings und stellen dir hochauflösende Fotos und Videos zur Verfügung.",
      },
      {
        step: "03",
        title: "Einlagerung im Fulfillment-Hub",
        desc: "Dein Packaging wird in unserem Lager vorgehalten und bei jeder eingehenden Bestellung vollautomatisch dem Produkt beigelegt.",
      },
    ],
    faqs: [
      {
        q: "Muss ich tausende Kartons auf einmal bestellen?",
        a: "Nein! Dank unserer Partner-Druckereien können Beilagen wie Dankeskarten und Sticker bereits ab kleinsten Mengen gedruckt werden. Für bedruckte Boxen bieten wir flexible Staffelungen.",
      },
      {
        q: "Wie wirkt sich eigenes Packaging auf die Lieferzeit aus?",
        a: "Gar nicht. Sobald deine Verpackungsmaterialien in unserem Lager vorrätig sind, erfolgt die Kommissionierung und Verpackung genauso schnell wie bei Standardversand.",
      },
    ],
  },

  dropshipping: {
    id: "dropshipping",
    slug: "dropshipping",
    title: "Dropshipping weltweit & Express-Versand",
    shortTitle: "Globales Dropshipping",
    subtitle: "5-8 Tage Lieferzeit nach Deutschland, Österreich, Schweiz und in über 50 Länder weltweit.",
    badge: "5-8 Tage",
    iconName: "Globe",
    metaDescription: "Schnelles Dropshipping mit 5-8 Tagen Lieferzeit nach DE/AT/CH über Procware. Automatische Sendungsverfolgung mit DHL & Hermes, keine Zollprobleme für Endkunden.",
    heroText: "Vergiss 20-tägige China-Lieferzeiten, die deine Facebook-Ads-Ratings und Kundenrezensionen zerstören. Procware bietet zolloptimierte Express-Linien mit 5 bis 8 Werktagen Lieferzeit nach Deutschland, Österreich, Schweiz und in über 50 Länder. Die Pakete werden lückenlos mit DHL, Hermes, GLS oder der Österreichischen Post getrackt.",
    keyStats: [
      { label: "Lieferzeit D-A-CH", value: "5-8 Werktage" },
      { label: "Länder weltweit", value: "50+ Zielländer" },
      { label: "Zollabfertigung", value: "IOSS / DDP Inklusive" },
      { label: "Tracking", value: "Echtzeit DHL/Hermes" },
    ],
    highlights: [
      {
        title: "IOSS & DDP: Keine Zollüberraschungen",
        desc: "Alle Steuern und Einfuhrabgaben werden vorab elektronisch abgefertigt. Deine Kunden müssen niemals zum Zollamt oder Nachgebühren an der Haustür zahlen.",
      },
      {
        title: "Automatische Tracking-Nummern im Shopify Store",
        desc: "Sobald ein Paket gescannt wird, aktualisiert Procware den Fulfillment-Status in Shopify und sendet die Sendungsverfolgungsnummer an den Käufer.",
      },
      {
        title: "Erste-Meile-Prio & tägliche Flugverbindungen",
        desc: "Feste Frachtkontingente auf täglichen Direktflügen nach Frankfurt, Amsterdam und Wien garantieren minimale Transitzeiten.",
      },
      {
        title: "Neutrale Verpackung ohne China-Schriftzeichen",
        desc: "Keine chinesischen Absenderaufkleber oder fremdsprachige Zollerklärungen auf dem Paket – absolut neutraler, professioneller Markenversand.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Bestelleingang im Shopify Store",
        desc: "Dein Kunde kauft ein. Die Order wird in Echtzeit über die offizielle Procware Shopify App synchronisiert.",
      },
      {
        step: "02",
        title: "Kommissionierung & Qualitätsprüfung",
        desc: "Das Produkt wird binnen 24 Stunden gepackt, gewogen, mit deinem Label versehen und für den Luftfrachtversand vorbereitet.",
      },
      {
        step: "03",
        title: "Direktflug & Lokale Zustellung",
        desc: "Nach Landung in Europa übernimmt DHL/Hermes die Zustellung auf der letzten Meile direkt an die Haustür des Empfängers.",
      },
    ],
    faqs: [
      {
        q: "Welche Paketdienste stellen die Sendungen in Deutschland zu?",
        a: "In Deutschland erfolgt die Endzustellung fast ausschließlich über DHL Paket oder Hermes, in Österreich über die Österreichische Post, in der Schweiz über die Schweizerische Post.",
      },
      {
        q: "Sieht der Kunde, dass die Ware aus dem Ausland kommt?",
        a: "Nein. Die Pakete tragen neutrale Versandlabels mit deutscher Rücksendeadresse. Es sind keine chinesischen Zeichen oder Fremdfirmen-Logos vorhanden.",
      },
    ],
  },

  "bulk-orders": {
    id: "bulk-orders",
    slug: "bulk-orders",
    title: "100% Deutsches Fulfillment & Einlagerung",
    shortTitle: "Deutsches Fulfillment",
    subtitle: "Lagerung, Pick & Pack und 1-2 Tage Lieferzeit durch Einlagerung in unserem deutschen Logistikzentrum.",
    badge: "100% DE Fulfillment",
    iconName: "Warehouse",
    metaDescription: "100% Deutsches Fulfillment bei Procware: Lagere Ware in Deutschland ein. Same-Day Pick & Pack, Markenbeilagen und 1-2 Tage Zustellung mit DHL & DPD.",
    heroText: "Procware ist nicht nur dein Sourcing-Partner, sondern übernimmt das vollständige deutsche Fulfillment für deinen Shopify Store. Lagere deine Bestseller oder Großmengen direkt in unserem modernen deutschen Logistikzentrum ein. Wir übernehmen Einlagerung, Barcode-Scanning, Kommissionierung, kundenindividuelles Packaging und den taggleichen Versand per DHL oder DPD.",
    keyStats: [
      { label: "Versandzeit in DE", value: "1-2 Werktage" },
      { label: "Standort Lager", value: "100% Deutschland" },
      { label: "Same-Day Cutoff", value: "Bis 14:00 Uhr" },
      { label: "Shopify Sync", value: "Echtzeit Tracking" },
    ],
    highlights: [
      {
        title: "100% Deutsches Fulfillment: Lagerung, Pick & Pack",
        desc: "Bestellungen aus deinem Shopify-Store werden automatisiert an unser deutsches Logistikzentrum übermittelt und noch am selben Tag verpackt.",
      },
      {
        title: "Next-Day-Lieferung mit DHL & DPD",
        desc: "Deine Kunden in Deutschland und Österreich erhalten ihre Pakete in nur 1–2 Werktagen mit lückenloser Sendungsverfolgung.",
      },
      {
        title: "Individuelles Brand-Packaging & Beilagen",
        desc: "Wir packen deine gebrandeten Kartons, Seidenpapier, Dankeskarten und Gutscheine millimetergenau nach deinen Vorgaben.",
      },
      {
        title: "Keine versteckten Gebühren",
        desc: "Transparente Konditionen für Lagerung und Pick & Pack – ohne Knebelverträge oder Mindestvertragslaufzeiten.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Warenanlieferung im deutschen Lager",
        desc: "Deine Ware wird direkt vom Hersteller oder Seehafen in unser deutsches Logistikzentrum angeliefert.",
      },
      {
        step: "02",
        title: "Digitale Einbuchung & Qualitätsprüfung",
        desc: "Wir prüfen die Artikel, erfassen Barcodes und buchen den Bestand in Echtzeit in dein Procware Dashboard ein.",
      },
      {
        step: "03",
        title: "Same-Day Pick, Pack & Ship",
        desc: "Verkäufe in deinem Shopify Store werden sekundenschnell übermittelt, gepackt und mit Trackingnummer an den Kunden versendet.",
      },
    ],
    faqs: [
      {
        q: "Kann ich Produkte sowohl aus China als auch aus Deutschland fulfillen lassen?",
        a: "Ja, genau das ist der Hybrid-Vorteil von Procware: Neue Produkte kannst du via Express-Dropshipping testen, während Bestseller für maximale Marge und 24h-Lieferung im deutschen Lager liegen.",
      },
      {
        q: "Welche Versanddienstleister werden in Deutschland genutzt?",
        a: "Wir versenden standardmäßig mit DHL und DPD, inklusive lückenlosem Live-Tracking, das direkt an deinen Shopify Store übertragen wird.",
      },
    ],
  },

  returns: {
    id: "returns",
    slug: "returns",
    title: "Retourenservice & Aufbereitung Deutschland",
    shortTitle: "Retourenservice DE",
    subtitle: "Schütze deine Marge: Deutsche Rücksendeadresse, 24h-Qualitätsprüfung und automatisiertes Refurbishing.",
    badge: "Deutsches Retourenzentrum",
    iconName: "RotateCcw",
    metaDescription: "Procware Retourenservice Deutschland: Lokale Rücksendeadresse für Kunden, professionelle 24h-Prüfung & Wiedereinlagerung statt Totalverlust.",
    heroText: "Rücksendungen nach Asien sind wirtschaftlicher Unsinn. Mit Procware erhalten deine Kunden eine seriöse deutsche Rücksendeadresse. Retouren treffen innerhalb von 1-2 Tagen in unserem deutschen Prüfzentrum ein, werden auf Unversehrtheit geprüft, gereinigt, neu verpackt und stehen sofort für den nächsten Verkauf bereit.",
    keyStats: [
      { label: "Wiederverkaufsquote", value: "Bis zu 92%" },
      { label: "Deutsche Retourenadresse", value: "Inklusive" },
      { label: "Bearbeitungszeit", value: "Innerhalb 24h" },
      { label: "Kundenvertrauen", value: "Höchste Seriosität" },
    ],
    highlights: [
      {
        title: "Seriöse deutsche Absender- & Retourenadresse",
        desc: "Kunden fühlen sich sicher und bestellen lieber, wenn im Impressum und auf dem Paket eine deutsche Rücksendeadresse steht.",
      },
      {
        title: "Prüfung & Fotodokumentation binnen 24h",
        desc: "Jede Rücksendung wird geöffnet, begutachtet und im System mit Zustand (Neuware, B-Ware, Defekt) und Fotos erfasst.",
      },
      {
        title: "Wiederaufbereitung (Refurbishing) & Reshipment",
        desc: "Unbeschädigte Artikel werden neu versiegelt und bei der nächsten passenden Bestellung sofort wieder versendet.",
      },
      {
        title: "Automatisierte Gutschriften im Shopify Store",
        desc: "Spare Stunden manueller Kundenservice-Arbeit durch synchronisierte Status-Updates in deinem Shopify-Backend.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Kunde sendet Paket an deutsches Retourenzentrum",
        desc: "Der Endkunde nutzt dein Retourenlabel mit deutscher Lageradresse in Deutschland.",
      },
      {
        step: "02",
        title: "Eingangsprüfung binnen 24 Stunden",
        desc: "Unsere Mitarbeiter erfassen den Barcode, prüfen den Artikelzustand und laden Bilder ins System hoch.",
      },
      {
        step: "03",
        title: "Wiedereinlagerung oder Spende/Entsorgung",
        desc: "Gemäß deinen Richtlinien wird der Artikel direkt wieder dem verkaufbaren Bestand zugeführt.",
      },
    ],
    faqs: [
      {
        q: "Kann ich festlegen, welche Artikel wieder versendet werden dürfen?",
        a: "Ja, du definierst deine eigenen Prüfkriterien (z.B. Originalverpackung unbeschädigt, Siegel intakt). Unser Team handelt exakt nach deinen Vorgaben.",
      },
      {
        q: "Was kostet die Bearbeitung einer Retoure?",
        a: "Wir berechnen faire, transparente Stückpauschalen pro geprüftem Paket – ohne versteckte Grundgebühren.",
      },
    ],
  },

  multishop: {
    id: "multishop",
    slug: "multishop",
    title: "Mehrshop-Unterstützung & Multi-Store Management",
    shortTitle: "Multi-Store Suite",
    subtitle: "Verwalte 1, 5 oder 20+ Shopify Stores zentral über ein einziges Procware Dashboard.",
    badge: "Skalierbar",
    iconName: "Layers",
    metaDescription: "Procware Mehrshop-Verwaltung: Verbinde beliebig viele Shopify Stores mit einem Account. Zentrales Inventar, gemeinsame Abrechnung und Multi-Brand-Übersicht.",
    heroText: "Erfolgreiche E-Commerce-Unternehmer betreiben selten nur einen einzigen Shop. Egal ob du Nischenshops, internationale Ländershops (.de, .com, .fr) oder mehrere Brands führst: Mit Procware verknüpfst du alle Stores nahtlos in einem zentralen Dashboard – mit getrennten Beständen oder geteiltem Inventar.",
    keyStats: [
      { label: "Unterstützte Shops", value: "Unbegrenzt" },
      { label: "Synchronisation", value: "Echtzeit-API" },
      { label: "Abrechnung", value: "Gesammelt oder Getrennt" },
      { label: "Rollen & Rechte", value: "Teamfähig" },
    ],
    highlights: [
      {
        title: "Ein Login für dein gesamtes E-Commerce-Portfolio",
        desc: "Wechsle sekundenschnell zwischen verschiedenen Brands oder sieh alle Verkäufe und Versandstatus aggregiert auf einen Blick.",
      },
      {
        title: "Gemeinsames Inventar für Ländershops",
        desc: "Verkaufst du denselben Artikel in Deutschland, Frankreich und UK? Greife für alle Stores auf denselben Lagerbestand zu, ohne Überverkäufe.",
      },
      {
        title: "Individuelle Absenderadressen je Brand",
        desc: "Jeder Shop behält sein eigenes Branding, eigene Versandkartons und eigene Kundenkommunikation.",
      },
      {
        title: "Sammelrechnung & vereinfachte Buchhaltung",
        desc: "Erhalte auf Wunsch eine übersichtliche Monatsrechnung für alle Stores, die deine Buchhaltung und Steuerberatung entlastet.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Haupt-Account anlegen",
        desc: "Registriere deinen Procware Master-Account in wenigen Minuten.",
      },
      {
        step: "02",
        title: "Shopify Stores hinzufügen",
        desc: "Installiere die offizielle Procware App in jedem deiner Stores mit einem einzigen Klick.",
      },
      {
        step: "03",
        title: "Automatisierung aktivieren",
        desc: "Definiere Produkte, Sourcing-Zuordnungen und Versandregeln zentral für alle Kanäle.",
      },
    ],
    faqs: [
      {
        q: "Zahle ich für jeden weiteren Shop extra Gebühren?",
        a: "Nein, Procware unterstützt Multi-Shop ohne zusätzliche monatliche Grundgebühren.",
      },
      {
        q: "Können Mitarbeiter nur Zugriff auf bestimmte Shops erhalten?",
        a: "Ja, unser Rechte- und Rollensystem erlaubt es, Teammitglieder gezielt nur für einzelne Stores oder Funktionen freizuschalten.",
      },
    ],
  },

  agencies: {
    id: "agencies",
    slug: "agencies",
    title: "Agenturbetreuung & Partnerprogramm",
    shortTitle: "Agentur-Partner",
    subtitle: "Das professionelle Rückgrat für E-Commerce-Agenturen, Performance-Marketer und Beratungsagenturen.",
    badge: "Agentur-Ready",
    iconName: "Users",
    metaDescription: "Procware für Agenturen: Betreue Kunden-Shops beim Sourcing & Fulfillment. Dedizierter Ansprechpartner, individuelle Margen & Whitelabel-Fähigkeit.",
    heroText: "Du baust erfolgreiche Marken für deine Kunden auf und willst ihnen auch bei Sourcing, Produktqualität und Fulfillment erstklassige Ergebnisse liefern? Procware bietet ein spezialisiertes Agentur-Partnerprogramm mit bevorzugten Konditionen, White-Label-Berichten und dedizierten Key-Account-Managern.",
    keyStats: [
      { label: "Agentur-Konditionen", value: "Exklusiv" },
      { label: "Account Manager", value: "Persönlicher Betreuer" },
      { label: "Kunden-Onboarding", value: "Priorisiert" },
      { label: "Whitelabel Berichte", value: "Verfügbar" },
    ],
    highlights: [
      {
        title: "Dedizierter deutschsprachiger Key-Account-Manager",
        desc: "Ein direkter Draht via Slack, WhatsApp oder Telefon für schnelle Abstimmungen und priorisierte Produktbeschaffung.",
      },
      {
        title: "Skalierungssicherheit für Kunden-Launches",
        desc: "Plane große Marketing-Peaks und Black Friday Aktionen mit gesicherten Frachtkapazitäten und ausreichenden Vorräten.",
      },
      {
        title: "Attraktive Partner-Vergütungen & Kickbacks",
        desc: "Profitiere dauerhaft vom wachsenden Versandvolumen deiner vermittelten Mandanten.",
      },
      {
        title: "Entlastung deines Agentur-Teams",
        desc: "Keine zeitraubenden Lieferanten-Streitigkeiten mehr – dein Team konzentriert sich auf Performance-Marketing und Brand-Building.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Agentur-Erstgespräch führen",
        desc: "Wir stimmen im kurzen Strategiegespräch deine Kundenstruktur und besonderen Anforderungen ab.",
      },
      {
        step: "02",
        title: "Partner-Zugang freischalten",
        desc: "Du erhältst Zugang zum Agentur-Portal mit Multi-Client-Verwaltung und exklusiven Einkaufsbedingungen.",
      },
      {
        step: "03",
        title: "Gemeinsam Kunden skalieren",
        desc: "Wir übernehmen die operative Lieferkette im Hintergrund, während deine Kunden von Top-Lieferzeiten begeistert sind.",
      },
    ],
    faqs: [
      {
        q: "Können wir Procware unter unserer eigenen Marke anbieten?",
        a: "Ja, wir bieten Co-Branding und White-Label-Modelle für qualifizierte Agenturpartner.",
      },
      {
        q: "Wie werden Kunden-Abrechnungen gehandhabt?",
        a: "Wir können Kunden direkt abrechnen oder alle Leistungen gesammelt über deine Agentur fakturieren.",
      },
    ],
  },

  compliance: {
    id: "compliance",
    slug: "compliance",
    title: "EPR Pflichten & Abmahnschutz (GPSR)",
    shortTitle: "EPR & GPSR Schutz",
    subtitle: "Rechtssicherer Verkauf in der EU: LUCID VerpackG, WEEE, Batteriegesetz und EU-Produktsicherheitsverordnung.",
    badge: "Rechtssicher",
    iconName: "ShieldCheck",
    metaDescription: "Procware EPR & GPSR Abmahnschutz: Vollständige Erfüllung der EU-Produktsicherheitsverordnung (GPSR) und Verpackungsgesetz für Shopify Händler.",
    heroText: "Die gesetzlichen Anforderungen für den Online-Verkauf in Deutschland und Europa werden immer strenger. Fehlende Verpackungslizenzen (LUCID) oder Verstöße gegen die EU-Produktsicherheitsverordnung (GPSR) führen zu teuren Abmahnungen und Kontosperrungen. Procware unterstützt dich bei der lückenlosen Einhaltung aller Vorgaben ab dem ersten Verkaufstag.",
    keyStats: [
      { label: "EU-Konformität", value: "100% Geprüft" },
      { label: "LUCID VerpackG", value: "Konform" },
      { label: "GPSR Konformität", value: "EU-Wirtschaftsakteure" },
      { label: "Abmahnschutz", value: "Maximal" },
    ],
    highlights: [
      {
        title: "EU-Verantwortliche Person (Responsible Person)",
        desc: "Erfülle die GPSR-Vorgaben mit autorisierten EU-Wirtschaftsakteuren und rechtssicheren Kontaktangaben auf Produkt und Verpackung.",
      },
      {
        title: "Verpackungsgesetz (LUCID) & EPR Registrierung",
        desc: "Unterstützung bei der ordnungsgemäßen Lizenzierung von Verkaufs- und Versandverpackungen in Deutschland und Europa.",
      },
      {
        title: "Zertifikatsprüfung (CE, RoHS, REACH)",
        desc: "Wir fordern Prüfzertifikate direkt bei den Herstellern an und stellen sicher, dass notwendige Konformitätserklärungen vorliegen.",
      },
      {
        title: "Produktkennzeichnung & Sicherheitswarnungen",
        desc: "Richtige Kennzeichnung von Inhaltsstoffen, Warnhinweisen und Barcodes direkt im Produktionsprozess.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Sortiments-Check & Risikobewertung",
        desc: "Wir prüfen deine Produktkategorien auf spezifische Nachweispflichten (z.B. Elektronik, Kosmetik, Spielzeug, Textil).",
      },
      {
        step: "02",
        title: "Beschaffung aller Herstellerzertifikate",
        desc: "Unsere Partner-Auditoren fordern gültige Prüfberichte der Fabriken an und prüfen deren Echtheit.",
      },
      {
        step: "03",
        title: "Rechtskonforme Verpackung & Etikettierung",
        desc: "Alle vorgeschriebenen Kennzeichnungen werden vor dem Versand physisch auf dem Produkt und der Verpackung angebracht.",
      },
    ],
    faqs: [
      {
        q: "Betrifft die GPSR-Pflicht auch kleine Shopify-Stores?",
        a: "Ja, ausnahmslos jeder Händler, der Produkte an Verbraucher in der EU verkauft, muss die neue Produktsicherheitsverordnung (GPSR) seit Dezember 2024 einhalten.",
      },
      {
        q: "Kann Procware die Dokumentation direkt in Shopify einpflegen?",
        a: "Wir stellen dir alle geforderten Hersteller- und Verantwortlichen-Angaben zur Verfügung, sodass du diese mit wenigen Klicks in deinen Produktseiten hinterlegen kannst.",
      },
    ],
  },
};
