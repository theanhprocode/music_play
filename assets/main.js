const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const btnPlay = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
    songs : [
        {
            name: 'Xin đừng lặng im',
            singer: 'Sobin Hoàng Sơn',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },

        {
            name: 'Lại gần hôn anh',
            singer: 'Lân Nhã',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },

        {
            name: 'Yêu em rất nhiều',
            singer: 'Hoàng Tôn',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },

        {
            name: 'Chưa bao giờ',
            singer: 'Trung Quân idol',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },

        {
            name: 'Anh đã quen với cô đơn',
            singer: 'Sobin Hoàng Sơn',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },

        {
            name: 'Xin em',
            singer: 'Bùi Anh Tuấn',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },

        {
            name: 'Vinh quang đang chờ ta',
            singer: 'Sobin Hoàng Sơn',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
    ],

    render: function() {
        const htmls = this.songs.map(function(song) {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },

    defindPropertise: function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
        return this.songs[this.currentIndex]
        }
      });
       
    },

    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // zoom in - zoom out CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // play - pause
        btnPlay.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
                player.classList.remove('playing')
                _this.isPlaying = false
                cdthumbSpin.pause()
            } else {
                audio.play()
                player.classList.add('playing')
                _this.isPlaying = true
                cdthumbSpin.play()
            }
        }

        // song progress
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
        
                // Cập nhật màu chạy theo sau
                progress.style.background = `linear-gradient(to right, var(--primary-color) ${progressPercent}%, #d3d3d3 ${progressPercent}%)`;
            }
        }

        // rewind song
        progress.onchange = function(e) {
            audio.currentTime = audio.duration / 100 * e.target.value
        }

        // cd spin - stop
        const cdthumbSpin = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdthumbSpin.pause()

        // next song
        nextBtn.onclick = function() {
            _this.nextSong();
            audio.play(); // Tự động phát bài hát mới
            player.classList.add('playing'); // Thêm class "playing" để CD quay
            _this.isPlaying = true; // Cập nhật trạng thái isPlaying
            cdthumbSpin.play(); // Bắt đầu quay CD
        }

        // prev song
        prevBtn.onclick = function() {
            _this.prevSong();
            audio.play(); // Tự động phát bài hát mới
            player.classList.add('playing'); // Thêm class "playing" để CD quay
            _this.isPlaying = true; // Cập nhật trạng thái isPlaying
            cdthumbSpin.play(); // Bắt đầu quay CD
        }

        // random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
           randomBtn.classList.toggle('active',_this.isRandom) 
        }
    },

    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomPlaySong: function() {

    },

    start: function() {
      this.render()
      
      this.defindPropertise()
      
      this.handleEvents()

      this.loadCurrentSong()
    }

} 

app.start()