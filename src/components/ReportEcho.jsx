import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { useReportEcho } from '../hooks/useReportEcho';

const ReportEcho = ({ echoId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const { reportEcho, isLoading, error } = useReportEcho();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await reportEcho(echoId, reason);
    setIsOpen(false);
    setReason('');
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        Report Echo
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Echo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for reporting..."
              required
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </DialogFooter>
          </form>
          {error && <p className="text-red-500 mt-2">{error.message}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportEcho;