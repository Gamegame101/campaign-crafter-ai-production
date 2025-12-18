import { Organization, Product, Service } from "@/lib/mockData";

const API_BASE = 'http://54.169.249.150:8002/api';

// Organization CRUD operations
export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await fetch(`${API_BASE}/organizations`);
    if (!response.ok) throw new Error('Failed to fetch organizations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

export const createOrganization = async (org: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> => {
  try {
    const response = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(org)
    });
    if (!response.ok) throw new Error('Failed to create organization');
    return await response.json();
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

export const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<Organization> => {
  try {
    const response = await fetch(`${API_BASE}/organizations?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() })
    });
    if (!response.ok) throw new Error('Failed to update organization');
    return await response.json();
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};

export const deleteOrganization = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/organizations?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to delete organization');
  } catch (error) {
    console.error('Error deleting organization:', error);
    throw error;
  }
};

// Product CRUD operations
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (product: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  try {
    const response = await fetch(`${API_BASE}/products?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() })
    });
    if (!response.ok) throw new Error('Failed to update product');
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/products?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to delete product');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Service CRUD operations
export const getServices = async (): Promise<Service[]> => {
  try {
    const response = await fetch(`${API_BASE}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const createService = async (service: Omit<Service, 'id' | 'created_at'>): Promise<Service> => {
  try {
    const response = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(service)
    });
    if (!response.ok) throw new Error('Failed to create service');
    return await response.json();
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (id: string, updates: Partial<Service>): Promise<Service> => {
  try {
    const response = await fetch(`${API_BASE}/services?id=eq.${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, updated_at: new Date().toISOString() })
    });
    if (!response.ok) throw new Error('Failed to update service');
    return await response.json();
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/services?id=eq.${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to delete service');
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};