import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { CONTACT, DEFAULT_BENEFITS, DEFAULT_FAQS, THERAPIES } from '../src/lib/franchise'

const prisma = new PrismaClient()

// Content comes from the Nov 2026 brochure (src/lib/franchise.ts). Every step only adds what is
// missing, so re-running the seed never overwrites or deletes anything an admin has edited.
async function main() {
  console.log('Seeding Zen Steps database...')

  // 1. Admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@zensteps.in'
  const adminPassword = process.env.ADMIN_PASSWORD || 'ZenAdmin@12345'
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Zen Admin',
      role: 'superadmin',
    },
  })

  // 2. Therapy menu
  for (const [i, t] of THERAPIES.entries()) {
    await prisma.service.upsert({
      where: { slug: t.slug },
      update: {},
      create: { ...t, benefits: [...t.benefits], sortOrder: i + 1, isActive: true },
    })
  }

  // 3. Centre
  await prisma.location.upsert({
    where: { slug: 'zen-steps-ambattur' },
    update: {},
    create: {
      name: 'Zen Steps Ambattur',
      slug: 'zen-steps-ambattur',
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: CONTACT.address,
      phone: CONTACT.phone,
      mapUrl: CONTACT.mapUrl,
      image: '/images/session-room.jpg',
      isActive: true,
    },
  })

  // 4. Blog posts (Strictly Foot Reflexology & Plantar Health Only)
  const posts = [
    {
      title: 'The Science of Sole Reflexology: How 7,200 Plantar Nerves Reset the Body',
      slug: 'science-of-sole-reflexology-nerve-endings',
      excerpt: 'Explore the biological link between plantar mechanoreceptors, the autonomic nervous system, and systemic bodily restoration.',
      content: `The human foot is an anatomical marvel containing 26 bones, 33 joints, and over one hundred muscles, tendons, and ligaments. Crucially, each foot is one of the body's densest sensory epicentres, packed with more than 7,200 nerve endings.\n\nWhen we spend long hours in rigid shoes walking over flat synthetic surfaces, these plantar mechanoreceptors undergo sensory starvation. In therapeutic reflexology, specific zones across the plantar fascia map directly to internal organs, endocrine glands, and nervous meridians.\n\nClinical studies demonstrate that sustained, rhythmic thumb pressure applied to specific plantar reflex arcs triggers parasympathetic nervous system dominance. This lowers systemic cortisol, stimulates localized nitric oxide release, and relieves arterial tension. Regular foot reflexology sessions not only alleviate localised heel strain, but signal the entire central nervous system to shift into a deep restorative state.\n\nAt Zen Steps, each session is calibrated to your individual physical fatigue profile. Guided purely by tactile discernment, our practitioners systematically work through these 7,200 nerve endings to restore equilibrium throughout your body.`,
      coverImage: '/images/reflexology-benefits.jpg',
      category: 'Plantar Reflexology',
      author: 'Zen Steps',
      tags: ['Foot Reflexology', 'Plantar Nerves', 'Acupressure'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Relieving Plantar Fasciitis & Foot Fatigue Through Targeted Acupressure',
      slug: 'plantar-fasciitis-relief-foot-acupressure',
      excerpt: 'How targeted calcaneal pressure and longitudinal arch mobilization relieve morning heel pain, plantar fasciitis, and occupational foot fatigue.',
      content: `Plantar fasciitis is one of the most widespread foot ailments in modern urban living. Prolonged standing, hard tile floors, and improper arch support create micro-tears and localized inflammation where the plantar fascia anchors to the calcaneus (heel bone).\n\nWhile standard painkillers mask the discomfort temporarily, clinical foot reflexology addresses the mechanical and circulatory root causes. By applying sustained directional thumb pressure along the medial longitudinal arch, reflexology releases fascial adhesions, relaxes the flexor hallucis brevis, and stimulates microvascular blood flow to dormant tissues.\n\nAt Zen Steps, our therapists utilize deep thumb-walking techniques along the plantar fascia and Achilles insertion points. This breaks up calcified tension pockets and encourages healthy collagen realignment.\n\nGuests suffering from chronic foot fatigue or sharp morning heel stiffness experience notable relief within 2 to 3 sessions as elasticity and natural shock absorption are restored to the arch.`,
      coverImage: '/images/session-closeup.jpg',
      category: 'Foot Therapy',
      author: 'Zen Steps',
      tags: ['Plantar Fasciitis', 'Heel Pain', 'Arch Mechanics'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Herbal Foot Soaks: Traditional Indian Botanicals for Plantar Circulation',
      slug: 'herbal-foot-baths-traditional-botanicals',
      excerpt: 'Discover how pairing mineral-rich salts with active Indian botanical infusions prepares the soles for deeper reflexology release.',
      content: `Hydrotherapy through warm foot soaks has been an essential precursor to foot reflexology in Eastern traditions for centuries. The soles of our feet possess large sebaceous pores and dense micro-capillary networks that respond immediately to temperature and herbal infusions.\n\nAt Zen Steps, every reflexology ritual begins with a preparatory botanical foot soak in traditional bronze bowls. We blend pure Himalayan rock salts with cold-pressed neem, wild-harvested turmeric (Curcuma longa), and essential oils of eucalyptus and camphor.\n\nThe therapeutic warmth induces peripheral vasodilation, easing heavy legs and softening the plantar epidermis. Turmeric delivers localized anti-inflammatory support, while mineral salts reduce extracellular fluid buildup in swollen ankles.\n\nThis restorative 10-minute foot soak calms the autonomic nervous system and primes the nerve endings of the feet, enabling the therapist to achieve significantly deeper and more effective reflexology work.`,
      coverImage: '/images/botanical-foot-bath.jpg',
      category: 'Foot Care Rituals',
      author: 'Zen Steps',
      tags: ['Foot Soak', 'Plantar Circulation', 'Botanical Care'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'The Tactile Advantage: Why Visually Impaired Practitioners Excel at Reflexology',
      slug: 'tactile-advantage-visually-impaired-reflexologists',
      excerpt: 'How neuroplastic tactile adaptation allows visually impaired reflexologists to detect minute plantar tension knots undetectable by sight.',
      content: `When sight is absent or diminished, the human brain undergoes cross-modal neuroplasticity. The somatosensory cortex expands, giving the fingertips an extraordinary degree of tactile sensitivity, spatial discrimination, and pressure feedback.\n\nIn foot reflexology, the difference between an average session and a transformative one lies in the sensitivity of touch. A visually impaired practitioner can feel subtle crystalline deposits (uric acid micro-accumulations), localized temperature fluctuations, and microscopic fascial adhesions along the foot reflex meridians that sight-guided therapists often miss.\n\nAt Zen Steps, we train certified visually impaired artisans to harness this innate sensory gift into mastery of plantar reflexology. Because our practitioners do not rely on visual distraction, their complete mental presence is concentrated in the tips of their fingers.\n\nThe result is a deeply intuitive, meticulously calibrated foot reflexology treatment that targets stress points with unmatched precision.`,
      coverImage: '/images/highlight-session.jpg',
      category: 'Clinical Reflexology',
      author: 'Zen Steps',
      tags: ['Tactile Science', 'Visually Impaired Mastery', 'Foot Reflexology'],
      isPublished: true,
      publishedAt: new Date(),
    },
  ]

  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: p, create: p })
  }

  // 5. FAQs and home page benefits (only into empty tables)
  if ((await prisma.fAQ.count()) === 0) {
    await prisma.fAQ.createMany({ data: DEFAULT_FAQS.map((f) => ({ ...f, isActive: true })) })
  }
  if ((await prisma.benefit.count()) === 0) {
    await prisma.benefit.createMany({ data: DEFAULT_BENEFITS.map((b, i) => ({ ...b, sortOrder: i + 1 })) })
  }

  // 6. Site settings
  const settings = [
    { key: 'siteName', value: 'Zen Steps' },
    { key: 'tagline', value: 'Where foot care begins with passion' },
    { key: 'phone', value: CONTACT.phone },
    { key: 'whatsapp', value: '+918925383388' },
    { key: 'email', value: CONTACT.email },
    { key: 'address', value: CONTACT.address },
  ]

  for (const s of settings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s })
  }

  console.log('Zen Steps database seeded.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
