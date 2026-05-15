export type CampaignStatus = 'IN_DESIGN' | 'SENT' | 'SCHEDULED' | 'PAUSED' | 'ARCHIVED';

export interface Campaign {
  id: string;
  name: string;
  type: string;
  status: CampaignStatus;
  description?: string | null;
  tags?: string[] | null;
  trigger?: string | null;
  trigger_config?: Record<string, unknown> | null;
  segment?: string | null;
  target_group?: Record<string, unknown> | null;
  start_date?: string | null;
  end_date?: string | null;
  created_by?: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampaignForm {
  name: string;
  type: string;
  tags: string[];
  description: string;
  trigger: string;
  segment: string;
  start_date: string;
  end_date: string;
  target_group: string;
}

export interface CampaignErrors {
  name?: string;
  trigger?: string;
  start_date?: string;
}

export interface CampaignFilters {
  search: string;
  status: string;
  trigger: string;
  tag: string;
}

export const CAMPAIGN_STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Status', value: '' },
  { label: 'In Design', value: 'IN_DESIGN' },
  { label: 'Sent', value: 'SENT' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'Paused', value: 'PAUSED' },
];

export const CAMPAIGN_TRIGGER_OPTIONS: { label: string; value: string }[] = [
  { label: 'Scheduled - Now', value: 'Scheduled - Now' },
  { label: 'Daily At 00:00 UTC', value: 'Daily At 00:00 UTC' },
  { label: 'Event: Registration', value: 'Event: Registration' },
  { label: 'Event: First Deposit', value: 'Event: First Deposit' },
  { label: 'Event: Login', value: 'Event: Login' },
];

export const CAMPAIGN_TAG_OPTIONS: string[] = [
  'Welcome',
  'Retention',
  'Reactivation',
  'Promotion',
  'No Deposit',
];

export const CAMPAIGN_SEGMENT_OPTIONS: string[] = [
  'Level -1',
  'Join No Deposit Last 24 Hours',
  'reg no depo',
  'Registration',
];
