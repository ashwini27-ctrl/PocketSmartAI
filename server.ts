import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Set up persistent data store directory
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface PlanRecord {
  id: string;
  userId: string;
  planType: 'home' | 'party' | 'jewelry';
  title: string;
  summary: string;
  totalBudget: number;
  budgetUsed: number;
  budgetRemaining: number;
  budgetBreakdown: any[];
  tips: string[];
  requestData: Record<string, any>;
  createdAt: string;
}

interface DBStructure {
  users: UserRecord[];
  plans: PlanRecord[];
  contacts: any[];
}

function initDB(): DBStructure {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading db.json, re-initializing', e);
    }
  }

  const demoUserId = 'user-demo-1';
  const initialData: DBStructure = {
    users: [
      {
        id: demoUserId,
        name: 'Demo User',
        email: 'demo@example.com',
        passwordHash: 'demo123',
        createdAt: new Date('2026-01-15T10:00:00Z').toISOString(),
      },
    ],
    plans: [
      {
        id: 'plan-demo-home',
        userId: demoUserId,
        planType: 'home',
        title: 'Smart Home Plan for ₹50,000',
        summary: 'A balanced modern living room plan prioritizing comfortable seating, mood lighting, and sleek wall aesthetics within ₹50,000.',
        totalBudget: 50000,
        budgetUsed: 46500,
        budgetRemaining: 3500,
        budgetBreakdown: [
          {
            category: 'Furniture',
            allocatedBudget: 17500,
            percentageOfBudget: 35,
            items: [
              {
                id: 'hf-1',
                name: '3-Seater Minimalist Fabric Sofa',
                category: 'Furniture',
                estimatedPrice: 12000,
                quantity: 1,
                totalPrice: 12000,
                reason: 'Primary comfortable centerpiece designed for compact and modern living rooms.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('3 Seater Minimalist Fabric Sofa'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('3 Seater Minimalist Fabric Sofa'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('3 Seater Minimalist Fabric Sofa'),
                },
              },
              {
                id: 'hf-2',
                name: 'Engineered Wood Coffee Table',
                category: 'Furniture',
                estimatedPrice: 5500,
                quantity: 1,
                totalPrice: 5500,
                reason: 'Sturdy tea table with bottom magazine shelf fitting right into the budget.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Engineered Wood Coffee Table'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Engineered Wood Coffee Table'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Engineered Wood Coffee Table'),
                },
              },
            ],
          },
          {
            category: 'Lighting',
            allocatedBudget: 7500,
            percentageOfBudget: 15,
            items: [
              {
                id: 'hl-1',
                name: 'LED Warm White Ceiling Spotlights (Pack of 4)',
                category: 'Lighting',
                estimatedPrice: 3200,
                quantity: 1,
                totalPrice: 3200,
                reason: 'Provides distributed ambient illumination without heavy power draw.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('LED Warm White Ceiling Spotlights'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('LED Warm White Ceiling Spotlights'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('LED Warm White Ceiling Spotlights'),
                },
              },
              {
                id: 'hl-2',
                name: 'Nordic Tripod Floor Lamp',
                category: 'Lighting',
                estimatedPrice: 3800,
                quantity: 1,
                totalPrice: 3800,
                reason: 'Creates cozy accent lighting beside the sofa corner for evening relaxation.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Nordic Tripod Floor Lamp'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Nordic Tripod Floor Lamp'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Nordic Tripod Floor Lamp'),
                },
              },
            ],
          },
          {
            category: 'Fans & Climate',
            allocatedBudget: 6000,
            percentageOfBudget: 12,
            items: [
              {
                id: 'hfc-1',
                name: 'BLDC Energy Saving Smart Ceiling Fan',
                category: 'Fans & Climate',
                estimatedPrice: 5500,
                quantity: 1,
                totalPrice: 5500,
                reason: 'Whisper-quiet 28W BLDC motor saves up to 65% on electricity bills.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('BLDC Energy Saving Ceiling Fan'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('BLDC Energy Saving Ceiling Fan'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('BLDC Energy Saving Ceiling Fan'),
                },
              },
            ],
          },
          {
            category: 'Dining & Utility',
            allocatedBudget: 9000,
            percentageOfBudget: 18,
            items: [
              {
                id: 'hdu-1',
                name: 'Compact 2-Seater Wooden Dining Set',
                category: 'Dining & Utility',
                estimatedPrice: 8500,
                quantity: 1,
                totalPrice: 8500,
                reason: 'Space-saving breakfast table perfect for modern apartment layouts.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Compact 2 Seater Wooden Dining Set'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Compact 2 Seater Wooden Dining Set'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Compact 2 Seater Wooden Dining Set'),
                },
              },
            ],
          },
          {
            category: 'Decor & Essentials',
            allocatedBudget: 10000,
            percentageOfBudget: 20,
            items: [
              {
                id: 'hde-1',
                name: 'Large Geometric Area Rug (4x6 ft)',
                category: 'Decor & Essentials',
                estimatedPrice: 4200,
                quantity: 1,
                totalPrice: 4200,
                reason: 'Ties the living room seating area together with plush comfort underfoot.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Large Geometric Area Rug 4x6'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Large Geometric Area Rug 4x6'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Large Geometric Area Rug 4x6'),
                },
              },
              {
                id: 'hde-2',
                name: 'Blackout Linen Curtains with Rod Set',
                category: 'Decor & Essentials',
                estimatedPrice: 3300,
                quantity: 1,
                totalPrice: 3300,
                reason: 'Blocks harsh sunlight while elevating window proportions.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Blackout Linen Curtains with Rod'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Blackout Linen Curtains with Rod'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Blackout Linen Curtains with Rod'),
                },
              },
            ],
          },
        ],
        tips: [
          'Compare prices on festive or clearance sales before final checkout.',
          'Always check seller reviews and customer photos for fabric color accuracy.',
          'Keep ₹3,500 unallocated for delivery charges and wall-mounting hardware.',
          'Choose modular furniture that can easily be rearranged in your space.',
        ],
        requestData: {
          totalBudget: 50000,
          room: 'Living Room',
          homeType: 'Apartment',
          stylePreference: 'Modern',
          priority: 'Balanced',
          requiredItems: ['Sofa', 'Lighting', 'Ceiling Fan', 'Curtains'],
        },
        createdAt: new Date('2026-02-10T14:30:00Z').toISOString(),
      },
      {
        id: 'plan-demo-party',
        userId: demoUserId,
        planType: 'party',
        title: 'Celebration Birthday Bash for ₹30,000',
        summary: 'A curated birthday party for 20 guests emphasizing delicious catering, vibrant photo-ready balloon decor, and top music vibes.',
        totalBudget: 30000,
        budgetUsed: 27500,
        budgetRemaining: 2500,
        budgetBreakdown: [
          {
            category: 'Food & Drinks',
            allocatedBudget: 10500,
            percentageOfBudget: 35,
            items: [
              {
                id: 'pf-1',
                name: 'Live Appetizers & Snack Platters for 20 Guests',
                category: 'Food & Drinks',
                estimatedPrice: 7000,
                quantity: 1,
                totalPrice: 7000,
                reason: 'Finger foods, mini burgers, spring rolls, and mocktail pitchers.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Party catering snacks platter'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Party catering supplies'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Party snack supplies'),
                },
              },
              {
                id: 'pf-2',
                name: 'Custom 2-Tier Birthday Cake (1.5 kg)',
                category: 'Food & Drinks',
                estimatedPrice: 2500,
                quantity: 1,
                totalPrice: 2500,
                reason: 'Fresh bakery customized fondant cake with candles and cake topper.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Customized birthday cake'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Birthday cake toppers'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Birthday cake accessories'),
                },
              },
            ],
          },
          {
            category: 'Venue & Seating',
            allocatedBudget: 7500,
            percentageOfBudget: 25,
            items: [
              {
                id: 'pv-1',
                name: 'Rooftop Community Hall Rental & Extra Folding Chairs',
                category: 'Venue & Seating',
                estimatedPrice: 6500,
                quantity: 1,
                totalPrice: 6500,
                reason: 'Intimate private open-air space ensuring great ambience for evening photos.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Party venue chairs rental'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Party folding chairs'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Party seating accessories'),
                },
              },
            ],
          },
          {
            category: 'Decorations',
            allocatedBudget: 4500,
            percentageOfBudget: 15,
            items: [
              {
                id: 'pd-1',
                name: 'Metallic Chrome Balloon Arch & LED Fairy Lights Kit',
                category: 'Decorations',
                estimatedPrice: 3800,
                quantity: 1,
                totalPrice: 3800,
                reason: 'Instantly creates an Instagrammable photo backdrop with minimal setup time.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Metallic Balloon Arch Kit with LED Lights'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Metallic Balloon Arch Kit with LED Lights'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Metallic Balloon Arch Kit with LED Lights'),
                },
              },
            ],
          },
          {
            category: 'Entertainment',
            allocatedBudget: 4500,
            percentageOfBudget: 15,
            items: [
              {
                id: 'pe-1',
                name: 'High-Wattage Party Speaker Rental & Fun Party Games',
                category: 'Entertainment',
                estimatedPrice: 4200,
                quantity: 1,
                totalPrice: 4200,
                reason: 'Booming sound with mic for announcements, karaoke, and interactive party games.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Portable Party Speaker with Mic'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Portable Party Speaker with Mic'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Portable Party Speaker with Mic'),
                },
              },
            ],
          },
          {
            category: 'Contingency & Buffer',
            allocatedBudget: 3000,
            percentageOfBudget: 10,
            items: [
              {
                id: 'pc-1',
                name: 'Reserved Cash Cushion for Ice, Napkins & Extra Food',
                category: 'Contingency & Buffer',
                estimatedPrice: 3500,
                quantity: 1,
                totalPrice: 3500,
                reason: 'Crucial reserve for last-minute guest additions and quick grocery runs.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Party supplies disposable plates'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('Party paper plates napkins'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('Party disposables set'),
                },
              },
            ],
          },
        ],
        tips: [
          'Pre-chill drinks the morning of the event to avoid buying emergency ice packs.',
          'Prepare your music playlist beforehand to eliminate awkward silences.',
          'Use disposable biodegradable tableware to reduce post-party cleaning costs.',
        ],
        requestData: {
          totalBudget: 30000,
          partyType: 'Birthday',
          numberOfGuests: 20,
          location: 'Rooftop',
          foodPreference: 'Multi-cuisine',
          decorationPreference: 'Thematic',
        },
        createdAt: new Date('2026-02-28T16:00:00Z').toISOString(),
      },
      {
        id: 'plan-demo-jewelry',
        userId: demoUserId,
        planType: 'jewelry',
        title: 'Wedding Festive Jewelry Plan for ₹1,00,000',
        summary: 'An elegant festival ensemble combining a certified hallmarked Gold Pendant Necklace with matching Chandbali Earrings and luxury velvet travel care.',
        totalBudget: 100000,
        budgetUsed: 92000,
        budgetRemaining: 8000,
        budgetBreakdown: [
          {
            category: 'Main Piece',
            allocatedBudget: 55000,
            percentageOfBudget: 55,
            items: [
              {
                id: 'jm-1',
                name: '22KT Hallmarked Intricate Gold Choker Necklace (approx 7.5g)',
                category: 'Main Piece',
                estimatedPrice: 52000,
                quantity: 1,
                totalPrice: 52000,
                reason: 'Timeless heirloom craftsmanship certified by BIS hallmark, ideal for bridal wear.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('22KT Gold Choker Necklace Hallmarked'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('22k gold necklace jewelry'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('22k gold necklace'),
                },
              },
            ],
          },
          {
            category: 'Matching Piece',
            allocatedBudget: 25000,
            percentageOfBudget: 25,
            items: [
              {
                id: 'jmp-1',
                name: 'Matching 22KT Gold Chandbali Earrings with Pearl Drops',
                category: 'Matching Piece',
                estimatedPrice: 24000,
                quantity: 1,
                totalPrice: 24000,
                reason: 'Harmonious complement to the neckpiece with lightweight balance for extended wear.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('22KT Gold Chandbali Earrings Pearl'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('gold chandbali earrings'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('gold chandbali earrings'),
                },
              },
            ],
          },
          {
            category: 'Care & Packaging',
            allocatedBudget: 10000,
            percentageOfBudget: 10,
            items: [
              {
                id: 'jc-1',
                name: 'Anti-Tarnish Velvet Multi-Tier Jewelry Organizer Box',
                category: 'Care & Packaging',
                estimatedPrice: 4200,
                quantity: 1,
                totalPrice: 4200,
                reason: 'Safeguards gold and precious gemstones against scratches and oxidation.',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('Anti Tarnish Velvet Jewelry Box'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('velvet jewelry organizer box'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('jewelry organizer box velvet'),
                },
              },
            ],
          },
          {
            category: 'Buffer & Making Charges',
            allocatedBudget: 10000,
            percentageOfBudget: 10,
            items: [
              {
                id: 'jb-1',
                name: 'Reserved Cushion for Daily Gold Rate Fluctuation & GST',
                category: 'Buffer & Making Charges',
                estimatedPrice: 11800,
                quantity: 1,
                totalPrice: 11800,
                reason: 'Accounts for standard 3% GST and variable jeweler making charges (VA).',
                shoppingLinks: {
                  google: 'https://www.google.com/search?tbm=shop&q=' + encodeURIComponent('BIS Hallmarked gold jewelry coin'),
                  amazon: 'https://www.amazon.in/s?k=' + encodeURIComponent('gold coin 24k'),
                  flipkart: 'https://www.flipkart.com/search?q=' + encodeURIComponent('gold coin 24k'),
                },
              },
            ],
          },
        ],
        tips: [
          'Always insist on BIS Hallmark and detailed HUID number on gold purchases.',
          'Verify making charges breakdown before finalizing with any jeweler.',
          'Store pearls and gold in separate velvet compartments to prevent micro-abrasions.',
        ],
        requestData: {
          totalBudget: 100000,
          jewelryType: 'Set',
          occasion: 'Wedding',
          preferredMetal: 'Gold',
          style: 'Traditional',
        },
        createdAt: new Date('2026-03-05T11:20:00Z').toISOString(),
      },
    ],
    contacts: [],
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

