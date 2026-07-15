// ---------- AI Studio types ----------

export type ConnectionStatus = "active" | "inactive" | "error";
export type HealthStatus = "healthy" | "degraded" | "down" | "unknown";

// ---------- LLM Connections ----------

export type LLMProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "grok"
  | "deepseek"
  | "mistral"
  | "cohere"
  | "openrouter"
  | "azure-openai"
  | "ollama"
  | "custom";

export interface LLMModelConfig {
  defaultModel: string;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  maxTokens: number;
  streaming: boolean;
  jsonMode: boolean;
  visionEnabled: boolean;
  functionCalling: boolean;
  reasoningMode: "off" | "low" | "medium" | "high";
  timeoutSeconds: number;
  retryCount: number;
  rateLimitRpm: number;
  fallbackModel: string;
}

export interface LLMConnection {
  id: string;
  name: string;
  description: string;
  tags: string[];
  provider: LLMProvider;
  // Auth
  apiKey: string;
  organizationId: string;
  projectId: string;
  baseUrl: string;
  keyValidated: boolean;
  // Model config
  config: LLMModelConfig;
  // Meta / status
  status: ConnectionStatus;
  health: HealthStatus;
  contextWindow: number;
  lastTestedAt: string | null;
  estimatedCostPer1k: number; // USD per 1K tokens (blended estimate)
  usedByAgentIds: string[];
  createdBy: string;
  createdAt: string;
}

// ---------- MCP Servers ----------

export type MCPCategory =
  | "filesystem"
  | "github"
  | "gitlab"
  | "slack"
  | "jira"
  | "browser"
  | "google-drive"
  | "notion"
  | "sharepoint"
  | "database"
  | "salesforce"
  | "sap"
  | "microsoft-365"
  | "aws"
  | "azure"
  | "confluence"
  | "custom";

export type MCPEnvironment = "development" | "qa" | "production";

export type MCPTransport = "stdio" | "http" | "https" | "sse" | "websocket";

export type MCPAuthType =
  | "none"
  | "api_key"
  | "bearer"
  | "oauth"
  | "jwt"
  | "basic"
  | "client_cert";

export type MCPToolPermission = "read" | "write" | "admin";

export type MCPRetryStrategy = "none" | "fixed" | "exponential";

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  category: string; // tool group, e.g. "Repository", "Issue Management"
  version: string;
  permission: MCPToolPermission;
  enabled: boolean;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface MCPAuthCredentials {
  apiKey: string;
  bearerToken: string;
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
}

export interface MCPSecurityOptions {
  verifySSL: boolean;
  allowSelfSigned: boolean;
  encryptCredentials: boolean;
}

export interface MCPConnectionSettings {
  autoSyncTools: boolean;
  healthMonitoring: boolean;
  connectionLogging: boolean;
  autoRefreshToolList: boolean;
  toolUsageTracking: boolean;
  rateLimiting: boolean;
  maxConcurrentRequests: number;
  maxToolCallsPerRequest: number;
  connectionTimeoutSeconds: number;
  retryStrategy: MCPRetryStrategy;
  retryAttempts: number;
}

export interface MCPServer {
  id: string;
  // Basic information
  name: string; // internal server name
  displayName: string;
  description: string;
  category: MCPCategory;
  tags: string[];
  version: string;
  environment: MCPEnvironment;
  icon: string; // emoji
  // Connection configuration
  transport: MCPTransport;
  endpointUrl: string; // MCP endpoint URL (non-stdio)
  baseUrl: string;
  healthCheckEndpoint: string;
  command: string; // stdio
  workingDirectory: string;
  port: string;
  timeoutSeconds: number;
  retryCount: number;
  autoReconnect: boolean;
  // Authentication & security
  authType: MCPAuthType;
  credentials: MCPAuthCredentials;
  headersJson: string; // additional headers as JSON
  envVars: KeyValuePair[];
  secretVars: KeyValuePair[];
  security: MCPSecurityOptions;
  certificate: string;
  // Connection settings
  settings: MCPConnectionSettings;
  // Tools
  tools: MCPTool[];
  serverVersion: string;
  protocolVersion: string;
  // Meta / status
  status: ConnectionStatus;
  health: HealthStatus;
  usedByAgentIds: string[];
  lastTestedAt: string | null;
  lastSyncedAt: string | null;
  lastConnectedAt: string | null;
  updatedAt: string;
  createdBy: string;
  createdAt: string;
}

