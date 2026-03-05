import { getAccessToken } from '$lib/api/client';

export async function downloadVideo(url: string, deviceId: string | null): Promise<Blob | null> {
    try {
        const token = getAccessToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/downloader/download', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                url,
                device_id: deviceId
            })
        });

        if (!res.ok) {
            console.error("Download failed:", await res.text());
            return null;
        }
        
        return await res.blob();
    } catch (e) {
        console.error("Failed to download video", e);
        return null;
    }
}
