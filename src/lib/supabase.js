import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations

export const ticketService = {
  async getAll() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(ticket) {
    const { data, error } = await supabase
      .from('tickets')
      .insert([ticket])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

export const testCaseService = {
  async getByTicketId(ticketId) {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(testCase) {
    const { data, error } = await supabase
      .from('test_cases')
      .insert([testCase])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('test_cases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('test_cases')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

export const testRunService = {
  async getByTicketId(ticketId) {
    const { data, error } = await supabase
      .from('test_runs')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('test_runs')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(testRun) {
    const { data, error } = await supabase
      .from('test_runs')
      .insert([testRun])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('test_runs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('test_runs')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

export const testRunResultService = {
  async getByTestRunId(testRunId) {
    const { data, error } = await supabase
      .from('test_run_results')
      .select('*')
      .eq('test_run_id', testRunId)
      .order('step_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async upsert(result) {
    const { data, error } = await supabase
      .from('test_run_results')
      .upsert([result], { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('test_run_results')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
