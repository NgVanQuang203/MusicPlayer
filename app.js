const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const heading = $(".infor h2");
const nameSinger = $("header .name-singer");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const timeLeft = $(".time-left");
const timeRight = $(".time-right");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const songOld = $(".song");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  song: [
    {
      name: "MyLove",
      singer: "WestLife",
      image: "./assets/music/img/Westlife Greatest Hits Album Cover.jpg",
      path: "./assets/music/songs/Westlife_-_My_Love_(Jesusful.com).mp3",
    },
    {
      name: "Âm Thầm Bên Em",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/am-tham-ben-em-live-son-tung-m-tp.jpg",
      path: "./assets/music/songs/AmThamBenEm-SonTungMTP-4066476.mp3",
    },
    {
      name: "Đôi Mươi",
      singer: "Hoàng Dũng",
      image: "./assets/music/img/1200x1200bf-60.jpg",
      path: "./assets/music/songs/DoiMuoi-HoangDungTheVoice-7817479.mp3",
    },
    {
      name: "Đoạn Kết Mới",
      singer: "Hoàng Dũng",
      image: "./assets/music/img/1200x1200bf-60.jpg",
      path: "./assets/music/songs/DoanKetMoi-HoangDungTheVoice-7662770.mp3",
    },
    {
      name: "Chúng Ta Của Hiện Tại",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/70a345571f4fdac72acbf6c5c3fceee5.jpg",
      path: "./assets/music/songs/chungtacuahientai.mp3",
    },
    {
      name: "Buông Đôi Tay Nhau Ra",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/mqdefault.jpg",
      path: "./assets/music/songs/buongdoitaynhaura.mp3",
    },
    {
      name: "Nơi Này Có Anh",
      singer: "Sơn Tùng M-TP",
      image:
        "./assets/music/img/b6c44f836516ce8f33d539e140300a55.1000x1000x1.jpg",
      path: "./assets/music/songs/Noinaycoanh.mp3",
    },
    {
      name: "Lạc Trôi",
      singer: "Sơn Tùng M-TP",
      image: "./assets/music/img/lactroi.jpg",
      path: "./assets/music/songs/Lactroi_lyrics.mp3",
    },
    {
      name: "Chắc Ai Đó Sẽ Về",
      singer: "Sơn Tùng M-TP",
      image:
        "./assets/music/img/chac-ai-do-se-ve-bi-nghi-dao-nhac-doisongphapluat1.jpg",
      path: "./assets/music/songs/ChacAidosevelyrics.mp3",
    },
    {
      name: "Tháng Tư Là Lời Nói Dối Của Em",
      singer: "Hà Anh Tuấn",
      image: "./assets/music/img/R.png",
      path: "./assets/music/songs/ThangTuLaLoiNoiDoilyrics.mp3",
    },
  ],
  songs: [],
  render: function () {
    const htmls = this.song.map((song, index) => {
      return `
                <div class="song" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </div>
                </div> 
               
            `;
    });
    document.querySelector(".playlist").innerHTML = htmls.join("");
    this.songs = document.querySelectorAll(".song");
  },

  defineProperties: function () {
    Object.defineProperty(this, "CurrentSong", {
      get: function () {
        return this.song[this.currentIndex];
      },
    });
  },

  formatTime: function (time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    // *Xử lý CD quay/dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10 seconds
        iterations: Infinity, // Vô hạn
      }
    );
    cdThumbAnimate.pause();

    // *Xử lý phóng to thu nhỏ image CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
    //Xử lý play

    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
        if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
          _this.songs.forEach((song) => {
            song.classList.remove("active");
          });
          _this.songs[_this.currentIndex].classList.add("active");
        }
      }
    };

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Tiến độ bài hát
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Load Tổng số thời gian bài hát
    audio.addEventListener("loadedmetadata", function () {
      timeRight.textContent = _this.formatTime(audio.duration);
    });

    // Load timeLeft khi thay đổi
    progress.addEventListener("input", function (e) {
      const timeChange = (audio.duration / 100) * e.target.value;
      timeLeft.textContent = _this.formatTime(timeChange);
    });
    audio.addEventListener("timeupdate", function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
        timeLeft.textContent = _this.formatTime(audio.currentTime);
      }
    });
    // Click next button
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSongg();
      }
      audio.play();
      if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
        _this.songs.forEach((song) => {
          song.classList.remove("active");
        });
        _this.songs[_this.currentIndex].classList.add("active");
      }
    };
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      if (_this.currentIndex == _this.getValueIndex(_this.currentIndex)) {
        _this.songs.forEach((song) => {
          song.classList.remove("active");
        });
        _this.songs[_this.currentIndex].classList.add("active");
      }
    };

    // *Xử lý random
    randomBtn.onclick = function (e) {
      if (_this.isRepeat) {
        repeatBtn.click();
      }
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    // Xử lý next song khi end
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Xử lý phát lại 1 bài
    repeatBtn.onclick = function () {
      if (_this.isRandom) {
        randomBtn.click();
      }
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
  },
  getValueIndex: function (currentIndex) {
    const songOfIndex = this.songs[currentIndex];
    console.log(songOfIndex); // Kiểm tra giá trị của songOfIndex
    if (songOfIndex && songOfIndex.getAttribute) {
      const valueIndex = songOfIndex.getAttribute("data-index");
      console.log(valueIndex);
      return valueIndex;
    } else {
      return null; // hoặc giá trị mặc định nếu không tìm thấy phần tử hoặc thuộc tính
    }
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.song.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  nextSongg: function () {
    this.currentIndex++;
    if (this.currentIndex > this.song.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.song.length - 1;
    }
    this.loadCurrentSong();
  },

  loadCurrentSong: function () {
    heading.textContent = this.CurrentSong.name;
    nameSinger.textContent = this.CurrentSong.singer;
    cdThumb.style.backgroundImage = `url('${this.CurrentSong.image}')`;
    audio.src = this.CurrentSong.path;
  },

  start: function () {
    // Định nghĩa

    this.defineProperties();

    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
//
