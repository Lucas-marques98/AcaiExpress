import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { UserRole } from '../types';
import { SubscriptionBlockingScreen } from './SubscriptionBlockingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { stores, loading: storeLoading } = useStore();
  const location = useLocation();

  if (authLoading || storeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0b]">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Subscription blocking for STORE_ADMIN
  if (user.role === 'STORE_ADMIN' && user.storeId) {
    const store = stores.find(s => s.id === user.storeId);
    if (store) {
      const status = store.billingStatus || 'active';
      
      // Check if trial is expired based on date if status is still 'trial'
      const isTrialExpired = status === 'trial' && 
                            store.trialEndsAt && 
                            new Date(store.trialEndsAt) < new Date();
      
      const effectiveStatus = isTrialExpired ? 'trial_expired' : status;
      const isBlocked = ['suspended', 'canceled', 'trial_expired', 'overdue'].includes(effectiveStatus);
      
      // Allow access to "My Plan" page even if blocked, so they can pay
      const isMyPlanPage = location.pathname.includes('/admin/meu-plano');
      
      if (isBlocked && !isMyPlanPage) {
        return (
          <SubscriptionBlockingScreen 
            status={effectiveStatus} 
            storeName={store.name} 
            isAdmin={true}
          />
        );
      }
    }
  }

  return <>{children}</>;
};
