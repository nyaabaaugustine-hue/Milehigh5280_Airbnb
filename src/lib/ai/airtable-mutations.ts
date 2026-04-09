// ─── Airtable Mutation Client ─────────────────────────────────────────────────
// Handles CREATE, UPDATE, DELETE operations against Airtable.
// READ operations are in client.ts — this file is write-only.

const AIRTABLE_BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

function headers() {
  return {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

/** Update one or more fields on an existing Airtable record */
export async function updateAirtableRecord(
  table: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const res = await fetch(
    `${AIRTABLE_BASE_URL}/${encodeURIComponent(table)}/${recordId}`,
    {
      method:  'PATCH',
      headers: headers(),
      body:    JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable PATCH failed (${res.status}): ${err}`);
  }

  return res.json();
}

/** Create a new record in an Airtable table */
export async function createAirtableRecord(
  table: string,
  fields: Record<string, unknown>,
): Promise<{ id: string; fields: Record<string, unknown> }> {
  const res = await fetch(
    `${AIRTABLE_BASE_URL}/${encodeURIComponent(table)}`,
    {
      method:  'POST',
      headers: headers(),
      body:    JSON.stringify({ fields }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable POST failed (${res.status}): ${err}`);
  }

  return res.json();
}

/** Delete a record from Airtable */
export async function deleteAirtableRecord(
  table: string,
  recordId: string,
): Promise<void> {
  const res = await fetch(
    `${AIRTABLE_BASE_URL}/${encodeURIComponent(table)}/${recordId}`,
    {
      method:  'DELETE',
      headers: headers(),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable DELETE failed (${res.status}): ${err}`);
  }
}

/** Fetch all records from a table (used for bulk operations) */
export async function fetchAllForMutation(
  table: string,
): Promise<Array<{ id: string; fields: Record<string, unknown> }>> {
  const records: Array<{ id: string; fields: Record<string, unknown> }> = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: '100' });
    if (offset) params.set('offset', offset);

    const res = await fetch(
      `${AIRTABLE_BASE_URL}/${encodeURIComponent(table)}?${params}`,
      { headers: headers() },
    );

    if (!res.ok) throw new Error(`Airtable fetch failed (${res.status})`);

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}
