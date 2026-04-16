export type Locale = 'en' | 'es'

export const marketingContent = {
  en: {
    nav: {
      links: [
        { label: "Services", href: "#services" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
      ],
      clientLogin: { label: "Client Login", href: "/client-portal" },
      bookCta: "Book a Meeting →",
    },

    hero: {
      badge: "Over 18 years of experience",
      h1Line1: "It's time to",
      h1Line2: "get your taxes",
      h1Italic: "done right.",
      subtext:
        "Abacus Accounting, LLC — personalized tax preparation, accounting, and business consulting. Hassle-free. Transparent. In English and Spanish.",
      cta1: "Book a free meeting",
      cta2: "See our services →",
      stats: [
        { value: "18+", label: "Years of experience" },
        { value: "100%", label: "Personalized service" },
        { value: "2", label: "Languages spoken" },
      ],
    },

    services: {
      label: "What we do",
      h2Part1: "Everything your",
      h2Italic: "finances",
      h2Part2: "need.",
      subtext:
        "Comprehensive accounting solutions delivered with transparency, flexibility, and 18+ years of expertise.",
      cards: [
        {
          title: "Tax Preparation",
          description:
            "Individual and business tax return preparation. We stay current on tax laws to ensure accuracy and maximize your refund — year-round support included.",
          highlights: [
            "Individual & business returns",
            "Tax agency notices",
            "Offer in compromise",
            "Installment plans",
          ],
        },
        {
          title: "Accounting",
          description:
            "Monthly, quarterly, and yearly accounting services with full financial statement preparation. Get a clear snapshot of your business performance.",
          highlights: [
            "Monthly bookkeeping",
            "Financial statements",
            "Income & expense tracking",
            "Business snapshots",
          ],
        },
        {
          title: "Consulting",
          description:
            "Tax planning to reduce your burden, college and retirement savings strategies, ITIN services, and proactive advice tailored to your situation.",
          highlights: [
            "Tax planning",
            "Retirement savings",
            "College savings",
            "ITIN services",
          ],
        },
        {
          title: "Business Advice",
          description:
            "Strategic guidance to help your business grow. We don't just prepare your taxes — we act as your trusted advisor for business decisions.",
          highlights: [
            "Growth strategy",
            "Business structure",
            "Financial planning",
            "Ongoing support",
          ],
        },
      ],
    },

    about: {
      label: "Who we are",
      h2Part1: "We take the",
      h2Italic: "stress",
      h2Part2: "out of taxes.",
      p1: "At Abacus Accounting, LLC, we believe that managing your finances shouldn't be overwhelming. We handle the complexity so you can focus on what matters — growing your business and living your life.",
      p2Bold: "hablamos español.",
      p2: "We offer flexible scheduling, transparent communication, and personalized service that evolves with your needs. And yes —",
      pills: [
        { label: "Individual Tax", color: "border-[#bfdbfe] bg-[#eff6ff] text-[#1e40af]" },
        { label: "Business Tax", color: "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]" },
        { label: "Consulting", color: "border-[#fde68a] bg-[#fefce8] text-[#ca8a04]" },
        { label: "Se habla Español", color: "border-[#e9d5ff] bg-[#fdf4ff] text-[#9333ea]" },
      ],
      values: [
        {
          title: "Passion",
          description:
            "We genuinely care about your financial wellbeing. This isn't just work to us — it's how we help families and businesses thrive.",
        },
        {
          title: "Experience",
          description:
            "Over 18 years helping individuals and businesses navigate complex tax laws, accounting challenges, and financial decisions.",
        },
        {
          title: "Diligence",
          description:
            "We stay up to date on every tax law change so you don't have to. Accurate, thorough, and always on your side.",
        },
      ],
    },

    booking: {
      label: "Get started",
      h2Part1: "Ready to get on",
      h2Italic: "the schedule?",
      subtext:
        "Book a free consultation with our team. We offer in-person, virtual, and phone meetings — whatever works best for you.",
      cta: "📅 Schedule now — it's free",
      meetingTypes: [
        { label: "In Person", sub: "Our office" },
        { label: "Zoom", sub: "Video call" },
        { label: "Google Meet", sub: "Video call" },
        { label: "Phone", sub: "Quick call" },
      ],
    },

    contact: {
      label: "Get in touch",
      h2Part1: "Let's",
      h2Italic: "talk.",
      subtext: "Have questions? Reach out directly. We respond fast.",
      cards: [
        { label: "Phone", sub: "Call or text us" },
        { label: "Email", sub: "We reply within 24 hours" },
        { label: "Languages", sub: "Hablamos español" },
      ],
    },

    footer: {
      tagline: "Passion. Experience. Diligence.\nServing individuals and businesses for over 18 years.",
      seHablaEspanol: "Se habla Español",
      servicesHeader: "Services",
      contactHeader: "Contact",
      services: [
        "Tax Preparation",
        "Accounting",
        "Consulting",
        "Business Advice",
        "ITIN Services",
      ],
      portalLink: { label: "Staff / Client Portal →", href: "/admin" },
      copyright: (year: number) => `© ${year} Abacus Accounting, LLC. All rights reserved.`,
    },
  },

  es: {
    nav: {
      links: [
        { label: "Servicios", href: "#services" },
        { label: "Nosotros", href: "#about" },
        { label: "Contacto", href: "#contact" },
      ],
      clientLogin: { label: "Acceso Clientes", href: "/es/client-portal" },
      bookCta: "Agendar Cita →",
    },

    hero: {
      badge: "Más de 18 años de experiencia",
      h1Line1: "Es hora de poner",
      h1Line2: "tus impuestos",
      h1Italic: "en orden.",
      subtext:
        "Abacus Accounting, LLC — preparación de impuestos personalizada, contabilidad y consultoría empresarial. Sin complicaciones. Transparente. En inglés y español.",
      cta1: "Agendar cita gratis",
      cta2: "Ver nuestros servicios →",
      stats: [
        { value: "18+", label: "Años de experiencia" },
        { value: "100%", label: "Servicio personalizado" },
        { value: "2", label: "Idiomas que hablamos" },
      ],
    },

    services: {
      label: "Lo que hacemos",
      h2Part1: "Todo lo que tus",
      h2Italic: "finanzas",
      h2Part2: "necesitan.",
      subtext:
        "Soluciones contables completas con transparencia, flexibilidad y más de 18 años de experiencia.",
      cards: [
        {
          title: "Preparación de Impuestos",
          description:
            "Preparación de declaraciones individuales y empresariales. Nos mantenemos al día en las leyes fiscales para garantizar precisión y maximizar tu reembolso — soporte durante todo el año.",
          highlights: [
            "Declaraciones individuales y empresariales",
            "Avisos de agencias fiscales",
            "Oferta en compromiso",
            "Planes de pago",
          ],
        },
        {
          title: "Contabilidad",
          description:
            "Servicios de contabilidad mensual, trimestral y anual con preparación completa de estados financieros. Obtén una visión clara del desempeño de tu negocio.",
          highlights: [
            "Contabilidad mensual",
            "Estados financieros",
            "Seguimiento de ingresos y gastos",
            "Resúmenes del negocio",
          ],
        },
        {
          title: "Consultoría",
          description:
            "Planificación fiscal para reducir tu carga, estrategias de ahorro para universidad y jubilación, servicios de ITIN y asesoría proactiva adaptada a tu situación.",
          highlights: [
            "Planificación fiscal",
            "Ahorro para el retiro",
            "Ahorro universitario",
            "Servicios de ITIN",
          ],
        },
        {
          title: "Asesoría Empresarial",
          description:
            "Orientación estratégica para hacer crecer tu negocio. No solo preparamos tus impuestos — somos tu asesor de confianza para decisiones empresariales.",
          highlights: [
            "Estrategia de crecimiento",
            "Estructura empresarial",
            "Planificación financiera",
            "Soporte continuo",
          ],
        },
      ],
    },

    about: {
      label: "Quiénes somos",
      h2Part1: "Le quitamos el",
      h2Italic: "estrés",
      h2Part2: "a tus impuestos.",
      p1: "En Abacus Accounting, LLC, creemos que administrar tus finanzas no tiene que ser complicado. Nosotros nos encargamos de la complejidad para que tú puedas enfocarte en lo que importa — hacer crecer tu negocio y disfrutar tu vida.",
      p2Bold: "hablamos español.",
      p2: "Ofrecemos horarios flexibles, comunicación transparente y un servicio personalizado que evoluciona con tus necesidades. Y sí —",
      pills: [
        { label: "Impuestos Individuales", color: "border-[#bfdbfe] bg-[#eff6ff] text-[#1e40af]" },
        { label: "Impuestos Empresariales", color: "border-[#bbf7d0] bg-[#f0fdf4] text-[#16a34a]" },
        { label: "Consultoría", color: "border-[#fde68a] bg-[#fefce8] text-[#ca8a04]" },
        { label: "Se habla Español", color: "border-[#e9d5ff] bg-[#fdf4ff] text-[#9333ea]" },
      ],
      values: [
        {
          title: "Pasión",
          description:
            "Nos importa genuinamente tu bienestar financiero. Esto no es solo trabajo para nosotros — es cómo ayudamos a familias y negocios a prosperar.",
        },
        {
          title: "Experiencia",
          description:
            "Más de 18 años ayudando a personas y empresas a navegar leyes fiscales complejas, retos contables y decisiones financieras.",
        },
        {
          title: "Dedicación",
          description:
            "Nos mantenemos al día con cada cambio en la ley fiscal para que tú no tengas que hacerlo. Precisos, meticulosos y siempre de tu lado.",
        },
      ],
    },

    booking: {
      label: "Comienza ahora",
      h2Part1: "¿Listo para agendar",
      h2Italic: "tu cita?",
      subtext:
        "Agenda una consulta gratuita con nuestro equipo. Ofrecemos reuniones en persona, virtuales y por teléfono — lo que mejor te funcione.",
      cta: "📅 Agendar ahora — es gratis",
      meetingTypes: [
        { label: "En Persona", sub: "Nuestra oficina" },
        { label: "Zoom", sub: "Videollamada" },
        { label: "Google Meet", sub: "Videollamada" },
        { label: "Teléfono", sub: "Llamada rápida" },
      ],
    },

    contact: {
      label: "Contáctanos",
      h2Part1: "Hablemos.",
      h2Italic: "",
      subtext: "¿Tienes preguntas? Contáctanos directamente. Respondemos rápido.",
      cards: [
        { label: "Teléfono", sub: "Llámanos o escríbenos" },
        { label: "Correo", sub: "Respondemos en menos de 24 horas" },
        { label: "Idiomas", sub: "Hablamos español" },
      ],
    },

    footer: {
      tagline:
        "Pasión. Experiencia. Dedicación.\nAl servicio de personas y negocios por más de 18 años.",
      seHablaEspanol: "Se habla Español",
      servicesHeader: "Servicios",
      contactHeader: "Contacto",
      services: [
        "Preparación de Impuestos",
        "Contabilidad",
        "Consultoría",
        "Asesoría Empresarial",
        "Servicios de ITIN",
      ],
      portalLink: { label: "Staff / Portal de Clientes →", href: "/es/client-portal" },
      copyright: (year: number) => `© ${year} Abacus Accounting, LLC. Todos los derechos reservados.`,
    },
  },
} as const
