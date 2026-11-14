import type { APIRoute } from 'astro';
import { iconPng } from '@/lib/icon';

// iOS rounds the corners itself and does not allow transparency, so fill the square.
export const GET: APIRoute = () => iconPng(180, true);
