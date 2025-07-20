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
import { CalendarIcon, Plus, Wheat, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeedManagementProps {
  userRole: 'admin' | 'worker';
}

interface FeedRecord {
  id: string;
  date: Date;
  amount: number;
  type: string;
  cost?: number;
  supplier?: string;
  notes?: string;
}

const feedTrendData = [
  { date: '2024-01-01', feed: 45, eggs: 1200 },
  { date: '2024-01-02', feed: 48, eggs: 1180 },
  { date: '2024-01-03', feed: 46, eggs: 1220 },
  { date: '2024-01-04', feed: 50, eggs: 1150 },
  { date: '2024-01-05', feed: 47, eggs: 1300 },
  { date: '2024-01-06', feed: 49, eggs: 1280 },
  { date: '2024-01-07', feed: 48, eggs: 1320 },
];

export function FeedManagement({ userRole }: FeedManagementProps) {
  const [records, setRecords] = useState<FeedRecord[]>([
    {
      id: '1',
      date: new Date('2024-01-07'),
      amount: 48,
      type: 'Layer Feed Premium',
      cost: 25,
      supplier: 'AgriSupply Co.',
      notes: 'Good quality feed'
    },
    {
      id: '2',
      date: new Date('2024-01-06'),
      amount: 49,
      type: 'Layer Feed Premium',
      cost: 25,
      supplier: 'AgriSupply Co.',
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState('');
  const [feedType, setFeedType] = useState('');
  const [cost, setCost] = useState('');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: FeedRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      amount: parseFloat(amount),
      type: feedType,
      cost: cost ? parseFloat(cost) : undefined,
      supplier: supplier || undefined,
      notes: notes || undefined,
    };

    setRecords([newRecord, ...records]);
    
    // Reset form
    setAmount('');
    setFeedType('');
    setCost('');
    setSupplier('');
    setNotes('');
    
    toast.success('Feed consumption recorded successfully!');
  };

  const totalWeeklyFeed = records
    .slice(0, 7)
    .reduce((sum, record) => sum + record.amount, 0);

  const averageDailyFeed = records.length > 0 
    ? (totalWeeklyFeed / Math.min(7, records.length)).toFixed(1)
    : '0';

  const currentStock = 150; // kg
  const daysRemaining = Math.floor(currentStock / parseFloat(averageDailyFeed));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Feed Management</h2>
        <p className="text-gray-600">Track feed consumption and monitor stock levels</p>
      </div>

      {/* Feed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Wheat className="h-5 w-5" />
              Today's Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">48 kg</div>
            <p className="text-sm text-blue-600">Layer feed consumed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageDailyFeed} kg</div>
            <p className="text-sm text-gray-600">per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{currentStock} kg</div>
            <p className="text-sm text-gray-600">in storage</p>
          </CardContent>
        </Card>

        <Card className={daysRemaining <= 3 ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200" : ""}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${daysRemaining <= 3 ? "text-red-800" : ""}`}>
              {daysRemaining <= 3 && <AlertTriangle className="h-4 w-4" />}
              Days Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${daysRemaining <= 3 ? "text-red-900" : "text-gray-900"}`}>
              {daysRemaining}
            </div>
            <p className={`text-sm ${daysRemaining <= 3 ? "text-red-600" : "text-gray-600"}`}>
              {daysRemaining <= 3 ? "Reorder now!" : "at current rate"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feed vs Egg Production Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Feed Efficiency Analysis</CardTitle>
          <CardDescription>Feed consumption vs egg production over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={feedTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line yAxisId="left" type="monotone" dataKey="feed" stroke="#3B82F6" strokeWidth={2} name="Feed (kg)" />
              <Line yAxisId="right" type="monotone" dataKey="eggs" stroke="#22C55E" strokeWidth={2} name="Eggs" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Add Feed Record Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Record Feed Consumption
          </CardTitle>
          <CardDescription>
            Log daily feed usage and track consumption patterns
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
                <Label htmlFor="amount">Amount (kg) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="48.5"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedType">Feed Type *</Label>
                <Select value={feedType} onValueChange={setFeedType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select feed type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Layer Feed Premium">Layer Feed Premium</SelectItem>
                    <SelectItem value="Layer Feed Standard">Layer Feed Standard</SelectItem>
                    <SelectItem value="Starter Feed">Starter Feed</SelectItem>
                    <SelectItem value="Grower Feed">Grower Feed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost per kg ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="0.52"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="AgriSupply Co."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Quality observations..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Record Feed Consumption
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Feed Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feed Records</CardTitle>
          <CardDescription>Historical feed consumption data</CardDescription>
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
                    <Badge variant="outline" className="font-bold">
                      {record.amount} kg
                    </Badge>
                    <Badge variant="secondary">{record.type}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {record.cost && <span>Cost: ${record.cost}/kg</span>}
                    {record.supplier && <span>Supplier: {record.supplier}</span>}
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