import React from 'react';

export const dummyMediaDatabase: MediaDatabase[] = [
  {
    id: '1',
    name: 'Summer Banner',
    description: 'Homepage summer campaign banner',
    category: 'banners',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300',
    createdAt: '2026-05-08T10:00:00Z',
    updatedAt: '2026-05-08T10:00:00Z',
    createdBy: 'Akshay',
    fileSize: '2.4 MB',
  },
  {
    id: '2',
    name: 'Mission Promo',
    description: 'Mission bundle promotional image',
    category: 'mission-bundles',
    imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=300',
    createdAt: '2026-05-07T08:30:00Z',
    updatedAt: '2026-05-07T09:00:00Z',
    createdBy: 'Admin',
    fileSize: '1.8 MB',
  },
  {
    id: '3',
    name: 'Booster Ad',
    description: 'Booster campaign social media asset',
    category: 'booster-images',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300',
    createdAt: '2026-05-06T12:45:00Z',
    updatedAt: '2026-05-06T13:10:00Z',
    createdBy: 'Marketing Team',
    fileSize: '3.1 MB',
  },
  {
    id: '4',
    name: 'Email Header',
    description: 'Email template top banner asset',
    category: 'email-templates-assets',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300',
    createdAt: '2026-05-05T15:20:00Z',
    updatedAt: '2026-05-05T15:20:00Z',
    createdBy: 'Designer',
    fileSize: '950 KB',
  },
  {
    id: '5',
    name: 'Template Mockup',
    description: 'UI template preview image',
    category: 'template',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300',
    createdAt: '2026-05-04T18:00:00Z',
    updatedAt: '2026-05-04T18:40:00Z',
    createdBy: 'UI Team',
    fileSize: '4.6 MB',
  },
];

export const categoryOptions = [
  { label: 'All', value: 'all' },
  { label: 'Banners', value: 'banners' },
  { label: 'Booster Images', value: 'booster-images' },
  { label: 'Email Templates Assets', value: 'email-templates-assets' },
  { label: 'Joy Saha', value: 'joy-saha' },
  { label: 'Mission Bundles', value: 'mission-bundles' },
  { label: 'Mission Banner', value: 'mission-banner' },
  { label: 'Template', value: 'template' },
];

export type MediaDatabaseNavItemId =
  | 'all-media-database'
  | 'media-database-banners'
  | 'media-database-booster-images'
  | 'media-database-email-templates-assets'
  | 'media-database-joy-saha'
  | 'media-database-mission-bundles'
  | 'media-database-mission-banner'
  | 'media-database-template';

export interface MediaDatabaseNavItem {
  id: MediaDatabaseNavItemId;
  label: string;
  icon: React.ReactNode;
}

export interface MediaDatabase {
  id: string;
  name: string;
  description?: string;
  category?: string;

  imageUrl?: string;
  thumbnailUrl?: string;

  createdAt: string;
  updatedAt: string;

  createdBy: string;

  fileSize?: string;
}

export interface MediaDatabaseForm {
  id?: string;

  name: string;

  description?: string;

  imageUrl?: string;

  file?: File;

  category?: string;

  createdAt?: string;

  createdBy: string;
}

export interface MediaDatabaseErrors {
  name?: string;

  category?: string;

  description?: string;

  imageUrl?: string;
}
