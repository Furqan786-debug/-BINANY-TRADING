import React from 'react';
import { useTrading } from '../../context/TradingContext';
import { Bell, CheckCheck, Trash2, X, Activity, DollarSign, Shield, LifeBuoy } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useTrading();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'deposit':
        return <DollarSign className="w-4 h-4 text-blue-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-rose-400" />;
      case 'support':
        return <LifeBuoy className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              title="Clear all"
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/40">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No notifications at the moment.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkTab) {
                  onNavigateTab(n.linkTab);
                  onClose();
                }
              }}
              className={`flex items-start gap-3 p-3.5 hover:bg-slate-800/50 transition-colors cursor-pointer ${
                !n.read ? 'bg-blue-600/5' : ''
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50 shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className={`font-bold truncate ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {n.message}
                </p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
