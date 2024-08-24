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
const repeatBtn = $('.btn-repeat')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  playedSongs: [],

  songs: [
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

  render() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}">
          <div class="thumb" style="background-image: url('${song.image}')"></div>
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

  defindPropertise() {
    Object.defineProperty(this, 'currentSong', {
      get: () => this.songs[this.currentIndex]
    })
  },

  handleEvents() {
    const cdWidth = cd.offsetWidth

    // Zoom in - zoom out CD
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
    }

    // Play - pause
    btnPlay.onclick = () => {
      if (this.isPlaying) {
        audio.pause()
        player.classList.remove('playing')
        this.isPlaying = false
        cdthumbSpin.pause()
      } else {
        audio.play()
        player.classList.add('playing')
        this.isPlaying = true
        cdthumbSpin.play()
      }
    }

    // Song progress
    audio.ontimeupdate = () => {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
        progress.style.background = `linear-gradient(to right, var(--primary-color) ${progressPercent}%, #d3d3d3 ${progressPercent}%)`
      }
    }

    // Rewind song
    progress.onchange = (e) => {
      audio.currentTime = audio.duration / 100 * e.target.value
    }

    // CD spin - stop
    const cdthumbSpin = cdThumb.animate([
      { transform: 'rotate(360deg)' }
    ], {
      duration: 20000,
      iterations: Infinity
    })
    cdthumbSpin.pause()

    // Next song
    nextBtn.onclick = () => {
      if (this.isRandom) {
        this.randomPlaySong()
      } else {
        this.nextSong()
      }
      audio.play()
      this.render()
      player.classList.add('playing')
      this.isPlaying = true
      cdthumbSpin.play()
    }

    // Prev song
    prevBtn.onclick = () => {
      if (this.isRandom) {
        this.randomPlaySong()
      } else {
        this.prevSong()
      }
      audio.play()
      this.render()
      player.classList.add('playing')
      this.isPlaying = true
      cdthumbSpin.play()
    }

    // Random song
    randomBtn.onclick = () => {
      this.isRandom = !this.isRandom
      randomBtn.classList.toggle('active', this.isRandom)
    }

    // Repeat song
    repeatBtn.onclick = () => {
      this.isRepeat = !this.isRepeat
      repeatBtn.classList.toggle('active', this.isRepeat)
    }

    // Next or repeat when ended
    audio.onended = () => {
      if (this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }
  },

  loadCurrentSong() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },

  nextSong() {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong() {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },

  randomPlaySong: function() {
    let newIndex;

    // Kiểm tra nếu tất cả các bài hát đã được phát
    if (this.playedSongs.length === this.songs.length) {
      this.playedSongs = []; // Reset lại mảng khi tất cả bài hát đã được phát
    }

    // Random bài hát chưa được phát
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.playedSongs.includes(newIndex));

    // Cập nhật bài hát hiện tại và thêm vào mảng đã phát
    this.currentIndex = newIndex;
    this.playedSongs.push(newIndex);

    this.loadCurrentSong();
  },

  start() {
    this.render()
    this.defindPropertise()
    this.handleEvents()
    this.loadCurrentSong()
  }
}

app.start()
