import {
  ServiceItem,
  TestimonialItem,
  FeatureItem,
  HowItWorksStep,
  CountryItem,
  CaseStudyItem,
  BlogArticle,
  FaqItem,
} from "../types";

export const PROCWARE_LOGO = "/procware-logo-wide.png";

export const PROCWARE_ICON =
  "https://procware.de/wp-content/uploads/2025/05/cropped-procware-icon-Photoroom-e1746621559788.png";

export const HERO_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

export const SERVICES: ServiceItem[] = [
  {
    id: "sourcing",
    title: "Exklusive Produktanfragen & Sourcing",
    description: "Produkte und Preise transparent kalkuliert, von unserem Team verhandelt.",
    longDescription:
      "Stelle innerhalb von Sekunden detaillierte Sourcing-Anfragen für jedes Produkt. Als dein verlässlicher Zwischenhändler verhandelt unser erfahrenes Team mit verifizierten Fabriken in China, um dir optimale Einkaufspreise und kompromisslose Produktqualität zu sichern.",
    iconName: "Search",
    badge: "Kernleistung",
  },
  {
    id: "packaging",
    title: "Individuelles Branding & Packaging",
    description: "Verpackung, Karten und Beilagen ab der ersten Bestellung verfügbar.",
    longDescription:
      "Hebe deine Brand ab der ersten Bestellung vom Wettbewerb ab. Wir drucken dein Logo auf Boxen, legen hochwertige Dankeskarten oder Flyer bei und statten Produkte mit deinen maßgeschneiderten Etiketten aus.",
    iconName: "Package",
    badge: "Ab 1. Order",
  },
  {
    id: "dropshipping",
    title: "Dropshipping weltweit",
    description: "Lieferung direkt zum Kunden in über 50 Länder – zuverlässig und schnell.",
    longDescription:
      "Schnelle, zollabgefertigte Express-Lieferungen in 5 bis 8 Werktagen nach Deutschland, Österreich, Schweiz und über 50 Länder weltweit mit lückenlosem Tracking über DHL, Hermes und führende Postdienstleister.",
    iconName: "Globe",
  },
  {
    id: "bulk-orders",
    title: "100% Deutsches Fulfillment & Lager",
    description: "Lagerung, Pick & Pack und Same-Day-Versand direkt aus unserem deutschen Logistikzentrum.",
    longDescription:
      "Lagere deine Bestseller oder Vorräte direkt in Deutschland ein. Wir übernehmen die professionelle Einlagerung, barcodebasierte Bestandsführung, Pick & Pack mit individuellen Brand-Beilagen und den blitzschnellen Versand binnen 24-48 Stunden über DHL und DPD.",
    iconName: "Warehouse",
    badge: "100% Made in Germany",
  },
  {
    id: "returns",
    title: "Retourenservice & Qualitätsprüfung DE",
    description: "Deutsche Rücksendeadresse, 24h-Zustandsprüfung, Refurbishing und Wiedereinlagerung.",
    longDescription:
      "Keine Retouren-Alpträume mehr: Rücksendungen deiner Kunden gehen direkt an unser deutsches Logistikzentrum, werden dort binnen 24 Stunden geprüft, mit Fotodokumentation erfasst, gereinigt, neu verpackt und stehen sofort für den nächsten Verkauf bereit.",
    iconName: "RotateCcw",
  },
  {
    id: "multishop",
    title: "Mehrshop-Unterstützung",
    description: "Beliebig viele Shops über ein einziges Dashboard verwalten.",
    longDescription:
      "Egal ob du 1 oder 25 Shopify-Shops betreibst: Verknüpfe alle Stores zentral in einem einzigen Procware-Konto. Behalte Finanzen, Orders, Tracking und Lieferanten-Chats im perfekten Überblick.",
    iconName: "Layers",
  },
  {
    id: "agencies",
    title: "Agenturbetreuung",
    description: "Agenturen können ihren Kunden über Procware beim Sourcing und Fulfillment helfen.",
    longDescription:
      "Unser spezielles Agentur-Programm ermöglicht Full-Service-Betreuung deiner Mandanten. Wir bieten dedizierte Account Manager, individuelle Margenaufschläge und Multi-Mandanten-Zugänge.",
    iconName: "Users",
  },
  {
    id: "compliance",
    title: "EPR Pflichten & Abmahnschutz (GPSR)",
    description: "Sichere Konformität für den EU-Markt ab dem ersten Tag.",
    longDescription:
      "Schütze deinen Shop vor rechtlichen Abmahnungen: Wir unterstützen dich bei den EU-EPR-Verpflichtungen (LUCID VerpackG, WEEE, Batteriegesetz) und der neuen Produktsicherheitsverordnung (GPSR).",
    iconName: "ShieldCheck",
    badge: "Rechtssicher",
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    duration: "Seit 2 Jahren Procware Kunde",
    headline: "Noch nie mit jemand besserem Zusammengearbeitet im Sourcing",
    quote:
      "Procware bietet uns Produkte an, die unserem Qualitätsstandard entsprechen zu einem guten Preis. Procware ist hilfsbereit, hilft uns Produkte zu verbessern, Produkte preiswerter zu verhandeln mit den Factories und liefert ein Rundum-Paket im Sourcing.",
    authorName: "Sebastian Beyer",
    authorRole: "E-Commerce Brand Gründer (D-A-CH)",
    orders: "10.000+ Orders / Monat",
    rating: 5,
    wistiaId: "vkfkg2htpe",
    videoDuration: "3:39",
    posterUrl: "https://embed-ssl.wistia.com/deliveries/9f2572a1f83c122a96de41eb443ecf2688b261fd.jpg?image_crop_resized=960x540",
  },
  {
    id: "2",
    duration: "Seit 8 Monaten Procware Kunde",
    headline: "20k Orders im Monat, Sourcing und Import ohne Kopfschmerzen bei Procware",
    quote:
      "Wenn deine Stärke im Marketing liegt und du deine Firma genau darüber stärken willst, ist das hier genau richtig. Das operative Sourcing- und Fulfillment-Chaos wird dir komplett abgenommen. Procware ist die All-in-One Lösung für alle, die sich aufs Marketing konzentrieren wollen und sich nicht mit China Agenten rumärgern wollen.",
    authorName: "Store Betreiber",
    authorRole: "Shopify Brand Betreiber",
    orders: "20.000+ Orders / Monat",
    rating: 5,
    wistiaId: "l487o7ucuq",
    videoDuration: "3:44",
    posterUrl: "https://embed-ssl.wistia.com/deliveries/3fdec88be50c59b8a9e9db97aea4e8bea1648035.jpg?image_crop_resized=960x540",
  },
];

