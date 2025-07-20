'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Scissors, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, addWeeks, isBefore, isAfter } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DebeakingScheduleProps {
  userRole: 'admin' | 'worker';
}

interface DebeakingRecord {
  id: string;
  batchId: string;
  batchNumber: string;
  scheduledDate: Date;
  completedDate?: Date;
  debeakingType: 'first' | 'second' | 'third';
  birdAge: number; // in weeks
  performedBy?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'overdue';
}

export function DebeakingSchedule({ userRole }: DebeakingScheduleProps) {
  const [records, setRecords] = useState<DebeakingRecord[]>([
    {
      id: '1',
      batchId: 'batch-1',
      batchNumber: 'B-2024-001',
      scheduledDate: new Date('2024-01-15'),
      completedDate: new Date('2024-01-15'),
      debeakingType: 'first',
      birdAge: 8,
      performedBy: 'Farm Worker A',
      status: 'completed',
      notes: 'Completed successfully, minimal stress observed'
    },
    {
      id: '2',
      batchId: 'batch-1',
      batchNumber: 'B-2024-001',
      scheduledDate: new Date('2024-01-12'),
      debeakingType: 'second',
      birdAge: 18,
      status: 'overdue'
    },
    {
      id: '3',
      batchId: 'batch-1',
      batchNumber: 'B-2024-001',
      scheduledDate: new Date('2024-01-20'),
      debeakingType: 'third',
      birdAge: 45,
      status: 'scheduled'
    },
  ]);

  const [batchNumber, setBatchNumber] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [debeakingType, setDebeakingType] = useState<'first' | 'second' | 'third'>('first');
  const [birdAge, setBirdAge] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: DebeakingRecord = {
      id: Date.now().toString(),
      batchId: `batch-${Date.now()}`,
      batchNumber,
      scheduledDate,
      debeakingType,
      birdAge: parseInt(birdAge),
      performedBy: performedBy || undefined,
      notes: notes || undefined,
      status: 'scheduled'
    };

    setRecords([newRecord, ...records]);
    
    // Reset form
    setBatchNumber('');
    setBirdAge('');
    setPerformedBy('');
    setNotes('');
    
    toast.success('Debeaking schedule added successfully!');
  };

  const markAsCompleted = (recordId: string) => {
    setRecords(records.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            status: 'completed' as const,
            completedDate: new Date(),
            performedBy: performedBy || 'Farm Worker'
          }
        : record
    ));
    toast.success('Debeaking marked as completed!');
  };

  const scheduledCount = records.filter(r => r.status === 'scheduled').length;
  const overdueCount = records.filter(r => r.status === 'overdue').length;
  const completedCount = records.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Debeaking Schedule</h2>
        <p className="text-gray-600">Manage debeaking schedules for optimal bird health and production</p>
      </div>

      {/* Debeaking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className={overdueCount > 0 ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : ""}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${overdueCount > 0 ? "text-red-800" : ""}`}>
              <AlertTriangle className="h-5 w-5" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-900" : "text-gray-900"}`}>
              {overdueCount}
            </div>
            <p className={`text-sm ${overdueCount > 0 ? "text-red-600" : "text-gray-600"}`}>
              procedures overdue
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Scissors className="h-5 w-5" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{scheduledCount}</div>
            <p className="text-sm text-blue-600">upcoming procedures</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{completedCount}</div>
            <p className="text-sm text-green-600">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">98%</div>
            <p className="text-sm text-gray-600">procedure success</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Debeaking Schedule Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Schedule Debeaking
          </CardTitle>
          <CardDescription>
            Plan debeaking procedures for optimal timing and bird welfare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <Input
                  id="batchNumber"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="B-2024-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduledDate ? format(scheduledDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={(date) => date && setScheduledDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debeakingType">Debeaking Type *</Label>
                <Select value={debeakingType} onValueChange={(value: any) => setDebeakingType(value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first">First Debeaking (6-10 weeks)</SelectItem>
                    <SelectItem value="second">Second Debeaking (12-16 weeks)</SelectItem>
                    <SelectItem value="third">Third Debeaking (40+ weeks)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birdAge">Bird Age (weeks) *</Label>
                <Input
                  id="birdAge"
                  type="number"
                  value={birdAge}
                  onChange={(e) => setBirdAge(e.target.value)}
                  placeholder="8"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="performedBy">Performed By</Label>
                <Input
                  id="performedBy"
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                  placeholder="Farm Worker A"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special considerations..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Schedule Debeaking
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Debeaking Schedule List */}
      <Card>
        <CardHeader>
          <CardTitle>Debeaking Schedule & History</CardTitle>
          <CardDescription>Track all scheduled and completed debeaking procedures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records
              .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
              .map((record) => (
              <div
                key={record.id}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg transition-colors",
                  record.status === 'overdue' 
                    ? "border-red-200 bg-red-50" 
                    : record.status === 'scheduled' 
                    ? "border-blue-200 bg-blue-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-medium">
                      {record.batchNumber} - {record.debeakingType.charAt(0).toUpperCase() + record.debeakingType.slice(1)} Debeaking
                    </p>
                    <Badge 
                      variant={
                        record.status === 'overdue' 
                          ? 'destructive' 
                          : record.status === 'scheduled' 
                          ? 'default' 
                          : 'outline'
                      }
                    >
                      {record.status}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-1">
                    <span>Scheduled: {format(record.scheduledDate, 'MMM d, yyyy')}</span>
                    <span>Bird Age: {record.birdAge} weeks</span>
                    {record.performedBy && <span>By: {record.performedBy}</span>}
                  </div>
                  {record.completedDate && (
                    <div className="text-sm text-green-600 mb-1">
                      Completed: {format(record.completedDate, 'MMM d, yyyy')}
                    </div>
                  )}
                  {record.notes && (
                    <p className="text-sm text-gray-500">{record.notes}</p>
                  )}
                </div>
                {record.status === 'scheduled' && (
                  <div className="ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsCompleted(record.id)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Mark Completed
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Debeaking Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Debeaking Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">First Debeaking</h4>
              <p className="text-sm text-blue-700">
                Perform at 6-10 weeks old when beak is soft. Remove 1/3 of upper beak.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Second Debeaking</h4>
              <p className="text-sm text-green-700">
                At 12-16 weeks if needed. Touch up first debeaking for consistency.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-2">Adult Touch-up</h4>
              <p className="text-sm text-orange-700">
                After 40 weeks if aggressive behavior develops. Minimal trimming only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}