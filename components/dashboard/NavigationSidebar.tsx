'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Egg, 
  Wheat, 
  Pill, 
  Users, 
  Scissors, 
  Package,
  Feather
} from 'lucide-react';

interface NavigationSidebarProps {
  activeSection: string;
  setActiveSection: (section: any) => void;
  userRole: 'admin' | 'worker';
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'worker'] },
  { id: 'production', label: 'Egg Production', icon: Egg, roles: ['admin', 'worker'] },
  { id: 'feed', label: 'Feed Management', icon: Wheat, roles: ['admin', 'worker'] },
  { id: 'medication', label: 'Medication', icon: Pill, roles: ['admin'] },
  { id: 'batch', label: 'Batch Management', icon: Users, roles: ['admin'] },
  { id: 'debeaking', label: 'Debeaking', icon: Scissors, roles: ['admin'] },
  { id: 'inventory', label: 'Inventory', icon: Package, roles: ['admin', 'worker'] },
];

export function NavigationSidebar({ activeSection, setActiveSection, userRole }: NavigationSidebarProps) {
  const filteredItems = navigationItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="relative">
            <Egg className="h-8 w-8 text-green-600" />
            <Feather className="h-4 w-4 text-blue-600 absolute -top-1 -right-1" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Farm Manager</h2>
            <p className="text-sm text-gray-600">v1.0</p>
          </div>
        </div>
        <nav className="space-y-2">
          {filteredItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-2 h-11',
                activeSection === item.id 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'hover:bg-gray-100'
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}