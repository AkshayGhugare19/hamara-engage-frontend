export type SegmentType = 'DYNAMIC' | 'STATIC';

export interface Segment {
  id: string;
  name: string;
  type: SegmentType;
  description?: string | null;
  tags?: string[] | null;
  content?: Record<string, unknown> | null;
  player_count: number;
  last_counted_at?: string | null;
  created_by?: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface SegmentForm {
  name: string;
  type: SegmentType | '';
  tags: string[];
  description: string;
  content: string;
}

export interface SegmentErrors {
  name?: string;
  type?: string;
}

export interface SegmentFilters {
  search: string;
  type: string;
  created_by: string;
  tag: string;
}

export const SEGMENT_TYPE_OPTIONS: { label: string; value: SegmentType }[] = [
  { label: 'Dynamic', value: 'DYNAMIC' },
  { label: 'Static', value: 'STATIC' },
];

export const SEGMENT_TYPE_FILTER_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Types', value: '' },
  { label: 'Dynamic', value: 'DYNAMIC' },
  { label: 'Static', value: 'STATIC' },
];

export const SEGMENT_TAG_OPTIONS: string[] = [
  'High Value',
  'Retention',
  'Reactivation',
  'No Deposit',
  'VIP',
  'New Player',
];
