// ─── Tool Executor ────────────────────────────────────────────────────────────
// This is the ONLY place where AI-requested actions are actually executed.
// Every execution requires an approved ActionLog entry.
// Each handler captures before/after values for audit and undo.

import type {
  ActionLog,
  ExecutionResult,
  UpdateContentInput,
  UpdatePropertyInput,
  UpdatePropertyPriceInput,
  BulkUpdatePricesInput,
  CreatePropertyInput,
  UpdateContactInfoInput,
  PublishBlogPostInput,
  ApproveReviewInput,
  DeleteReviewInput,
  TogglePropertyLiveInput,
  ToolName,
} from './types';

import {
  updateAirtableRecord,
  createAirtableRecord,
  deleteAirtableRecord,
  fetchAllForMutation,
} from './airtable-mutations';

import { markExecuted, markFailed } from './logger';

const USD_TO_GHS = 15.8;

// ─── Main dispatcher ──────────────────────────────────────────────────────────

export async function executeAction(log: ActionLog): Promise<ExecutionResult> {
  if (log.status !== 'approved') {
    return { success: false, logId: log.id, message: 'Action must be approved before execution.' };
  }

  try {
    const result = await dispatch(log);
    await markExecuted(log.id, {
      before:           result.before,
      after:            result.after,
      airtableRecordId: result.airtableRecordId,
    });
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    await markFailed(log.id, msg);
    return { success: false, logId: log.id, message: `Execution failed: ${msg}` };
  }
}

async function dispatch(log: ActionLog): Promise<ExecutionResult> {
  switch (log.tool as ToolName) {
    case 'updateContent':
      return executeUpdateContent(log.id, log.input as UpdateContentInput);

    case 'updateContactInfo':
      return executeUpdateContactInfo(log.id, log.input as UpdateContactInfoInput);

    case 'updateProperty':
      return executeUpdateProperty(log.id, log.input as UpdatePropertyInput);

    case 'updatePropertyPrice':
      return executeUpdatePropertyPrice(log.id, log.input as UpdatePropertyPriceInput);

    case 'bulkUpdatePrices':
      return executeBulkUpdatePrices(log.id, log.input as BulkUpdatePricesInput);

    case 'createProperty':
      return executeCreateProperty(log.id, log.input as CreatePropertyInput);

    case 'togglePropertyLive':
      return executeTogglePropertyLive(log.id, log.input as TogglePropertyLiveInput);

    case 'publishBlogPost':
    case 'unpublishBlogPost':
      return executeToggleBlogPost(log.id, log.input as PublishBlogPostInput, log.tool === 'publishBlogPost');

    case 'approveReview':
      return executeApproveReview(log.id, log.input as ApproveReviewInput);

    case 'deleteReview':
      return executeDeleteReview(log.id, log.input as DeleteReviewInput);

    default:
      throw new Error(`Unknown tool: ${log.tool}`);
  }
}

// ─── Individual Handlers ──────────────────────────────────────────────────────

async function executeUpdateContent(
  logId: string,
  input: UpdateContentInput,
): Promise<ExecutionResult> {
  // Find the record in the Site Content table matching the key
  const records = await fetchAllForMutation('Site Content');
  const existing = records.find(r => (r.fields['Key'] as string) === input.key);

  if (existing) {
    const before = { [input.key]: existing.fields['Value'] };
    await updateAirtableRecord('Site Content', existing.id, { Value: input.value });
    return {
      success:           true,
      logId,
      message:           `Updated "${input.key}" in section "${input.section}"`,
      airtableRecordId:  existing.id,
      before,
      after:             { [input.key]: input.value },
    };
  }

  // Create new content record if not found
  const created = await createAirtableRecord('Site Content', {
    Key:     input.key,
    Value:   input.value,
    Section: input.section,
  });
  return {
    success:           true,
    logId,
    message:           `Created content "${input.key}" in section "${input.section}"`,
    airtableRecordId:  created.id,
    before:            {},
    after:             { [input.key]: input.value },
  };
}

