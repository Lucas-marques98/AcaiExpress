import React, { useEffect } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { SubscriptionBlockingScreen } from './SubscriptionBlockingScreen';

export const StoreLoader: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { setStoreBySlug, currentStore, stores, loading } = useStore();

  useEffect(() => {
    if (slug) {
      setStoreBySlug(slug);
    }
  }, [slug, setStoreBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0b]">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If slug is provided but store not found among existing stores
  if (slug && !stores.find(s => s.slug === slug)) {
    return <Navigate to="/404" replace />;
  }

  // Check subscription status for public access
  if (currentStore) {
    const status = currentStore.billingStatus || 'active';
    
    // Check if trial is expired based on date if status is still 'trial'
    const isTrialExpired = status === 'trial' && 
                          currentStore.trialEndsAt && 
                          new Date(currentStore.trialEndsAt) < new Date();
    
    const effectiveStatus = isTrialExpired ? 'trial_expired' : status;
    const isBlocked = ['suspended', 'canceled', 'trial_expired', 'overdue'].includes(effectiveStatus);
    
    if (isBlocked) {
      return (
        <SubscriptionBlockingScreen 
          status={effectiveStatus} 
          storeName={currentStore.name} 
          isAdmin={false}
        />
      );
    }
  }

  return <Outlet />;
};
