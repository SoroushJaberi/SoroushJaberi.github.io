import type { APIRoute } from 'astro';
import { iconPng } from '@/lib/icon';

// The tab icon. 96 px stays sharp on high-density screens.
export const GET: APIRoute = () => iconPng(96);
