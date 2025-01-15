// src/app/shared/components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'outline';
 children: ReactNode;
 isLoading?: boolean;
}

export default function Button({ 
 variant = 'primary', 
 children, 
 className = '',
 isLoading = false,
 ...props 
}: ButtonProps) {
 const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors';
 
 const variants = {
   primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
   secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
   outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300'
 };

 return (
   <button 
     className={`${baseStyles} ${variants[variant]} ${className}`}
     disabled={isLoading}
     {...props}
   >
     {isLoading ? (
       <span className="flex items-center justify-center">
         <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
         Cargando...
       </span>
     ) : children}
   </button>
 );
}