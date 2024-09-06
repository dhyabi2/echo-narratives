import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { reportEcho } from '../lib/db';

const EchoReportButton = ({ echoId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleReport = async () => {
    await reportEcho(echoId, reason);
    setIsOpen(false);
    setReason('');
    alert('Echo reported. Thank you for helping keep our community safe.');
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <Flag className="h-5 w-5 mr-1" />
        Report
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Echo</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Reason for reporting"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleReport}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EchoReportButton;