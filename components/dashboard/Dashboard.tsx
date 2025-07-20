'use client';

import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { NavigationSidebar } from './NavigationSidebar';
import { DashboardOverview } from './DashboardOverview';
import { EggProduction } from '../production/EggProduction';
import { FeedManagement } from '../feed/FeedManagement';
import { MedicationTracker } from '../medication/MedicationTracker';
import { BatchManagement } from '../batch/BatchManagement';
import { DebeakingSchedule } from '../debeaking/DebeakingSchedule';
import { InventoryDisplay } from '../inventory/InventoryDisplay';

interface DashboardProps {
  userRole: 'admin' | 'worker';
  onLogout: () => void;
}

type ActiveSection = 'overview' | 'production' | 'feed' | 'medication' | 'batch' | 'debeaking' | 'inventory';

export function Dashboard({ userRole, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview userRole={userRole} />;
      case 'production':
        return <EggProduction userRole={userRole} />;
      case 'feed':
        return <FeedManagement userRole={userRole} />;
      case 'medication':
        return <MedicationTracker userRole={userRole} />;
      case 'batch':
        return <BatchManagement userRole={userRole} />;
      case 'debeaking':
        return <DebeakingSchedule userRole={userRole} />;
      case 'inventory':
        return <InventoryDisplay userRole={userRole} />;
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        userRole={userRole}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader userRole={userRole} onLogout={onLogout} />
        <main className="flex-1 overflow-auto p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}