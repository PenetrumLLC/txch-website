document.addEventListener('DOMContentLoaded', function() {

    // Typing effect for quote
    const quoteElement = document.querySelector('.quote');
    const fullQuote = '"Believe, and you will witness the incredible glory of God unfold in your life."';
    let currentIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function typeQuote() {
        if (isWaiting) return;
        
        if (!isDeleting) {
            // Typing
                            if (currentIndex < fullQuote.length) {
                    quoteElement.textContent = fullQuote.substring(0, currentIndex + 1) + '|';
                    currentIndex++;
                    setTimeout(typeQuote, 65);
            } else {
                // Finished typing, wait 5 seconds then start deleting
                setTimeout(() => {
                    isDeleting = true;
                    typeQuote();
                }, 5000);
            }
        } else {
            // Deleting
                            if (currentIndex > 0) {
                    quoteElement.textContent = fullQuote.substring(0, currentIndex - 1) + '|';
                    currentIndex--;
                    setTimeout(typeQuote, 50);
            } else {
                // Finished deleting, wait 1 second then start typing again
                isDeleting = false;
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    typeQuote();
                }, 1000);
            }
        }
    }

    // Start the typing effect
    typeQuote();

    // Add some interactive effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Sound control toggle (placeholder for future functionality)
    const soundControl = document.querySelector('.sound-control');
    let soundEnabled = true;
    
    soundControl.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        const icon = this.querySelector('i');
        
        if (soundEnabled) {
            icon.className = 'fas fa-volume-up';
        } else {
            icon.className = 'fas fa-volume-mute';
        }
    });

    // Add view count animation
    const viewCount = document.querySelector('.view-count span');
    if (viewCount) {
        const finalCount = 1051;
        let currentCount = 0;
        const increment = Math.ceil(finalCount / 50);
        
        const counter = setInterval(() => {
            currentCount += increment;
            if (currentCount >= finalCount) {
                currentCount = finalCount;
                clearInterval(counter);
            }
            viewCount.textContent = currentCount.toLocaleString();
        }, 50);
    }

    // Add loading animation for profile picture
    const profileImg = document.querySelector('.profile-picture img');
    if (profileImg) {
        profileImg.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                this.style.transition = 'all 0.5s ease';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        });
    }

    // Discord Status - Set to idle permanently
    const statusIndicator = document.querySelector('.status-indicator');
    
    function setIdleStatus() {
        statusIndicator.className = 'status-indicator dnd';
        statusIndicator.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // Set to idle status
    setIdleStatus();

    // Dynamic time display
    function updateTimeDisplay() {
        const timeDisplay = document.getElementById('time-display');
        
        // Your timezone (Stockholm, Sweden - UTC+1/UTC+2)
        const yourTimezone = 'Europe/Stockholm';
        const yourTime = new Date().toLocaleTimeString('en-US', {
            timeZone: yourTimezone,
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });
        
        // Visitor's local time
        const visitorTime = new Date().toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });
        
        timeDisplay.textContent = `${yourTime} my time is ${visitorTime} for you.`;
    }
    
    // Update time immediately and every minute
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000);

    // Spotify integration using Lanyard API - custom implementation
    const spotifyContent = document.getElementById('spotify-content');
    const DISCORD_USER_ID = '268826493377839106'; // Your Discord User ID

    let currentSpotifyData = null;
    let durationUpdateInterval = null;

    async function updateSpotifyData() {
        try {
            console.log('Fetching Spotify data from Lanyard...');

            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Lanyard response:', data);

                if (data.success && data.data) {
                    const userData = data.data;

                    // Check if user is listening to Spotify
                    if (userData.listening_to_spotify && userData.spotify) {
                        const spotify = userData.spotify;
                        console.log('Spotify data found:', spotify);

                        // Store current Spotify data for real-time updates
                        currentSpotifyData = spotify;
                        
                        // Start real-time duration updates
                        startDurationUpdates();

                        // Display Spotify activity
                        updateSpotifyDisplay();
                    } else {
                        // Check activities array for Spotify activity
                        let spotifyActivity = null;
                        if (userData.activities && userData.activities.length > 0) {
                            spotifyActivity = userData.activities.find(activity =>
                                activity.name === 'Spotify' ||
                                activity.type === 2 || // Activity type 2 is usually Spotify
                                (activity.application_id && activity.application_id === 'spotify:1')
                            );
                        }

                        if (spotifyActivity && spotifyActivity.details) {
                            console.log('Spotify activity found in activities:', spotifyActivity);

                            // Display Spotify activity from activities array
                            spotifyContent.innerHTML = `
                                <div class="spotify-track">
                                    <div class="spotify-album-art">
                                        <img src="https://via.placeholder.com/50x50/1db954/ffffff?text=🎵" alt="Album Art">
                                    </div>
                                    <div class="spotify-info">
                                        <div class="spotify-song">${spotifyActivity.details || 'Unknown Song'}</div>
                                        <div class="spotify-artist">${spotifyActivity.state || 'Unknown Artist'}</div>
                                    </div>
                                </div>
                            `;
                        } else {
                            // Not listening to Spotify
                            console.log('Not listening to Spotify');
                            currentSpotifyData = null;
                            stopDurationUpdates();
                            showNotPlaying();
                        }
                    }
                } else {
                    console.log('Lanyard data not available');
                    currentSpotifyData = null;
                    stopDurationUpdates();
                    showNotPlaying();
                }
            } else {
                console.log('Failed to fetch Lanyard data');
                currentSpotifyData = null;
                stopDurationUpdates();
                showNotPlaying();
            }
        } catch (error) {
            console.error('Lanyard error:', error);
            currentSpotifyData = null;
            stopDurationUpdates();
            showNotPlaying();
        }
    }

    function updateSpotifyDisplay() {
        if (!currentSpotifyData) return;

        // Calculate duration and progress if available
        let durationText = '';
        if (currentSpotifyData.timestamps && currentSpotifyData.timestamps.start) {
            const currentTime = Date.now() - currentSpotifyData.timestamps.start;
            const duration = currentSpotifyData.timestamps.end ? currentSpotifyData.timestamps.end - currentSpotifyData.timestamps.start : null;

            if (duration) {
                const currentSeconds = Math.floor(currentTime / 1000);
                const totalSeconds = Math.floor(duration / 1000);

                // Ensure we don't show negative time or time beyond the song
                const clampedCurrentSeconds = Math.max(0, Math.min(currentSeconds, totalSeconds));

                const currentMinutes = Math.floor(clampedCurrentSeconds / 60);
                const currentSecs = clampedCurrentSeconds % 60;
                const totalMinutes = Math.floor(totalSeconds / 60);
                const totalSecs = totalSeconds % 60;

                durationText = `${currentMinutes}:${currentSecs.toString().padStart(2, '0')} / ${totalMinutes}:${totalSecs.toString().padStart(2, '0')}`;
            }
        }

        // Display Spotify activity
        spotifyContent.innerHTML = `
            <div class="spotify-track">
                <div class="spotify-album-art">
                    <img src="${currentSpotifyData.album_art_url || 'https://via.placeholder.com/50x50/1db954/ffffff?text=🎵'}" alt="Album Art">
                </div>
                <div class="spotify-info">
                    <div class="spotify-song">${currentSpotifyData.song}</div>
                    <div class="spotify-artist">${currentSpotifyData.artist}</div>
                    ${durationText ? `<div class="spotify-duration">${durationText}</div>` : ''}
                </div>
            </div>
        `;
    }

    function startDurationUpdates() {
        // Clear any existing interval
        stopDurationUpdates();
        
        // Update duration every second
        durationUpdateInterval = setInterval(() => {
            if (currentSpotifyData) {
                updateSpotifyDisplay();
            }
        }, 1000);
    }

    function stopDurationUpdates() {
        if (durationUpdateInterval) {
            clearInterval(durationUpdateInterval);
            durationUpdateInterval = null;
        }
    }
    
    function showNotPlaying() {
        spotifyContent.innerHTML = `
            <div class="spotify-not-playing">
                <i class="fas fa-music"></i>
                <span>I'm not listening to anything right now</span>
            </div>
        `;
    }
    
    // Update Spotify data immediately and every 30 seconds
    updateSpotifyData();
    setInterval(updateSpotifyData, 30000);
    
    // Add click to refresh functionality
    spotifyContent.addEventListener('click', function() {
        // Refresh the Lanyard iframe
        updateSpotifyData();
    });

    // Discord Server integration
    const discordContent = document.getElementById('discord-content');
    const DISCORD_SERVER_ID = '1266369006248394752'; // Your Discord server ID
    
    async function updateDiscordData() {
        try {
            console.log('Fetching Discord server data...');
            
            let discordData = null;
            
            // Try multiple approaches to get Discord server data
            try {
                // Approach 1: Try using your Python bot API (most reliable)
                const BOT_API_URL = 'http://localhost:5000/api/server-stats'; // Update with your bot's URL
                
                try {
                    const botResponse = await fetch(BOT_API_URL, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (botResponse.ok) {
                        const botData = await botResponse.json();
                        console.log('Bot API data:', botData);
                        
                        discordData = {
                            name: botData.name || "Tech's Community",
                            icon: botData.icon || null,
                            member_count: botData.member_count || 0,
                            approximate_member_count: botData.member_count || 0,
                            approximate_presence_count: botData.online_count || 0,
                            vanity_url_code: "sWeYyBKhFW"
                        };
                        
                        console.log('Real Discord data fetched from bot API:', discordData);
                    } else {
                        console.log('Bot API not accessible, trying widget API...');
                    }
                } catch (botError) {
                    console.log('Bot API not available:', botError.message);
                }
                
                // Approach 2: Try the widget API (if bot API failed)
                if (!discordData) {
                    const widgetResponse = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_SERVER_ID}/widget.json`);
                    
                    if (widgetResponse.ok) {
                        const widgetData = await widgetResponse.json();
                        console.log('Widget data:', widgetData);
                        
                        discordData = {
                            name: widgetData.name,
                            icon: null,
                            member_count: widgetData.presence_count || 0,
                            approximate_member_count: widgetData.presence_count || 0,
                            approximate_presence_count: widgetData.presence_count || 0,
                            vanity_url_code: "sWeYyBKhFW"
                        };
                        
                        console.log('Real Discord data fetched from widget:', discordData);
                    } else {
                        console.log('Widget API not accessible (403/401) - Enable widget in server settings for real-time data');
                    }
                }
                
                // Approach 3: Use fallback data if all APIs fail
                if (!discordData) {
                    discordData = {
                        name: "Tech's Community", // Update this with your actual server name
                        icon: null,
                        member_count: 150, // Update this with your actual member count
                        approximate_member_count: 150, // Update this with your actual member count
                        approximate_presence_count: 23, // Update this with your actual online count
                        vanity_url_code: "sWeYyBKhFW"
                    };
                    
                    console.log('Using configurable fallback data:', discordData);
                }
            } catch (e) {
                console.log('Discord API error:', e.message);
                
                // Use fallback data if all APIs fail
                discordData = {
                    name: "Tech's Community",
                    icon: null,
                    member_count: 150,
                    approximate_member_count: 150,
                    approximate_presence_count: 23,
                    vanity_url_code: "sWeYyBKhFW"
                };
            }
            
            // Generate invite URL using your actual invite code
            const inviteUrl = `https://discord.gg/sWeYyBKhFW`;
            
            // Use icon URL directly from API response (it's already a full URL)
            const iconUrl = discordData.icon || 'https://cdn.discordapp.com/embed/avatars/0.png';
            
            // Display Discord server data
            discordContent.innerHTML = `
                <div class="discord-server">
                    <div class="discord-server-icon">
                        <img src="${iconUrl}" alt="Server Icon" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                    </div>
                    <div class="discord-server-info">
                        <div class="discord-server-name">${discordData.name}</div>
                        <div class="discord-server-stats">${discordData.approximate_presence_count || 0} online • ${discordData.approximate_member_count || discordData.member_count || 0} members</div>
                    </div>
                    <a href="${inviteUrl}" target="_blank" class="discord-join-button">
                        Join
                    </a>
                </div>
            `;
            
        } catch (error) {
            console.error('Discord error:', error);
            showDiscordNotAvailable();
        }
    }
    
    // Update Discord data immediately and every 60 seconds
    updateDiscordData();
    setInterval(updateDiscordData, 60000);
    
    // Add click to refresh functionality for Discord
    discordContent.addEventListener('click', function() {
        updateDiscordData();
    });

    // TECH reveal effect
    const titleElement = document.querySelector('.title');
    const bioContent = document.querySelector('.bio-content');
    
    // Track mouse position globally but only update TECH when hovering over the container
    document.addEventListener('mousemove', function(e) {
        const containerRect = bioContent.getBoundingClientRect();
        const rect = titleElement.getBoundingClientRect();
        
        // Calculate mouse position relative to the element's bounding box
        // Since the element uses transform: translate(-50%, -50%), we need to account for this
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Expand the tracking area to account for TECH text extending beyond container
        const expandedLeft = containerRect.left - 100;   // Larger buffer on left
        const expandedRight = containerRect.right + 100; // Larger buffer on right
        const expandedTop = containerRect.top - 50;      // Buffer on top
        const expandedBottom = containerRect.bottom + 50; // Buffer on bottom
        
        // Use expanded area for tracking since TECH text extends beyond container
        if (e.clientX >= expandedLeft && e.clientX <= expandedRight && 
            e.clientY >= expandedTop && e.clientY <= expandedBottom) {
            titleElement.style.setProperty('--mouse-x', x + 'px');
            titleElement.style.setProperty('--mouse-y', y + 'px');
        } else {
            // Hide the reveal when mouse is outside expanded area
            titleElement.style.setProperty('--mouse-x', '-100px');
            titleElement.style.setProperty('--mouse-y', '-100px');
        }
    });
}); 
