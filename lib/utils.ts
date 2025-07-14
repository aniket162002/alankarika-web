import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Temporary: Return a dummy user object for build
export async function getUserFromRequest(req: any) {
  return { id: 'dummy-user-id' };
}
