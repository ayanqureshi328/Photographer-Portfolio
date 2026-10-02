import { useEffect, useMemo, useState } from 'react'

const galleryImages = [
  {
    id: 1,
    title: 'Noir Riviera',
    location: 'Cannes, France',
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Silent Wake',
    location: 'Kyiv, Ukraine',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Afterglow',
    location: 'Marrakech, Morocco',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Glass Tide',
    location: 'Lisbon, Portugal',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Field Notes',
    location: 'Sicily, Italy',
    image:
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Fade Line',
    location: 'Tokyo, Japan',
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1200&q=80',
  },
]

const services = [
  { title: 'Editorial Portraits', price: '$950', detail: 'Art-directed sessions for magazines, brands, and personal narratives.' },
  { title: 'Wedding Stories', price: '$2,400', detail: 'Full-day coverage with cinematic edits and a quiet, natural pace.' },
  { title: 'Brand Campaigns', price: '$1,800', detail: 'Visual storytelling for founders, hospitality, and culture-led businesses.' },
]

const clientLogos = ['LUMA', 'HARP', 'KITE', 'NOVA', 'ATLAS', 'MORROW']

const initialFormData = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
}

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [formData, setFormData] = useState(initialFormData)
  const [submitState, setSubmitState] = useState({ type: 'idle', message: '' })

  useEffect(() => {
    const handlePointerMove = (event) => {
      setCursor({ x: event.clientX, y: event.clientY })
    }

    const interactiveTargets = document.querySelectorAll('a, button, .photo-card, .logo-item, input, textarea')
    const activateCursor = () => document.body.classList.add('cursor-active')
    const deactivateCursor = () => document.body.classList.remove('cursor-active')

    interactiveTargets.forEach((target) => {
      target.addEventListener('pointerenter', activateCursor)
      target.addEventListener('pointerleave', deactivateCursor)
    })

    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      interactiveTargets.forEach((target) => {
        target.removeEventListener('pointerenter', activateCursor)
        target.removeEventListener('pointerleave', deactivateCursor)
      })
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  useEffect(() => {
    if (!selectedImage) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      }

      if (event.key === 'ArrowRight') {
        setSelectedImage((current) => {
          const currentIndex = galleryImages.findIndex((image) => image.id === current?.id)
          const nextIndex = (currentIndex + 1) % galleryImages.length
          return galleryImages[nextIndex]
        })
      }

      if (event.key === 'ArrowLeft') {
        setSelectedImage((current) => {
          const currentIndex = galleryImages.findIndex((image) => image.id === current?.id)
          const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
          return galleryImages[prevIndex]
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  const currentIndex = useMemo(() => {
    if (!selectedImage) return 0
    return galleryImages.findIndex((image) => image.id === selectedImage.id)
  }, [selectedImage])

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length
    setSelectedImage(galleryImages[nextIndex])
  }

  const previousImage = () => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length
    setSelectedImage(galleryImages[prevIndex])
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState({ type: 'loading', message: 'Sending your inquiry...' })

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.error || 'Inquiry could not be sent.')
      }

      setSubmitState({ type: 'success', message: 'Your inquiry has been received. I will be in touch soon.' })
      setFormData(initialFormData)
    } catch (error) {
      setSubmitState({ type: 'error', message: error.message || 'Something went wrong.' })
    }
  }

  return (
    <div className="page-shell">
      <div
        className="cursor"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
        }}
      />

      <header className="topbar">
        <div className="brand-mark">
          <span className="brand-dot" />
          Alex Morgan
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Photographer / Director / Storyteller</p>
            <h1>Frames that carry the feeling of a moment.</h1>
            <p className="lede">
              I create intimate photo stories for people, places, and brands with a bold editorial eye and a cinematic rhythm.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="primary-btn">Book a session</a>
              <a href="#gallery" className="secondary-btn">View portfolio</a>
            </div>
          </div>

          <div className="hero-stack">
            <div className="hero-card hero-card-large">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"
                alt="Photographer in a city light scene"
              />
            </div>
            <div className="hero-card hero-card-small">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80"
                alt="Portrait from a documentary-inspired shoot"
              />
            </div>
          </div>
        </section>

        <section className="gallery-section section" id="gallery">
          <div className="section-heading">
            <p className="eyebrow">Selected work</p>
            <h2>Stories in motion.</h2>
          </div>

          <div className="gallery-track" aria-label="Horizontal photography gallery">
            {galleryImages.map((image, index) => (
              <article
                className="photo-card"
                key={image.id}
                onClick={() => setSelectedImage(image)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setSelectedImage(image)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open image ${index + 1}: ${image.title}`}
              >
                <img src={image.image} alt={image.title} />
                <div className="photo-overlay" />
                <div className="photo-meta">
                  <p>{image.location}</p>
                  <h3>{image.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about section" id="about">
          <div className="about-copy">
            <p className="eyebrow">About</p>
            <h2>Quiet direction, expressive imagery.</h2>
            <p>
              I work across portraits, travel journals, and commercial storytelling with a preference for natural light, emotional detail,
              and a careful eye for texture.
            </p>
            <p>
              My approach balances editorial polish with real human presence, creating work that feels personal without losing visual clarity.
            </p>
          </div>

          <div className="about-stats">
            <div>
              <strong>12+</strong>
              <span>Years behind the lens</span>
            </div>
            <div>
              <strong>150+</strong>
              <span>Stories published</span>
            </div>
            <div>
              <strong>48h</strong>
              <span>Average edit turnaround</span>
            </div>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-heading">
            <p className="eyebrow">Services</p>
            <h2>Tailored coverage for meaningful work.</h2>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <div className="price-row">
                  <span className="service-title">{service.title}</span>
                  <span className="service-price">{service.price}</span>
                </div>
                <p>{service.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="clients section">
          <div className="section-heading">
            <p className="eyebrow">Selected clients</p>
            <h2>Trusted by brands and culture-led teams.</h2>
          </div>

          <div className="logo-grid" aria-label="Client logos">
            {clientLogos.map((logo) => (
              <div key={logo} className="logo-item">
                {logo}
              </div>
            ))}
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">Contact</p>
            <h2>Let’s make something iconic.</h2>
            <p>
              Share the story, the timeline, and the mood you want to carry. I’ll send a thoughtful reply with availability and next steps.
            </p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="field-row">
              <label>
                Name
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </label>
            </div>

            <div className="field-row">
              <label>
                Project type
                <input type="text" name="projectType" value={formData.projectType} onChange={handleInputChange} required />
              </label>
              <label>
                Budget
                <input type="text" name="budget" value={formData.budget} onChange={handleInputChange} required />
              </label>
            </div>

            <label>
              Brief
              <textarea name="message" rows="5" value={formData.message} onChange={handleInputChange} required />
            </label>

            <button type="submit" className="primary-btn submit-btn" disabled={submitState.type === 'loading'}>
              {submitState.type === 'loading' ? 'Sending...' : 'Send inquiry'}
            </button>

            {submitState.message ? (
              <p className={`form-status ${submitState.type}`}>{submitState.message}</p>
            ) : null}
          </form>
        </section>
      </main>

      {selectedImage ? (
        <div className="lightbox" aria-modal="true" role="dialog">
          <button type="button" className="lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Close image viewer">
            ×
          </button>

          <button type="button" className="lightbox-arrow left" onClick={previousImage} aria-label="Previous image">
            ←
          </button>

          <div className="lightbox-stage">
            <img src={selectedImage.image} alt={selectedImage.title} />
          </div>

          <div className="lightbox-meta">
            <p>{selectedImage.location}</p>
            <h3>{selectedImage.title}</h3>
          </div>

          <button type="button" className="lightbox-arrow right" onClick={nextImage} aria-label="Next image">
            →
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
