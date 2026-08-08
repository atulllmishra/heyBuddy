import { API_BASE_URL } from '../config';

/**
 * YouTube-Grade Telemetry Client SDK
 * 
 * Communicates with backend ingestion pipeline (/api/v3/telemetry/event)
 * and fetches real-time telemetry stats from Bigtable, Redis G-Counters, and HyperLogLog.
 */

// Generate or retrieve persistent visitor ID for HyperLogLog unique estimation
const getVisitorId = () => {
  let vId = localStorage.getItem('heybuddy_visitor_id');
  if (!vId) {
    vId = 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('heybuddy_visitor_id', vId);
  }
  return vId;
};

export const sendTelemetryEvent = async ({ videoId = 'default_video', type, action = 'add' }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v3/telemetry/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        type,
        action,
        visitorId: getVisitorId(),
        region: 'ap-south-1'
      })
    });
    return await res.json();
  } catch (err) {
    console.warn('[TelemetryClient] Event ingest warning:', err);
    return { success: false };
  }
};

export const fetchVideoStats = async (videoId = 'default_video') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v3/videos/stats?videoId=${encodeURIComponent(videoId)}`);
    const json = await res.json();
    if (json.statistics) return json;
    return null;
  } catch (err) {
    console.warn('[TelemetryClient] Fetch video stats warning:', err);
    return null;
  }
};

export const fetchChannelStats = async (channelId = 'heybuddy_official') => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v3/channels/stats?channelId=${encodeURIComponent(channelId)}`);
    const json = await res.json();
    if (json.statistics) return json;
    return null;
  } catch (err) {
    console.warn('[TelemetryClient] Fetch channel stats warning:', err);
    return null;
  }
};

export const subscribeTelemetryStream = (videoId, onUpdate) => {
  if (typeof window === 'undefined' || !('EventSource' in window)) return null;

  try {
    const sseUrl = `${API_BASE_URL}/api/v3/telemetry/stream?videoId=${encodeURIComponent(videoId)}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'TELEMETRY_UPDATE' && onUpdate) {
          onUpdate(data);
        }
      } catch (e) {}
    };

    return () => eventSource.close();
  } catch (e) {
    return null;
  }
};
