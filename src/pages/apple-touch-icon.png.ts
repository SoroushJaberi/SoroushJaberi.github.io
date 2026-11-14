import type { APIRoute } from 'astro';
import { iconPng } from '@/lib/icon';

// iOS masks the icon itself, so fill the square and inset the mark.
export const GET: APIRoute = () => iconPng(180, 22);
