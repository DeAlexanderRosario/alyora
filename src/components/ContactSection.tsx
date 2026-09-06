'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, X } from 'lucide-react';
import { COMPANY_CONFIG } from '@/lib/env';
import { api } from '@/lib/api';

export function ContactSection() {
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [contactModalOpen, setContactModalOpen] = useState(false);

    async function handleContact(e: React.FormEvent) {
        e.preventDefault();
        if (!contactName || !contactEmail || !contactMessage) {
            setContactStatus('error');
            return;
        }
        setContactStatus('sending');
        try {
            await api.submitInquiry({
                name: contactName,
                email: contactEmail,
                phone: contactPhone,
                message: contactMessage,
            });
            setContactStatus('sent');
            setContactName('');
            setContactEmail('');
            setContactPhone('');
            setContactMessage('');
        } catch {
            setContactStatus('error');
        }
    }

    return (
        <>
            <section className="section-wrap" id="contact" style={{ display: 'flex', flexWrap: 'wrap', gap: 60 }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                    <span style={{ color: '#3d4d53', fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>GET IN TOUCH</span>
                    <h2 className="serif" style={{ color: '#153545', fontSize: 32, marginTop: 6, lineHeight: 1.2 }}>
                        Let's Find Your<br />Perfect Property
                    </h2>
                    <p style={{ color: '#3d4d53', fontSize: 14, lineHeight: 1.6, marginTop: 14 }}>
                        Have a question or want to schedule a visit? Send us a message and our team will get back to you within 24 hours.
                    </p>
                    <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#153545' }}>
                            <Phone size={18} aria-hidden="true" /> <span>{COMPANY_CONFIG.phone}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#153545' }}>
                            <Mail size={18} aria-hidden="true" /> <span>{COMPANY_CONFIG.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#153545' }}>
                            <MapPin size={18} aria-hidden="true" /> <span>{COMPANY_CONFIG.address}</span>
                        </div>
                    </div>
                </div>

                <div className="sm:hidden mt-4" style={{ flex: 1, minWidth: 300 }}>
                    <button
                        onClick={() => setContactModalOpen(true)}
                        aria-label="Open message form"
                        style={{
                            width: '100%',
                            backgroundColor: '#153545',
                            color: '#ffffff',
                            border: 'none',
                            padding: '14px 20px',
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            boxShadow: '0 4px 12px rgba(21,53,69,0.15)',
                            cursor: 'pointer',
                        }}
                    >
                        <Mail size={16} aria-hidden="true" />
                        <span>Send Message</span>
                    </button>
                </div>

                {/* DESKTOP INLINE FORM */}
                <form onSubmit={handleContact} className="hidden sm:flex" style={{ flex: 1, minWidth: 300, flexDirection: 'column', gap: 14 }} aria-label="Desktop Contact Form">
                    <input
                        id="contact-name-desktop"
                        aria-label="Your Name"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none' }}
                        placeholder="Your Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                    />
                    <input
                        id="contact-email-desktop"
                        type="email"
                        aria-label="Email Address"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none' }}
                        placeholder="Email Address"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                    />
                    <input
                        id="contact-phone-desktop"
                        aria-label="Phone Number (optional)"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none' }}
                        placeholder="Phone Number (optional)"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                    />
                    <textarea
                        id="contact-message-desktop"
                        aria-label="Your Message"
                        rows={4}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #dde4e5', fontSize: 14, outline: 'none', resize: 'vertical' }}
                        placeholder="Your Message"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                    />

                    {contactStatus === 'sent' && <div style={{ color: '#2e7d32', fontSize: 13, fontWeight: 600 }}>Thank you! We'll get back to you soon.</div>}
                    {contactStatus === 'error' && <div style={{ color: '#c0392b', fontSize: 13, fontWeight: 600 }}>Please fill in your name, email, and message.</div>}

                    <button
                        type="submit"
                        disabled={contactStatus === 'sending'}
                        style={{
                            backgroundColor: '#103143',
                            color: '#ffffff',
                            border: 'none',
                            padding: '14px 32px',
                            borderRadius: 8,
                            fontSize: 14,
                            fontWeight: 600,
                            alignSelf: 'flex-start',
                            cursor: 'pointer',
                            opacity: contactStatus === 'sending' ? 0.7 : 1,
                        }}
                    >
                        {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>
            </section>

            {/* POPUP MODAL FOR MOBILE CONTACT FORM */}
            {contactModalOpen && (
                <div role="dialog" aria-modal="true" aria-labelledby="mobile-modal-title" style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: 20, width: '100%', maxWidth: 440, padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
                        <button
                            onClick={() => setContactModalOpen(false)}
                            aria-label="Close message form"
                            style={{ position: 'absolute', top: 16, right: 16, background: '#f0f4f5', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <X size={18} color="#153545" aria-hidden="true" />
                        </button>

                        <div style={{ marginBottom: 16 }}>
                            <span style={{ color: '#cbbf9d', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>GET IN TOUCH</span>
                            <h3 id="mobile-modal-title" className="serif" style={{ color: '#153545', fontSize: 22, fontWeight: 700, marginTop: 2 }}>Send Us a Message</h3>
                            <p style={{ color: '#3d4d53', fontSize: 12, marginTop: 4 }}>We will get back to you within 24 hours.</p>
                        </div>

                        <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 12 }} aria-label="Mobile Contact Form">
                            <input
                                id="contact-name-mobile"
                                aria-label="Your Name"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none' }}
                                placeholder="Your Name"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                            />
                            <input
                                id="contact-email-mobile"
                                type="email"
                                aria-label="Email Address"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none' }}
                                placeholder="Email Address"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                            />
                            <input
                                id="contact-phone-mobile"
                                aria-label="Phone Number (optional)"
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none' }}
                                placeholder="Phone Number (optional)"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                            />
                            <textarea
                                id="contact-message-mobile"
                                aria-label="Your Message"
                                rows={3}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #dde4e5', fontSize: 13, outline: 'none', resize: 'none' }}
                                placeholder="Your Message"
                                value={contactMessage}
                                onChange={(e) => setContactMessage(e.target.value)}
                            />

                            {contactStatus === 'sent' && (
                                <div style={{ color: '#2e7d32', fontSize: 12, fontWeight: 600, backgroundColor: '#E8F5E9', padding: '8px 12px', borderRadius: 8 }}>
                                    Thank you! Message sent successfully.
                                </div>
                            )}
                            {contactStatus === 'error' && (
                                <div style={{ color: '#c0392b', fontSize: 12, fontWeight: 600, backgroundColor: '#FFEBEE', padding: '8px 12px', borderRadius: 8 }}>
                                    Please fill in your name, email, and message.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={contactStatus === 'sending'}
                                style={{
                                    backgroundColor: '#153545',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    borderRadius: 10,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    marginTop: 4,
                                    opacity: contactStatus === 'sending' ? 0.7 : 1,
                                }}
                            >
                                {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