export interface MCPTestResult {
  connected: boolean;
  serverVersion: string;
  protocolVersion: string;
  authSuccessful: boolean;
  toolCount: number;
  latencyMs: number;
  executionTimeSec: number;
  health: HealthStatus;
  logs: string[];
}

// ---------- API Connections ----------

export type APIAuthType = "api_key" | "bearer" | "oauth" | "jwt" | "basic";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface APIEndpoint {
  id: string;
  method: HTTPMethod;
  path: string;
  description: string;
  enabled: boolean;
}

export interface APIConnection {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  baseUrl: string;
  // Auth
  authType: APIAuthType;
  authValue: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  secretVars: KeyValuePair[];
  // Endpoints
  endpoints: APIEndpoint[];
  // Meta / status
  status: ConnectionStatus;
  lastUsedAt: string | null;
  usedByAgentIds: string[];
  createdBy: string;
  createdAt: string;
}

// ---------- Agents ----------

export type AgentVisibility = "private" | "team" | "public";
export type AgentStatus = "draft" | "active" | "inactive" | "archived";

export type DeploymentTarget =
  | "web-chat"
  | "rest-api"
  | "embed-widget"
  | "slack"
  | "ms-teams";

export interface AgentInstructions {
  systemPrompt: string;
  goal: string;
  persona: string;
  tone: string;
  instructions: string;
  constraints: string;
  responseFormat: string;
  enableMemory: boolean;
  enableHistory: boolean;
  enableCitations: boolean;
  enableToolCalling: boolean;
}

export type AgentMCPPermissionMode = "read_only" | "read_write" | "custom";

export interface AgentMCPApprovalRules {
  create: boolean;
  update: boolean;
  delete: boolean;
  admin: boolean;
}

export interface AgentMCPSelection {
  mcpServerId: string;
  toolIds: string[]; // subset of the server's enabled tools
  // Agent-level permissions
  permissionMode: AgentMCPPermissionMode;
  // Execution settings
  maxToolCalls: number;
  toolTimeoutSeconds: number;
  retryFailedCalls: boolean;
  parallelExecution: boolean;
  toolCaching: boolean;
  logToolCalls: boolean;
  // Approval rules — require user approval before these actions
  approvalRules: AgentMCPApprovalRules;
  // Priority when multiple MCP servers are attached
  toolPriority: "high" | "medium" | "low";
}

export interface AgentAPISelection {
  apiConnectionId: string;
  endpointIds: string[];
  // Execution settings
  timeoutSeconds: number;
  retryCount: number;
  rateLimitRpm: number;
}

export type AgentResourceType = "mcp" | "api" | null;

export type DeploymentStatus = "draft" | "deploying" | "live" | "failed";

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string; // emoji
  version: string;
  status: AgentStatus;
  // Resources
  llmConnectionId: string | null;
  fallbackLLMConnectionId: string | null;
  resourceType: AgentResourceType; // one external resource: MCP or API
  mcpSelections: AgentMCPSelection[];
  apiSelections: AgentAPISelection[];
  // Intelligence
  instructions: AgentInstructions;
  // Deployment
  visibility: AgentVisibility;
  deploymentTargets: DeploymentTarget[];
  deployed: boolean;
  deploymentStatus: DeploymentStatus;
  agentUrl: string;
  chatUrl: string;
  apiEndpoint: string;
  apiKey: string;
  embedCode: string;
  // Wizard state (for resuming drafts)
  wizardStep: number;
  // Meta
  totalRuns: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Marketplace ----------

export interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  llmLabel: string;
  mcpLabels: string[];
  apiLabels: string[];
  downloads: number;
  rating: number; // 0-5
  updatedAt: string;
  verified: boolean;
  featured: boolean;
  isNew: boolean;
  icon: string;
}

// ---------- Test / playground results ----------

export interface LLMTestResult {
  success: boolean;
  response: string;
  modelUsed: string;
  tokensUsed: number;
  responseTimeMs: number;
  estimatedCost: number;
  health: HealthStatus;
}

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  // execution details (assistant messages only)
  llmLabel?: string;
  mcpCalls?: string[];
  apiCalls?: string[];
  timeline?: { step: string; ms: number }[];
  responseTimeMs?: number;
  toolExecutionMs?: number;
  tokensUsed?: number;
  estimatedCost?: number;
  error?: string;
}
