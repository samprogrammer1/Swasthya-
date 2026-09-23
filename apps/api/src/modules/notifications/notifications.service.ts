import { Injectable, NotFoundException } from '@nestjs/common';

export interface NotificationRecord {
  id: string;
  userId: string;
  userMobile: string;
  title: string;
  message: string;
  channel: 'IN_APP' | 'SMS' | 'PUSH' | 'EMAIL';
  event: 'TOKEN_CREATED' | 'TOKEN_NEAR' | 'TOKEN_CALLED' | 'PRESCRIPTION_CREATED';
  isRead: boolean;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  private notifications: NotificationRecord[] = [
    {
      id: 'notif_101',
      userId: 'usr_patient_01',
      userMobile: '+919876543214',
      title: 'Token #20 is being served',
      message: 'Your token #27 for Dr. Ananya Sharma is near. Please start moving towards City Care Hospital OPD Desk 2.',
      channel: 'SMS',
      event: 'TOKEN_NEAR',
      isRead: false,
      createdAt: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: 'notif_102',
      userId: 'usr_patient_01',
      userMobile: '+919876543214',
      title: 'OPD Token #27 Confirmed',
      message: 'Token #27 generated for Dr. Ananya Sharma at City Care Hospital Jodhpur. Est wait: ~45 mins.',
      channel: 'IN_APP',
      event: 'TOKEN_CREATED',
      isRead: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif_103',
      userId: 'usr_patient_01',
      userMobile: '+919876543214',
      title: 'Digital Prescription Issued',
      message: 'Dr. Ananya Sharma completed consultation and issued digital Rx RX-2026-10492.',
      channel: 'IN_APP',
      event: 'PRESCRIPTION_CREATED',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  async getByUser(userId: string): Promise<NotificationRecord[]> {
    return this.notifications.filter((n) => n.userId === userId || userId === 'usr_patient_01');
  }

  async createNotification(
    userId: string,
    userMobile: string,
    event: 'TOKEN_CREATED' | 'TOKEN_NEAR' | 'TOKEN_CALLED' | 'PRESCRIPTION_CREATED',
    title: string,
    message: string,
    channel: 'IN_APP' | 'SMS' | 'PUSH' | 'EMAIL' = 'IN_APP',
  ): Promise<NotificationRecord> {
    const notif: NotificationRecord = {
      id: `notif_${Date.now()}`,
      userId,
      userMobile,
      title,
      message,
      channel,
      event,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  async markAsRead(id: string): Promise<NotificationRecord> {
    const notif = this.notifications.find((n) => n.id === id);
    if (!notif) throw new NotFoundException('Notification not found');
    notif.isRead = true;
    return notif;
  }

  async markAllAsRead(userId: string): Promise<{ success: boolean }> {
    this.notifications.forEach((n) => {
      if (n.userId === userId || userId === 'usr_patient_01') {
        n.isRead = true;
      }
    });
    return { success: true };
  }
}
