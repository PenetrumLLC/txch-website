document.addEventListener('DOMContentLoaded', function() {
    // Entry overlay functionality
    const entryOverlay = document.getElementById('entry-overlay');
    const bioPage = document.getElementById('bio-page');
    
    // Show bio page initially so overlay can blur the background
    bioPage.style.opacity = '1';
    
    // Entry overlay click handler
    entryOverlay.addEventListener('click', function() {
        // Start audio immediately
        startAudio();
        
        // Fade out overlay
        entryOverlay.classList.add('fade-out');
        
        // Show bio page
        bioPage.style.transition = 'opacity 0.5s ease';
        bioPage.style.opacity = '1';
        
        // Remove overlay after animation
        setTimeout(() => {
            entryOverlay.style.display = 'none';
        }, 500);
    });
    
    // Banner functionality
    const floatingBanner = document.getElementById('floating-banner');
    
    // Info button functionality
    const infoButton = document.getElementById('info-button');
    const bioContentContainer = document.querySelector('.bio-content');
    
    if (infoButton) {
        infoButton.addEventListener('click', function() {
            if (bioContentContainer.classList.contains('info-active')) {
                // Close info view
                bioContentContainer.classList.remove('info-active');
                infoButton.classList.remove('close');
                infoButton.innerHTML = '<i class="fas fa-info"></i>';
                document.body.classList.remove('info-modal-active');
            } else {
                // Open info view
                bioContentContainer.classList.add('info-active');
                infoButton.classList.add('close');
                infoButton.innerHTML = '<i class="fas fa-times"></i>';
                document.body.classList.add('info-modal-active');
            }
        });
    }
    
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
    
    // Animated title effect
    const animatedTitle = document.getElementById('animated-title');
    if (animatedTitle) {
        const titleText = "Tech The Goat";
        let titleIndex = 0;
        let isTitleDeleting = false;
        let isTitleWaiting = false;
        
        // Set initial title to prevent "index.html" flash
        animatedTitle.textContent = titleText;
        
        function typeTitle() {
            if (isTitleWaiting) return;
            
            if (!isTitleDeleting) {
                // Typing
                if (titleIndex < titleText.length) {
                    animatedTitle.textContent = titleText.substring(0, titleIndex + 1);
                    titleIndex++;
                    setTimeout(typeTitle, 200);
                } else {
                    // Finished typing, wait 5 seconds then start deleting
                    setTimeout(() => {
                        isTitleDeleting = true;
                        typeTitle();
                    }, 5000);
                }
            } else {
                // Deleting
                if (titleIndex > 0) {
                    animatedTitle.textContent = titleText.substring(0, titleIndex - 1);
                    titleIndex--;
                    setTimeout(typeTitle, 150);
                } else {
                    // Finished deleting, keep a space to prevent "index.html" flash
                    animatedTitle.textContent = ' ';
                    // Wait 3 seconds then start typing again
                    isTitleDeleting = false;
                    isTitleWaiting = true;
                    setTimeout(() => {
                        isTitleWaiting = false;
                        typeTitle();
                    }, 3000);
                }
            }
        }
        
        // Start title animation after a longer delay
        setTimeout(typeTitle, 3000);
    }

    // Add some interactive effects - optimized with throttling
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Audio player functionality
    const audio = document.getElementById('background-audio');
    const soundControl = document.getElementById('sound-control');
    const volumeSlider = document.getElementById('volume-slider');
    const soundIcon = soundControl.querySelector('i');
    
    let isMuted = false;
    let previousVolume = 0.5;
    let audioStarted = false;
    
    // Initialize audio
    audio.volume = 0.5;
    
    // Function to start audio
    function startAudio() {
        if (!audioStarted) {
            audio.play().then(() => {
                audioStarted = true;
                console.log('Audio started successfully');
            }).catch(e => {
                console.log('Audio play failed:', e);
            });
        }
    }
    
    // Sound control click - mute/unmute
    soundControl.addEventListener('click', function(e) {
        // Don't trigger if clicking on volume slider
        if (e.target === volumeSlider) return;
        
        // Start audio if it hasn't started yet
        if (!audioStarted) {
            startAudio();
        }
        
        if (isMuted) {
            // Unmute
            audio.muted = false;
            audio.volume = previousVolume;
            volumeSlider.value = previousVolume * 100;
            soundIcon.className = 'fas fa-volume-up';
            isMuted = false;
        } else {
            // Mute
            previousVolume = audio.volume;
            audio.muted = true;
            volumeSlider.value = 0;
            soundIcon.className = 'fas fa-volume-mute';
            isMuted = true;
        }
    });
    
    // Volume slider control
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        audio.volume = volume;
        audio.muted = false;
        isMuted = false;
        
        // Update icon based on volume level
        if (volume === 0) {
            soundIcon.className = 'fas fa-volume-mute';
            isMuted = true;
        } else if (volume < 0.5) {
            soundIcon.className = 'fas fa-volume-down';
        } else {
            soundIcon.className = 'fas fa-volume-up';
        }
    });

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

    // Spotify integration using Lanyard API - optimized implementation
    const spotifyContent = document.getElementById('spotify-content');
    const DISCORD_USER_ID = '268826493377839106';

    let currentSpotifyData = null;
    let durationUpdateInterval = null;
    let lastSpotifyUpdate = 0;
    const SPOTIFY_UPDATE_INTERVAL = 30000; // 30 seconds

    async function updateSpotifyData() {
        const now = Date.now();
        if (now - lastSpotifyUpdate < SPOTIFY_UPDATE_INTERVAL) {
            return; // Skip if too soon
        }
        lastSpotifyUpdate = now;

        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            if (response.ok) {
                const data = await response.json();

                if (data.success && data.data) {
                    const userData = data.data;

                    // Check if user is listening to Spotify
                    if (userData.listening_to_spotify && userData.spotify) {
                        const spotify = userData.spotify;
                        currentSpotifyData = spotify;
                        startDurationUpdates();
                        updateSpotifyDisplay();
                    } else {
                        // Check activities array for Spotify activity
                        let spotifyActivity = null;
                        if (userData.activities && userData.activities.length > 0) {
                            spotifyActivity = userData.activities.find(activity =>
                                activity.name === 'Spotify' ||
                                activity.type === 2 ||
                                (activity.application_id && activity.application_id === 'spotify:1')
                            );
                        }

                        if (spotifyActivity && spotifyActivity.details) {
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
                            currentSpotifyData = null;
                            stopDurationUpdates();
                            showNotPlaying();
                        }
                    }
                } else {
                    currentSpotifyData = null;
                    stopDurationUpdates();
                    showNotPlaying();
                }
            } else {
                currentSpotifyData = null;
                stopDurationUpdates();
                showNotPlaying();
            }
        } catch (error) {
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

        // Update the header text
        const spotifyHeader = document.querySelector('.spotify-header span');
        if (spotifyHeader) {
            spotifyHeader.textContent = 'Now Playing';
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
        // Update the header text
        const spotifyHeader = document.querySelector('.spotify-header span');
        if (spotifyHeader) {
            spotifyHeader.textContent = 'Not Playing';
        }
        
        spotifyContent.innerHTML = `
            <div class="spotify-not-playing">
                <i class="fas fa-music"></i>
                <span>Not Playing Anything</span>
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

    // Discord Server integration - Static display
    const discordContent = document.getElementById('discord-content');
    
    function showDiscordServer() {
        const inviteUrl = 'https://discord.gg/sWeYyBKhFW';
        const serverIcon = 'https://cdn.discordapp.com/icons/1266369006248394752/a2867602c226c6edd46296d0a653a032.png?size=1024';
        
        discordContent.innerHTML = `
            <div class="discord-server">
                <div class="discord-server-icon">
                    <img src="${serverIcon}" alt="Server Icon" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">
                </div>
                <div class="discord-server-info">
                    <div class="discord-server-name">Technical Unity</div>
                </div>
                <a href="${inviteUrl}" target="_blank" class="discord-join-button">
                    Join
                </a>
            </div>
        `;
    }
    
    // Show Discord server immediately
    showDiscordServer();

    // TECH reveal effect - optimized with throttling
    const titleElement = document.querySelector('.title');
    const bioContent = document.querySelector('.bio-content');
    
    // Throttle function for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Track mouse position with throttling for better performance
    const throttledMouseMove = throttle(function(e) {
        const containerRect = bioContent.getBoundingClientRect();
        const rect = titleElement.getBoundingClientRect();
        
        // Calculate mouse position relative to the element's bounding box
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Expand the tracking area to account for TECH text extending beyond container
        const expandedLeft = containerRect.left - 100;
        const expandedRight = containerRect.right + 100;
        const expandedTop = containerRect.top - 50;
        const expandedBottom = containerRect.bottom + 50;
        
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
    }, 16); // ~60fps
    
    document.addEventListener('mousemove', throttledMouseMove);
}); 
