
import { toast } from "sonner";

// Define types for our mock backend system
export interface MockEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  responseData: any;
  statusCode: number;
  delay?: number; // Simulate network delay in ms
  headers?: Record<string, string>;
}

export interface MockDatabase {
  collections: Record<string, any[]>;
}

class MockBackendService {
  private endpoints: MockEndpoint[] = [];
  private db: MockDatabase = { collections: {} };
  
  constructor() {
    // Initialize with some default endpoints
    this.endpoints = [
      {
        path: '/api/hello',
        method: 'GET',
        responseData: { message: 'Hello from mock backend!' },
        statusCode: 200,
        delay: 300
      }
    ];
    
    // Initialize with some default collections
    this.db = {
      collections: {
        users: [
          { id: 1, name: 'John Doe', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
        ],
        posts: [
          { id: 1, title: 'First Post', content: 'Hello world!', userId: 1 },
          { id: 2, title: 'Second Post', content: 'Another post', userId: 2 }
        ]
      }
    };
  }
  
  // Register a new endpoint
  public addEndpoint(endpoint: MockEndpoint): void {
    this.endpoints.push(endpoint);
    toast.success(`Added mock endpoint: ${endpoint.method} ${endpoint.path}`);
  }
  
  // Remove an endpoint
  public removeEndpoint(path: string, method: string): void {
    this.endpoints = this.endpoints.filter(
      e => !(e.path === path && e.method === method)
    );
  }
  
  // Get list of all registered endpoints
  public getEndpoints(): MockEndpoint[] {
    return [...this.endpoints];
  }
  
  // Simulate a fetch request to our mock backend
  public async fetch(path: string, options: RequestInit = {}): Promise<Response> {
    const method = (options.method || 'GET') as MockEndpoint['method'];
    
    // Find matching endpoint
    const endpoint = this.endpoints.find(e => e.path === path && e.method === method);
    
    if (!endpoint) {
      console.error(`No mock endpoint found for: ${method} ${path}`);
      return new Response(
        JSON.stringify({ error: 'Not Found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Simulate network delay
    if (endpoint.delay) {
      await new Promise(resolve => setTimeout(resolve, endpoint.delay));
    }
    
    // Create response headers
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...endpoint.headers
    });
    
    // Return mock response
    return new Response(
      JSON.stringify(endpoint.responseData),
      { status: endpoint.statusCode, headers }
    );
  }
  
  // Database operations
  public getCollection(name: string): any[] {
    return this.db.collections[name] || [];
  }
  
  public addCollection(name: string, initialData: any[] = []): void {
    if (!this.db.collections[name]) {
      this.db.collections[name] = initialData;
      toast.success(`Created collection: ${name}`);
    }
  }
  
  public addItem(collection: string, item: any): any {
    if (!this.db.collections[collection]) {
      this.addCollection(collection);
    }
    
    // Auto-generate ID if not provided
    if (!item.id) {
      const maxId = Math.max(0, ...this.db.collections[collection].map(i => i.id || 0));
      item.id = maxId + 1;
    }
    
    this.db.collections[collection].push(item);
    return item;
  }
  
  public updateItem(collection: string, id: number | string, updates: any): any | null {
    if (!this.db.collections[collection]) return null;
    
    const index = this.db.collections[collection].findIndex(item => item.id === id);
    if (index === -1) return null;
    
    const updatedItem = { ...this.db.collections[collection][index], ...updates };
    this.db.collections[collection][index] = updatedItem;
    return updatedItem;
  }
  
  public deleteItem(collection: string, id: number | string): boolean {
    if (!this.db.collections[collection]) return false;
    
    const initialLength = this.db.collections[collection].length;
    this.db.collections[collection] = this.db.collections[collection].filter(item => item.id !== id);
    
    return initialLength !== this.db.collections[collection].length;
  }
}

// Create singleton instance
export const mockBackend = new MockBackendService();

// Mock fetch function that can be injected into the preview iframe
export function createMockFetchForIframe(): string {
  return `
    // Mock fetch implementation
    window.originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      console.log('[MockBackend] Intercepted fetch request:', url, options);
      
      // Only intercept API requests (starting with /api)
      if (url.toString().startsWith('/api')) {
        try {
          // Send message to parent with request info
          window.parent.postMessage({
            type: 'mock-fetch',
            url: url.toString(),
            options
          }, '*');
          
          // Wait for response from parent
          const response = await new Promise((resolve) => {
            const handler = (event) => {
              if (event.data && event.data.type === 'mock-fetch-response' && event.data.url === url.toString()) {
                window.removeEventListener('message', handler);
                resolve(event.data.response);
              }
            };
            window.addEventListener('message', handler);
          });
          
          console.log('[MockBackend] Received mock response:', response);
          
          return new Response(
            JSON.stringify(response.data),
            {
              status: response.status,
              headers: response.headers
            }
          );
        } catch (error) {
          console.error('[MockBackend] Error:', error);
          return new Response(
            JSON.stringify({ error: 'Mock backend error' }),
            { status: 500 }
          );
        }
      }
      
      // For non-API requests, use the original fetch
      return window.originalFetch(url, options);
    };
    
    console.log('[MockBackend] Mock fetch installed');
  `;
}
