import type { OrganizationKind, YellowBookCategory, YellowBookEntry } from '@lib/types';
import { YellowBookCategorySchema, YellowBookEntrySchema } from '@lib/types';

const IS_CI = process.env.CI === "true";

type ApiFetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

function getBaseUrl() {
  const browserBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001';
  if (typeof window !== 'undefined') {
    return browserBaseUrl;
  }

  return process.env.INTERNAL_BACKEND_URL ?? browserBaseUrl;
}

async function apiFetch<T>(path: string, init: ApiFetchOptions = {}): Promise<T> {
  if (IS_CI) {
    // CI дээр fetch хийхгүй, mock буцаана
    return [] as unknown as T;
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: mergeHeaders(init.headers),
    credentials: 'omit',
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Сүлжээний алдаа (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function mergeHeaders(headers?: HeadersInit): Headers {
  const merged = new Headers(headers);

  if (!merged.has('Content-Type')) {
    merged.set('Content-Type', 'application/json');
  }

  return merged;
}

export type YellowBookListParams = {
  search?: string;
  categorySlug?: string;
  organizationType?: OrganizationKind;
  tag?: string;
};

/* -------------------------------------------------------
   LIST — CI дээр хоосон буцаана
--------------------------------------------------------*/
export async function fetchYellowBookList(
  params: YellowBookListParams,
  init?: ApiFetchOptions,
): Promise<YellowBookEntry[]> {

  if (IS_CI) {
    return [];
  }

  const url = new URL('/yellow-books', getBaseUrl());

  if (params.search) url.searchParams.set('search', params.search);
  if (params.categorySlug) url.searchParams.set('categorySlug', params.categorySlug);
  if (params.organizationType) url.searchParams.set('organizationType', params.organizationType);
  if (params.tag) url.searchParams.set('tag', params.tag);

  const data = await apiFetch<unknown>(`${url.pathname}${url.search}`, init);
  return YellowBookEntrySchema.array().parse(data);
}

/* -------------------------------------------------------
   CATEGORIES — CI дээр хоосон буцаана
--------------------------------------------------------*/
export async function fetchYellowBookCategories(init?: ApiFetchOptions): Promise<YellowBookCategory[]> {
  if (IS_CI) {
    return [];
  }

  const data = await apiFetch<unknown>('/yellow-books/categories', init);
  return YellowBookCategorySchema.array().parse(data);
}

/* -------------------------------------------------------
   DETAIL — CI дээр MOCK объект буцаана
--------------------------------------------------------*/
export async function fetchYellowBookDetail(id: string, init?: ApiFetchOptions): Promise<YellowBookEntry> {
  if (IS_CI) {
    return {
      id,
      name: "Mock байгууллага",
      summary: "",
      description: "",
      contacts: [],
      category: {
        id: "mock-category",
        name: "Mock категор",
        slug: "mock",
        description: "",
      },
      address: null,
      hours: null,
      tags: [],
      kind: "GOVERNMENT",
    } as unknown as YellowBookEntry;
  }

  const data = await apiFetch<unknown>(`/yellow-books/${id}`, init);
  return YellowBookEntrySchema.parse(data);
}

/* -------------------------------------------------------
   OTHER ENDPOINTS (CI дээр API байхгүй тул POST-уудыг skip)
--------------------------------------------------------*/
export type ReviewPayload = {
  yellowBookEntryId: string;
  rating: number;
  title: string;
  comment: string;
  userId?: string;
};

export async function submitReview(payload: ReviewPayload) {
  if (IS_CI) return { id: "ci-mock", createdAt: new Date().toISOString() };
  return apiFetch<{ id: string; createdAt: string }>('/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchReviews(entryId: string, init?: ApiFetchOptions) {
  if (IS_CI) return [];
  const data = await apiFetch<unknown>(`/reviews/${entryId}`, init);
  return data;
}

export type OrganizationRegistrationPayload = {
  name: string;
  category: string;
  city: string;
  phone: string;
  email: string;
  message?: string;
};

export async function submitOrganizationRegistration(payload: OrganizationRegistrationPayload) {
  if (IS_CI) return { id: "ci-mock", createdAt: new Date().toISOString() };
  return apiFetch<{ id: string; createdAt: string }>('/registrations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export type AdminSessionPayload = {
  email: string;
  password: string;
};

export async function requestAdminSession(payload: AdminSessionPayload) {
  if (IS_CI) return { token: "ci-token", createdAt: new Date().toISOString(), message: "CI mock" };
  return apiFetch<{ token: string; createdAt: string; message: string }>('/admin/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
