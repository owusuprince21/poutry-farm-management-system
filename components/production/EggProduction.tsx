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
import { CalendarIcon, Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EggProductionProps {
  userRole: 'admin' | 'worker';
}

interface EggRecord {
  id: string;
  date: Date;
  small: number;
  medium: number;
  large: number;
  extraLarge: number;
  total: number;
  notes?: string;
}

export function EggProduction({ userRole }: EggProductionProps) {
  const [records, setRecords] = useState<EggRecord[]>([
    {
      id: '1',
      date: new Date('2024-01-07'),
      small: 120,
      medium: 680,
      large: 450,
      extraLarge: 70,
      total: 1320,
      notes: 'Normal production day'
    },
    {
      id: '2',
      date: new Date('2024-01-06'),
      small: 110,
      medium: 720,
      large: 380,
      extraLarge: 70,
      total: 1280,
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [small, setSmall] = useState('');
  const [medium, setMedium] = useState('');
  const [large, setLarge] = useState('');
  const [extraLarge, setExtraLarge] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const smallNum = parseInt(small) || 0;
    const mediumNum = parseInt(medium) || 0;
    const largeNum = parseInt(large) || 0;
    const extraLargeNum = parseInt(extraLarge) || 0;
    const total = smallNum + mediumNum + largeNum + extraLargeNum;

    const newRecord: EggRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      small: smallNum,
      medium: mediumNum,
      large: largeNum,
      extraLarge: extraLargeNum,
      total,
      notes: notes || undefined,
    };

    setRecords([newRecord, ...records]);
    
    // Reset form
    setSmall('');
    setMedium('');
    setLarge('');
    setExtraLarge('');
    setNotes('');
    
    toast.success('Egg production recorded successfully!');
  };

  const todayTotal = records.find(r => 
    format(r.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  )?.total || 0;

  const averageProduction = records.length > 0 
    ? Math.round(records.reduce((sum, record) => sum + record.total, 0) / records.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Egg Production</h2>
        <p className="text-gray-600">Track daily egg production by size category</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <TrendingUp className="h-5 w-5" />
              Today's Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{todayTotal}</div>
            <p className="text-sm text-orange-600">eggs collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageProduction}</div>
            <p className="text-sm text-gray-600">eggs per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">88%</div>
            <p className="text-sm text-gray-600">of expected output</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Record Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Record Daily Production
          </CardTitle>
          <CardDescription>
            Enter the number of eggs collected by size category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
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
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any observations..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="small">Small Eggs</Label>
                <Input
                  id="small"
                  type="number"
                  value={small}
                  onChange={(e) => setSmall(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium Eggs</Label>
                <Input
                  id="medium"
                  type="number"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="large">Large Eggs</Label>
                <Input
                  id="large"
                  type="number"
                  value={large}
                  onChange={(e) => setLarge(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraLarge">Extra Large</Label>
                <Input
                  id="extraLarge"
                  type="number"
                  value={extraLarge}
                  onChange={(e) => setExtraLarge(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Record Production
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Production Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Production Records</CardTitle>
          <CardDescription>Historical egg production data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-medium">{format(record.date, 'MMMM d, yyyy')}</p>
                    <Badge variant="outline" className="text-lg font-bold">
                      {record.total} total
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>Small: {record.small}</span>
                    <span>Medium: {record.medium}</span>
                    <span>Large: {record.large}</span>
                    <span>XL: {record.extraLarge}</span>
                  </div>
                  {record.notes && (
                    <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
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