import type { APIRoute } from 'astro';
import { iconIco } from '@/lib/icon';

// Browsers and tools that ignore <link rel="icon"> ask for this file by name.
export const GET: APIRoute = () => iconIco();
