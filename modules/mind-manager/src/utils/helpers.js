export function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  function getRandomHex(length) {
    let result = "";
    const chars = "0123456789abcdef";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
  }

  const timestamp = getRandomHex(32).toString(16).padStart(12, "0");
  const randomPart = getRandomHex(8);

  const timeLow = timestamp.slice(0, 8);
  const timeMid = timestamp.slice(8, 12);
  const timeHiAndVersion = "4" + getRandomHex(3);
  const clockSeqHiAndReserved = getRandomHex(3);
  const node = getRandomHex(6) + randomPart.slice(0, 6);

  return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}-${node}`;
}

export function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function todayISO() {
  return formatDate(new Date());
}

export function validateAndNormalizeUrl(rawUrl) {
  const trimmed = (rawUrl || "").trim();

  if (!trimmed) {
    throw new Error("URL is required for bookmark");
  }

  // Reject strings without a dot or proper domain structure (e.g., plain words/gibberish)
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

  if (!urlPattern.test(trimmed)) {
    throw new Error(
      "Invalid URL format. Please enter a valid web address (e.g., https://example.com)",
    );
  }

  try {
    // If it lacks http/https, prepend it for URL constructor validation
    const targetUrl = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const parsed = new URL(targetUrl);

    // Ensure host actually contains a domain extension
    if (!parsed.hostname.includes(".")) {
      throw new Error("Invalid domain name");
    }

    return parsed.href;
  } catch (err) {
    throw new Error(
      "Invalid URL format. Please enter a valid web address (e.g., https://example.com)",
    );
  }
}

export function sanitizeTagIds(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => {
      if (typeof tag === "object" && tag !== null) {
        return String(tag.id || tag.value || "");
      }
      return String(tag || "").trim();
    })
    .filter(Boolean);
}

export function mapTagIdsToObjects(tagIds = [], globalTags = []) {
  if (!Array.isArray(tagIds)) return [];
  return tagIds
    .map((id) => globalTags.find((t) => t.id === id))
    .filter(Boolean);
}

export function processTagPipeline(
  componentItems = [],
  existingTags = [],
  entityType = null,
) {
  const updatedGlobalTags = existingTags.map((tag) => ({ ...tag }));
  const assignedTagIds = [];

  componentItems.forEach((item) => {
    const isNewFlag = typeof item === "object" && (item.isNew || !item.id);
    const itemTitle = typeof item === "object" ? item.name : item;

    if (!itemTitle) return;

    const normalizedTitle = itemTitle.trim().toLowerCase();

    let match = null;
    if (typeof item === "object" && item.id && !isNewFlag) {
      match = updatedGlobalTags.find((t) => t.id === item.id);
    }

    if (!match) {
      match = updatedGlobalTags.find(
        (t) => t.name.toLowerCase() === normalizedTitle,
      );
    }

    if (isNewFlag && !match) {
      const newTag = {
        id: generateId(),
        name: itemTitle.trim(),
        entityTypes: entityType ? [entityType] : [],
      };
      updatedGlobalTags.push(newTag);
      assignedTagIds.push(newTag.id);
    } else if (match) {
      if (!Array.isArray(match.entityTypes)) {
        match.entityTypes = [];
      }
      if (entityType && !match.entityTypes.includes(entityType)) {
        match.entityTypes.push(entityType);
      }
      assignedTagIds.push(match.id);
    }
  });

  return {
    assignedTagIds,
    updatedGlobalTags,
  };
}

export function syncTagEntityTypes(
  tags = [],
  entityType = null,
  entityItems = [],
) {
  if (!entityType || !Array.isArray(entityItems)) return tags;

  const activeTagIdsInEntity = new Set(
    entityItems.flatMap((item) => item.tagIds || []),
  );

  return tags.map((tag) => {
    const entityTypes = Array.isArray(tag.entityTypes) ? tag.entityTypes : [];
    if (entityTypes.includes(entityType) && !activeTagIdsInEntity.has(tag.id)) {
      return {
        ...tag,
        entityTypes: entityTypes.filter((et) => et !== entityType),
      };
    }
    return tag;
  });
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
