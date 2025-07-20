'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Package, Filter, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InventoryDisplayProps {
  userRole: 'admin' | 'worker';
}

interface EggInventory {
  id: string;
  date: Date;
  small: number;
  medium: number;
  large: number;
  extraLarge: number;
  total: number;
  lastUpdated: Date;
}

export function InventoryDisplay({ userRole }: InventoryDisplayProps) {
  const [inventory, setInventory] = useState<EggInventory[]>([
    {
      id: '1',
      date: new Date('2024-01-07'),
      small: 120,
      medium: 680,
      large: 450,
      extraLarge: 70,
      total: 1320,
      lastUpdated: new Date('2024-01-07T14:30:00')
    },
    {
      id: '2',
      date: new Date('2024-01-06'),
      small: 110,
      medium: 720,
      large: 380,
      extraLarge: 70,
      total: 1280,
      lastUpdated: new Date('2024-01-06T14:15:00')
    },
    {
      id: '3',
      date: new Date('2024-01-05'),
      small: 130,
      medium: 700,
      large: 400,
      extraLarge: 70,
      total: 1300,
      lastUpdated: new Date('2024-01-05T14:20:00')
    },
  ]);

  const [filterDate, setFilterDate] = useState<Date>();
  const [filterSize, setFilterSize] = useState<string>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const filteredInventory = inventory.filter(item => {
    if (filterDate) {
      return format(item.date, 'yyyy-MM-dd') === format(filterDate, 'yyyy-MM-dd');
    }
    return true;
  });

  const currentStock = inventory[0] || {
    small: 0,
    medium: 0,
    large: 0,
    extraLarge: 0,
    total: 0
  };

  const totalAvailable = currentStock.total;
  const stockBySize = {
    small: currentStock.small,
    medium: currentStock.medium,
    large: currentStock.large,
    extraLarge: currentStock.extraLarge
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch fresh data from the server
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Small', 'Medium', 'Large', 'Extra Large', 'Total', 'Last Updated'],
      ...filteredInventory.map(item => [
        format(item.date, 'yyyy-MM-dd'),
        item.small,
        item.medium,
        item.large,
        item.extraLarge,
        item.total,
        format(item.lastUpdated, 'yyyy-MM-dd HH:mm')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `egg-inventory-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Egg Inventory</h2>
          <p className="text-gray-600">Real-time egg stock levels and availability</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {userRole === 'admin' && (
            <Button variant="outline" onClick={handleExport} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Current Stock Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Package className="h-5 w-5" />
              Total Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">{totalAvailable}</div>
            <p className="text-sm text-orange-600">eggs in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Small Eggs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stockBySize.small}</div>
            <Badge variant="outline" className="mt-1">Small</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Medium Eggs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stockBySize.medium}</div>
            <Badge variant="secondary" className="mt-1">Medium</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Large Eggs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stockBySize.large}</div>
            <Badge className="mt-1">Large</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Extra Large</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stockBySize.extraLarge}</div>
            <Badge variant="outline" className="mt-1 border-purple-600 text-purple-600">XL</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Status</CardTitle>
          <CardDescription>
            Last updated: {format(lastRefresh, 'MMMM d, yyyy \'at\' h:mm a')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Egg Size Distribution</h4>
              <div className="space-y-3">
                {Object.entries(stockBySize).map(([size, count]) => {
                  const percentage = totalAvailable > 0 ? (count / totalAvailable * 100).toFixed(1) : 0;
                  return (
                    <div key={size} className="flex items-center justify-between">
                      <span className="capitalize font-medium">{size === 'extraLarge' ? 'Extra Large' : size}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{count}</span>
                        <span className="text-sm text-gray-600">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Quality Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Fresh (Today):</span>
                  <Badge className="bg-green-600">{currentStock.total} eggs</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Grade A Quality:</span>
                  <Badge className="bg-blue-600">98%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage Temperature:</span>
                  <Badge variant="outline">4°C</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shelf Life:</span>
                  <Badge variant="secondary">21 days</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Inventory
          </CardTitle>
          <CardDescription>Filter inventory records by date and egg size</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Filter by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filterDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDate ? format(filterDate, "PPP") : <span>All dates</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Filter by Size</Label>
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extraLarge">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setFilterDate(undefined);
                  setFilterSize('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Records */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory History</CardTitle>
          <CardDescription>
            Detailed inventory records {filterDate && `for ${format(filterDate, 'MMMM d, yyyy')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <p className="font-medium">{format(item.date, 'MMMM d, yyyy')}</p>
                    <Badge variant="outline" className="text-lg font-bold">
                      {item.total} total
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                    <span>Small: {item.small}</span>
                    <span>Medium: {item.medium}</span>
                    <span>Large: {item.large}</span>
                    <span>XL: {item.extraLarge}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last updated: {format(item.lastUpdated, 'h:mm a')}
                  </p>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <Badge 
                    variant={item.date.toDateString() === new Date().toDateString() ? "default" : "secondary"}
                  >
                    {item.date.toDateString() === new Date().toDateString() ? "Today" : "Historical"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Public Inventory Display */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Public Inventory Display</CardTitle>
          <CardDescription>
            Customer-facing inventory information (could be displayed on website)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-green-300">
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
              Fresh Farm Eggs Available
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stockBySize.small}</div>
                <p className="text-sm text-gray-600">Small</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stockBySize.medium}</div>
                <p className="text-sm text-gray-600">Medium</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stockBySize.large}</div>
                <p className="text-sm text-gray-600">Large</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stockBySize.extraLarge}</div>
                <p className="text-sm text-gray-600">Extra Large</p>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              Last updated: {format(lastRefresh, 'h:mm a \'on\' MMMM d, yyyy')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}