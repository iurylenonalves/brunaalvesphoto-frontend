import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { ContactSchema } from '@/schemas/ContactSchema';
import { trackEvent } from '@/lib/gtag';

interface Translations {
  contactSuccess: string;
  contactError: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  sendMessageButton: string;
  errorMessage: string;
  networkError: string;
  tooManyRequests: string;
  loading: string;
}

export const useContactForm = (locale: string, translations: Translations) => {
  const contactSchema = ContactSchema(locale as 'en' | 'pt');
  const [status, setStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', lang: locale });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    try {
      contactSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Fix: Ensure correct API URL construction
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-brunaphoto-vercel.vercel.app';
    const CONTACT_API_URL = `${API_BASE_URL}/api/contacts`;
    
    setStatus(translations.loading || 'loading');

    try {
      const response = await axios.post(CONTACT_API_URL, formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      });
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Response:', response.data);
      }

      setStatus('success');
      trackEvent('contact_form_submitted', { locale });
      setFormData({ 
        name: '', 
        email: '', 
        message: '', 
        lang: locale 
      });
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Submission error:', error);
        }
        setStatus(error.response?.status === 429 
          ? 'too-many-requests' 
          : translations.contactError || 'An error occurred'
        );            
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('Unexpected error:', error);
        }
        setStatus(translations.contactError || 'An error occurred');
      }
    }
  };

  return { formData, errors, status, handleChange, handleSubmit }; 
}
