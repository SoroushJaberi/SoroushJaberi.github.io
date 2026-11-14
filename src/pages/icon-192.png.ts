import type { APIRoute } from 'astro';
import { iconPng } from '@/lib/icon';

// Android home screen and other large uses.
export const GET: APIRoute = () => iconPng(192);
