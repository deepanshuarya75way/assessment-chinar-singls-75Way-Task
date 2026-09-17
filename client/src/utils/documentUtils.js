/**
 * Helper utilities for resolving and previewing uploaded documents.
 *
 * Documents are sensitive (identity proofs), so the backend only serves them
 * through authenticated endpoints. Browser <img>/<object> tags and
 * window.open() cannot attach an Authorization header, so previews fetch the
 * file as an authenticated Blob via the shared API client and render it
 * through a temporary object URL instead of a raw URL. No JWT is ever placed
 * in a URL, query string, or browser-visible document location.
 */
import { requestBlob } from '../services/api';

/**
 * Authenticated endpoint that serves a document for a teacher application
 * or teacher profile (the backend resolves both from the same id). */
export const getDocumentEndpoint = (ownerId, docType) =>
  `/admin/applications/${ownerId}/documents/${docType}`;

/** Fetches a document through the authenticated API client and returns a
 * temporary blob: object URL usable in <img>, <object> and window.open().
 * Callers MUST revoke the returned URL when done (URL.revokeObjectURL). */
export const fetchDocumentObjectUrl = async (ownerId, docType) => {
  if (!ownerId || !docType) throw new Error('Unable to load this document.');
  const blob = await requestBlob(getDocumentEndpoint(ownerId, docType));
  return URL.createObjectURL(blob);
};

/** Opens a document in a new browser tab (authenticated, no tokens in URLs).
 * The object URL is revoked after 60s — enough time for the tab to load. */
export const openDocumentInNewTab = async (ownerId, docType) => {
  const objectUrl = await fetchDocumentObjectUrl(ownerId, docType);
  window.open(objectUrl, '_blank', 'noopener,noreferrer');
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60 * 1000);
  return objectUrl;
};

export const getDocumentInfo = (appOrProfile, type) => {
  if (!appOrProfile) return null;

  if (type === 'idProof') {
    const doc = appOrProfile.documents?.idProof;
    const url = doc?.url || appOrProfile.idProof;
    if (!url) return null;
    return {
      type: 'idProof',
      url,
      fileName: doc?.fileName || url.split('/').pop() || 'ID_Proof',
      mimeType: doc?.mimeType || (url.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png'),
      title: 'Identity Proof',
    };
  }

  if (type === 'highestDegree' || type === 'certificate') {
    const doc = appOrProfile.documents?.highestDegree || appOrProfile.documents?.certificate;
    const url = doc?.url || appOrProfile.certificate;
    if (!url) return null;
    return {
      type: type === 'certificate' ? 'certificate' : 'highestDegree',
      url,
      fileName: doc?.fileName || url.split('/').pop() || 'Degree_Certificate',
      mimeType: doc?.mimeType || (url.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/png'),
      title: 'Highest Degree / Certificate',
    };
  }

  return null;
};