let db = initDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// Helper to extract or decode authorization token
function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (!token) return null;
  // Simple token format: user-id or base64 user-id
  if (token.startsWith('user-')) return token;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.startsWith('user-')) return decoded;
  } catch {
    // fallback
  }
  // Lookup token if matching email or id
  const user = db.users.find(u => u.id === token || u.email === token);
  return user ? user.id : 'user-demo-1';
}

// -------------------------------------------------------------
// DETERMINISTIC FALLBACK BUDGET GENERATION SYSTEM
// -------------------------------------------------------------
function generateDeterministicPlan(planType: 'home' | 'party' | 'jewelry', totalBudget: number, data: Record<string, any>): any {
  const budget = Math.max(1000, Number(totalBudget) || 10000);
  let categories: { category: string; pct: number; items: { name: string; pct: number; qty: number; reason: string }[] }[] = [];
  let title = '';
  let summary = '';
  let tips: string[] = [];

  if (planType === 'home') {
    title = `Smart Home Budget Plan for ₹${budget.toLocaleString('en-IN')}`;
    const room = data.room || 'Living Room';
    const style = data.stylePreference || 'Modern';
    summary = `Optimized ${style} ${room} layout configured to extract maximum comfort and utility while keeping spending strictly inside ₹${budget.toLocaleString('en-IN')}.`;

    // Rule: Furniture: 35%, Decor & Essentials: 20%, Dining: 18%, Lighting: 15%, Fans: 12%
    categories = [
      {
        category: 'Furniture',
        pct: 35,
        items: [
          { name: `${style} Seating Setup / Sofa`, pct: 24, qty: 1, reason: `Essential core furniture anchoring the ${room}.` },
          { name: `Coffee / Utility Accent Table`, pct: 11, qty: 1, reason: `Functional surface with storage for daily living.` },
        ],
      },
      {
        category: 'Decor & Essentials',
        pct: 20,
        items: [
          { name: `Soft Textured Area Rug & Drapes`, pct: 12, qty: 1, reason: `Improves acoustic warmth and gives a cohesive visual finish.` },
          { name: `Framed Wall Art & Planters Set`, pct: 8, qty: 1, reason: `Personalizes the space without heavy recurring costs.` },
        ],
      },
      {
        category: 'Dining & Storage',
        pct: 18,
        items: [
          { name: `Modular Compact Dining / Shelf Unit`, pct: 18, qty: 1, reason: `Optimized multipurpose unit ensuring clutter-free spaces.` },
        ],
      },
      {
        category: 'Lighting',
        pct: 15,
        items: [
          { name: `Warm Ambience Ceiling / Task Lighting`, pct: 9, qty: 2, reason: `High-efficiency LED fixtures providing balanced glare-free light.` },
          { name: `Corner Reading Accent Lamp`, pct: 6, qty: 1, reason: `Adds depth and warm evening mood lighting.` },
        ],
      },
      {
        category: 'Fans & Ventilation',
        pct: 12,
        items: [
          { name: `High-Airflow BLDC Energy Efficient Fan`, pct: 12, qty: 1, reason: `Modern motor saving significant power with silent operation.` },
        ],
      },
    ];

    tips = [
      'Shop during major festival sales for 20-30% extra savings on furniture.',
      'Check room dimensions twice before ordering to prevent return shipping fees.',
      'Keep a 5-10% buffer for delivery and assembly charges.',
      'Invest in neutral furniture bases and add color through easily swappable cushions and throws.',
    ];
  } else if (planType === 'party') {
    title = `Complete Party Budget Plan for ₹${budget.toLocaleString('en-IN')}`;
    const pType = data.partyType || 'Celebration';
    const guests = data.numberOfGuests || 20;
    summary = `A full ${pType} celebration planned for ${guests} guests emphasizing delicious catering, memorable venue vibes, and lively entertainment.`;

    // Rule: Food & Drinks: 35%, Venue: 25%, Decorations: 15%, Entertainment: 15%, Contingency: 10%
    categories = [
      {
        category: 'Food & Drinks',
        pct: 35,
        items: [
          { name: `Catered Platter & Buffet for ${guests} Guests`, pct: 26, qty: 1, reason: `Curated starter and main spread catering to guest preferences.` },
          { name: `Custom Celebration Cake & Mocktails`, pct: 9, qty: 1, reason: `Thematic centerpiece cake with refreshing drink dispensers.` },
        ],
      },
      {
        category: 'Venue & Seating',
        pct: 25,
        items: [
          { name: `Venue Space Booking & Extra Seating Setup`, pct: 25, qty: 1, reason: `Comfortable room or terrace setting accommodating all attendees.` },
        ],
      },
      {
        category: 'Decorations',
        pct: 15,
        items: [
          { name: `Themed Balloon Arch & Photo Backdrop Kit`, pct: 15, qty: 1, reason: `Provides a focal photo area for memorable group pictures.` },
        ],
      },
      {
        category: 'Entertainment',
        pct: 15,
        items: [
          { name: `Bluetooth Sound System & Party Games Props`, pct: 15, qty: 1, reason: `Ensures great music and high-energy guest participation.` },
        ],
      },
      {
        category: 'Contingency & Supplies',
        pct: 10,
        items: [
          { name: `Disposables, Emergency Ice & Backup Buffer`, pct: 10, qty: 1, reason: `Prevents last-minute stress from sudden guest additions or shortages.` },
        ],
      },
    ];

    tips = [
      'Confirm RSVP numbers 48 hours prior to finalize exact catering portions.',
      'Create and download your party playlist offline to avoid internet drops.',
      'Purchase eco-friendly disposable tableware in bulk for easy cleanup.',
      'Assign one friend to photograph key moments so you can enjoy hosting.',
    ];
  } else {
    // Jewelry
    title = `Curated Jewelry Budget Plan for ₹${budget.toLocaleString('en-IN')}`;
    const metal = data.preferredMetal || 'Gold';
    const occasion = data.occasion || 'Festival';
    summary = `Exquisite ${metal} jewelry combination tailored for ${occasion}, balancing hallmarked purity, stunning presence, and long-term value.`;

    // Rule: Main Piece: 55%, Matching Piece: 25%, Care & Packaging: 10%, Buffer: 10%
    categories = [
      {
        category: 'Main Piece',
        pct: 55,
        items: [
          { name: `Hallmarked ${metal} Statement Neckpiece / Pendant`, pct: 55, qty: 1, reason: `Signature heirloom focal piece crafted with certified purity.` },
        ],
      },
      {
        category: 'Matching Piece',
        pct: 25,
        items: [
          { name: `Coordinated ${metal} Earrings or Bangle Pair`, pct: 25, qty: 1, reason: `Harmonious accent designed to complete the festive silhouette.` },
        ],
      },
      {
        category: 'Care & Packaging',
        pct: 10,
        items: [
          { name: `Anti-Tarnish Velvet Storage Case & Cleaning Kit`, pct: 10, qty: 1, reason: `Protects precious metals and stones from micro-scratches and moisture.` },
        ],
      },
      {
        category: 'Buffer & Making Charges',
        pct: 10,
        items: [
          { name: `Gold Rate Fluctuation & Making Charges Reserve`, pct: 10, qty: 1, reason: `Buffers standard GST (3%) and day-to-day bullion price swings.` },
        ],
      },
    ];

    tips = [
      'Always inspect the BIS Hallmark logo and 6-digit HUID code before paying.',
      'Inquire about the buyback and exchange policy in writing.',
      'Keep jewelry away from direct perfumes, hairsprays, and moisture.',
      'Compare making charges across at least two certified jewelers.',
    ];
  }

  // Calculate strict amounts ensuring budget_used <= totalBudget
  let totalAllocated = 0;
  const breakdown = categories.map((cat, catIdx) => {
    const catAllocated = Math.floor((budget * cat.pct) / 100);
    let catItemsTotal = 0;

    const items = cat.items.map((item, itemIdx) => {
      const itemAllocated = Math.floor((budget * item.pct) / 100);
      const estPrice = Math.max(100, Math.floor(itemAllocated / item.qty));
      const lineTotal = estPrice * item.qty;
      catItemsTotal += lineTotal;

      const query = item.name;
      return {
        id: `item-${catIdx}-${itemIdx}-${Date.now().toString(36)}`,
        name: item.name,
        category: cat.category,
        estimatedPrice: estPrice,
        quantity: item.qty,
        totalPrice: lineTotal,
        reason: item.reason,
        shoppingLinks: {
          google: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`,
          amazon: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
          flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`,
        },
      };
    });

    totalAllocated += catItemsTotal;
    return {
      category: cat.category,
      allocatedBudget: catAllocated,
      percentageOfBudget: cat.pct,
      items,
    };
  });

  // Strict check: if totalAllocated > budget, scale down
  if (totalAllocated > budget) {
    const scale = (budget * 0.95) / totalAllocated;
    totalAllocated = 0;
    breakdown.forEach(cat => {
      cat.items.forEach(it => {
        it.estimatedPrice = Math.floor(it.estimatedPrice * scale);
        it.totalPrice = it.estimatedPrice * it.quantity;
      });
      cat.allocatedBudget = cat.items.reduce((s, it) => s + it.totalPrice, 0);
      totalAllocated += cat.allocatedBudget;
      cat.percentageOfBudget = Math.round((cat.allocatedBudget / budget) * 100);
    });
  }

  const budgetUsed = totalAllocated;
  const budgetRemaining = Math.max(0, budget - budgetUsed);

  return {
    title,
    summary,
    totalBudget: budget,
    budgetUsed,
    budgetRemaining,
    budgetBreakdown: breakdown,
    tips,
  };
}

