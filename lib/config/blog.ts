/**
 * WASTE Journal — Editorial Content Configuration
 * Authoritative content, metadata, and routing for editorial articles.
 */

export interface BlogSection {
  id: string;
  heading: string;
  level?: "h2" | "h3";
  paragraphs: string[];
  callout?: {
    title?: string;
    text: string;
  };
  internalLink?: {
    text: string;
    href: string;
    label: string;
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  category: string;
  categorySlug: string;
  publishedAt: string; // ISO 8601 date string
  updatedAt?: string;
  excerpt: string;
  featuredImage: string;
  featuredImageAlt: string;
  intro: string[];
  sections: BlogSection[];
  faqs?: FaqItem[];
  conclusion: string[];
  relatedSlugs: string[];
  relatedCollection?: {
    heading: string;
    description: string;
    linkText: string;
    href: string;
  };
}

export const ARTICLES: Article[] = [
  {
    slug: "how-to-style-oversized-t-shirts",
    title: "How to Style Oversized T-Shirts: 7 Outfit Ideas",
    seoTitle: "How to Style Oversized T-Shirts: 7 Outfit Ideas | WASTE Journal",
    metaDescription:
      "Master oversized streetwear styling with 7 practical outfit ideas. Learn how to balance proportions, choose the right fit, and pair graphic tees with trousers.",
    category: "Styling Guide",
    categorySlug: "styling-guide",
    publishedAt: "2026-03-15",
    updatedAt: "2026-04-10",
    excerpt:
      "Master the proportions of oversized streetwear. From relaxed tailoring to layered street silhouettes, discover 7 versatile ways to style oversized T-shirts for everyday wear.",
    featuredImage:
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792930001/modern-heritage_xbx276.jpg",
    featuredImageAlt:
      "Model wearing an oversized black streetwear graphic T-shirt with relaxed trousers",
    intro: [
      "The oversized T-shirt has evolved from a casual afterthought into the foundational canvas of modern streetwear. In contemporary Indian fashion, relaxed silhouettes have decisively replaced rigid slim cuts, offering breathable comfort without compromising architectural presence.",
      "However, styling an oversized tee requires an understanding of proportion, drape, and visual balance. Wearing garments with excess volume can easily look unintentional if the surrounding pieces do not support the silhouette. Below, we break down seven practical outfit blueprints, fit guidelines, and essential styling principles to elevate your daily rotation.",
    ],
    sections: [
      {
        id: "relaxed-wide-leg-trousers",
        heading: "1. Pair with Relaxed Wide-Leg Trousers",
        paragraphs: [
          "One of the most elevated ways to wear an oversized T-shirt is alongside tailored, wide-leg trousers. While older fashion advice suggested pairing loose tops with skinny bottoms, contemporary streetwear embraces balanced volume throughout the entire look.",
          "Opt for trousers in heavyweight cotton twill, linen-blend pleated fabric, or pleated wool. The structured drape of the pants creates a deliberate vertical line that matches the drop-shoulder construction of the top. Finish the look with clean retro court sneakers or minimalist leather derbies.",
        ],
        callout: {
          title: "Proportion Tip",
          text: "Ensure the hemline of your trousers breaks cleanly over your sneakers rather than excessively pooling, preserving a crisp and intentional shape.",
        },
      },
      {
        id: "structured-cargo-pants",
        heading: "2. The Utilitarian Combo: Cargo Pants & Chunky Footwear",
        paragraphs: [
          "For an effortless utilitarian aesthetic, pair a heavyweight graphic tee with multi-pocket cargo pants. The tactical hardware and pockets introduce visual texture that balances the broad, uninterrupted surface of an oversized shirt.",
          "Stick to grounded neutral tones such as washed olive, slate grey, or deep black. When wearing a dark graphic tee like the ART OF REBELLION oversized top, neutral bottoms allow the chest artwork to remain the central focus.",
        ],
        internalLink: {
          text: "Explore our graphic oversized tees built from heavyweight combed cotton.",
          href: "/shop/t-shirts",
          label: "View T-Shirts & Tops",
        },
      },
      {
        id: "layering-over-waffle-long-sleeve",
        heading: "3. Layer Over a Lightweight Waffle or Long Sleeve",
        paragraphs: [
          "Micro-layering adds depth to simple outfits during transitional weather or cooler evenings. Layering an oversized short-sleeve tee over a fitted waffle-knit long sleeve or thermal base layer brings tactile contrast to the sleeves and collar.",
          "Exposed waffle cuffs peeking out beneath a relaxed elbow-length sleeve create visual structure. Keep the base layer in an off-white or heather grey tone to establish a subtle contrast with dark outerwear tops.",
        ],
        internalLink: {
          text: "Discover textured layers like the Leopard Noir Oversized Waffle.",
          href: "/product/leopard-noir-waffle-unisex-oversized-waffle",
          label: "View Leopard Noir Waffle",
        },
      },
      {
        id: "french-tuck-styling",
        heading: "4. The Considered Front Tuck with High-Waisted Denim",
        paragraphs: [
          "If an oversized tee feels overly boxy on a particular day, the front tuck (often called the French tuck) offers an immediate remedy. By casually tucking the front center hem into high-waisted denim or pleated trousers, you visually define the waistline while leaving the sides and back loose.",
          "This technique shows off your belt hardware and lengthens leg proportions, making it particularly effective for shorter or medium heights wanting to embrace oversized garments without feeling dwarfed.",
        ],
      },
      {
        id: "monochrome-minimalism",
        heading: "5. The Monochrome Minimalist Statement",
        paragraphs: [
          "When in doubt, build an outfit around a single tonal spectrum. An all-black ensemble—combining a washed black oversized graphic tee, washed black denim, and dark footwear—instantly reads as cohesive and editorial.",
          "In monochrome dressing, fabric texture replaces color contrast. Pairing a soft 240+ GSM combed cotton tee with rugged washed denim and matte leather accessories ensures the outfit feels textured and multi-dimensional rather than flat.",
        ],
      },
      {
        id: "relaxed-summer-shorts",
        heading: "6. Warm-Weather Streetwear: Relaxed Denim Shorts & Athletic Socks",
        paragraphs: [
          "During warmer months across India, pairing an oversized tee with knee-length denim shorts or heavyweight mesh athletic shorts provides superior ventilation while preserving street credibility.",
          "Balance the generous torso volume by wearing crew-length ribbed white socks paired with retro skate shoes or chunkier runners. The sock height creates a clean visual anchor that grounds the relaxed upper body.",
        ],
      },
      {
        id: "layered-under-open-jacket",
        heading: "7. Layered Under an Open Overshirt or Light Jacket",
        paragraphs: [
          "An oversized T-shirt functions as an exceptional foundation underneath lightweight outerwear. Wear it under an unbuttoned canvas overshirt, denim jacket, or statement fur-collar article for dynamic movement.",
          "Because the tee is cut with a wider silhouette, ensure your jacket has ample room in the armholes and shoulders to prevent bunching around the bicep. Leave the front unbuttoned so the central graphic remains proudly visible.",
        ],
        internalLink: {
          text: "Browse our outerwear curation including statement jackets and layering pieces.",
          href: "/shop/outerwear",
          label: "View Outerwear & Layers",
        },
      },
      {
        id: "how-to-choose-the-right-fit",
        heading: "How to Choose the Right Oversized T-Shirt Fit",
        paragraphs: [
          "True oversized design is engineered specifically with drop shoulders, widened chest dimensions, and adjusted necklines. It is not simply a standard T-shirt sized up two sizes, which often results in an excessively long, unflattering hemline.",
          "When selecting an oversized piece, look for three key markers: a shoulder seam that falls 2–3 inches past your natural shoulder bone, sleeves that hit just at or above the elbow crease, and a hem that rests comfortably around the mid-fly line without covering your entire thighs.",
        ],
        callout: {
          title: "Fabric Weight Matters",
          text: "Heavyweight fabrics (220 to 280 GSM) maintain their boxy architecture throughout the day. Flimsy fabrics collapse against the body and lose their signature streetwear silhouette.",
        },
      },
    ],
    faqs: [
      {
        question: "Should I buy my regular size or size up for an oversized T-shirt?",
        answer:
          "Buy your standard size. Thoughtfully designed streetwear brands like WASTE cut oversized tees with deliberate extra room in the chest and shoulders. Sizing up usually results in an excessively long body length rather than the intended boxy drape.",
      },
      {
        question: "Can shorter individuals wear oversized tees without looking smaller?",
        answer:
          "Yes. To keep proportions balanced, pair the tee with straight or relaxed trousers that break cleanly, try a partial front tuck, and avoid overly long tees that extend past the bottom of your back pockets.",
      },
      {
        question: "How do I care for heavyweight cotton graphic tees?",
        answer:
          "Always wash inside out in cold water on a gentle cycle. Air dry flat or hang in the shade to prevent shrinkage and protect the graphic print from heat degradation.",
      },
    ],
    conclusion: [
      "Styling an oversized T-shirt is ultimately an exercise in confidence and intentional proportion. By pairing loose architectural tops with deliberate trousers, curated footwear, and subtle accessories, you create a timeless look rooted in contemporary culture.",
      "Explore the full range of original graphics and distinctive fits in the WASTE collection to find your next statement piece.",
    ],
    relatedSlugs: [
      "how-to-style-graphic-t-shirts",
      "streetwear-fashion-guide-india",
    ],
    relatedCollection: {
      heading: "Explore Heavyweight Streetwear Tops",
      description:
        "Crafted in India from premium combed cotton with distinctive drops and graphic expression.",
      linkText: "Shop T-Shirts & Tops",
      href: "/shop/t-shirts",
    },
  },
  {
    slug: "streetwear-fashion-guide-india",
    title: "A Beginner's Guide to Streetwear Fashion in India",
    seoTitle: "A Beginner's Guide to Streetwear Fashion in India | WASTE Journal",
    metaDescription:
      "Understand contemporary Indian streetwear culture, climate-friendly silhouettes, essential wardrobe foundations, and versatile styling principles.",
    category: "Culture & Essentials",
    categorySlug: "culture-and-essentials",
    publishedAt: "2026-03-22",
    updatedAt: "2026-04-12",
    excerpt:
      "From climate-conscious fabric choices to silhouettes rooted in modern subculture, here is everything you need to know about navigating contemporary Indian streetwear.",
    featuredImage:
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792962520/OUT-STORY_HEOR_twahsu.jpg",
    featuredImageAlt:
      "Streetwear models showcasing contemporary Indian street silhouettes and creative apparel",
    intro: [
      "Over the past five years, streetwear in India has transformed from an underground niche into one of the country's most vibrant cultural movements. What began as a borrowing of Western skate and hip-hop aesthetics has matured into an independent design identity that celebrates local artistry, urban realities, and relaxed tailoring.",
      "Navigating streetwear in India requires a unique approach: outfits must respond to tropical heat, bustling city commutes, and diverse social settings, all while expressing individuality. Here is your definitive primer on building an authentic streetwear wardrobe from the ground up.",
    ],
    sections: [
      {
        id: "understanding-indian-streetwear-silhouettes",
        heading: "1. Understanding Streetwear Silhouettes in the Indian Climate",
        paragraphs: [
          "The most fundamental difference between Western streetwear and Indian streetwear lies in fabric breathability and heat adaptation. Heavy synthetic hoodies and multi-layered wool coats that dominate foreign lookbooks simply do not work during Indian summers.",
          "Instead, Indian streetwear prioritizes breathable heavyweight cottons (100% natural fibers), drop-shoulder short-sleeve tees, and airy wide-leg trousers. The extra space within an oversized cut allows air to circulate naturally, keeping you cooler than clingy synthetic fabrics ever could.",
        ],
        callout: {
          title: "Material Choice",
          text: "Prioritize 100% combed cotton with natural yarn structures. Avoid polyester blends that trap heat and moisture in humid city conditions.",
        },
      },
      {
        id: "wardrobe-foundations",
        heading: "2. The Four Wardrobe Foundations to Own First",
        paragraphs: [
          "Building a versatile streetwear rotation does not require dozens of garments. Focus initially on four versatile pillars that can be mixed and matched endlessly:",
          "1. Heavyweight Graphic Tees: Look for expressive artwork and durable ribbed collars that maintain their shape after multiple washes.",
          "2. Relaxed-Fit Trousers: High-rise pleated cotton chinos or relaxed-leg cargo pants in black, olive, or beige.",
          "3. Versatile Layering Piece: A breathable overshirt, lightweight zip hoodie, or statement graphic sweatshirt for air-conditioned spaces and evening outings.",
          "4. Timeless Footwear: One pair of crisp white or neutral low-top sneakers that complement wide leg openings.",
        ],
        internalLink: {
          text: "Discover foundational pieces in the WASTE Streetwear Collection.",
          href: "/shop",
          label: "View All Pieces",
        },
      },
      {
        id: "navigating-color-palette",
        heading: "3. Navigating the Color Palette: Beyond Standard Black",
        paragraphs: [
          "While monochrome black remains an enduring staple of global street culture, contemporary Indian streetwear draws rich inspiration from local landscapes and architecture.",
          "Earthy tones—such as sun-faded olive, desert sand, terracotta crimson, warm charcoal, and raw canvas ecru—harmonize effortlessly with natural sunlight. Introducing these tones alongside classic black gives your daily wardrobe subtle depth and character.",
        ],
      },
      {
        id: "layering-strategies-for-the-heat",
        heading: "4. Smart Layering Strategies That Prevent Overheating",
        paragraphs: [
          "Layering is the cornerstone of great streetwear styling, but in India it must be approached pragmatically. Focus on lightweight structural pieces rather than thick insulators.",
          "Open canvas overshirts, textured waffle-knit tops worn with sleeves pushed up, and lightweight unlined jackets allow you to add visual tiers to an outfit without trapping excessive heat. When moving between outdoor heat and indoor air conditioning, having an adaptable top layer is both functional and stylish.",
        ],
        internalLink: {
          text: "Explore outerwear and layering articles designed for contemporary styling.",
          href: "/shop/outerwear",
          label: "View Outerwear & Layers",
        },
      },
      {
        id: "finding-personal-expression",
        heading: "5. Finding Personal Expression Over Logo Hype",
        paragraphs: [
          "The greatest trap for beginners in streetwear is confusing brand hype with genuine personal style. Plastering massive commercial logos across every garment rarely creates an interesting look.",
          "True style lies in finding pieces whose story, silhouette, and artistic point of view resonate with you personally. Independent Indian streetwear labels like WASTE craft collections that prioritize artistic rebellion, craftsmanship, and cultural storytelling over superficial branding.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I start building a streetwear wardrobe on a budget?",
        answer:
          "Start with two high-quality oversized tees in neutral shades, one pair of versatile black or olive relaxed trousers, and one reliable pair of sneakers. Invest in construction quality rather than quantity.",
      },
      {
        question: "Is streetwear acceptable for semi-casual work environments in India?",
        answer:
          "Yes, particularly when pairing a clean, minimalist graphic tee with tailored pleated trousers and clean leather footwear. Keep graphics subtle and ensure garments are neatly steamed.",
      },
    ],
    conclusion: [
      "Streetwear in India is not a temporary trend; it is a creative canvas for a generation expressing independence, cultural pride, and relaxed modern elegance.",
      "Take your time experimenting with silhouettes, focus on honest craftsmanship, and wear what feels genuine to your lifestyle.",
    ],
    relatedSlugs: [
      "how-to-style-oversized-t-shirts",
      "how-to-style-graphic-t-shirts",
    ],
    relatedCollection: {
      heading: "Discover the WASTE Story",
      description:
        "Learn about our Jaipur roots, our design philosophy, and our commitment to modern Indian culture.",
      linkText: "Read Our Story",
      href: "/our-story",
    },
  },
  {
    slug: "how-to-style-graphic-t-shirts",
    title: "How to Style Graphic T-Shirts: A Practical Outfit Guide",
    seoTitle: "How to Style Graphic T-Shirts: A Practical Outfit Guide | WASTE Journal",
    metaDescription:
      "Learn how to style bold graphic T-shirts without visual clutter. Master visual hierarchy, neutral pairing, tailored contrasts, and color coordination.",
    category: "Style Editorial",
    categorySlug: "style-editorial",
    publishedAt: "2026-04-02",
    updatedAt: "2026-04-15",
    excerpt:
      "Make graphic prints the focal point of your outfit without looking cluttered. Learn how to balance bold artwork with neutral silhouettes, tailored layers, and refined details.",
    featuredImage:
      "https://res.cloudinary.com/dom7a6zlx/image/upload/v1792943377/footer-section_wxyq9z.jpg",
    featuredImageAlt:
      "Editorial model in an expressive graphic streetwear t-shirt with tailored neutral pants",
    intro: [
      "Graphic T-shirts are often misconstrued as purely casual loungewear. But in thoughtful contemporary streetwear, an expressive graphic tee serves as the hero element—a piece of wearable visual art that anchors an entire look.",
      "The challenge with bold prints is preventing the outfit from looking chaotic or overwhelmed. When done right, pairing expressive artwork with refined textures, disciplined color palettes, and balanced proportions transforms an ordinary T-shirt into a striking fashion statement.",
    ],
    sections: [
      {
        id: "visual-hierarchy-rule",
        heading: "1. The Rule of Visual Hierarchy: One Hero at a Time",
        paragraphs: [
          "The golden rule of styling graphic tees is establishing a clear visual focal point. If your T-shirt features an intricate back graphic or a vibrant chest print like the Crimson Bloom artwork, every other component in your outfit should play a supporting role.",
          "Avoid pairing busy graphic tees with heavily patterned pants, logo-covered caps, or loud multi-colored sneakers. Keeping your bottoms clean and muted gives the graphic room to breathe and commands the viewer's attention.",
        ],
        internalLink: {
          text: "See statement graphic tees like the Crimson Bloom Oversized Tee.",
          href: "/product/waste-crimson-bloom-oversized-tee",
          label: "View Crimson Bloom Tee",
        },
      },
      {
        id: "pairing-with-tailored-trousers",
        heading: "2. The High-Low Balance: Pairing Artwork with Tailoring",
        paragraphs: [
          "One of the most modern fashion contrasts is the collision between casual streetwear graphics and formal tailoring. Pairing a bold, slightly rebellious graphic tee with pleated trousers or relaxed wool-blend pants creates immediate sophistication.",
          "This high-low contrast subverts expectations: the formality of the trousers keeps the graphic tee from feeling sloppy, while the raw attitude of the tee prevents the trousers from feeling stuffy.",
        ],
        callout: {
          title: "Styling Note",
          text: "Keep the trousers relaxed or wide-legged. Skinny dress pants clash awkwardly with the boxy cut of streetwear graphic tops.",
        },
      },
      {
        id: "layering-without-covering-print",
        heading: "3. Framing the Art: Layering Without Covering the Graphic",
        paragraphs: [
          "Layering around a graphic tee requires framing rather than concealing. Use open-front garments—such as an unstructured denim jacket, a lightweight cotton overshirt, or an open cardigan—to flank the graphic on both sides.",
          "The vertical lines of the jacket lapels naturally draw the eye toward the center of your chest, highlighting the artwork while adding three-dimensional depth to your outfit.",
        ],
        internalLink: {
          text: "Browse layering essentials in our outerwear catalog.",
          href: "/shop/outerwear",
          label: "View Outerwear",
        },
      },
      {
        id: "color-accent-coordination",
        heading: "4. Color Accent Echoing: Subtle Harmony",
        paragraphs: [
          "A subtle styling secret used by fashion editors is picking one secondary accent color from the graphic print and echoing it elsewhere in the ensemble.",
          "For example, if your graphic tee incorporates subtle amber or crimson brushstrokes, echoing that tone in your sneaker accents, socks, or watch strap ties the entire outfit together into a cohesive visual narrative.",
        ],
      },
      {
        id: "caring-for-graphic-garments",
        heading: "5. Caring for Printed Garments to Maintain Artwork Longevity",
        paragraphs: [
          "A graphic T-shirt only looks premium as long as its print remains crisp and vibrant. Heat is the natural enemy of screenprinted and digital artwork.",
          "Always turn your graphic tops inside out prior to washing. Use cold water, mild detergents, and never iron directly on the printed surface. Iron from the reverse side on low heat, or use a handheld garment steamer to keep the cotton drape looking pristine.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can graphic tees be worn for evening or dinner occasions?",
        answer:
          "Yes. Choose a darker graphic tee with thoughtful artwork, pair it with structured dark trousers and clean minimalist leather shoes, and layer with an unstructured blazer or jacket.",
      },
      {
        question: "Should the graphic match the color of my shoes?",
        answer:
          "Exact color matching can look overly calculated. Instead, look for complementary undertones—pair warm graphics with earth tones and cool monochrome prints with neutral whites, greys, and blacks.",
      },
    ],
    conclusion: [
      "Graphic T-shirts are powerful instruments of personal storytelling. When treated with the same styling discipline as tailoring or luxury knitwear, they become the centerpiece of an authentic, contemporary wardrobe.",
      "Explore the full range of original graphics in the WASTE collection to discover pieces that speak to your individual perspective.",
    ],
    relatedSlugs: [
      "how-to-style-oversized-t-shirts",
      "streetwear-fashion-guide-india",
    ],
    relatedCollection: {
      heading: "Explore the Graphic T-Shirts Collection",
      description:
        "Original artwork, heavyweight fabrics, and relaxed streetwear fits crafted in India.",
      linkText: "Shop Graphic Tees",
      href: "/shop/t-shirts",
    },
  },
];

export function getArticles(): Article[] {
  return ARTICLES;
}

export function getArticleBySlug(slug: string): Article | null {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function getAllArticleSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export function calculateReadingTime(article: Article): number {
  const allText = [
    article.title,
    ...article.intro,
    ...article.sections.flatMap((s) => [s.heading, ...s.paragraphs, s.callout?.text || ""]),
    ...(article.faqs?.flatMap((f) => [f.question, f.answer]) || []),
    ...article.conclusion,
  ].join(" ");
  const wordCount = allText.trim().split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}