export const FEATURES: FeatureItem[] = [
  {
    id: "feature-1",
    stepNumber: "01",
    title: "Produktanfragen stellen",
    description:
      "Fordere Angebote über unsere Plattform an – individuell, transparent kalkuliert und nur für dich sichtbar.",
    bullets: [
      "Produktanfrage in unter 60 Sekunden stellen",
      "Geprüfte Angebote verhandelt über unser Partner-Netzwerk",
      "Vollständige Preistransparenz ohne versteckte Gebühren",
      "Qualitätsmuster vorab zur Freigabe",
    ],
    imageUrl: "https://procware.de/wp-content/uploads/2025/06/rundgang.png",
    imageAlt: "Procware Produktanfrage und Sourcing Dashboard",
    highlightBadge: "Fabrikpreise verhandelt",
    tag: "RFQ & Kalkulation",
  },
  {
    id: "feature-2",
    stepNumber: "02",
    title: "Persönlicher Sourcing-Support & Chat",
    description:
      "Kläre Fragen, stimme Details ab und lass dein Sortiment von unserem erfahrenen Team koordinieren.",
    bullets: [
      "Direkter Austausch mit unserem deutschsprachigen Partner-Team",
      "Individuelle Anpassungen und Farbmuster abstimmen",
      "Fotobeweise und Qualitätsprüfberichte direkt im Feed",
      "Keine Sprachbarrieren oder mühsame Agenten-Kommunikation",
    ],
    imageUrl: "https://procware.de/wp-content/uploads/2025/06/demo-produkt-chat.png",
    imageAlt: "Procware Sourcing-Support Chat und Musterprüfung",
    highlightBadge: "Deutsches Partner-Team",
    tag: "Live-Kommunikation",
  },
  {
    id: "feature-3",
    stepNumber: "03",
    title: "100% Deutsches Fulfillment & globaler Versand",
    description:
      "Sobald du verkaufst, übernehmen wir Einlagerung, Pick & Pack, Qualitätsprüfung und Express-Versand – vollautomatisiert.",
    bullets: [
      "100% deutsches Fulfillment: Lagerung, Kommissionierung & Same-Day-Versand aus Deutschland",
      "Vollautomatische Synchronisation mit deinem Shopify-Shop ohne manuellen Aufwand",
      "Lückenlose Sendungsverfolgung (DHL, Hermes, DPD, GLS) direkt an deine Endkunden",
      "Deutsches Retourenzentrum mit 24h-Prüfung, Fotodokumentation & Aufbereitung",
    ],
    imageUrl: "https://procware.de/wp-content/uploads/2025/06/procware-shopify-app.png",
    imageAlt: "Procware Deutsches Fulfillment Dashboard & Shopify Sync",
    highlightBadge: "Deutsches Lager & Express",
    tag: "100% Deutsches Fulfillment",
  },
];

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    number: "01",
    title: "Shop verbinden",
    description:
      "Installiere unsere App über den Shopify App Store und verknüpfe deinen Shop mit wenigen Klicks.",
    actionText: "Shopify App Store",
  },
  {
    number: "02",
    title: "Produkt anfragen & Angebot erhalten",
    description:
      "Wähle ein Produkt oder sende eine individuelle Anfrage. Unser Team meldet sich direkt mit einem maßgeschneiderten Angebot.",
    actionText: "Anfrage starten",
  },
  {
    number: "03",
    title: "Verkaufen & automatisieren",
    description:
      "Sobald dein Kunde bestellt, übernimmt unser System automatisch den Versand – ohne manuelles Eingreifen und mit voller Sendungsverfolgung.",
    actionText: "Fulfillment starten",
  },
];