// -------------------------------------------------------------
// AI GENERATION WITH GEMINI 3.8 FLASH & STRICT BUDGET ENFORCEMENT
// -------------------------------------------------------------
async function generateAIBudgetPlan(planType: 'home' | 'party' | 'jewelry', totalBudget: number, data: Record<string, any>) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log('No GEMINI_API_KEY detected, using deterministic smart allocation system.');
    return generateDeterministicPlan(planType, totalBudget, data);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `
You are the recommendation brain for PocketSmart AI.
Category: "${planType}"
Total Budget: ₹${totalBudget} (Indian Rupees)
User Requirements:
${JSON.stringify(data, null, 2)}

TASK:
Create a realistic, smart budget recommendation for this user.
CRITICAL MANDATORY RULES:
1. The sum of all item prices ('budget_used') MUST NEVER EXCEED the user's total budget of ₹${totalBudget}.
2. 'budget_remaining' must be exactly (${totalBudget} - 'budget_used') and must be >= 0.
3. Realistic price estimation in Indian Rupees (₹).
4. Provide sensible item categories matching the domain (e.g. for Home: Furniture, Lighting, Fans & Climate, Dining, Decor; for Party: Food & Drinks, Venue, Decorations, Entertainment, Contingency; for Jewelry: Main Piece, Matching Piece, Care & Box, Buffer).
5. For each item, provide a realistic estimated price, quantity, and a concise convincing reason why it fits the user's need and budget.
6. Provide 4 actionable, practical tips for smart shopping and avoiding overspending.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are PocketSmart AI, an expert financial and procurement advisor. Always return clean JSON adhering strictly to the schema. Never exceed the user budget ceiling.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short catchy plan title' },
            summary: { type: Type.STRING, description: '2-3 sentence overview of the plan' },
            budget_used: { type: Type.NUMBER, description: 'Total spent <= totalBudget' },
            budget_remaining: { type: Type.NUMBER, description: 'Remaining amount >= 0' },
            budget_breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  allocated_budget: { type: Type.NUMBER },
                  percentage_of_budget: { type: Type.NUMBER },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        estimated_price: { type: Type.NUMBER },
                        quantity: { type: Type.NUMBER },
                        reason: { type: Type.STRING },
                      },
                      required: ['name', 'category', 'estimated_price', 'quantity', 'reason'],
                    },
                  },
                },
                required: ['category', 'allocated_budget', 'percentage_of_budget', 'items'],
              },
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['title', 'summary', 'budget_used', 'budget_remaining', 'budget_breakdown', 'tips'],
        },
      },
    });

    const rawText = response.text ? response.text.trim() : '';
    if (!rawText) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(rawText);

    // Build standardized objects with shopping links and enforce budget bounds
    let calculatedUsed = 0;
    const formattedBreakdown = parsed.budget_breakdown.map((cat: any, cIdx: number) => {
      let catTotal = 0;
      const items = (cat.items || []).map((it: any, iIdx: number) => {
        const estPrice = Math.max(10, Math.round(Number(it.estimated_price) || 500));
        const qty = Math.max(1, Math.round(Number(it.quantity) || 1));
        const lineTotal = estPrice * qty;
        catTotal += lineTotal;
        const qName = it.name || `Item ${iIdx + 1}`;

        return {
          id: `ai-item-${cIdx}-${iIdx}-${Date.now().toString(36)}`,
          name: qName,
          category: it.category || cat.category,
          estimatedPrice: estPrice,
          quantity: qty,
          totalPrice: lineTotal,
          reason: it.reason || 'Optimal pick matching your budget requirements.',
          shoppingLinks: {
            google: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(qName)}`,
            amazon: `https://www.amazon.in/s?k=${encodeURIComponent(qName)}`,
            flipkart: `https://www.flipkart.com/search?q=${encodeURIComponent(qName)}`,
          },
        };
      });

      calculatedUsed += catTotal;
      return {
        category: cat.category,
        allocatedBudget: catTotal,
        percentageOfBudget: Math.round((catTotal / totalBudget) * 100) || Number(cat.percentage_of_budget) || 10,
        items,
      };
    });

    // Auto-adjust if model somehow exceeded budget
    if (calculatedUsed > totalBudget) {
      const scale = (totalBudget * 0.94) / calculatedUsed;
      calculatedUsed = 0;
      formattedBreakdown.forEach((cat: any) => {
        let catTotal = 0;
        cat.items.forEach((it: any) => {
          it.estimatedPrice = Math.max(50, Math.floor(it.estimatedPrice * scale));
          it.totalPrice = it.estimatedPrice * it.quantity;
          catTotal += it.totalPrice;
        });
        cat.allocatedBudget = catTotal;
        cat.percentageOfBudget = Math.round((catTotal / totalBudget) * 100);
        calculatedUsed += catTotal;
      });
    }

    const budgetRemaining = Math.max(0, totalBudget - calculatedUsed);

    return {
      title: parsed.title || `Smart ${planType.toUpperCase()} Plan for ₹${totalBudget.toLocaleString('en-IN')}`,
      summary: parsed.summary || 'A balanced, intelligent budget distribution crafted to maximize value within your limits.',
      totalBudget,
      budgetUsed: calculatedUsed,
      budgetRemaining,
      budgetBreakdown: formattedBreakdown,
      tips: Array.isArray(parsed.tips) && parsed.tips.length > 0 ? parsed.tips : [
        'Compare product deals across platforms before checkout.',
        'Keep some remaining budget as emergency buffer.',
        'Prioritize must-have items before choosing cosmetic additions.',
        'Check reviews and return policies on expensive purchases.',
      ],
    };
  } catch (err) {
    console.warn('Gemini API call failed, safely defaulting to deterministic engine:', err);
    return generateDeterministicPlan(planType, totalBudget, data);
  }
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'PocketSmart AI', timestamp: new Date().toISOString() });
});