async function executeUpdateContactInfo(
  logId: string,
  input: UpdateContactInfoInput,
): Promise<ExecutionResult> {
  const fieldMap: Record<string, string> = {
    phone:    'Phone',
    whatsapp: 'WhatsApp',
    email:    'Email',
    location: 'Location',
  };

  const records = await fetchAllForMutation('Settings');
  const contactRecord = records.find(r => r.fields['Type'] === 'contact');

  if (!contactRecord) {
    // Create the settings record
    const created = await createAirtableRecord('Settings', {
      Type:              'contact',
      [fieldMap[input.field]]: input.value,
    });
    return {
      success:          true,
      logId,
      message:          `Contact ${input.field} set to "${input.value}"`,
      airtableRecordId: created.id,
      before:           {},
      after:            { [input.field]: input.value },
    };
  }

  const before = { [input.field]: contactRecord.fields[fieldMap[input.field]] };
  await updateAirtableRecord('Settings', contactRecord.id, {
    [fieldMap[input.field]]: input.value,
  });

  return {
    success:          true,
    logId,
    message:          `Contact ${input.field} updated to "${input.value}"`,
    airtableRecordId: contactRecord.id,
    before,
    after:            { [input.field]: input.value },
  };
}

async function executeUpdateProperty(
  logId: string,
  input: UpdatePropertyInput,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Properties');
  const prop = records.find(r =>
    r.id === input.propertyId ||
    (r.fields['ID'] as string) === input.propertyId,
  );

  if (!prop) throw new Error(`Property not found: ${input.propertyId}`);

  const before: Record<string, unknown> = {};
  const airtableFields: Record<string, unknown> = {};

  if (input.updates.name !== undefined) {
    before.name = prop.fields['Name'];
    airtableFields['Name'] = input.updates.name;
  }
  if (input.updates.tagline !== undefined) {
    before.tagline = prop.fields['Tagline'];
    airtableFields['Tagline'] = input.updates.tagline;
  }
  if (input.updates.description !== undefined) {
    before.description = prop.fields['Description'];
    airtableFields['Description'] = input.updates.description;
  }
  if (input.updates.pricePerNight !== undefined) {
    before.pricePerNight = prop.fields['Price Per Night'];
    airtableFields['Price Per Night'] = input.updates.pricePerNight;
  }
  if (input.updates.badge !== undefined) {
    before.badge = prop.fields['Badge'];
    airtableFields['Badge'] = input.updates.badge;
  }

  await updateAirtableRecord('Properties', prop.id, airtableFields);

  return {
    success:          true,
    logId,
    message:          `Property "${prop.fields['Name']}" updated`,
    airtableRecordId: prop.id,
    before,
    after:            input.updates as Record<string, unknown>,
  };
}

async function executeUpdatePropertyPrice(
  logId: string,
  input: UpdatePropertyPriceInput,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Properties');
  const prop = records.find(r =>
    r.id === input.propertyId ||
    (r.fields['ID'] as string) === input.propertyId,
  );

  if (!prop) throw new Error(`Property not found: ${input.propertyId}`);

  const before = {
    priceUSD: prop.fields['Price Per Night'],
    priceGHS: prop.fields['Price Per Night GHS'],
  };

  const newGHS = input.newPriceGHS ?? Math.round(input.newPriceUSD * USD_TO_GHS);

  await updateAirtableRecord('Properties', prop.id, {
    'Price Per Night':     input.newPriceUSD,
    'Price Per Night GHS': newGHS,
  });

  return {
    success:          true,
    logId,
    message:          `Price updated to $${input.newPriceUSD} / GHS ${newGHS}`,
    airtableRecordId: prop.id,
    before,
    after:            { priceUSD: input.newPriceUSD, priceGHS: newGHS },
  };
}

async function executeBulkUpdatePrices(
  logId: string,
  input: BulkUpdatePricesInput,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Properties');
  const multiplier = 1 + input.percentageChange / 100;

  const updates: Array<{ id: string; before: Record<string, unknown>; after: Record<string, unknown> }> = [];

  for (const prop of records) {
    const currentUSD = prop.fields['Price Per Night'] as number ?? 0;
    const currentGHS = prop.fields['Price Per Night GHS'] as number ?? 0;

    const fields: Record<string, unknown> = {};
    const before: Record<string, unknown> = {};
    const after: Record<string, unknown> = {};

    if (input.currency === 'USD' || input.currency === 'both') {
      before.priceUSD = currentUSD;
      const newUSD = Math.round(currentUSD * multiplier);
      fields['Price Per Night'] = newUSD;
      after.priceUSD = newUSD;
    }
    if (input.currency === 'GHS' || input.currency === 'both') {
      before.priceGHS = currentGHS;
      const newGHS = Math.round(currentGHS * multiplier);
      fields['Price Per Night GHS'] = newGHS;
      after.priceGHS = newGHS;
    }

    await updateAirtableRecord('Properties', prop.id, fields);
    updates.push({ id: prop.id, before, after });
  }

  return {
    success: true,
    logId,
    message: `Bulk price ${input.percentageChange > 0 ? 'increase' : 'decrease'} of ${Math.abs(input.percentageChange)}% applied to ${records.length} properties`,
    before:  { updates: updates.map(u => u.before) },
    after:   { updates: updates.map(u => u.after) },
  };
}

