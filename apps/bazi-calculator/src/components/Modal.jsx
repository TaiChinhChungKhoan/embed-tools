import React from 'react';
import { Button, Card } from '@embed-tools/components';

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0 rounded-full hover:bg-gray-100"
          >
            <span className="text-xl">×</span>
          </Button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh] modal-content">
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Đóng
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Modal; 