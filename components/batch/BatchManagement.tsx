'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { format, differenceInWeeks, addWeeks } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BatchManagementProps {
  userRole: 'admin' | 'worker';
}

interface Batch {
  id: string;
  batchNumber: string;
  arrivalDate: Date;
  initialCount: number;
  currentCount: number;
  breed: string;
  supplier: string;
  expectedSaleDate: Date;
  status: 'active' | 'sold' | 'archived';
  notes?: string;
}

export function BatchManagement({ userRole }: BatchManagementProps) {
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: '1',
      batchNumber: 'B-2024-001',
      arrivalDate: new Date('2023-09-15'),
      initialCount: 1500,
      currentCount: 1485,
      breed: 'Rhode Island Red',
      supplier: 'Premium Hatchery',
      expectedSaleDate: new Date('2024-09-15'),
      status: 'active',
      notes: 'High quality batch with excellent genetics'
    },
    {
      id: '2',
      batchNumber: 'B-2023-012',
      arrivalDate: new Date('2023-03-01'),
      initialCount: 1400,
      currentCount: 0,
      breed: 'Leghorn White',
      supplier: 'AgriPoultry Inc.',
      expectedSaleDate: new Date('2024-03-01'),
      status: 'sold',
      notes: 'Excellent production batch - 92% egg production rate'
    },
  ]);

  const [batchNumber, setBatchNumber] = useState('');
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [initialCount, setInitialCount] = useState('');
  const [breed, setBreed] = useState('');
  const [supplier, setSupplier] = useState('');
  const [expectedSaleDate, setExpectedSaleDate] = useState<Date>();
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBatch: Batch = {
      id: Date.now().toString(),
      batchNumber,
      arrivalDate,
      initialCount: parseInt(initialCount),
      currentCount: parseInt(initialCount),
      breed,
      supplier,
      expectedSaleDate: expectedSaleDate || addWeeks(arrivalDate, 72), // 72 weeks = ~17 months
      status: 'active',
      notes: notes || undefined,
    };

    setBatches([newBatch, ...batches]);
    
    // Reset form
    setBatchNumber('');
    setInitialCount('');
    setBreed('');
    setSupplier('');
    setExpectedSaleDate(undefined);
    setNotes('');
    
    toast.success('New batch added successfully!');
  };

  const activeBatch = batches.find(b => b.status === 'active');
  const currentAge = activeBatch ? differenceInWeeks(new Date(), activeBatch.arrivalDate) : 0;
  const productionPhase = currentAge < 20 ? 'Growing' : currentAge < 72 ? 'Production' : 'End of Cycle';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Batch Management</h2>
        <p className="text-gray-600">Track bird batches throughout their lifecycle</p>
      </div>

      {/* Current Batch Overview */}
      {activeBatch && (
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Users className="h-5 w-5" />
              Current Active Batch
            </CardTitle>
            <CardDescription>
              Batch {activeBatch.batchNumber} - {activeBatch.breed}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Age</p>
                <p className="text-2xl font-bold text-green-900">{currentAge} weeks</p>
                <p className="text-sm text-green-600">{productionPhase} phase</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Count</p>
                <p className="text-2xl font-bold text-blue-900">{activeBatch.currentCount}</p>
                <p className="text-sm text-blue-600">birds remaining</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Survival Rate</p>
                <p className="text-2xl font-bold text-purple-900">
                  {((activeBatch.currentCount / activeBatch.initialCount) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-purple-600">excellent health</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Lifecycle Progress</span>
                <span className="text-sm text-gray-600">{Math.round((currentAge / 72) * 100)}% complete</span>
              </div>
              <Progress value={(currentAge / 72) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Arrival: {format(activeBatch.arrivalDate, 'MMM yyyy')}</span>
                <span>Expected Sale: {format(activeBatch.expectedSaleDate, 'MMM yyyy')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Active Batches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {batches.filter(b => b.status === 'active').length}
            </div>
            <p className="text-sm text-gray-600">currently managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Birds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {batches
                .filter(b => b.status === 'active')
                .reduce((sum, b) => sum + b.currentCount, 0)
              }
            </div>
            <p className="text-sm text-gray-600">in active batches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{currentAge} weeks</div>
            <p className="text-sm text-gray-600">current batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Sale Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {activeBatch ? Math.max(0, 72 - currentAge) : 0}
            </div>
            <p className="text-sm text-gray-600">weeks remaining</p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Batch Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Batch
          </CardTitle>
          <CardDescription>
            Register a new batch of birds arriving at the farm
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
                  placeholder="B-2024-002"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Arrival Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !arrivalDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {arrivalDate ? format(arrivalDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={arrivalDate}
                      onSelect={(date) => date && setArrivalDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialCount">Initial Bird Count *</Label>
                <Input
                  id="initialCount"
                  type="number"
                  value={initialCount}
                  onChange={(e) => setInitialCount(e.target.value)}
                  placeholder="1500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Rhode Island Red"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Premium Hatchery"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Expected Sale Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expectedSaleDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedSaleDate ? format(expectedSaleDate, "PPP") : <span>Auto-calculated</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expectedSaleDate}
                      onSelect={setExpectedSaleDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Batch characteristics, health status, etc."
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Add New Batch
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Batch History */}
      <Card>
        <CardHeader>
          <CardTitle>Batch History</CardTitle>
          <CardDescription>All batches and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.map((batch) => {
              const age = differenceInWeeks(new Date(), batch.arrivalDate);
              const survivalRate = ((batch.currentCount / batch.initialCount) * 100).toFixed(1);
              
              return (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="font-medium">{batch.batchNumber}</p>
                      <Badge 
                        variant={
                          batch.status === 'active' 
                            ? 'default' 
                            : batch.status === 'sold' 
                            ? 'secondary' 
                            : 'outline'
                        }
                      >
                        {batch.status}
                      </Badge>
                      <Badge variant="outline">{batch.breed}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                      <span>Age: {age} weeks</span>
                      <span>Count: {batch.currentCount}/{batch.initialCount}</span>
                      <span>Survival: {survivalRate}%</span>
                      <span>Supplier: {batch.supplier}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>Arrived: {format(batch.arrivalDate, 'MMM d, yyyy')}</span>
                      <span className="ml-4">Expected Sale: {format(batch.expectedSaleDate, 'MMM d, yyyy')}</span>
                    </div>
                    {batch.notes && (
                      <p className="text-sm text-gray-500 mt-1">{batch.notes}</p>
                    )}
                  </div>
                  {batch.status === 'active' && (
                    <div className="ml-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Mark batch as sold
                          setBatches(batches.map(b => 
                            b.id === batch.id 
                              ? { ...b, status: 'sold' as const, currentCount: 0 }
                              : b
                          ));
                          toast.success('Batch marked as sold');
                        }}
                      >
                        Mark as Sold
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}