export const COUNTRIES: CountryItem[] = [
  { name: "Deutschland", flagUrl: "https://procware.de/wp-content/uploads/2024/05/germany-1.png", deliveryDays: "5-7 Tage" },
  { name: "Österreich", flagUrl: "https://procware.de/wp-content/uploads/2025/06/austria.png", deliveryDays: "5-8 Tage" },
  { name: "Schweiz", flagUrl: "https://procware.de/wp-content/uploads/2025/06/switzerland.png", deliveryDays: "5-8 Tage" },
  { name: "Spanien", flagUrl: "https://procware.de/wp-content/uploads/2024/05/spain-1.png", deliveryDays: "6-8 Tage" },
  { name: "Frankreich", flagUrl: "https://procware.de/wp-content/uploads/2024/05/france-1.png", deliveryDays: "5-8 Tage" },
  { name: "USA", flagUrl: "https://procware.de/wp-content/uploads/2024/05/1200px-United-states_flag_icon_round-1.png", deliveryDays: "6-9 Tage" },
  { name: "Australien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/australia.png", deliveryDays: "7-10 Tage" },
  { name: "Belgien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/belgium.png", deliveryDays: "5-7 Tage" },
  { name: "Bulgarien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/bulgaria.png", deliveryDays: "6-9 Tage" },
  { name: "Kanada", flagUrl: "https://procware.de/wp-content/uploads/2025/06/canada.png", deliveryDays: "7-10 Tage" },
  { name: "Kroatien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/croatia.png", deliveryDays: "6-8 Tage" },
  { name: "Tschechien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/czech-republic.png", deliveryDays: "5-8 Tage" },
  { name: "Italien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/italy.png", deliveryDays: "5-8 Tage" },
  { name: "Luxemburg", flagUrl: "https://procware.de/wp-content/uploads/2025/06/luxembourg.png", deliveryDays: "5-7 Tage" },
  { name: "Niederlande", flagUrl: "https://procware.de/wp-content/uploads/2025/06/netherlands.png", deliveryDays: "5-7 Tage" },
  { name: "Neuseeland", flagUrl: "https://procware.de/wp-content/uploads/2025/06/new-zealand.png", deliveryDays: "8-12 Tage" },
  { name: "Polen", flagUrl: "https://procware.de/wp-content/uploads/2025/06/poland.png", deliveryDays: "5-8 Tage" },
  { name: "Portugal", flagUrl: "https://procware.de/wp-content/uploads/2025/06/portugal.png", deliveryDays: "6-9 Tage" },
  { name: "Rumänien", flagUrl: "https://procware.de/wp-content/uploads/2025/06/romania.png", deliveryDays: "6-9 Tage" },
  { name: "Slowakei", flagUrl: "https://procware.de/wp-content/uploads/2025/06/slovakia.png", deliveryDays: "6-8 Tage" },
  { name: "Südafrika", flagUrl: "https://procware.de/wp-content/uploads/2025/06/south-africa.png", deliveryDays: "8-12 Tage" },
  { name: "Schweden", flagUrl: "https://procware.de/wp-content/uploads/2025/06/sweden.png", deliveryDays: "6-8 Tage" },
  { name: "Großbritannien (UK)", flagUrl: "https://procware.de/wp-content/uploads/2025/06/united-kingdom.png", deliveryDays: "5-8 Tage" },
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "pheromiya",
    title: "Online Shop Case Study: pheromiya.de",
    category: "Online Shop",
    brandName: "pheromiya.de",
    date: "11. Mai 2025",
    imageUrl: "https://procware.de/wp-content/uploads/2025/05/Screenshot-2025-05-11-220256-960x718.png",
    summary:
      "Wie die Parfüm- und Lifestyle-Brand pheromiya.de durch Procware das Sourcing optimierte, Lieferzeiten um 42% senkte und über 15.000 monatliche Bestellungen fehlerfrei automatisiert.",
    keyStats: [
      { label: "Orders / Monat", value: "15.000+" },
      { label: "Lieferzeit-Reduktion", value: "-42%" },
      { label: "Branding", value: "100% Custom Boxen" },
      { label: "Retourenquote", value: "< 1.8%" },
    ],
    content:
      "Pheromiya stand vor der Herausforderung, dass bisherige China-Agenten bei steigendem Werbedruck und hoher Skalierung Lieferengpässe hatten und Sonderwünsche beim Flakon-Packaging nicht umsetzen konnten. Durch den Wechsel zu Procware konnte das Team direkt mit der Fabrik in Kontakt treten, eigene Parfum-Verpackungen ab Tag 1 etablieren und die Lieferzeit nach Deutschland von 14 Tagen auf stabile 6 Werktage drücken.",
  },
  {
    id: "gobrand",
    title: "Agentur Case Study: Gobrand",
    category: "Agentur",
    brandName: "Gobrand Performance Marketing",
    date: "30. Juli 2024",
    imageUrl: "https://procware.de/wp-content/uploads/2024/07/ChatGPT-Image-4.-Mai-2025-18_57_18-960x718.png",
    summary:
      "Wie die E-Commerce Agentur Gobrand für über 20 betreute Mandanten-Shops das komplette Sourcing und Fulfillment über Procware skalierte und den operativen Aufwand eliminierte.",
    keyStats: [
      { label: "Betreute Shops", value: "20+ Mandanten" },
      { label: "Wachstumsfaktor", value: "4.5x Skalierung" },
      { label: "Admin-Zeitersparnis", value: "15h / Woche" },
      { label: "Kundenzufriedenheit", value: "99.4%" },
    ],
    content:
      "Als wachsende Agentur für Shopify-Stores betreut Gobrand Kunden, deren Hauptengpass oft im Warennachschub und unzuverlässigen Logistikern lag. Durch Procware konnten sie ihren Mandanten eine ganzheitliche Beschaffungs- und Fulfillment-Pipeline anbieten. Alle Kunden-Stores laufen in einem Multi-Shop Dashboard mit individuellem Branding und automatisiertem Tracking.",
  },
];

