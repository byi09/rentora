'use client';

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

/**
 * Contact form that sends an email via EmailJS.
 *
 * Set the following env vars in .env.local:
 * NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
 * NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
 * NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
 */
const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      );
      setStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm w-full">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="from_name"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="reply_to"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@example.com"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell us about your rental needs..."
            required
            disabled={isSubmitting}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-8 py-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold text-lg transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="text-center text-green-600 text-sm font-medium">Message sent successfully! ⭐️</p>
        )}
        {status === 'error' && (
          <p className="text-center text-red-600 text-sm font-medium">Failed to send. Please try again later.</p>
        )}
      </form>

      <div className="mt-8 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">
          Or email us directly at{' '}
          <a href="mailto:byi09@berkeley.edu" className="font-semibold text-blue-600 hover:underline">
            byi09@berkeley.edu
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactForm; 