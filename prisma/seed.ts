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

  // 4. Blog posts
  const posts = [
    {
      title: 'The Science of Sole Reflexology: How 7,200 Nerves Reconnect You',
      slug: 'science-of-sole-reflexology-nerve-endings',
      excerpt: 'Explore the biological link between plantar mechanoreceptors, the autonomic nervous system, and systemic vitality.',
      content: `The human foot is an anatomical masterpiece. Composed of 26 bones, 33 joints, and over one hundred muscles, tendons, and ligaments, it also serves as one of our body's densest sensory hubs with more than 7,200 nerve endings.\n\nWhen we encase our feet in thick rubberized soles and walk exclusively on flat synthetic floors, these mechanoreceptors undergo sensory deprivation. In reflexology, each zone of the sole maps to distinct physiological organs and autonomic meridians.\n\nClinical trials have demonstrated that sustained mechanical pressure applied to the plantar surface stimulates nitric oxide production, lowers cortisol levels, and induces parasympathetic dominance. Regular reflexology sessions not only alleviate localised heel strain, but reset the entire nervous system's stress response.\n\nAt Zen Steps, each session is calibrated to your current physical load. By understanding nerve mapping, our practitioners help your body trigger its inherent self-restoration mechanisms.`,
      coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      category: 'Foot Health',
      author: 'Zen Steps',
      tags: ['Reflexology', 'Nerve Health', 'Anatomy'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Grounding and Blood Viscosity: Why Barefoot Contact Matters',
      slug: 'grounding-and-blood-viscosity-barefoot-science',
      excerpt: 'Modern research illustrates how direct grounding contact helps regulate cardiovascular strain and reduce chronic systemic inflammation.',
      content: `In our modern indoor existence, we rarely make direct conductive contact with the earth. Biophysical studies in earthing and grounding demonstrate that contact with natural conductive surfaces transfers free electrons into the body, neutralizing reactive oxygen species.\n\nResearch published in the Journal of Alternative and Complementary Medicine found that grounding significantly decreases red blood cell aggregation and lowers blood viscosity—a primary marker for cardiovascular strain.\n\nOur natural stone-path walkways replicate the uneven, mineral-rich terrain humans evolved on. As you step across basalt and river cobblestones, you engage intrinsic plantar stabilizers while grounding your electrical potential.\n\nWhether you visit our centre for twenty minutes or an hour, the physiological benefits of grounded walking begin from the very first step.`,
      coverImage: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
      category: 'Grounding Science',
      author: 'Zen Steps',
      tags: ['Grounding', 'Circulation', 'Holistic Health'],
      isPublished: true,
      publishedAt: new Date(),
    },
    {
      title: 'Herbal Foot Baths: Traditional Botanicals for Modern Fatigue',
      slug: 'herbal-foot-baths-traditional-botanicals',
      excerpt: 'Discover why pairing Himalayan salts with active Indian botanical oils provides superior detoxification and deep neuromuscular release.',
      content: `Hydrotherapy through warm foot baths has been a cornerstone of Ayurvedic and Siddha traditions for centuries. The soles of our feet possess large sebaceous pores and abundant vascular networks capable of absorbing active phytochemicals.\n\nAt Zen Steps, our foot soak infusions are blended fresh daily using organic Himalayan crystal salt, cold-pressed neem, Indian turmeric (curcuma longa), and wild-harvested eucalyptus.\n\nTurmeric provides powerful anti-inflammatory support, while neem and tea tree ensure rigorous microbial balance. The warmth vasodilates peripheral capillaries, allowing blood to circulate freely from the extremities back toward the core, easing heaviness in the calves and soothing restless legs.\n\nExperience this ritual before your reflexology treatment to prepare both body and mind for profound rejuvenation.`,
      coverImage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
      category: 'Holistic Wellness',
      author: 'Zen Steps',
      tags: ['Ayurveda', 'Botanicals', 'Detox'],
      isPublished: true,
      publishedAt: new Date(),
    },
  ]

  for (const p of posts) {
    await prisma.blogPost.upsert({ where: { slug: p.slug }, update: {}, create: p })
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