async function executeCreateProperty(
  logId: string,
  input: CreatePropertyInput,
): Promise<ExecutionResult> {
  const created = await createAirtableRecord('Properties', {
    'Name':            input.name,
    'Tagline':         input.tagline,
    'Description':     input.description,
    'Price Per Night': input.pricePerNight,
    'Price Per Night GHS': Math.round(input.pricePerNight * USD_TO_GHS),
    'Location':        input.location,
    'Bedrooms':        input.bedrooms,
    'Bathrooms':       input.bathrooms,
    'Guests':          input.guests,
    'Type':            input.type,
    'Is Live':         false,
  });

  return {
    success:          true,
    logId,
    message:          `New property "${input.name}" created (unpublished)`,
    airtableRecordId: created.id,
    before:           {},
    after:            { name: input.name, pricePerNight: input.pricePerNight },
  };
}

async function executeTogglePropertyLive(
  logId: string,
  input: TogglePropertyLiveInput,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Properties');
  const prop = records.find(r =>
    r.id === input.propertyId ||
    (r.fields['ID'] as string) === input.propertyId,
  );

  if (!prop) throw new Error(`Property not found: ${input.propertyId}`);

  const before = { isLive: prop.fields['Is Live'] };
  await updateAirtableRecord('Properties', prop.id, { 'Is Live': input.isLive });

  return {
    success:          true,
    logId,
    message:          `Property "${prop.fields['Name']}" is now ${input.isLive ? 'LIVE ✅' : 'UNPUBLISHED ⛔'}`,
    airtableRecordId: prop.id,
    before,
    after:            { isLive: input.isLive },
  };
}

async function executeToggleBlogPost(
  logId: string,
  input: PublishBlogPostInput,
  publish: boolean,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Blog Posts');
  const post = records.find(r =>
    r.id === input.postId ||
    (r.fields['ID'] as string) === input.postId,
  );

  if (!post) throw new Error(`Blog post not found: ${input.postId}`);

  const before = { published: post.fields['Published'] };
  await updateAirtableRecord('Blog Posts', post.id, { Published: publish });

  return {
    success:          true,
    logId,
    message:          `Blog post "${post.fields['Title']}" ${publish ? 'published ✅' : 'unpublished ⛔'}`,
    airtableRecordId: post.id,
    before,
    after:            { published: publish },
  };
}

async function executeApproveReview(
  logId: string,
  input: ApproveReviewInput,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Reviews');
  const review = records.find(r =>
    r.id === input.reviewId ||
    (r.fields['ID'] as string) === input.reviewId,
  );

  if (!review) throw new Error(`Review not found: ${input.reviewId}`);

  const before = { verified: review.fields['Verified'] };
  await updateAirtableRecord('Reviews', review.id, { Verified: true });

  return {
    success:          true,
    logId,
    message:          `Review by "${review.fields['Author']}" approved ✅`,
    airtableRecordId: review.id,
    before,
    after:            { verified: true },
  };
}

async function executeDeleteReview(
  logId: string,
  input: DeleteReviewInput,
): Promise<ExecutionResult> {
  const records = await fetchAllForMutation('Reviews');
  const review = records.find(r =>
    r.id === input.reviewId ||
    (r.fields['ID'] as string) === input.reviewId,
  );

  if (!review) throw new Error(`Review not found: ${input.reviewId}`);

  const before = { ...review.fields };
  await deleteAirtableRecord('Reviews', review.id);

  return {
    success:          true,
    logId,
    message:          `Review by "${review.fields['Author']}" permanently deleted`,
    airtableRecordId: review.id,
    before,
    after:            {},
  };
}