// Auth: Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide full name, email, and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.users.find(u => u.email === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please login.' });
    }

    const newUser: UserRecord = {
      id: `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: password, // For college demo prototype
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB();

    res.status(201).json({
      user: { id: newUser.id, name: newUser.name, email: newUser.email, createdAt: newUser.createdAt },
      token: newUser.id,
      message: 'Account created successfully!',
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Registration failed' });
  }
});

// Auth: Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter your email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find(u => u.email === cleanEmail);

    if (!user || user.passwordHash !== password) {
      // Allow demo user password fallback if testing
      if (cleanEmail === 'demo@example.com' && (password === 'demo123' || password === 'password123' || password === 'demo')) {
        const demoUser = db.users.find(u => u.email === 'demo@example.com');
        if (demoUser) {
          return res.json({
            user: { id: demoUser.id, name: demoUser.name, email: demoUser.email, createdAt: demoUser.createdAt },
            token: demoUser.id,
            message: 'Welcome back, Demo User!',
          });
        }
      }
      return res.status(401).json({ error: 'Invalid email or password. Try demo@example.com with demo123' });
    }

    res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      token: user.id,
      message: `Welcome back, ${user.name}!`,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Login failed' });
  }
});

// Auth: Current user
app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
  });
});

// Auth: Update profile
app.post('/api/auth/update-profile', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name cannot be empty.' });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.name = name.trim();
  saveDB();

  res.json({
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    message: 'Profile updated successfully!',
  });
});

// Plans: List all for current user
app.get('/api/plans', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req) || 'user-demo-1';
  const userPlans = db.plans.filter(p => p.userId === userId);
  // Sort most recent first
  userPlans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ plans: userPlans });
});

// Plans: Get by ID
app.get('/api/plans/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const plan = db.plans.find(p => p.id === id);
  if (!plan) {
    return res.status(404).json({ error: 'Plan not found.' });
  }
  res.json({ plan });
});

// Plans: Save Plan
app.post('/api/plans', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req) || 'user-demo-1';
  const planData = req.body;

  if (!planData || !planData.totalBudget || !planData.planType) {
    return res.status(400).json({ error: 'Incomplete plan data.' });
  }

  const newPlan: PlanRecord = {
    id: planData.id || `plan-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    userId,
    planType: planData.planType,
    title: planData.title || `Smart ${planData.planType} Plan`,
    summary: planData.summary || '',
    totalBudget: Number(planData.totalBudget),
    budgetUsed: Number(planData.budgetUsed),
    budgetRemaining: Number(planData.budgetRemaining),
    budgetBreakdown: planData.budgetBreakdown || [],
    tips: planData.tips || [],
    requestData: planData.requestData || {},
    createdAt: planData.createdAt || new Date().toISOString(),
  };

  // Check if exists
  const existingIdx = db.plans.findIndex(p => p.id === newPlan.id);
  if (existingIdx >= 0) {
    db.plans[existingIdx] = newPlan;
  } else {
    db.plans.unshift(newPlan);
  }

  saveDB();
  res.status(201).json({ plan: newPlan, message: 'Plan saved successfully!' });
});

