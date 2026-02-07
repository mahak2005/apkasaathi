
import { Copyright } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <Copyright className="h-4 w-4 text-gray-500" />
            <p className="text-sm text-gray-500">
              {new Date().getFullYear()} Career Check. All rights reserved.
            </p>
            <a href="https://docs.google.com/forms/d/1oeZcn75reYXgEG8eRJGPZ2QGKDsNSUhcKGW773vbF2k/edit" className="text-sm text-gray-500 underline">
              Feedback Form</a>

          </div>
          <p className="text-sm text-gray-500">
            Developed and maintained by&nbsp;
            <a 
              href="https://www.linkedin.com/in/mahak-154720287/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline"
            >
               Mahak
            </a> 
            &nbsp;and&nbsp;
            <a 
              href="https://www.linkedin.com/in/mehak-garg-084642282/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline"
            >
              Mehak Garg
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
