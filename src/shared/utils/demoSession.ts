export type DemoRole = 'customer' | 'provider' | 'admin';

export interface DemoSession {
  role: DemoRole;
  email: string;
}

const sessionKey = 'jisr-demo-session';

export function getDemoSession(): DemoSession | null {
  const stored = window.sessionStorage.getItem(sessionKey);
  if (!stored) return null;
  try {
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null || !('role' in parsed) || !('email' in parsed)) return null;
    if ((parsed.role !== 'customer' && parsed.role !== 'provider' && parsed.role !== 'admin') || typeof parsed.email !== 'string') return null;
    return { role: parsed.role, email: parsed.email };
  } catch {
    return null;
  }
}

export function saveDemoSession(session: DemoSession): void {
  window.sessionStorage.setItem(sessionKey, JSON.stringify(session));
}

export function clearDemoSession(): void {
  window.sessionStorage.removeItem(sessionKey);
}
