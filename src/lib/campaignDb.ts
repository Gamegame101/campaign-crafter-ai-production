// Campaign types
export interface Campaign {
  id: string;
  name: string;
  objective: string;
  target_audience: string;
  platforms: string[];
  budget: number;
  start_date: string;
  end_date: string;
  content_strategy: string;
  posting_frequency: string;
  campaign_data: any;
  status?: string;
  created_at: string;
  updated_at?: string;
}

export type CreateCampaignInput = Omit<Campaign, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCampaignInput = Partial<Campaign>;

const API_BASE = 'http://54.169.249.150:8002/api';

// Fetch all campaigns
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch(`${API_BASE}/campaigns`);
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

// Fetch single campaign by ID
export async function fetchCampaignById(id: string): Promise<Campaign | null> {
  try {
    const response = await fetch(`${API_BASE}/campaigns/${id}`);
    if (!response.ok) throw new Error('Failed to fetch campaign');
    return await response.json();
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
}

// Create a new campaign
export async function createCampaign(input: CreateCampaignInput): Promise<Campaign> {
  try {
    const response = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!response.ok) throw new Error('Failed to create campaign');
    return await response.json();
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

// Update an existing campaign
export async function updateCampaign(id: string, input: UpdateCampaignInput): Promise<Campaign> {
  try {
    const response = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!response.ok) throw new Error('Failed to update campaign');
    return await response.json();
  } catch (error) {
    console.error('Error updating campaign:', error);
    throw error;
  }
}

// Delete a campaign
export async function deleteCampaign(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to delete campaign');
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
}

// Update campaign status
export async function updateCampaignStatus(
  id: string, 
  status: Campaign['status']
): Promise<Campaign> {
  return updateCampaign(id, { status });
}
