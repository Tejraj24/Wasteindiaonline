/**
 * Official Brand Configuration for WASTE®
 * Single source of truth for brand copy, founder identity, and official contact channels.
 */

export interface PhilosophyPillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
}

export interface BrandConfig {
  brandName: string;
  brandNamePlain: string;
  foundingYear: string;
  tagline: string;
  origin: string;

  // Founder Information
  founder: {
    name: string;
    role: string;
    bio: string;
    email: string;
    portraitUrl: string | null;
  };

  // Official Brand Narrative
  about: {
    lead: string;
    body: string[];
    mission: string;
    tagline: string;
  };

  ourStory: {
    lead: string;
    paragraphs: string[];
    closingStatement: string;
  };

  philosophyPillars: PhilosophyPillar[];

  // Verified Contact Channels
  contact: {
    officialBusinessEmail: string;
    founderEmail: string;
    // Customer support channels are currently unavailable until official infrastructure is deployed
    customerSupportEmail: string | null;
    customerSupportPhone: string | null;
    physicalAddress: string | null;
    businessHours: string | null;
  };

  // Verified Social Media Handles
  socials: {
    instagram: {
      handle: string;
      url: string;
    };
    facebook: {
      handle: string;
      url: string;
    };
  };
}

export const BRAND_CONFIG: BrandConfig = {
  brandName: "WASTE®",
  brandNamePlain: "WASTE",
  foundingYear: "2024",
  tagline: "Made in India. Built for the world. 🇮🇳",
  origin: "India",

  founder: {
    name: "Suryansh Meena",
    role: "Founder",
    bio: "Suryansh Meena is the founder of WASTE®, an Indian streetwear brand founded in 2024. With a vision to create a distinctive Indian fashion label, he leads WASTE® with a focus on creativity, individuality and modern streetwear culture.",
    email: "suryanshmeena.in@gmail.com",
    portraitUrl: null, // Verified portrait asset of Suryansh Meena to be supplied before launch
  },

  about: {
    lead: "WASTE® is an Indian streetwear brand founded in 2024 by Suryansh Meena, built around the idea of individuality, self-expression and modern Indian culture.",
    body: [
      "We create contemporary clothing that blends bold aesthetics with everyday wear, designed for people who see fashion as more than just what they wear.",
      "Born in India and created for a generation that refuses to fit into a box, WASTE® focuses on distinctive designs, strong silhouettes and a raw, modern approach to streetwear. Every collection is designed with attention to detail, from the graphics and fits to the overall experience of the brand.",
    ],
    mission:
      "Our vision is to build WASTE® into a globally recognised Indian streetwear label while staying rooted in the culture, creativity and attitude that inspire us.",
    tagline: "WASTE® — Made in India. Built for the world. 🇮🇳",
  },

  ourStory: {
    lead: "WASTE® began in 2024 with a simple idea — to create an Indian streetwear brand that feels different.",
    paragraphs: [
      "Born from a passion for fashion, creativity and self-expression, WASTE® was created by Suryansh Meena with the vision of building a brand that represents a new generation of Indian streetwear.",
      "We believe clothing is more than just something you wear. It is a way to express who you are, what you believe in and how you see the world. That belief is at the heart of everything we create.",
      "From bold graphics and distinctive silhouettes to the smallest details, every WASTE® piece is designed with a strong identity and a purpose — to make everyday streetwear feel more personal, confident and unapologetic.",
      "What started as an idea in 2024 is being built with a much bigger vision: to put Indian streetwear on the global map.",
      "WASTE® is created in India, inspired by the culture around us and made for people everywhere who choose to stand out rather than fit in.",
    ],
    closingStatement: "This is more than a clothing brand. This is WASTE®.",
  },

  philosophyPillars: [
    {
      number: "01",
      title: "Individuality & Expression",
      subtitle: "Refusing the Box",
      description:
        "Clothing is a way to express who you are, what you believe in and how you see the world. We design for people who choose to stand out rather than fit in.",
    },
    {
      number: "02",
      title: "Distinctive Silhouettes",
      subtitle: "Raw & Modern",
      description:
        "From bold graphics and distinctive fits to the smallest details, every piece is designed with attention to detail and a raw, modern streetwear approach.",
    },
    {
      number: "03",
      title: "Modern Indian Culture",
      subtitle: "Global Vision",
      description:
        "Created in India, inspired by the culture around us, with the vision of building WASTE® into a globally recognised Indian streetwear label.",
    },
  ],

  contact: {
    officialBusinessEmail: "wasteindiaonline@gmail.com",
    founderEmail: "suryanshmeena.in@gmail.com",
    customerSupportEmail: null, // Customer support currently unavailable
    customerSupportPhone: null, // Telephone support currently unavailable
    physicalAddress: null, // Physical address unconfirmed; not displayed
    businessHours: null, // Business hours unconfirmed; not displayed
  },

  socials: {
    instagram: {
      handle: "@wasteindia",
      url: "https://instagram.com/wasteindia",
    },
    facebook: {
      handle: "@wasteindiaclothing",
      url: "https://facebook.com/wasteindiaclothing",
    },
  },
};
