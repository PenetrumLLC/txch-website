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

    // Spotify integration
    const spotifyContent = document.getElementById('spotify-content');
    
    // Spotify integration - working approach
    async function updateSpotifyData() {
        try {
            // Since API calls are blocked by CORS on localhost, show current track directly
            console.log('API calls blocked by CORS, showing current track');
            showCurrentTrack();
        } catch (error) {
            console.error('Spotify error:', error);
            showCurrentTrack();
        }
    }
    
    function showCurrentTrack() {
        // Show a generic message since we can't get real-time data
        spotifyContent.innerHTML = `
            <div class="spotify-current">
                <div class="spotify-not-playing">
                    <i class="fas fa-music"></i>
                    <span>Spotify integration coming soon</span>
                    <div style="font-size: 10px; color: #666; margin-top: 5px;">
                        (API blocked by CORS on localhost)
                    </div>
                </div>
            </div>
        `;
    }
    

    
    function showNotPlaying() {
        spotifyContent.innerHTML = `
            <div class="spotify-current">
                <div class="spotify-not-playing">
                    <i class="fas fa-music"></i>
                    <span>Not currently playing</span>
                </div>
            </div>
        `;
    }
    
    function showDemoSpotifyData() {
        // Show demo Spotify data
        const demoData = {
            is_playing: true,
            item: {
                name: "Blinding Lights",
                artists: [{ name: "The Weeknd" }],
                album: {
                    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a" }]
                }
            }
        };
        displaySpotifyData(demoData);
    }
    
    function displaySpotifyData(data) {
        if (data && data.is_playing && data.item) {
            const track = data.item;
            const albumArt = track.album.images[0]?.url || "https://via.placeholder.com/50x50/1db954/ffffff?text=🎵";
            
            spotifyContent.innerHTML = `
                <div class="spotify-current">
                    <div class="spotify-track">
                        <img src="${albumArt}" alt="Album Art" class="spotify-album-art">
                        <div class="spotify-track-info">
                            <div class="spotify-track-name">${track.name}</div>
                            <div class="spotify-artist">${track.artists[0].name}</div>
                        </div>
                    </div>
                    
                </div>
            `;
                 } else {
             // Not currently playing
             spotifyContent.innerHTML = `
                 <div class="spotify-current">
                     <div class="spotify-not-playing">
                         <i class="fas fa-music"></i>
                         <span>Not currently playing</span>
                     </div>
                 </div>
             `;
        }
    }
    
    // Update Spotify data immediately and every 30 seconds
    updateSpotifyData();
    setInterval(updateSpotifyData, 30000);
    
    // Add click to refresh functionality
    spotifyContent.addEventListener('click', function() {
        updateSpotifyData();
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
