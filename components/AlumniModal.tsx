
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alumni } from '@/public/data/alumni';
import { FaLinkedin } from 'react-icons/fa'; // Import LinkedIn icon

interface AlumniModalProps {
  alumni: Alumni | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AlumniModal({ alumni, isOpen, onClose }: AlumniModalProps) {
  if (!alumni) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>



<DialogContent className="sm:max-w-[600px] text-[#000814]">
  <DialogHeader className="flex items-center justify-between">
    <DialogTitle className="flex items-center space-x-2">
      <span>{alumni.name}</span>
      {/* LinkedIn Icon */}
      {alumni.linkedin && (
        <a 
          href={alumni.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:text-blue-700"
        >
          <FaLinkedin size={20} />
        </a>
      )}
    </DialogTitle>
  </DialogHeader>
  <div className="mt-1 space-y-0.5">
    {/* Combined Branch, Batch, and Company */}
    <p className="text-sm text-gray-500">{alumni.branch}</p>
    <p className="text-sm text-gray-500">Batch: {alumni.batch}</p>
    <p className="text-sm text-gray-500">Company: {alumni.company}</p>
  </div>
  <div className="mt-3">
    <p className="text-sm text-gray-700">{alumni.story}</p>
  </div>
</DialogContent>



    </Dialog>
  );
}
