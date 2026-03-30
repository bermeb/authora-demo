export type Role = 'USER' | 'ADMIN'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  roles: Role[]
  profilePicture?: string
  createdAt: string
  lastLoginAt?: string
}

export interface AdminUserView extends UserProfile {
  enabled: boolean
  accountLocked: boolean
  lockedUntil?: string
  failedLoginAttempts: number
  oauthProvider?: string
}

export interface TokenResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
  user: UserProfile
}

export interface TokenRefreshResponse {
  success: boolean
  accessToken: string
  refreshToken: string
  tokenType: 'Bearer'
  expiresIn: number
}

export interface RegisterResponse {
  success: boolean
  message: string
  userId: string
}

export interface SuccessResponse {
  success: boolean
  message: string
}

export interface MeResponse {
  success: boolean
  user: UserProfile
}

export type AuditEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'TOKEN_REFRESHED'
  | 'OAUTH2_LOGIN'
  | 'REGISTRATION'
  | 'EMAIL_VERIFICATION'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'ACCOUNT_DISABLED'
  | 'ACCOUNT_ENABLED'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED'
  | 'USER_DELETED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INVALID_TOKEN'
  | 'SUSPICIOUS_ACTIVITY'

export interface AuditLogEntry {
  id: string
  userId?: string
  userEmail?: string
  eventType: AuditEventType
  details?: string
  ipAddress: string
  failed: boolean
  createdAt: string
}

export interface PaginatedAuditLog {
  content: AuditLogEntry[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface PaginatedUserResponse {
  content: AdminUserView[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface ProblemDetail {
  type?: string
  title?: string
  status: number
  detail?: string
  timestamp?: string
  errors?: Record<string, string>
}
