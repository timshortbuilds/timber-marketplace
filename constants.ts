import { Listing } from './types';

export const ACCOMMODATIONS = [
  'Lodging',
  'Well Water',
  'Outhouse',
  'Electricity',
  'Camping Area'
];

export const SPORTING_ARMS = [
  'Bow',
  'Rifle',
  'Shotgun',
  'Muzzleloader',
  'Crossbow'
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Timber Ridge Whitetail Haven',
    location: 'Pike County, Illinois',
    pricePerDay: 450,
    description: 'Premier trophy whitetail property with established food plots and heavy timber cover. Excellent deer management practices in place for over a decade.',
    gameTypes: ['Whitetail Deer', 'Turkey'],
    sportingArms: ['Bow', 'Rifle', 'Shotgun'],
    acreage: 240,
    features: ['Blind Provided', 'Water Source'],
    accommodations: ['Lodging', 'Well Water', 'Electricity'],
    images: [
      'https://picsum.photos/seed/hunt1/800/600',
      'https://picsum.photos/seed/hunt1b/800/600'
    ],
    landowner: {
      id: 'o1',
      name: 'John Miller',
      avatar: 'https://picsum.photos/seed/owner1/100/100',
      rating: 4.9,
      listingsCount: 3
    },
    rating: 4.95,
    reviews: 24,
    isVerified: true,
    coordinates: { lat: 39.6273, lng: -90.7512 }
  },
  {
    id: '2',
    title: 'Rolling Plains Quail Ranch',
    location: 'Snyder, Texas',
    pricePerDay: 300,
    description: 'Expansive grasslands perfect for upland bird hunting. High density of wild bobwhite quail. Includes access to a rustic bunkhouse.',
    gameTypes: ['Quail', 'Dove'],
    sportingArms: ['Shotgun'],
    acreage: 1200,
    features: ['Dog Kennels', 'Vehicle Access'],
    accommodations: ['Outhouse', 'Camping Area'],
    images: [
      'https://picsum.photos/seed/hunt2/800/600',
      'https://picsum.photos/seed/hunt2b/800/600'
    ],
    landowner: {
      id: 'o2',
      name: 'Sarah Evans',
      avatar: 'https://picsum.photos/seed/owner2/100/100',
      rating: 4.8,
      listingsCount: 1
    },
    rating: 4.7,
    reviews: 15,
    isVerified: true,
    coordinates: { lat: 32.7179, lng: -100.9176 }
  },
  {
    id: '3',
    title: 'Cypress Creek Waterfowl',
    location: 'Stuttgart, Arkansas',
    pricePerDay: 550,
    description: 'Flooded timber and rice fields in the heart of the Mississippi Flyway. Fully guided or self-guided options available.',
    gameTypes: ['Duck', 'Goose'],
    sportingArms: ['Shotgun'],
    acreage: 400,
    features: ['Pit Blinds', 'Decoys Included', 'Boat Access'],
    accommodations: ['Lodging', 'Electricity'],
    images: [
      'https://picsum.photos/seed/hunt3/800/600',
      'https://picsum.photos/seed/hunt3b/800/600'
    ],
    landowner: {
      id: 'o3',
      name: 'Beau Bridges',
      avatar: 'https://picsum.photos/seed/owner3/100/100',
      rating: 5.0,
      listingsCount: 2
    },
    rating: 4.88,
    reviews: 42,
    isVerified: false,
    coordinates: { lat: 34.5004, lng: -91.5515 }
  },
  {
    id: '4',
    title: 'Black Hills Elk Territory',
    location: 'Custer, South Dakota',
    pricePerDay: 750,
    description: 'Rugged terrain with high elk density. Borders National Forest land. Experienced scouting reports provided upon booking.',
    gameTypes: ['Elk', 'Mule Deer'],
    sportingArms: ['Bow', 'Rifle', 'Muzzleloader'],
    acreage: 850,
    features: ['Mountainous', 'Primitive Camping', 'Pack-in Only'],
    accommodations: ['Camping Area'],
    images: [
      'https://picsum.photos/seed/hunt4/800/600',
      'https://picsum.photos/seed/hunt4b/800/600'
    ],
    landowner: {
      id: 'o4',
      name: 'Erik Thorne',
      avatar: 'https://picsum.photos/seed/owner4/100/100',
      rating: 4.9,
      listingsCount: 1
    },
    rating: 4.92,
    reviews: 18,
    isVerified: true,
    coordinates: { lat: 43.7667, lng: -103.6030 }
  }
];

export const GAME_TYPES = [
  'Whitetail Deer',
  'Mule Deer',
  'Elk',
  'Turkey',
  'Duck',
  'Goose',
  'Quail',
  'Pheasant',
  'Hog'
];