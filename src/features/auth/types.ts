/** Shape of GET /auth/me on the Beytrax API — same contract every tenant site reads. */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  globalRole: string;
}

export interface AuthTenant {
  tenant_id: string;
  tenant_key: string;
  tenant_name: string;
  role: string;
}

export interface AuthSite {
  site_id: string;
  site_key: string;
  site_name: string;
  domain: string;
  tenant_id: string;
  role: string;
}

export interface MeResponse {
  user: AuthUser;
  tenants: AuthTenant[];
  sites: AuthSite[];
  activeTenantId: string | null;
  activeSiteId: string | null;
}
