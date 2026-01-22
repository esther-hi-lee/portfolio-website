
import React, { useState } from 'react'
import './ContactPage.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    
    // TODO: Replace with your actual Formspree endpoint
    // Example: https://formspree.io/f/your-form-id
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'
    
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="contact-page">
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p className="contact-subtitle">
          Have a question or want to work together? Send me a message!
        </p>
      </header>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Contact Info</h2>
          <p>
            <strong>Email:</strong><br />
            <a href="mailto:28estherhlee@gmail.com">28estherhlee@gmail.com</a>
          </p>
          <p className="contact-note">
            Feel free to reach out via email or use the contact form. 
            I'll get back to you as soon as possible!
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message..."
              rows="6"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <p className="form-status success">
              Thanks for your message! I'll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p className="form-status error">
              Oops! Something went wrong. Please try again or email me directly.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
