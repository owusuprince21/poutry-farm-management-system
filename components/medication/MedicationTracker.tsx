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
import { CalendarIcon, Plus, Pill, AlertCircle, CheckCircle } from 'lucide-react';
import { format, addMonths, addDays } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MedicationTrackerProps {
  userRole: 'admin' | 'worker';
}

interface MedicationRecord {
  id: string;
  date: Date;
  medicationName: string;
  purpose: string;
  dosage: string;
  frequency: 'monthly' | 'quarterly' | 'bi-annually' | 'custom';
  nextDue?: Date;
  administeredBy: string;
  notes?: string;
  status: 'completed' | 'due' | 'overdue';
}

export function MedicationTracker({ userRole }: MedicationTrackerProps) {
  const [records, setRecords] = useState<MedicationRecord[]>([
    {
      id: '1',
      date: new Date('2024-01-05'),
      medicationName: 'Newcastle Disease Vaccine',
      purpose: 'Disease Prevention',
      dosage: '0.5ml per bird',
      frequency: 'quarterly',
      nextDue: new Date('2024-04-05'),
      administeredBy: 'Dr. Smith',
      status: 'completed'
    },
    {
      id: '2',
      date: new Date('2024-01-01'),
      medicationName: 'Vitamin Supplement',
      purpose: 'Nutritional Support',
      dosage: '10g per 100 birds',
      frequency: 'monthly',
      nextDue: new Date('2024-01-08'),
      administeredBy: 'Farm Worker',
      status: 'overdue'
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medicationName, setMedicationName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'bi-annually' | 'custom'>('monthly');
  const [customNextDate, setCustomNextDate] = useState<Date | undefined>();
  const [administeredBy, setAdministeredBy] = useState('');
  const [notes, setNotes] = useState('');

  const calculateNextDue = (date: Date, freq: string): Date => {
    switch (freq) {
      case 'monthly':
        return addMonths(date, 1);
      case 'quarterly':
        return addMonths(date, 3);
      case 'bi-annually':
        return addMonths(date, 6);
      default:
        return customNextDate || addMonths(date, 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nextDue = frequency === 'custom' ? customNextDate : calculateNextDue(selectedDate, frequency);
    
    const newRecord: MedicationRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      medicationName,
      purpose,
      dosage,
      frequency,
      nextDue,
      administeredBy,
      notes: notes || undefined,
      status: 'completed'
    };

    setRecords([newRecord, ...records]);
    
    // Reset form
    setMedicationName('');
    setPurpose('');
    setDosage('');
    setFrequency('monthly');
    setCustomNextDate(undefined);
    setAdministeredBy('');
    setNotes('');
    
    toast.success('Medication record added successfully!');
  };

  const overdueCount = records.filter(r => r.status === 'overdue').length;
  const dueCount = records.filter(r => r.status === 'due').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Medication Tracker</h2>
        <p className="text-gray-600">Manage vaccination schedules and medication records</p>
      </div>

      {/* Medication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={overdueCount > 0 ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : ""}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${overdueCount > 0 ? "text-red-800" : ""}`}>
              <AlertCircle className="h-5 w-5" />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overdueCount > 0 ? "text-red-900" : "text-gray-900"}`}>
              {overdueCount}
            </div>
            <p className={`text-sm ${overdueCount > 0 ? "text-red-600" : "text-gray-600"}`}>
              medications overdue
            </p>
          </CardContent>
        </Card>

        <Card className={dueCount > 0 ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200" : ""}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${dueCount > 0 ? "text-yellow-800" : ""}`}>
              <Pill className="h-5 w-5" />
              Due Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${dueCount > 0 ? "text-yellow-900" : "text-gray-900"}`}>
              {dueCount}
            </div>
            <p className={`text-sm ${dueCount > 0 ? "text-yellow-600" : "text-gray-600"}`}>
              within 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {records.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-sm text-green-600">this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Medication Record Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Record Medication
          </CardTitle>
          <CardDescription>
            Log vaccination or medication administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Administered</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication/Vaccine Name *</Label>
                <Input
                  id="medicationName"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="Newcastle Disease Vaccine"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose *</Label>
                <Select value={purpose} onValueChange={setPurpose} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disease Prevention">Disease Prevention</SelectItem>
                    <SelectItem value="Treatment">Treatment</SelectItem>
                    <SelectItem value="Nutritional Support">Nutritional Support</SelectItem>
                    <SelectItem value="Parasite Control">Parasite Control</SelectItem>
                    <SelectItem value="Stress Management">Stress Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="0.5ml per bird"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={frequency} onValueChange={(value: any) => setFrequency(value)} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="bi-annually">Bi-annually</SelectItem>
                    <SelectItem value="custom">Custom Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {frequency === 'custom' && (
                <div className="space-y-2">
                  <Label>Next Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !customNextDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {customNextDate ? format(customNextDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={customNextDate}
                        onSelect={setCustomNextDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="administeredBy">Administered By *</Label>
                <Input
                  id="administeredBy"
                  value={administeredBy}
                  onChange={(e) => setAdministeredBy(e.target.value)}
                  placeholder="Dr. Smith or Farm Worker"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations or side effects..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Record Medication
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Medication Records */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Schedule & History</CardTitle>
          <CardDescription>Track all medications and upcoming schedules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className={cn(
                  "flex items-center justify-between p-4 border rounded-lg transition-colors",
                  record.status === 'overdue' 
                    ? "border-red-200 bg-red-50" 
                    : record.status === 'due' 
                    ? "border-yellow-200 bg-yellow-50" 
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-medium">{record.medicationName}</p>
                    <Badge 
                      variant={
                        record.status === 'overdue' 
                          ? 'destructive' 
                          : record.status === 'due' 
                          ? 'secondary' 
                          : 'outline'
                      }
                    >
                      {record.status}
                    </Badge>
                    <Badge variant="outline">{record.purpose}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-1">
                    <span>Administered: {format(record.date, 'MMM d, yyyy')}</span>
                    <span>Dosage: {record.dosage}</span>
                    <span>By: {record.administeredBy}</span>
                  </div>
                  {record.nextDue && (
                    <div className="text-sm text-gray-600 mb-1">
                      Next due: {format(record.nextDue, 'MMM d, yyyy')} ({record.frequency})
                    </div>
                  )}
                  {record.notes && (
                    <p className="text-sm text-gray-500">{record.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}