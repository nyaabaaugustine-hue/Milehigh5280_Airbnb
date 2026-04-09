// Airtable CMS Client for Milehigh5280

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  console.warn('Airtable credentials not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env.local');
}

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}`;

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

export async function fetchAirtableRecords(
  table: string,
  options?: {
    filterByFormula?: string;
    sort?: Array<{ field: string; direction?: 'asc' | 'desc' }>;
    maxRecords?: number;
    pageSize?: number;
    offset?: string;
    fields?: string[];
  }
): Promise<AirtableRecord[]> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable not configured');
  }

  const params = new URLSearchParams();

  if (options?.filterByFormula) {
    params.set('filterByFormula', options.filterByFormula);
  }
  if (options?.maxRecords) {
    params.set('maxRecords', String(options.maxRecords));
  }
  if (options?.pageSize) {
    params.set('pageSize', String(options.pageSize));
  }
  if (options?.offset) {
    params.set('offset', options.offset);
  }
  if (options?.fields && options.fields.length > 0) {
    options.fields.forEach(f => params.append('fields[]', f));
  }
  if (options?.sort && options.sort.length > 0) {
    options.sort.forEach((s, i) => {
      params.set(`sort[${i}][field]`, s.field);
      if (s.direction) params.set(`sort[${i}][direction]`, s.direction);
    });
  }

  const url = `${AIRTABLE_BASE_URL}/${encodeURIComponent(table)}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function fetchAllRecords(
  table: string,
  options?: {
    filterByFormula?: string;
    sort?: Array<{ field: string; direction?: 'asc' | 'desc' }>;
    maxRecords?: number;
    fields?: string[];
  }
): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const response = await fetchAirtableRecords(table, {
      ...options,
      pageSize: 100,
      offset,
    });

    allRecords.push(...response.records);
    offset = response.offset;
  } while (offset);

  return allRecords;
}

export async function getAirtableRecord(
  table: string,
  recordId: string
): Promise<AirtableRecord> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable not configured');
  }

  const response = await fetch(`${AIRTABLE_BASE_URL}/${encodeURIComponent(table)}/${recordId}`, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status}`);
  }

  return response.json();
}

export { AIRTABLE_API_KEY, AIRTABLE_BASE_ID };
export type { AirtableRecord, AirtableResponse };
