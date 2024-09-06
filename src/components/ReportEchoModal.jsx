import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { reportEcho } from '../lib/db';

const ReportEchoModal = ({ echoId, isOpen, onClose }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    await reportEcho(echoId, 'currentUserId', reason);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Echo</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Reason for reporting"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportEchoModal;