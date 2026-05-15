import type { ApiResponse, ApiError } from '@remont/shared';

// =============================================================================
// Конфигурация
// =============================================================================

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const TOKEN_KEY = 'auth_token';

// =============================================================================
// getToken — извлекает JWT из localStorage (безопасен для SSR)
// =============================================================================

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// =============================================================================
// mapHttpStatusToErrorCode — преобразует HTTP-статус в ErrorCode
// =============================================================================

function mapHttpStatusToErrorCode(status: number): ApiError['code'] {
  switch (status) {
    case 400:
      return 'VALIDATION_ERROR';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    default:
      return 'INTERNAL_ERROR';
  }
}

// =============================================================================
// extractErrorMessage — извлекает сообщение из тела ошибки
// =============================================================================

function extractErrorMessage(body: unknown, status: number): string {
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.error === 'string') return obj.error;
  }
  return `Request failed with status ${status}`;
}

// =============================================================================
// Тип ApiClient — сигнатура с convenience-методами
// =============================================================================

interface ApiClient {
  <T>(url: string, options?: RequestInit): Promise<ApiResponse<T>>;
  get<T>(url: string): Promise<ApiResponse<T>>;
  post<T>(url: string, body: unknown): Promise<ApiResponse<T>>;
  patch<T>(url: string, body: unknown): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
}

// =============================================================================
// _fetch<T> — базовый fetch-клиент с JWT и обработкой ошибок
// =============================================================================

async function _fetch<T>(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // 204 No Content — успешный ответ без тела
    if (response.status === 204) {
      return { data: null as unknown as T, error: null };
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const apiError: ApiError = {
        code: mapHttpStatusToErrorCode(response.status),
        message: extractErrorMessage(body, response.status),
      };
      return { data: null, error: apiError };
    }

    return { data: body as T, error: null };
  } catch (err) {
    return {
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'Network error',
      },
    };
  }
}

// =============================================================================
// apiClient — экспортируемый клиент с convenience-методами
// =============================================================================

export const apiClient: ApiClient = Object.assign(_fetch, {
  get<T>(url: string): Promise<ApiResponse<T>> {
    return _fetch<T>(url, { method: 'GET' });
  },

  post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return _fetch<T>(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  patch<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    return _fetch<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return _fetch<T>(url, { method: 'DELETE' });
  },
});
