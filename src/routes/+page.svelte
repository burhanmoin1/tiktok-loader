<script lang="ts">
    import { downloadVideo } from '$lib/features/downloader/api';
    import Download from 'lucide-svelte/icons/download';
    import Link from 'lucide-svelte/icons/link';
    import Search from 'lucide-svelte/icons/search';
    import Zap from 'lucide-svelte/icons/zap';
    import ShieldCheck from 'lucide-svelte/icons/shield-check';
    import Smartphone from 'lucide-svelte/icons/smartphone';
    import Monitor from 'lucide-svelte/icons/monitor';
    import Video from 'lucide-svelte/icons/video';
    import Infinity from 'lucide-svelte/icons/infinity';
    import UserX from 'lucide-svelte/icons/user-x';
    import CheckCircle2 from 'lucide-svelte/icons/check-circle-2';

    // Downloader state
    let tiktokUrl = '';
    let isDownloading = false;
    let downloadMessage = '';

    async function handleDownload() {
        if (!tiktokUrl) return;
        isDownloading = true;
        downloadMessage = 'Downloading... please wait';
        
        try {
            const deviceId = localStorage.getItem('analytics_device_id');
            const blob = await downloadVideo(tiktokUrl, deviceId);
            
            if (blob) {
                // Create object URL and trigger download
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `tiktok_video_${Date.now()}.mp4`; // Default name if header missing
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                downloadMessage = 'Download complete!';
                tiktokUrl = '';
            } else {
                downloadMessage = 'Download failed. Please check the URL.';
            }
        } catch (e) {
            downloadMessage = 'An error occurred during download.';
            console.error(e);
        } finally {
            isDownloading = false;
        }
    }

    async function handlePaste() {
        try {
            const text = await navigator.clipboard.readText();
            tiktokUrl = text;
        } catch (err) {
            console.error('Failed to read clipboard contents: ', err);
        }
    }
</script>

<main class="min-h-screen bg-[#0f172a] text-slate-50 font-sans selection:bg-emerald-500/30">
    <!-- Navbar -->
    <nav class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center space-x-2">
                    <div class="bg-gradient-to-br from-emerald-400 to-cyan-500 p-1.5 rounded-lg">
                        <Download class="w-5 h-5 text-white" />
                    </div>
                    <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        TikTok Downloader
                    </span>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
        <!-- Background Glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
            <div class="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-8">
                <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="text-sm font-medium text-emerald-400">Free & No Watermark</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span class="text-emerald-400">TikTok</span> Video <br class="hidden md:block" />
                Downloader
            </h1>
            
            <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">
                Download TikTok videos without watermark in HD quality. <br />
                Fast, free, and no login required.
            </p>

            <div class="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-400 mb-12">
                <div class="flex items-center space-x-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-500" />
                    <span>HD Quality</span>
                </div>
                <div class="flex items-center space-x-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-500" />
                    <span>No Watermark</span>
                </div>
                <div class="flex items-center space-x-1.5">
                    <CheckCircle2 class="w-4 h-4 text-emerald-500" />
                    <span>100% Free</span>
                </div>
            </div>

            <!-- Downloader Input -->
            <div class="max-w-2xl mx-auto">
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div class="relative flex items-center bg-slate-900 rounded-xl border border-slate-800 p-2 shadow-2xl">
                        <div class="pl-4 text-slate-500">
                            <Link class="w-5 h-5" />
                        </div>
                        <input 
                            type="text" 
                            bind:value={tiktokUrl} 
                            placeholder="Paste TikTok video link here..." 
                            class="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 outline-none w-full"
                            disabled={isDownloading}
                        />
                        <div class="flex items-center space-x-2 pr-1">
                            {#if !tiktokUrl}
                                <button 
                                    on:click={handlePaste}
                                    class="hidden sm:inline-flex px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Paste
                                </button>
                            {/if}
                            <button 
                                on:click={handleDownload}
                                disabled={isDownloading || !tiktokUrl}
                                class="inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-slate-900 transition-all duration-200 bg-emerald-400 rounded-lg hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                            >
                                {#if isDownloading}
                                    <div class="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                                {:else}
                                    <Download class="w-4 h-4 mr-2" />
                                    Download
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
                {#if downloadMessage}
                    <div class="mt-4 p-3 rounded-lg text-sm font-medium {downloadMessage.includes('failed') || downloadMessage.includes('error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}">
                        {downloadMessage}
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <!-- How It Works -->
    <section class="py-20 bg-slate-900/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">How It <span class="text-emerald-400">Works</span></h2>
                <p class="text-slate-400 max-w-2xl mx-auto">Three simple steps to download any TikTok video.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <!-- Connector Line (Desktop) -->
                <div class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-800 via-emerald-500/20 to-slate-800 z-0"></div>

                <!-- Step 1 -->
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg relative group hover:-translate-y-1 transition-transform duration-300">
                        <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold shadow-lg">01</div>
                        <Link class="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 class="text-xl font-bold mb-2">Copy Link</h3>
                    <p class="text-slate-400 text-sm">Open TikTok and copy the video link you want to download.</p>
                </div>

                <!-- Step 2 -->
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg relative group hover:-translate-y-1 transition-transform duration-300">
                        <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold shadow-lg">02</div>
                        <Search class="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 class="text-xl font-bold mb-2">Paste URL</h3>
                    <p class="text-slate-400 text-sm">Paste the copied link into the input field above.</p>
                </div>

                <!-- Step 3 -->
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-lg relative group hover:-translate-y-1 transition-transform duration-300">
                        <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold shadow-lg">03</div>
                        <Download class="w-10 h-10 text-emerald-400" />
                    </div>
                    <h3 class="text-xl font-bold mb-2">Download</h3>
                    <p class="text-slate-400 text-sm">Click download and save the video without watermark.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features -->
    <section class="py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Why Choose <span class="text-emerald-400">Us?</span></h2>
                <p class="text-slate-400 max-w-2xl mx-auto">The simplest way to save TikTok videos without watermarks.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Feature 1 -->
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                    <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Zap class="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 class="text-lg font-bold mb-2">Lightning Fast</h3>
                    <p class="text-slate-400 text-sm">Download videos in seconds with our high-speed servers.</p>
                </div>

                <!-- Feature 2 -->
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                    <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <ShieldCheck class="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 class="text-lg font-bold mb-2">No Watermark</h3>
                    <p class="text-slate-400 text-sm">Get clean videos without the TikTok watermark overlay.</p>
                </div>

                <!-- Feature 3 -->
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                    <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Smartphone class="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 class="text-lg font-bold mb-2">All Devices</h3>
                    <p class="text-slate-400 text-sm">Works perfectly on mobile, tablet, and desktop browsers.</p>
                </div>

                <!-- Feature 4 -->
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                    <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Video class="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 class="text-lg font-bold mb-2">HD Quality</h3>
                    <p class="text-slate-400 text-sm">Download in the highest available resolution.</p>
                </div>

                <!-- Feature 5 -->
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                    <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <Infinity class="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 class="text-lg font-bold mb-2">No Limits</h3>
                    <p class="text-slate-400 text-sm">Download as many videos as you want, completely free.</p>
                </div>

                <!-- Feature 6 -->
                <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
                    <div class="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                        <UserX class="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 class="text-lg font-bold mb-2">No Login</h3>
                    <p class="text-slate-400 text-sm">No account or registration needed. Just paste and download.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} TikTok Downloader. All rights reserved.</p>
    </footer>
</main>
