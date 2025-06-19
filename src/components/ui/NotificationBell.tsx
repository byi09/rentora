"use client";
import React, { useEffect, useState } from 'react';
import { HiBell } from 'react-icons/hi';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover';
import Spinner from '@/src/components/ui/Spinner';

interface Notification {
  id: string;
  senderId: string;
  receiverId: string | null;
  type: 'notification' | 'phone' | 'email';
  message: string;
  createdAt: string;
  readAt: string | null;
}

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const json = await res.json();
        setItems(json.notifications);
        setUnread(json.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      });
      setItems(prev => prev.map(n => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
      setUnread(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
          <HiBell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 bg-white">
        <div className="py-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4"><Spinner size={24} /></div>
          ) : items.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">No notifications</p>
          ) : (
            items.map(n => (
              <div
                key={n.id}
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${!n.readAt ? 'font-medium' : ''}`}
                onClick={() => {
                  // Toggle expansion if already expanded
                  setExpandedId(expandedId === n.id ? null : n.id);
                }}
              >
                {/* Message preview or full */}
                <div className="flex justify-between items-start">
                  <span>{n.message}</span>
                  {expandedId !== n.id && (
                    <span className="ml-2 text-xs text-gray-400">▶</span>
                  )}
                </div>
                <span className="block text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </span>

                {/* Expanded area */}
                {expandedId === n.id && (
                  <div className="mt-2 space-y-2">
                    {/* Placeholder for additional details if needed */}
                    <button
                      className="text-blue-600 text-xs underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!n.readAt) markAsRead(n.id);
                        setExpandedId(null);
                      }}
                    >
                      {n.readAt ? 'Marked as read' : 'Mark as read'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell; 