// Plans: Delete Plan
app.delete('/api/plans/:id', (req: Request, res: Response) => {
  const userId = getUserIdFromRequest(req) || 'user-demo-1';
  const { id } = req.params;

  const idx = db.plans.findIndex(p => p.id === id && p.userId === userId);
  if (idx < 0) {
    return res.status(404).json({ error: 'Plan not found or unauthorized.' });
  }

  db.plans.splice(idx, 1);
  saveDB();
  res.json({ message: 'Plan deleted successfully.' });
});

// Plans: AI Generate Endpoint
app.post('/api/plan/generate', async (req: Request, res: Response) => {
  try {
    const { planType, totalBudget, ...restData } = req.body;

    if (!planType || !totalBudget || Number(totalBudget) <= 0) {
      return res.status(400).json({ error: 'Please provide a valid plan category and budget amount.' });
    }

    const budget = Number(totalBudget);
    const userId = getUserIdFromRequest(req) || 'user-demo-1';

    console.log(`Generating plan for type: ${planType}, budget: ₹${budget}`);
    const generated = await generateAIBudgetPlan(planType, budget, restData);

    const fullPlan: PlanRecord = {
      id: `plan-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      planType,
      title: generated.title,
      summary: generated.summary,
      totalBudget: generated.totalBudget,
      budgetUsed: generated.budgetUsed,
      budgetRemaining: generated.budgetRemaining,
      budgetBreakdown: generated.budgetBreakdown,
      tips: generated.tips,
      requestData: { planType, totalBudget: budget, ...restData },
      createdAt: new Date().toISOString(),
    };

    // Auto-save to database so it immediately shows in History and Dashboard
    db.plans.unshift(fullPlan);
    saveDB();

    res.json({ plan: fullPlan });
  } catch (error: any) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: 'Something went wrong while generating your plan. Please try again.' });
  }
});

// Contact endpoint
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const submission = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    db.contacts.push(submission);
    saveDB();

    res.json({ message: 'Thank you! Your message has been received. Our team will get back to you shortly.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit contact form.' });
  }
});

// Server boot with Vite middleware
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist');
  }

  app.listen(PORT, () => {
    console.log(`PocketSmart AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
