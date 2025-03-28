'use client';

import { useTranslations } from "@/context/TranslationContext";

interface ContactFormProps {
  formData: { name: string; email: string; message: string };  
  handleSubmit: (e: React.FormEvent) => void;
  status: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errors: { name?: string; email?: string; message?: string };
}

const ContactForm = ({ formData, handleSubmit, status, handleChange, errors }: ContactFormProps) => {
  const { translations } = useTranslations();
  
  const renderStatusMessage = () => {
    if (status === 'success') {
      return (
        <p className="text-green-600 mt-2 animate-fadeIn" aria-live="polite">
          {translations.contactSuccess}
        </p>
      );
    }

    if (status === 'too-many-requests') {
      return(
      <p className="text-orange-600 mt-2 animate-fadeIn" aria-live="polite">
        {translations.tooManyRequests || 'Too many requests. Please try again later.'}
      </p>
      );
    }

    if (status === 'error') {
      return (
        <p className="text-red-600 mt-2 animate-fadeIn" aria-live="polite">
          {translations.contactError}
        </p>
      );
    }   

    if (status === translations.loading || status === 'loading') {
      return(
        <p className="text-blue-600 mt-2 animate-fadeIn" aria-live="polite">
          {translations.loading || 'Sending...'}
        </p>
      );
    }
    return null;
  };

  const inputClass = (hasError: boolean) =>
    `w-full p-3 border rounded-lg ${hasError ? 'border-red-500' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <input
        type="text"
        name="name"
        placeholder={translations.namePlaceholder || 'Enter your name'}
        value={formData.name}
        onChange={handleChange}
        aria-label={translations.nameLabel || 'Name'}
        aria-invalid={!!errors.name}
        className={inputClass(!!errors.name)}
        autoComplete="name"
      />
       {errors.name && (
        <p className="text-red-500 text-sm mt-1 animate-fadeIn">
          {errors.name}
        </p>
       )}
      </div>

      <div>
      <input
        type="email"
        name="email"
        placeholder={translations.emailPlaceholder || 'Enter your email'}
        value={formData.email}
        onChange={handleChange}
        aria-label={translations.emailLabel || 'Email'}
        aria-invalid={!!errors.email}  
        className={inputClass(!!errors.email)}
        autoComplete="email"
      />
       {errors.email && (
        <p className="text-red-500 text-sm mt-1 animate-fadeIn">
          {errors.email}
        </p>
       )}
      </div>
    
      <div>
      <textarea
        id="message"
        name="message"
        placeholder={translations.messagePlaceholder || 'Enter your message'}
        value={formData.message}
        onChange={handleChange}
        aria-label={translations.messageLabel || 'Message'}
        aria-invalid={!!errors.message} 
        className={inputClass(!!errors.message)}
        autoComplete="off"
      />
       {errors.message && (
        <p className="text-red-500 text-sm mt-1 animate-fadeIn">
          {errors.message}
        </p>
       )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gray-500 text-white font-semibold cursor-pointer rounded-lg hover:bg-gray-600 transition"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (translations.loading || 'Sending...') : translations.sendMessageButton}
      </button>
      {renderStatusMessage()}
    </form>
  );
};

export default ContactForm;