// 18 SEO guides migrated from procware.de/wissen
export { BLOG_ARTICLES } from "./blogArticlesData";

export const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Was passiert, wenn ich ein Produkt anfrage?",
    answer:
      "Du sendest über die Plattform eine Produktanfrage (z. B. Link zu AliExpress, 1688 oder Spezifikationen). Als dein verlässlicher Zwischenhändler holt unser Team in China maßgeschneiderte Angebote von geprüften Fabriken ein, verhandelt die Konditionen und stellt dir das transparente Angebot in deinem Dashboard bereit. Rückfragen kannst du direkt mit unserem deutschsprachigen Partner-Team klären.",
  },
  {
    id: "faq-2",
    question: "Kann ich eigenes Branding verwenden?",
    answer:
      "Ja, absolut! Ab der ersten Bestellung kannst du individuelles Packaging wie bedruckte Versandkartons, Dankeskarten, Hangtags oder Sticker bei uns anfordern und verwenden. Dein Kunde sieht zu 100 % nur deine Brand – keinerlei Hinweise auf Drittanbieter.",
  },
  {
    id: "faq-3",
    question: "Gibt es eine Möglichkeit, Produkte in großen Mengen zu bestellen (Bulk Orders)?",
    answer:
      "Ja, mit unseren Bulk Orders kannst du größere Mengen zu besonders günstigen Konditionen einkaufen und diese in Lagerhäuser in Deutschland oder China liefern lassen – ideal zur Skalierung deines Shops mit noch schnelleren Lieferzeiten und maximaler Marge.",
  },
  {
    id: "faq-4",
    question: "Wie viel kostet die Nutzung von Procware?",
    answer:
      "Die Nutzung ist kostenlos, bis du erste Bestellungen über uns fulfillen lässt (Musterbestellungen ausgenommen). Danach beträgt die Plattformgebühr transparente 50 € pro Monat – unabhängig davon, wie viele Shopify-Shops du angebunden hast. Es gibt keine versteckten Einrichtungsgebühren oder prozentualen Umsatzbeteiligungen.",
  },
  {
    id: "faq-5",
    question: "Wie lange dauern die Lieferzeiten mit Procware?",
    answer:
      "Unsere Standard-Express-Lieferzeiten nach Deutschland, Österreich und in die Schweiz liegen bei 5 bis 8 Werktagen nach Versand. Die Pakete werden per Flugfracht transportiert, im Zielland verzollt und von lokalen Dienstleistern wie DHL oder Hermes mit lückenloser Sendungsnummer zugestellt.",
  },
  {
    id: "faq-6",
    question: "Macht Procware auch deutsches Fulfillment oder nur Retouren?",
    answer:
      "Wir machen 100% deutsches Fulfillment! Das bedeutet: Du kannst deine Bestseller oder Vorräte direkt in unserem deutschen Logistikzentrum einlagern. Wir übernehmen die professionelle Lagerung, Bestandsführung, Kommissionierung (Pick & Pack) mit individuellen Brand-Beilagen und den taggleichen Versand per DHL und DPD. Zusätzlich betreiben wir ein deutsches Retourenzentrum: Eingehende Rücksendungen werden binnen 24 Stunden geprüft, aufbereitet und sofort wieder dem Verkauf zugeführt.",
  },
  {
    id: "faq-7",
    question: "Ist Procware GPSR- und EPR-konform für den EU-Markt?",
    answer:
      "Ja. Wir unterstützen Händler aktiv bei der Einhaltung aller Vorgaben der neuen EU-Produktsicherheitsverordnung (GPSR) sowie den EPR-Verpflichtungen (VerpackG, WEEE, ElektroG). Auf Wunsch stellen wir EU-Bevollmächtigte und drucken konforme Warnhinweise direkt auf dein Packaging.",
  },
];
