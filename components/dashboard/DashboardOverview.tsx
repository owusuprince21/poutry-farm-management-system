'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Egg, 
  Wheat, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  DollarSign 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardOverviewProps {
  userRole: 'admin' | 'worker';
}

const eggProductionData = [
  { date: '2024-01-01', eggs: 1200 },
  { date: '2024-01-02', eggs: 1180 },
  { date: '2024-01-03', eggs: 1220 },
  { date: '2024-01-04', eggs: 1150 },
  { date: '2024-01-05', eggs: 1300 },
  { date: '2024-01-06', eggs: 1280 },
  { date: '2024-01-07', eggs: 1320 },
];

const feedConsumptionData = [
  { date: '2024-01-01', feed: 45 },
  { date: '2024-01-02', feed: 48 },
  { date: '2024-01-03', feed: 46 },
  { date: '2024-01-04', feed: 50 },
  { date: '2024-01-05', feed: 47 },
  { date: '2024-01-06', feed: 49 },
  { date: '2024-01-07', feed: 48 },
];

export function DashboardOverview({ userRole }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Farm Overview</h2>
        <p className="text-gray-600">Monitor your farm's daily operations and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Today's Eggs</CardTitle>
            <Egg className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">1,320</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.3% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Feed Used (kg)</CardTitle>
            <Wheat className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">48</div>
            <p className="text-xs text-blue-600">
              Normal consumption rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Active Birds</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">1,500</div>
            <p className="text-xs text-orange-600">
              Current batch size
            </p>
          </CardContent>
        </Card>

        {userRole === 'admin' && (
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">$2,640</div>
              <p className="text-xs text-purple-600">
                This week's earnings
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Egg Production Trend</CardTitle>
            <CardDescription>Daily egg production over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eggProductionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="eggs" stroke="#22C55E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feed Consumption</CardTitle>
            <CardDescription>Daily feed usage in kilograms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feedConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="feed" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-800">Vaccination Due</p>
                <p className="text-sm text-red-600">Newcastle disease vaccine needed</p>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-800">Feed Stock Low</p>
                <p className="text-sm text-yellow-600">Only 3 days of feed remaining</p>
              </div>
              <Badge variant="secondary">Warning</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-800">Debeaking Scheduled</p>
                <p className="text-sm text-blue-600">Second debeaking in 5 days</p>
              </div>
              <Badge>Info</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Batch Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Current Batch Age</span>
                <span className="text-sm text-gray-600">18 weeks</span>
              </div>
              <Progress value={72} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Peak production period</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Productivity Rate</span>
                <span className="text-sm text-gray-600">88%</span>
              </div>
              <Progress value={88} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Next Batch Arrival</p>
              <p className="text-lg font-bold text-green-600">March 15, 2024</p>
              <p className="text-xs text-gray-500">1,600 layer chicks expected</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}