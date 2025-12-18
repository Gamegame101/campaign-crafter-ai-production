// Simple database client for local PostgreSQL
class DatabaseClient {
  private baseUrl = 'http://localhost:8001';

  async query(sql: string, params: any[] = []): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/db/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });

      if (!response.ok) {
        throw new Error(`Database query failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async select(table: string, options: {
    columns?: string[];
    where?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}): Promise<any[]> {
    const { columns = ['*'], where, orderBy, limit } = options;
    
    let sql = `SELECT ${columns.join(', ')} FROM ${table}`;
    const params: any[] = [];
    
    if (where) {
      const conditions = Object.keys(where).map((key, index) => {
        params.push(where[key]);
        return `${key} = $${index + 1}`;
      });
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    if (orderBy) {
      sql += ` ORDER BY ${orderBy.column} ${orderBy.ascending !== false ? 'ASC' : 'DESC'}`;
    }
    
    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    const result = await this.query(sql, params);
    return result.rows || [];
  }

  async insert(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`);
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    
    const result = await this.query(sql, values);
    return result.rows?.[0];
  }

  async update(table: string, id: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, index) => `${col} = $${index + 1}`);
    
    const sql = `UPDATE ${table} SET ${setClause.join(', ')}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`;
    
    const result = await this.query(sql, [...values, id]);
    return result.rows?.[0];
  }

  async delete(table: string, id: string): Promise<void> {
    const sql = `DELETE FROM ${table} WHERE id = $1`;
    await this.query(sql, [id]);
  }
}

export const db = new DatabaseClient();